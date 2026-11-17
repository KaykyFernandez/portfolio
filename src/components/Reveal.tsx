import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

// Faz o conteúdo subir e aparecer quando entra na tela.
// Com "reduzir movimento" ligado, o CSS mostra tudo imediatamente.
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const [ref, visible] = useInView<HTMLDivElement>(0.12)
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
