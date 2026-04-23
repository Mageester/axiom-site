import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Chip({ className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface-soft px-3 py-1.5 font-sans text-body-sm text-text-secondary',
        className
      )}
      data-primitive="chip"
      {...props}
    />
  );
}
