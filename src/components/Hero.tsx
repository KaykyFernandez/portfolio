import { useRef, type PointerEvent } from 'react'
import { profile } from '../data/portfolio'
import { ArrowUpRightIcon, GithubIcon, LinkedinIcon } from './Icons'
import { Magnetic } from './Magnetic'
import { Marquee } from './Marquee'
import { SplitText } from './SplitText'
import { ThreeScene } from './ThreeScene'

const loadWave = () => import('../three/heroWave')

const iconLink =
  'grid size-12 place-items-center rounded-full border border-line text-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:text-fg'

// Cartão em estilo de editor de código, com dados reais do perfil.
function CodeCard() {
  return (
    <div className="float w-64 rounded-xl border border-line bg-surface/90 shadow-2xl shadow-accent/10 backdrop-blur sm:w-72">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-muted">
        <span>&lt;/&gt; perfil.ts</span>
        <span className="status-dot size-2 rounded-full bg-accent2" aria-hidden="true" />
      </div>
      <pre className="overflow-hidden p-4 font-mono text-xs leading-relaxed text-muted">
        <code>
          <span className="text-accent-fg">const</span> dev = {'{'}
          {'\n  '}nome: <span className="text-accent2">"{profile.firstName}"</span>,
          {'\n  '}foco: <span className="text-accent2">"back-end e automação"</span>,
          {'\n  '}stack: [<span className="text-accent2">"Java"</span>,{' '}
          <span className="text-accent2">"Python"</span>,
          {'\n    '}
          <span className="text-accent2">"JavaScript"</span>, <span className="text-accent2">"SQL"</span>],
          {'\n  '}local: <span className="text-accent2">"{profile.location}"</span>,
          {'\n'}
          {'}'};<span className="caret ml-1" aria-hidden="true" />
        </code>
      </pre>
    </div>
  )
}

// Selo circular com texto girando em volta do retrato.
function Badge() {
  const text = 'DESENVOLVIMENTO • AUTOMAÇÃO • INTEGRAÇÃO • '
  return (
    <svg
      viewBox="0 0 200 200"
      className="spin-slow absolute -inset-6 size-[calc(100%+3rem)] text-muted"
      aria-hidden="true"
    >
      <defs>
        <path id="circ" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
      </defs>
      {/* textLength distribui o texto pela circunferência inteira (2π·88 ≈ 553), sem emenda nem sobreposição. */}
      <text fill="currentColor" fontSize="11.5" fontWeight="600">
        <textPath href="#circ" textLength="548" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

function Portrait() {
  return (
    <div className="relative mx-auto aspect-square w-60 sm:w-80">
      <Badge />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 25%, var(--accent-fg), var(--accent) 55%, transparent 100%)',
          opacity: 0.9,
        }}
      />
      {profile.photo ? (
        <img
          src={profile.photo}
          alt={`Foto de ${profile.name}`}
          width={480}
          height={480}
          className="absolute inset-0 size-full rounded-full object-cover ring-4 ring-page"
        />
      ) : (
        <div
          role="img"
          aria-label={`Espaço reservado para a foto de ${profile.name}`}
          className="absolute inset-0 grid place-items-center pb-16 font-display text-7xl font-extrabold text-white/90 sm:text-8xl"
        >
          {profile.initials}
        </div>
      )}
      {/* O cartão fica quase todo abaixo do círculo para não cobrir o rosto. */}
      <div className="absolute -bottom-44 left-1/2 -translate-x-1/2 sm:-right-12 sm:left-auto sm:translate-x-0">
        <CodeCard />
      </div>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  // O brilho de fundo acompanha o mouse.
  function onMove(e: PointerEvent) {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--hx', `${e.clientX - r.left}px`)
    el.style.setProperty('--hy', `${e.clientY - r.top}px`)
  }

  return (
    <section
      id="inicio"
      ref={ref}
      onPointerMove={onMove}
      className="relative -mt-16 scroll-mt-0 overflow-hidden pt-16"
    >
      <div aria-hidden="true" className="hero-bg pointer-events-none absolute inset-0">
        {/* A grade em CSS só aparece se a cena 3D não carregar (sem WebGL). */}
        <div className="hero-grid" />
        <div className="hero-spot" />
        <ThreeScene load={loadWave} margin="0px" className="hero-scene absolute inset-0" />
        <div className="aurora aurora-a -top-40 -right-20 size-[34rem]" />
        <div className="aurora aurora-b -bottom-52 -left-32 size-[30rem]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:pt-16">
        <p
          className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-xs font-medium backdrop-blur"
          style={{ ['--d' as string]: '100ms' }}
        >
          <span className="status-dot size-2 rounded-full bg-accent2" aria-hidden="true" />
          {profile.availability}
        </p>

        <h1 className="mt-8">
          <span className="sr-only">
            {profile.name} — {profile.title}
          </span>
          <span aria-hidden="true" className="block">
            <SplitText
              text={profile.firstName}
              by="char"
              trigger="ready"
              delay={200}
              stagger={60}
              className="display-1 block text-gradient"
            />
            <SplitText
              text="Fernandes Garcia"
              by="char"
              trigger="ready"
              delay={650}
              stagger={32}
              className="display-2 mt-2 block text-fg/65"
            />
          </span>
        </h1>

        <div className="mt-12 grid items-center gap-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <p
              className="rise max-w-xl text-lg leading-snug font-semibold sm:text-xl"
              style={{ ['--d' as string]: '1100ms' }}
            >
              {profile.title}
            </p>
            <p
              className="rise mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              style={{ ['--d' as string]: '1200ms' }}
            >
              {profile.intro}
            </p>

            <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '1320ms' }}>
              <Magnetic>
                <a
                  href="#projetos"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-[background-color,box-shadow] duration-300 hover:bg-accent-fg hover:shadow-accent/50"
                >
                  Ver projetos <ArrowUpRightIcon className="size-4" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition-colors duration-300 hover:border-accent hover:bg-accent-soft"
                >
                  Entrar em contato
                </a>
              </Magnetic>
              <a href={profile.github} target="_blank" rel="noreferrer" className={iconLink} aria-label="GitHub (abre em nova aba)">
                <GithubIcon />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={iconLink} aria-label="LinkedIn (abre em nova aba)">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          <div className="rise pb-44 lg:pb-40" style={{ ['--d' as string]: '1000ms' }}>
            <Portrait />
          </div>
        </div>

        <div className="rise mt-14 hidden items-center gap-4 text-xs tracking-[0.2em] text-muted uppercase sm:flex" style={{ ['--d' as string]: '1500ms' }}>
          <span className="scroll-cue" aria-hidden="true" />
          Role para explorar
        </div>
      </div>

      <div className="relative border-y border-line bg-surface/50 py-6 backdrop-blur-sm">
        <Marquee
          items={profile.heroTech}
          className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-none font-extrabold tracking-tight uppercase"
        />
      </div>
    </section>
  )
}
