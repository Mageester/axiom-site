import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative" data-primitive="select" data-analytics-component="field">
    <select
      ref={ref}
      className={cn(
        'w-full appearance-none rounded-sm border border-hairline bg-surface-soft px-4 py-3 pr-12 font-sans text-body text-text-primary transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-55',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-r border-brass"
    />
  </div>
));

Select.displayName = 'Select';
