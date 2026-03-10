import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section className={['section', className ?? ''].join(' ').trim()} id={id}>
      <header className="section__header">
        {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
        <h2 className="section__title">{title}</h2>
        {description ? <p className="section__description">{description}</p> : null}
      </header>
      <div className="section__content">{children}</div>
    </section>
  )
}
