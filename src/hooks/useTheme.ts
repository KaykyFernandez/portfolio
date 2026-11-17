import { useCallback, useState } from 'react'

export type Theme = 'dark' | 'light'

// O tema inicial já foi aplicado pelo script inline do index.html.
function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Armazenamento indisponível (ex.: janela anônima): o tema vale só nesta visita.
    }
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
