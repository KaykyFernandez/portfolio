import { about } from '../data/portfolio'
import { BookIcon, BriefcaseIcon, CodeIcon, LayersIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Spotlight } from './Spotlight'

const icons = { book: BookIcon, briefcase: BriefcaseIcon, code: CodeIcon, layers: LayersIcon }

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="scroll-mt-16 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeading
            index="01"
            eyebrow="Sobre mim"
            title="Software, com a visão de quem já cuidou da infraestrutura"
            id="sobre-titulo"
          />
          <Reveal delay={150}>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.facts.map((fact, i) => {
            const Icon = icons[fact.icon]
            return (
              <Reveal key={fact.value} delay={i * 90}>
                <Spotlight tilt={5} className="h-full rounded-2xl border border-line bg-surface p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-fg">
                    <Icon />
                  </span>
                  <dt className="mt-5 font-display text-2xl font-extrabold tracking-tight">{fact.value}</dt>
                  <dd className="mt-1 text-sm text-muted">{fact.label}</dd>
                </Spotlight>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
