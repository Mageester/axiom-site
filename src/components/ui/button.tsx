import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'btn-cta border border-transparent bg-[color:var(--accent)] text-[color:var(--text-on-accent)] shadow-[var(--shadow-button-primary)] hover:bg-[color:var(--accent-hover)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[var(--shadow-button-primary-hover)]',
  secondary:
    'border border-[color:var(--hairline)] bg-[color:var(--surface-panel)] text-[var(--text-primary)] shadow-[var(--shadow-button-secondary)] hover:border-[color:var(--accent-border)] hover:bg-[color:var(--surface-overlay)] hover:brightness-105 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[var(--shadow-button-secondary-hover)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-primary)] underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-current hover:brightness-110 motion-safe:hover:-translate-y-0.5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[14px]',
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-12 px-6 text-[16px]',
};

const baseClasses =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold tracking-normal motion-safe:transition-[filter,background-color,border-color,color,opacity,transform,box-shadow] motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-0 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, type = 'button', children, style, ...props }, ref) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
    const mergedStyle = style;

    if (asChild && React.isValidElement(children)) {
      return <Slot className={classes} style={mergedStyle}>{children}</Slot>;
    }

    return (
      <button ref={ref} className={classes} style={mergedStyle} type={type} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
