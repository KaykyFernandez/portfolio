import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type MarqueeProps = {
  items: readonly string[]
  speed?: number // px por quadro
  reverse?: boolean
  className?: string
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-6 size-[0.5em] shrink-0 text-accent2 sm:mx-10" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 6.7 4.8 11.4 12 12-7.2.6-11.4 5.3-12 12-.6-6.7-4.8-11.4-12-12C7.2 11.4 11.4 6.7 12 0z"
      />
    </svg>
  )
}

// Faixa infinita. Acelera e inverte conforme a velocidade e a direção da rolagem da página.
export function Marquee({ items, speed = 0.7, reverse = false, className = '' }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return
    let x = 0
    let vel = 0
    let dir = reverse ? 1 : -1
    let lastY = scrollY
    let raf = 0
    let visible = true

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(el)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const dy = scrollY - lastY
      lastY = scrollY
      vel += (Math.min(Math.abs(dy), 60) - vel) * 0.08
      if (Math.abs(dy) > 1) dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1)
      const half = el.scrollWidth / 2
      x += dir * (speed + vel * 0.35)
      if (x <= -half) x += half
      if (x > 0) x -= half
      el.style.transform = `translate3d(${x}px, 0, 0)`
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [speed, reverse])

  const group = (key: string, hidden: boolean) => (
    <div key={key} className="marquee-group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={item + i} className="flex items-center">
          <span className={i % 2 ? 'text-outline' : ''}>{item}</span>
          <Star />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="marquee-track">
        {group('a', false)}
        {group('b', true)}
      </div>
    </div>
  )
}
