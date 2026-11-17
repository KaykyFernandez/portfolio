import * as THREE from 'three'

// As cores vêm direto das variáveis CSS (hex). Sem gestão de cor, o hex chega igual na tela,
// então a cena 3D usa exatamente a mesma paleta do resto do site.
THREE.ColorManagement.enabled = false

export type Palette = {
  accent: THREE.Color
  accentFg: THREE.Color
  accent2: THREE.Color
  fg: THREE.Color
  muted: THREE.Color
  bg: THREE.Color
  isLight: boolean
  css: { accent: string; accentFg: string; accent2: string; fg: string; muted: string }
}

export function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement)
  const v = (name: string) => s.getPropertyValue(name).trim() || '#888888'
  const css = { accent: v('--accent'), accentFg: v('--accent-fg'), accent2: v('--accent-2'), fg: v('--fg'), muted: v('--muted') }
  return {
    accent: new THREE.Color(css.accent),
    accentFg: new THREE.Color(css.accentFg),
    accent2: new THREE.Color(css.accent2),
    fg: new THREE.Color(css.fg),
    muted: new THREE.Color(css.muted),
    bg: new THREE.Color(v('--bg')),
    isLight: document.documentElement.dataset.theme === 'light',
    css,
  }
}

export type StageContext = {
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  container: HTMLElement
  palette: Palette
  reducedMotion: boolean
  /** Ponteiro relativo ao container, de -1 a 1 (y para cima). Fica em 0,0 sem mouse. */
  pointer: THREE.Vector2
  /** Pede um quadro novo (útil quando a animação contínua está desligada). */
  invalidate(): void
}

export type SceneHandle = {
  resize(width: number, height: number): void
  frame(time: number, delta: number): void
  setPalette?(palette: Palette): void
  dispose(): void
}

type Options = {
  /** O canvas recebe eventos (arrastar, hover). Sem isso, o ponteiro é lido da janela. */
  interactive?: boolean
  /** Limite de densidade de pixels (custo de GPU). */
  maxDpr?: number
}

// Monta uma cena Three.js dentro de `container` e cuida do ciclo de vida:
// tamanho (ResizeObserver), pausa fora da tela (IntersectionObserver) e aba oculta,
// troca de tema (atributo data-theme), movimento reduzido e limpeza total ao desmontar.
export function mountStage(
  container: HTMLElement,
  setup: (ctx: StageContext) => SceneHandle,
  { interactive = false, maxDpr = 1.75 }: Options = {},
): () => void {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    // Sem WebGL: a página continua com os fundos em CSS.
    return () => {}
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))

  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  if (!interactive) canvas.style.pointerEvents = 'none'
  container.appendChild(canvas)

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = new THREE.Vector2()
  let pending = 0
  const ctx: StageContext = {
    renderer,
    canvas,
    container,
    palette: readPalette(),
    reducedMotion,
    pointer,
    invalidate: () => {
      if (raf || pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        renderOnce()
      })
    },
  }
  const scene = setup(ctx)

  let width = 0
  let height = 0
  let visible = false
  let raf = 0
  let last = performance.now()
  let elapsed = 0

  const renderOnce = () => {
    if (width && height) scene.frame(elapsed, 0)
  }

  const loop = (now: number) => {
    raf = 0
    const delta = Math.min(0.05, (now - last) / 1000)
    last = now
    elapsed += delta
    scene.frame(elapsed, delta)
    schedule()
  }
  const schedule = () => {
    if (!raf && visible && !reducedMotion && !document.hidden && width && height) {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const ro = new ResizeObserver(([entry]) => {
    const w = Math.round(entry.contentRect.width)
    const h = Math.round(entry.contentRect.height)
    if (!w || !h || (w === width && h === height)) return
    width = w
    height = h
    renderer.setSize(w, h, false)
    scene.resize(w, h)
    renderOnce()
    schedule()
  })
  ro.observe(container)

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else stop()
    },
    { rootMargin: '80px' },
  )
  io.observe(container)

  const onVisibility = () => (document.hidden ? stop() : schedule())
  document.addEventListener('visibilitychange', onVisibility)

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && !interactive) return
    const r = container.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  const mo = new MutationObserver(() => {
    ctx.palette = readPalette()
    scene.setPalette?.(ctx.palette)
    renderOnce()
  })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  return () => {
    stop()
    cancelAnimationFrame(pending)
    ro.disconnect()
    io.disconnect()
    mo.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
    scene.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}

// Libera geometrias, materiais e texturas de uma árvore de objetos.
export function disposeTree(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    mesh.geometry?.dispose()
    const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
    for (const m of mats) {
      for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose()
      m.dispose()
    }
  })
}
