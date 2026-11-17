import { useEffect, useRef } from 'react'

export type SceneModule = { mount: (container: HTMLElement) => () => void }

type ThreeSceneProps = {
  /** Import dinâmico da cena. Defina fora do componente para manter a referência estável. */
  load: () => Promise<SceneModule>
  className?: string
  /** Distância antes de entrar na tela em que a cena começa a carregar. */
  margin?: string
  /** Quando o canvas recebe arrastar/hover, o cursor próprio cresce sobre ele. */
  interactive?: boolean
}

// Container de uma cena Three.js. O three.js só é baixado quando a cena chega perto da
// tela (chunk separado), e a cena é destruída ao desmontar. Sem WebGL, fica vazio.
export function ThreeScene({ load, className = '', margin = '300px', interactive = false }: ThreeSceneProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        load()
          .then((mod) => {
            if (cancelled) return
            cleanup = mod.mount(el)
            requestAnimationFrame(() => {
              if (!cancelled) el.dataset.on = '1'
            })
          })
          .catch(() => {
            // Falha ao baixar o chunk: o site segue sem a cena.
          })
      },
      { rootMargin: margin },
    )
    io.observe(el)

    return () => {
      cancelled = true
      io.disconnect()
      cleanup?.()
      delete el.dataset.on
    }
  }, [load, margin])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hover={interactive ? '' : undefined}
      className={`three-scene ${className}`}
    />
  )
}
