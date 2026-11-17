import { useEffect, useState } from 'react'
import { navLinks, profile } from '../data/portfolio'
import { useActiveSection } from '../hooks/useActiveSection'
import { useTheme } from '../hooks/useTheme'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'
import { Magnetic } from './Magnetic'

const SECTION_IDS = [...navLinks.map((l) => l.id), 'contato']

// Texto que "rola" para a cor de destaque no hover (efeito em CSS: .roll).
function Roll({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  )
}

export function Navbar() {
  const active = useActiveSection(SECTION_IDS)
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // A barra some ao rolar para baixo e volta ao rolar para cima.
  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 200)
        last = y
      }
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = (id: string) =>
    `relative py-1 text-sm transition-colors ${
      active === id
        ? "text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded after:bg-accent2 after:content-['']"
        : 'text-muted'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out)] ${
        hidden && !open ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'border-line bg-page/75' : 'border-transparent bg-transparent'}`}
    >
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <a href="#inicio" className="flex items-center gap-2.5 font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-accent font-display text-sm font-extrabold text-white">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={linkClass(link.id)}
                aria-current={active === link.id ? 'true' : undefined}
              >
                <Roll>{link.label}</Roll>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-[color,transform] duration-300 hover:rotate-12 hover:text-fg"
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Magnetic className="hidden sm:inline-block" strength={0.25}>
            <a
              href="#contato"
              className="inline-block rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-page transition-colors hover:bg-accent hover:text-white"
            >
              Contato
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-line text-muted lg:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="menu-mobile" className="border-t border-line bg-page px-4 py-3 lg:hidden">
          {[...navLinks, { id: 'contato', label: 'Contato' }].map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 font-display text-xl font-bold ${
                  active === link.id ? 'bg-accent-soft text-fg' : 'text-muted'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
