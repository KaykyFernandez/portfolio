import { education } from '../data/portfolio'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Spotlight } from './Spotlight'

export function Education() {
  return (
    <section id="formacao" aria-labelledby="formacao-titulo" className="scroll-mt-16 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading index="05" eyebrow="Formação" title="Formação e certificações" id="formacao-titulo" />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {education.degrees.map((d, i) => (
              <Reveal key={d.title} delay={i * 90}>
                <Spotlight tilt={3} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-xl font-extrabold tracking-tight">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted">{d.institution}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold text-accent-fg">{d.period}</span>
                    <span className="text-muted"> · {d.note}</span>
                  </p>
                </Spotlight>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <Spotlight tilt={3} className="h-full rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-xl font-extrabold tracking-tight">Certificações e cursos</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {education.certifications.map((c) => (
                  <li key={c} className="chip rounded-full bg-accent-soft px-3.5 py-1.5 text-sm text-accent-fg">
                    {c}
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 font-display text-xl font-extrabold tracking-tight">Idiomas</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {education.languages.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
