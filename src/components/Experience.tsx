import { useEffect, useRef } from 'react'
import { experiences, type Experience as ExperienceItem } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

function Entry({ item }: { item: ExperienceItem }) {
  if (item.minor) {
    // Experiência antiga e sem relação com TI: só uma linha, sem destaque.
    return (
      <p className="text-sm text-muted">
        {item.role} · {item.company} · {item.place} · {item.period}
      </p>
    )
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{item.role}</h3>
        {item.current && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-fg">
            <span className="status-dot size-1.5 rounded-full bg-accent2" aria-hidden="true" />
            Atual
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {item.company} · {item.place} · {item.period}
      </p>
      {item.bullets && (
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TimelineItem({ item }: { item: ExperienceItem }) {
  const [ref, inView] = useInView<HTMLLIElement>(0.35)
  return (
    <li ref={ref} className="relative">
      <span
        aria-hidden="true"
        className={`tl-dot absolute top-1.5 rounded-full border-2 border-page ${inView ? 'is-on bg-accent' : ''} ${
          item.minor ? '-left-[2.28rem] size-2.5' : '-left-[2.4rem] size-3.5'
        }`}
      />
      <Reveal>
        <Entry item={item} />
      </Reveal>
    </li>
  )
}

export function Experience() {
  const list = useRef<HTMLOListElement>(null)

  // A linha da timeline "se preenche" conforme a rolagem.
  useEffect(() => {
    const el = list.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height))
      el.style.setProperty('--p', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="experiencia" aria-labelledby="experiencia-titulo" className="scroll-mt-16 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading index="03" eyebrow="Experiência" title="Onde já atuei" id="experiencia-titulo" />

        <ol ref={list} className="relative mt-16 space-y-12 pl-9">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line" />
          <span aria-hidden="true" className="tl-fill absolute top-0 bottom-0 left-0 w-px" />
          {experiences.map((item) => (
            <TimelineItem key={item.role + item.company} item={item} />
          ))}
        </ol>
      </div>
    </section>
  )
}
