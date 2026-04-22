import * as React from 'react';
import { cn } from '../../lib/utils';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ as: Component = 'span', className, children, style, ...props }) => {
  return (
    <Component className={cn('axiom-eyebrow', className)} style={{ color: 'var(--accent-solid)', ...style }} {...props}>
      {children}
    </Component>
  );
};
