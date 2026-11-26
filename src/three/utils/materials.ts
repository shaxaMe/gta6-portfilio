import * as THREE from 'three'

export function createMetallicMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 1.5,
  })
}

export function createWireframeMaterial(
  color: number,
  opacity: number
): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity,
  })
}

export function createPointsMaterial(size: number, color: number): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size,
    color,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  })
}
