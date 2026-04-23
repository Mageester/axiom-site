import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses = {
  primary:
    'border border-brass bg-brass text-text-inverse shadow-sm hover:border-brass-muted hover:bg-brass-muted hover:text-bone',
  secondary:
    'border border-hairline bg-surface-soft text-text-primary hover:border-brass hover:bg-surface-raised',
  ghost:
    'border border-transparent bg-transparent text-text-primary hover:border-hairline hover:bg-surface-soft',
};

const sizeClasses = {
  sm: 'min-h-10 px-4 text-body-sm',
  md: 'min-h-11 px-6 text-body',
  lg: 'min-h-12 px-8 text-body-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, type = 'button', variant = 'primary', size = 'md', ...props }, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-sm border font-sans font-medium tracking-[0.02em] transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-55',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        data-primitive="button"
        data-analytics-component="button"
        type={type}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
