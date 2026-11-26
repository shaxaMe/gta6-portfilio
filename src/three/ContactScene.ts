import * as THREE from 'three'
import { disposeObject } from './utils/disposer'

export class ContactScene {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  private points!: THREE.Points
  private positions!: Float32Array
  private count: number

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    this.camera.position.z = 5

    const isMobile = window.innerWidth < 768
    this.count = isMobile ? 800 : 2500
  }

  init(): void {
    const geometry = new THREE.BufferGeometry()
    this.positions = new Float32Array(this.count * 3)

    for (let i = 0; i < this.count; i++) {
      this.positions[i * 3] = (Math.random() - 0.5) * 10
      this.positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xc8f135,
      opacity: 0.3,
      transparent: true,
      sizeAttenuation: true,
      depthWrite: false,
    })

    this.points = new THREE.Points(geometry, material)
    this.scene.add(this.points)
  }

  update(): void {
    if (!this.points) return

    const positions = this.points.geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < this.count; i++) {
      const y = positions.getY(i)
      if (y > 5) {
        positions.setY(i, -5)
      } else {
        positions.setY(i, y + 0.005)
      }
    }

    positions.needsUpdate = true
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
