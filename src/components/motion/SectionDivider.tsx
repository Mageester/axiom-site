import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SectionDivider({ className, ...props }: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('section-divider mx-auto', className)}
      data-reveal
      suppressHydrationWarning
      {...props}
    />
  );
}
