import type { ReactNode } from 'react'

interface CardProps {
  title: string
  description?: string
  meta?: string
  children?: ReactNode
}

export function Card({ title, description, meta, children }: CardProps) {
  return (
    <article className="card">
      <h3 className="card__title">{title}</h3>
      {description ? <p className="card__description">{description}</p> : null}
      {meta ? <p className="card__meta">{meta}</p> : null}
      {children ? <div className="card__body">{children}</div> : null}
    </article>
  )
}
