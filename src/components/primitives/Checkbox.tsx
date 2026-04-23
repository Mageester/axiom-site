import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, description, id, label, ...props }, ref) => {
    const fallbackId = React.useId();
    const fieldId = id ?? fallbackId;

    return (
      <label className="flex cursor-pointer items-start gap-3" data-primitive="checkbox" htmlFor={fieldId}>
        <span className="relative mt-1 h-4 w-4 flex-none">
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              'peer h-4 w-4 appearance-none rounded-[2px] border border-hairline bg-surface-soft transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink checked:border-brass checked:bg-brass disabled:cursor-not-allowed disabled:opacity-55',
              className
            )}
            data-analytics-component="field"
            type="checkbox"
            {...props}
          />
          <span className="pointer-events-none absolute inset-x-[4px] top-[1px] hidden h-[8px] rotate-45 border-b-2 border-r-2 border-ink peer-checked:block" />
        </span>
        <span className="flex flex-col gap-1">
          {label ? <span className="font-sans text-body text-text-primary">{label}</span> : null}
          {description ? <span className="font-sans text-body-sm text-text-secondary">{description}</span> : null}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
