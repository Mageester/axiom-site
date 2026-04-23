import * as React from 'react';
import { cn } from '../../lib/utils';

export interface GridLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  fade?: boolean;
}

export function GridLines({ className, fade = true, ...props }: GridLinesProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 bg-[image:var(--grid-line)] bg-[size:var(--grid-size)_var(--grid-size)] opacity-60',
        fade && 'mask-[image:var(--grid-mask)]',
        className
      )}
      data-primitive="grid-lines"
      {...props}
    />
  );
}
