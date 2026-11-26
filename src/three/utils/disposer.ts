import * as THREE from 'three'

export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
      if (child.geometry) {
        child.geometry.dispose()
      }

      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => disposeMaterial(mat))
      } else if (child.material) {
        disposeMaterial(child.material)
      }
    }
  })
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose()

  // Attempt to dispose any texture properties on the material
  const mat = material as unknown as Record<string, unknown>

  const textureKeys = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'emissiveMap',
    'aoMap',
    'envMap',
    'lightMap',
    'bumpMap',
    'displacementMap',
    'alphaMap',
  ]

  textureKeys.forEach((key) => {
    const texture = mat[key]
    if (texture instanceof THREE.Texture) {
      texture.dispose()
    }
  })
}
