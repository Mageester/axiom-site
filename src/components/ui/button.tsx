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
    'border border-transparent shadow-[var(--shadow-button-primary)] hover:brightness-110 motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[var(--shadow-button-primary-hover),0_0_20px_rgba(210,160,100,0.3)]',
  secondary:
    'border border-[color:var(--hairline)] bg-[color:var(--surface-panel)] text-[var(--text-primary)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-overlay)] hover:brightness-105',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-primary)] underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-current hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[14px]',
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-12 px-6 text-[16px]',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-normal motion-safe:transition-[filter,background-color,border-color,color,opacity,transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-0 motion-safe:active:scale-[0.98]';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, type = 'button', children, style, ...props }, ref) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
    const mergedStyle =
      variant === 'primary'
        ? { background: 'var(--accent)', color: 'var(--text-on-accent)', ...(style ?? {}) }
        : style;

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
