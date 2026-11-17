import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'

type SplitTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  id?: string
  by?: 'char' | 'word'
  // "ready": anima quando o preloader termina (hero). "view": anima ao entrar na tela.
  trigger?: 'ready' | 'view'
  delay?: number
  stagger?: number
}

type Vars = CSSProperties & Record<`--${string}`, string | number | undefined>

// Texto que sobe de dentro de uma máscara, letra por letra ou palavra por palavra.
// Leitores de tela recebem o texto inteiro; as letras animadas ficam escondidas deles.
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  id,
  by = 'word',
  trigger = 'view',
  delay = 0,
  stagger,
}: SplitTextProps) {
  const [ref, inView] = useInView<HTMLElement>(0.3)
  const words = text.split(' ')
  // Índice corrido de cada unidade (letra ou palavra), usado para escalonar o atraso.
  const starts = words.map((_, w) =>
    words.slice(0, w).reduce((sum, prev) => sum + (by === 'char' ? [...prev].length : 1), 0),
  )

  const style: Vars = { '--d': `${delay}ms`, '--st': stagger ? `${stagger}ms` : undefined }

  return (
    <Tag
      ref={ref as never}
      id={id}
      data-trigger={trigger}
      className={`sw ${trigger === 'view' && inView ? 'is-in' : ''} ${className}`}
      style={style}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className="sw-word">
              {by === 'char' ? (
                [...word].map((ch, c) => {
                  const unit: Vars = { '--i': starts[w] + c }
                  return (
                    <span key={c} className="sw-unit" style={unit}>
                      {ch}
                    </span>
                  )
                })
              ) : (
                <span className="sw-unit" style={{ '--i': starts[w] } as Vars}>
                  {word}
                </span>
              )}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  )
}
