import { profile } from '../data/portfolio'
import { Magnetic } from './Magnetic'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-muted sm:px-6">
        <p>
          © {year} {profile.name}
        </p>
        <Magnetic>
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-medium text-fg transition-colors hover:border-accent hover:bg-accent-soft"
          >
            Voltar ao topo <span aria-hidden="true">↑</span>
          </a>
        </Magnetic>
        <p>Feito com React, TypeScript, Tailwind CSS e Three.js</p>
      </div>
      <div aria-hidden="true" className="mt-10 -mb-[0.06em] text-center">
        <span className="footer-word">{profile.firstName}</span>
      </div>
    </footer>
  )
}
