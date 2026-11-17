import { useEffect, useState } from 'react'
import { profile } from '../data/portfolio'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const DURATION = 1600
const YEAR = new Date().getFullYear()

// Abertura: contador de 0 a 100 e cortina que sobe. Ao subir, marca <html data-ready>,
// o que dispara as animações de entrada do hero.
export function Preloader() {
  const [count, setCount] = useState(0)
  const [skip] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<'load' | 'exit' | 'done'>(skip ? 'done' : 'load')

  useEffect(() => {
    const root = document.documentElement
    if (skip) {
      root.dataset.ready = '1'
      return
    }
    let raf = 0
    let timer = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else {
        root.dataset.ready = '1'
        setPhase('exit')
        timer = window.setTimeout(() => setPhase('done'), 1100)
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [skip])

  if (phase === 'done') return null

  return (
    <div className={`preloader ${phase === 'exit' ? 'is-exit' : ''}`} aria-hidden="true">
      <div className="flex items-center justify-between text-xs font-medium tracking-[0.2em] text-muted uppercase">
        <span>{profile.initials} — Portfólio</span>
        <span>{YEAR}</span>
      </div>

      <div className="font-display text-[clamp(3.5rem,16vw,12rem)] leading-[0.85] font-extrabold tracking-tighter uppercase">
        <div className="overflow-hidden pb-[0.12em]">
          <div style={{ transform: `translateY(${100 - count}%)`, transition: 'transform 0.2s linear' }}>
            {profile.firstName}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs tracking-[0.2em] text-muted uppercase">Carregando</span>
          <span className="font-display text-[clamp(3rem,10vw,7rem)] leading-none font-extrabold tabular-nums">
            {String(count).padStart(3, '0')}
          </span>
        </div>
        <div className="preloader-bar">
          <i style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </div>
  )
}
