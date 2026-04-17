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
    'border border-transparent bg-[var(--accent)] text-[#0A0A0C] shadow-[0_14px_36px_rgba(0,0,0,0.24),0_0_0_1px_rgba(255,255,255,0.04)] hover:brightness-110',
  secondary:
    'border border-[color:var(--hairline)] bg-white/[0.02] text-[var(--text-primary)] hover:border-white/10 hover:bg-white/[0.045] hover:brightness-105',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-primary)] underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-current hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[13px]',
  md: 'min-h-11 px-5 text-[14px]',
  lg: 'min-h-12 px-6 text-[15px]',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-normal transition-[filter,background-color,border-color,color,opacity,transform,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-glow)] focus-visible:ring-offset-0 active:scale-[0.98]';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, type = 'button', children, ...props }, ref) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

    if (asChild && React.isValidElement(children)) {
      return <Slot className={classes}>{children}</Slot>;
    }

    return (
      <button ref={ref} className={classes} type={type} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
