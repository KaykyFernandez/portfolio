import { useRef, type PointerEvent, type ReactNode } from 'react'

type SpotlightProps = {
  children: ReactNode
  className?: string
  tilt?: number // graus máximos de inclinação 3D; 0 desliga
}

// Cartão com brilho que acompanha o mouse e, opcionalmente, inclinação 3D.
export function Spotlight({ children, className = '', tilt = 0 }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)

  function move(e: PointerEvent) {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (tilt) {
      const rx = (0.5 - y / r.height) * tilt * 2
      const ry = (x / r.width - 0.5) * tilt * 2
      el.classList.add('is-tilting')
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }
  function leave() {
    const el = ref.current
    if (!el) return
    el.classList.remove('is-tilting')
    el.style.transform = ''
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`spot ${className}`}>
      {children}
    </div>
  )
}
