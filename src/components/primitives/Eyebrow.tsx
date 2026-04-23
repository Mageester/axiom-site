import * as React from 'react';
import { cn } from '../../lib/utils';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export function Eyebrow({ as: Component = 'span', className, ...props }: EyebrowProps) {
  return (
    <Component
      className={cn('inline-flex items-center gap-2 font-sans text-caption uppercase tracking-[0.22em] text-brass', className)}
      data-primitive="eyebrow"
      {...props}
    />
  );
}
