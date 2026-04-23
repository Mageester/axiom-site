import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-36 w-full rounded-sm border border-hairline bg-surface-soft px-4 py-3 font-sans text-body text-text-primary placeholder:text-text-muted transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-55',
      className
    )}
    data-primitive="textarea"
    data-analytics-component="field"
    {...props}
  />
));

Textarea.displayName = 'Textarea';
