import * as THREE from 'three'
import { disposeObject } from './utils/disposer'

// ─── Shaders (liquid iridescent — keep user-approved material) ────────────────

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  uniform float uTime;

  vec3 liquidPalette(float t) {
    vec3 deepViolet = vec3(0.10, 0.06, 0.22);
    vec3 indigo     = vec3(0.20, 0.16, 0.38);
    vec3 mutedPink  = vec3(0.42, 0.20, 0.36);
    vec3 rose       = vec3(0.52, 0.28, 0.42);

    t = smoothstep(0.0, 1.0, t);

    vec3 color = mix(deepViolet, indigo, smoothstep(0.0, 0.45, t));
    color = mix(color, mutedPink, smoothstep(0.35, 0.75, t));
    color = mix(color, rose, smoothstep(0.70, 1.0, t));

    return color;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    float NdotV = clamp(dot(N, V), 0.0, 1.0);

    // Soft Fresnel
    float fresnel = pow(1.0 - NdotV, 2.4);

    // Slow liquid movement
    float wave1 = sin(vWorldPos.x * 0.65 + uTime * 0.10);
    float wave2 = cos(vWorldPos.y * 0.75 - uTime * 0.08);
    float wave3 = sin(vWorldPos.z * 0.55 + uTime * 0.06);

    float flow = wave1 * 0.22 + wave2 * 0.18 + wave3 * 0.15;

    float phase = NdotV * 0.55 + flow + uTime * 0.015;

    vec3 iridColor = liquidPalette(fract(phase));

    // Deep liquid base
    vec3 baseColor = vec3(0.025, 0.018, 0.075);

    // Restrained iridescence
    float iridStrength = 0.14 + fresnel * 0.36;

    vec3 color = mix(baseColor, iridColor, iridStrength);

    // Soft diffuse lighting
    vec3 lightDir = normalize(vec3(1.2, 2.0, 3.0));
    float diffuse = 0.45 + max(dot(N, lightDir), 0.0) * 0.40;

    color *= diffuse;

    // Wide soft reflection
    vec3 H = normalize(lightDir + V);
    float specular = pow(max(dot(N, H), 0.0), 28.0);

    vec3 specularColor = vec3(0.45, 0.30, 0.52);
    color += specular * specularColor * 0.18;

    // Soft violet edge reflection
    float rim = pow(1.0 - NdotV, 3.0);
    color += rim * vec3(0.16, 0.08, 0.28) * 0.20;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── Organic Ribbon Geometry ──────────────────────────────────────────────────
//
// A 3-D lemniscate-like ribbon: two interconnected portal openings, flowing
// and twisting through space. Built as a parametric tube with an elliptical
// (ribbon) cross-section. Uses rotation-minimising parallel-transport frames
// so the surface never flips, plus a closing-angle correction so the seam
// is invisible.
//
// Spine shape (t ∈ [0, 2π]):
//   x = 1.30·cos(t) + 0.08·cos(2.8t)   — slight organic bulge
//   y = 0.60·sin(2t) + 0.05·sin(3t)    — figure-8 vertical + subtle ripple
//   z = 0.80·sin(t)  + 0.06·cos(2t)    — depth + asymmetry
//
// Cross-section: width 0.22–0.37 (wider at the lobes), thickness 0.06.
// Visual twist: exactly 2π (one full turn) so the seam closes cleanly.

function buildOrganicRibbon(): THREE.BufferGeometry {
  const SPINE  = 320   // spine samples
  const RING   = 24    // cross-section segments (must stay even)
  const TAU    = Math.PI * 2
  const TWIST  = TAU   // one full visual twist → seam closes exactly

  // Spine parametric function
  const spineAt = (t: number): THREE.Vector3 => new THREE.Vector3(
    1.30 * Math.cos(t) + 0.08 * Math.cos(2.8 * t),
    0.60 * Math.sin(2 * t) + 0.05 * Math.sin(3 * t),
    0.80 * Math.sin(t) + 0.06 * Math.cos(2 * t)
  )

  // Variable ribbon width: swell at the lobes, pinch at the crossings
  const widthAt = (t: number): number => 0.22 + 0.15 * Math.abs(Math.sin(t))
  const THICK   = 0.060   // thin-ribbon minor axis

  // ── Sample spine ──────────────────────────────────────────────────────────
  const pts: THREE.Vector3[] = Array.from({ length: SPINE }, (_, i) =>
    spineAt((i / SPINE) * TAU)
  )

  // ── Tangents via central differences ─────────────────────────────────────
  const tans: THREE.Vector3[] = pts.map((_, i) =>
    pts[(i + 1) % SPINE].clone().sub(pts[(i - 1 + SPINE) % SPINE]).normalize()
  )

  // ── Rotation-minimising parallel-transport ────────────────────────────────
  // Seed: a normal perpendicular to the first tangent
  let seed = new THREE.Vector3(0, 1, 0)
  if (Math.abs(tans[0].dot(seed)) > 0.9) seed.set(0, 0, 1)
  seed.sub(tans[0].clone().multiplyScalar(tans[0].dot(seed))).normalize()

  const fN: THREE.Vector3[] = [seed.clone()]
  const fB: THREE.Vector3[] = [tans[0].clone().cross(seed).normalize()]

  for (let i = 1; i < SPINE; i++) {
    const T    = tans[i]
    const prev = fN[i - 1]
    const n    = prev.clone().sub(T.clone().multiplyScalar(T.dot(prev))).normalize()
    fN.push(n)
    fB.push(T.clone().cross(n).normalize())
  }

  // ── Closing-angle correction ──────────────────────────────────────────────
  // The accumulated torsion produces a small angular gap at the seam.
  // Distribute the correction evenly so the seam is invisible.
  {
    const T0  = tans[0]
    const lN  = fN[SPINE - 1]
    const fNv = fN[0]
    let   err = Math.acos(Math.max(-1, Math.min(1, lN.dot(fNv))))
    if (new THREE.Vector3().crossVectors(lN, fNv).dot(T0) < 0) err = -err

    const q = new THREE.Quaternion()
    for (let i = 0; i < SPINE; i++) {
      q.setFromAxisAngle(tans[i], err * i / (SPINE - 1))
      fN[i].applyQuaternion(q)
      fB[i].applyQuaternion(q)
    }
  }

  // ── Build vertex / index buffers ──────────────────────────────────────────
  const positions: number[] = []
  const normals:   number[] = []
  const uvs:       number[] = []
  const indices:   number[] = []

  // SPINE + 1 rings: the last ring duplicates ring 0 for a seamless wrap
  for (let i = 0; i <= SPINE; i++) {
    const fi     = i % SPINE
    const t      = (i / SPINE) * TAU      // parametric position on spine [0, 2π]
    const sp     = pts[fi]
    const N      = fN[fi]
    const B      = fB[fi]
    const w      = widthAt(t)
    const tOff   = TWIST * (i / SPINE)    // twist accumulation

    for (let j = 0; j <= RING; j++) {
      const theta = (j / RING) * TAU + tOff
      const cosT  = Math.cos(theta)
      const sinT  = Math.sin(theta)

      // Elliptical cross-section: width × N + thickness × B
      positions.push(
        sp.x + N.x * w * cosT + B.x * THICK * sinT,
        sp.y + N.y * w * cosT + B.y * THICK * sinT,
        sp.z + N.z * w * cosT + B.z * THICK * sinT
      )

      // Approximate outward-facing normal for the ellipse
      const nx = N.x * cosT + B.x * sinT
      const ny = N.y * cosT + B.y * sinT
      const nz = N.z * cosT + B.z * sinT
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      normals.push(nx / nl, ny / nl, nz / nl)

      uvs.push(j / RING, i / SPINE)
    }
  }

  const stride = RING + 1
  for (let i = 0; i < SPINE; i++) {
    for (let j = 0; j < RING; j++) {
      const a = i * stride + j
      const b = (i + 1) * stride + j
      const c = (i + 1) * stride + j + 1
      const d = i * stride + j + 1
      indices.push(a, b, d, b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals,   3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs,       2))
  geo.setIndex(indices)
  return geo
}

// ─── HeroScene ────────────────────────────────────────────────────────────────

export class HeroScene {
  scene:   THREE.Scene
  camera:  THREE.PerspectiveCamera
  mesh!:   THREE.Mesh

  mouseX = 0
  mouseY = 0
  targetMouseX = 0
  targetMouseY = 0

  private material!: THREE.ShaderMaterial

  constructor() {
    this.scene  = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.z = 6
  }

  init(): void {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      side: THREE.DoubleSide,  // ribbon interior is visible at certain angles
    })

    this.mesh = new THREE.Mesh(buildOrganicRibbon(), this.material)
    this.scene.add(this.mesh)
  }

  update(scroll: number, mx: number, my: number): void {
    if (this.material) {
      this.material.uniforms.uTime.value += 0.016
    }

    this.targetMouseX = mx
    this.targetMouseY = my

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05

    if (this.mesh) {
      this.mesh.rotation.y += 0.002
      this.mesh.rotation.x += 0.001

      this.mesh.rotation.x += (this.mouseY * 0.35 - this.mesh.rotation.x) * 0.025
      this.mesh.rotation.y += (this.mouseX * 0.35 - this.mesh.rotation.y) * 0.025

      const scaleFactor = 1 - scroll * 0.4
      this.mesh.scale.setScalar(Math.max(0.1, scaleFactor))
    }

    this.camera.position.z = 6 + scroll * 4
  }

  render(renderer: THREE.WebGLRenderer, rect: DOMRect): void {
    if (rect.bottom < 0 || rect.top > window.innerHeight) return

    const width  = rect.width
    const height = rect.height
    const left   = rect.left
    const bottom = window.innerHeight - rect.bottom

    renderer.setViewport(left, bottom, width, height)
    renderer.setScissor(left, bottom, width, height)
    renderer.setScissorTest(true)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    disposeObject(this.scene)
  }
}
