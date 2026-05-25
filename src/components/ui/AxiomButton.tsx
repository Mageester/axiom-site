import * as React from 'react';
import { cn } from '../../lib/utils';

export type AxiomButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type AxiomButtonSize = 'sm' | 'md' | 'lg';

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  variant?: AxiomButtonVariant;
  size?: AxiomButtonSize;
  disabled?: boolean;
  ariaLabel?: string;
  fullWidth?: boolean;
};

type AsButton = CommonProps & {
  as?: 'button';
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  target?: never;
  rel?: never;
};

type AsAnchor = CommonProps & {
  as: 'a';
  href: string;
  type?: never;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export type AxiomButtonProps = AsButton | AsAnchor;

const sizeMap: Record<AxiomButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[12px]',
  md: 'min-h-11 px-5 text-[12px]',
  lg: 'min-h-12 px-6 text-[13px]',
};

const variantMap: Record<AxiomButtonVariant, string> = {
  primary: 'axiom-btn-primary',
  secondary: 'axiom-btn-secondary',
  ghost: 'axiom-btn-ghost',
  icon: 'axiom-btn-icon',
};

const base =
  'group/axbtn relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-semibold uppercase tracking-[0.16em] text-white transition-[transform,border-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-55';

export function AxiomButton(props: AxiomButtonProps) {
  const {
    className,
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    ariaLabel,
    fullWidth,
  } = props;

  const classes = cn(
    base,
    variantMap[variant],
    variant === 'icon' ? null : sizeMap[size],
    fullWidth && 'w-full',
    className,
  );

  const inner = (
    <>
      <span className="axiom-btn-sheen" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-label={ariaLabel}
        onClick={props.onClick}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      aria-label={ariaLabel}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {inner}
    </button>
  );
}

export default AxiomButton;
