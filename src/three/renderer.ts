import * as THREE from 'three'

interface RendererState {
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
}

let state: RendererState | null = null

export function initRenderer(): RendererState {
  if (state) return state

  const canvas = document.createElement('canvas')
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  `
  document.body.appendChild(canvas)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  renderer.autoClear = false
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0

  function handleResize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  window.addEventListener('resize', handleResize)

  state = { renderer, canvas }
  return state
}

export function getRenderer(): RendererState | null {
  return state
}

export function disposeRenderer(): void {
  if (!state) return

  window.removeEventListener('resize', () => {
    state?.renderer.setSize(window.innerWidth, window.innerHeight)
  })

  state.renderer.dispose()
  state.canvas.remove()
  state = null
}
