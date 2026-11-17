import { useState } from 'react'
import { profile } from '../data/portfolio'
import { ArrowUpRightIcon, CheckIcon, CopyIcon, DownloadIcon, GithubIcon, LinkedinIcon, MapPinIcon } from './Icons'
import { Magnetic } from './Magnetic'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { ThreeScene } from './ThreeScene'

const loadOrb = () => import('../three/contactOrb')

export function Contact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sem permissão para a área de transferência: o e-mail continua visível e clicável.
    }
  }

  const socialClass =
    'inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition-[border-color,background-color] duration-300 hover:border-accent hover:bg-accent-soft'

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="aurora aurora-a pointer-events-none -bottom-60 left-1/2 size-[32rem] -translate-x-1/2 opacity-20" />
      {/* Orbe 3D: no desktop fica à direita do texto; no celular, discreto no canto. */}
      <ThreeScene
        load={loadOrb}
        className="orb-scene pointer-events-none absolute -top-16 -right-32 size-64 sm:-top-6 sm:-right-16 sm:size-96 lg:top-1/2 lg:right-[-7rem] lg:size-[34rem] lg:-translate-y-1/2 xl:right-[-4rem] 2xl:right-0"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading index="06" eyebrow="Vamos conversar" title="Tem uma vaga ou um projeto em mente?" id="contato-titulo" />

        <Reveal className="mt-10">
          <p className="max-w-xl leading-relaxed text-muted sm:text-lg">
            Busco estágio ou vaga júnior em desenvolvimento de software. Me chame por e-mail ou LinkedIn.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="big-link group mt-10 inline-flex max-w-full items-center gap-3 pb-2 font-display text-[clamp(1.1rem,4.9vw,3.6rem)] leading-none font-extrabold tracking-tight break-all"
          >
            {profile.email}
            <ArrowUpRightIcon className="size-[0.8em] shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45" />
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={copyEmail} className={socialClass}>
                {copied ? <CheckIcon className="size-4 text-accent2" /> : <CopyIcon className="size-4" />}
                {copied ? 'Copiado!' : 'Copiar e-mail'}
              </button>
            </Magnetic>
            <span className="sr-only" role="status">
              {copied ? 'E-mail copiado para a área de transferência' : ''}
            </span>
            <Magnetic>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={socialClass}>
                <LinkedinIcon className="size-4" /> LinkedIn
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.github} target="_blank" rel="noreferrer" className={socialClass}>
                <GithubIcon className="size-4" /> GitHub
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.cvUrl} download className={socialClass}>
                <DownloadIcon className="size-4" /> Baixar currículo (PDF)
              </a>
            </Magnetic>
          </div>

          <p className="mt-10 flex items-center gap-2 text-sm text-muted">
            <MapPinIcon className="size-4" /> {profile.location} · {profile.availability}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
