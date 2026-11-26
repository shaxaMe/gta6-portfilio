import * as THREE from 'three'
import { disposeObject } from './utils/disposer'

export class HeroScene {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  mesh!: THREE.Mesh
  mouseX = 0
  mouseY = 0
  targetMouseX = 0
  targetMouseY = 0

  private keyLight!: THREE.PointLight
  private rimLight!: THREE.PointLight
  private fillLight!: THREE.PointLight
  private ambientLight!: THREE.AmbientLight

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.z = 6
  }

  init(): void {
    // Geometry — torus knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 32, 2, 3)

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.05,
      metalness: 1.0,
      envMapIntensity: 1.5,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)

    // Lights — Vice City sunset palette
    this.keyLight = new THREE.PointLight(0xcc46a0, 4, 20)  // Flamingo pink
    this.keyLight.position.set(3, 3, 5)
    this.scene.add(this.keyLight)

    this.rimLight = new THREE.PointLight(0x4c5fca, 1.5, 15)  // Dusk blue
    this.rimLight.position.set(-3, -1, -3)
    this.scene.add(this.rimLight)

    this.fillLight = new THREE.PointLight(0xff885f, 1.2, 18)  // Tangerine orange
    this.fillLight.position.set(0, -4, 3)
    this.scene.add(this.fillLight)

    this.ambientLight = new THREE.AmbientLight(0x1a1030, 2)  // Deep purple ambient
    this.scene.add(this.ambientLight)
  }

  update(scroll: number, mx: number, my: number): void {
    this.targetMouseX = mx
    this.targetMouseY = my

    // Lerp mouse
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05

    if (this.mesh) {
      // Continuous rotation
      this.mesh.rotation.y += 0.003
      this.mesh.rotation.x += 0.001

      // Mouse parallax
      this.mesh.rotation.x += (this.mouseY * 0.5 - this.mesh.rotation.x) * 0.03
      this.mesh.rotation.y += (this.mouseX * 0.5 - this.mesh.rotation.y) * 0.03

      // Scroll-driven scale
      const scaleFactor = 1 - scroll * 0.4
      this.mesh.scale.setScalar(Math.max(0.1, scaleFactor))
    }

    // Camera z parallax on scroll
    this.camera.position.z = 6 + scroll * 4
  }

  render(renderer: THREE.WebGLRenderer, rect: DOMRect): void {
    if (rect.bottom < 0 || rect.top > window.innerHeight) return

    const width = rect.width
    const height = rect.height
    const left = rect.left
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
