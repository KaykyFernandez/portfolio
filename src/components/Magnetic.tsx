import { useRef, type PointerEvent, type ReactNode } from 'react'

type MagneticProps = { children: ReactNode; strength?: number; className?: string }

// O conteúdo é levemente "puxado" na direção do mouse quando ele chega perto.
export function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  function move(e: PointerEvent) {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) * strength
    const dy = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
  }
  function leave() {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`inline-block transition-transform duration-500 ease-[var(--ease-out)] ${className}`}
    >
      {children}
    </div>
  )
}
