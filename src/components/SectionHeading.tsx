import { SplitText } from './SplitText'
import { useInView } from '../hooks/useInView'

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: string
  id?: string
}

// Número da seção + etiqueta, título que sobe da máscara palavra por palavra e traço que se desenha.
export function SectionHeading({ index, eyebrow, title, id }: SectionHeadingProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref}>
      <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
        <span className="font-mono text-accent2">{index}</span>
        <span className={`line-draw ${inView ? 'is-in' : ''}`} style={{ maxWidth: '2.5rem', height: 1 }} />
        <span className="text-accent-fg">{eyebrow}</span>
      </p>
      <SplitText
        as="h2"
        id={id}
        text={title}
        stagger={55}
        className="font-display mt-5 max-w-4xl text-[clamp(2rem,5.4vw,4.2rem)] leading-[1.02] font-extrabold tracking-tight"
      />
      <div className={`line-draw mt-6 ${inView ? 'is-in' : ''}`} />
    </div>
  )
}
