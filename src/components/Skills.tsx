import { skillGroups } from '../data/portfolio'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Spotlight } from './Spotlight'
import { ThreeScene } from './ThreeScene'

const loadGlobe = () => import('../three/techGlobe')

export function Skills() {
  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading index="04" eyebrow="Habilidades" title="Tecnologias que uso" id="habilidades-titulo" />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
          {/* Globo 3D: mesmo conteúdo dos cartões, em forma de rede. Decorativo para leitores de tela. */}
          <Reveal className="lg:sticky lg:top-24">
            <div className="globe-frame relative aspect-square w-full overflow-hidden rounded-3xl border border-line">
              <ThreeScene load={loadGlobe} interactive className="absolute inset-0" />
              <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-page/70 px-3 py-1 text-[0.7rem] font-medium tracking-[0.14em] whitespace-nowrap text-muted uppercase backdrop-blur">
                Arraste para girar
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 70}>
                <Spotlight tilt={4} className="h-full rounded-2xl border border-line bg-surface p-6">
                  <section className="h-full">
                    <h3 className="flex items-center gap-3 text-sm font-semibold tracking-wide text-accent-fg uppercase">
                      <span className="font-mono text-accent2">{String(i + 1).padStart(2, '0')}</span>
                      {group.title}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="chip rounded-full border border-line bg-surface2 px-3.5 py-1.5 text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
