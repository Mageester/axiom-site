import * as React from 'react';
import { cn } from '../../lib/utils';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ as: Component = 'span', className, children, ...props }) => {
  return (
    <Component className={cn('axiom-eyebrow text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]', className)} {...props}>
      {children}
    </Component>
  );
};
