import { projects, type Project } from '../data/portfolio'
import { ArrowUpRightIcon, GithubIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Spotlight } from './Spotlight'

// `contain`: mostra a imagem inteira (usado no card em destaque, cuja coluna não tem a proporção da imagem).
function ProjectImage({ project, index, contain = false }: { project: Project; index: number; contain?: boolean }) {
  if (project.image) {
    return (
      <div className={`relative size-full ${contain ? 'grid place-items-center bg-[#0a0c20]' : ''}`}>
        <img
          src={project.image}
          alt={`${project.imageIsMockup ? 'Ilustração da interface' : 'Captura de tela'} do projeto ${project.title}`}
          width={1800}
          height={1005}
          loading="lazy"
          className={`transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105 ${
            contain ? 'h-auto w-full' : 'size-full object-cover object-left-top'
          }`}
        />
        {project.imageIsMockup && (
          <span className="absolute right-3 bottom-3 rounded-full border border-line bg-page/70 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-muted uppercase backdrop-blur">
            Ilustração
          </span>
        )}
      </div>
    )
  }
  // Placeholder animado até as capturas de tela existirem.
  return (
    <div className="mesh grid size-full place-items-center">
      <span
        aria-hidden="true"
        className="relative font-display text-[clamp(4rem,12vw,8rem)] leading-none font-extrabold text-outline transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-110"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="absolute bottom-3 left-4 text-xs text-muted">Captura de tela em breve</span>
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tag) => (
        <li key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-fg">
          {tag}
        </li>
      ))}
    </ul>
  )
}

function Links({ project }: { project: Project }) {
  const linkClass =
    'group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-fg'
  const arrow =
    'size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5'
  return (
    <div className="flex flex-wrap items-center gap-5">
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
          <GithubIcon className="size-4" /> GitHub <ArrowUpRightIcon className={arrow} />
          <span className="sr-only"> de {project.title} (abre em nova aba)</span>
        </a>
      )}
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noreferrer" className={linkClass}>
          Ver no ar <ArrowUpRightIcon className={arrow} />
          <span className="sr-only"> {project.title} (abre em nova aba)</span>
        </a>
      )}
    </div>
  )
}

function Status({ project }: { project: Project }) {
  if (project.status !== 'em-andamento') return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
      <span className="status-dot size-1.5 rounded-full bg-amber-400" aria-hidden="true" />
      Em desenvolvimento
    </span>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Spotlight tilt={2} className="group overflow-hidden rounded-3xl border border-line bg-surface">
      <article className="grid md:grid-cols-2">
        <div className="aspect-video overflow-hidden md:aspect-auto md:min-h-80">
          <ProjectImage project={project} index={0} contain />
        </div>
        <div className="flex flex-col gap-4 p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent-fg uppercase">
            Projeto em destaque · {project.kind}
          </p>
          <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            {project.title}
          </h3>
          <p className="leading-relaxed text-muted">{project.summary}</p>
          {project.highlights && (
            <ul className="space-y-1.5 text-sm text-muted">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent2" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          <Tags items={project.stack} />
          <Links project={project} />
        </div>
      </article>
    </Spotlight>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Spotlight tilt={6} className="group h-full overflow-hidden rounded-3xl border border-line bg-surface">
      <article className="flex h-full flex-col">
        <div className="aspect-video overflow-hidden">
          <ProjectImage project={project} index={index} />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{project.kind}</p>
            <Status project={project} />
          </div>
          <h3 className="font-display text-xl font-extrabold tracking-tight">{project.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
          <div className="mt-auto flex flex-col gap-4 pt-2">
            <Tags items={project.stack} />
            <Links project={project} />
          </div>
        </div>
      </article>
    </Spotlight>
  )
}

export function Projects() {
  const featured = projects.find((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading index="02" eyebrow="Projetos" title="Alguns dos meus trabalhos" id="projetos-titulo" />

        {featured && (
          <Reveal className="mt-14">
            <FeaturedCard project={featured} />
          </Reveal>
        )}

        {/* 3 colunas só quando a conta fecha; com 4 cartões fica 2x2, sem cartão sobrando. */}
        <div className={`mt-6 grid gap-6 md:grid-cols-2 ${others.length % 3 === 0 ? 'lg:grid-cols-3' : ''}`}>
          {others.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <ProjectCard project={project} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
