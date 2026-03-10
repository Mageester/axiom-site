import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'quiet'
type ButtonSize = 'md' | 'lg'

interface SharedButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

interface ButtonLinkProps extends SharedButtonProps {
  to: string
}

interface ButtonAnchorProps extends SharedButtonProps {
  href: string
  target?: string
  rel?: string
}

interface ButtonProps
  extends SharedButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {}

function buildButtonClass({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: Omit<SharedButtonProps, 'children'>): string {
  return [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      className={buildButtonClass({ variant, size, fullWidth, className })}
      to={to}
    >
      {children}
    </Link>
  )
}

export function ButtonAnchor({
  href,
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className,
  target,
  rel,
}: ButtonAnchorProps) {
  return (
    <a
      className={buildButtonClass({ variant, size, fullWidth, className })}
      href={href}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={buildButtonClass({ variant, size, fullWidth, className })}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
