import * as React from 'react';
import { cn } from '../../lib/utils';

type LinkVariant = 'inline' | 'subtle' | 'nav';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
}

const variantClasses = {
  inline: 'text-text-primary decoration-[0.08em] underline-offset-[0.22em] hover:text-brass',
  subtle: 'text-text-secondary decoration-transparent hover:text-text-primary hover:decoration-current',
  nav: 'text-body-sm uppercase tracking-[0.14em] text-text-secondary no-underline hover:text-bone',
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'inline', ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
        variantClasses[variant],
        className
      )}
      data-primitive="link"
      data-analytics-component="link"
      {...props}
    />
  )
);

Link.displayName = 'Link';
