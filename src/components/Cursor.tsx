import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Cursor próprio (ponto + anel que segue com atraso). Só aparece com mouse de verdade:
// em celular/tablet e com "reduzir movimento" o cursor normal continua.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const setState = (s: 'hover' | 'down' | 'hidden' | null) => {
      const d = dot.current
      const r = ring.current
      if (!d || !r) return
      if (s === 'hidden') {
        d.dataset.state = 'hidden'
        r.dataset.state = 'hidden'
        return
      }
      delete d.dataset.state
      if (s) r.dataset.state = s
      else delete r.dataset.state
    }

    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      const t = e.target as Element | null
      setState(t?.closest('a, button, [data-hover]') ? 'hover' : null)
    }
    const onDown = () => setState('down')
    const onUp = () => setState(null)
    const onLeave = () => setState('hidden')

    addEventListener('pointermove', onMove)
    addEventListener('pointerdown', onDown)
    addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      root.classList.remove('has-cursor')
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
