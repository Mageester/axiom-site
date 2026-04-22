import * as React from 'react';
import { m } from 'framer-motion';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { cn } from '../../lib/utils';
import { underlineDrawVariants } from './variants';

export interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SectionDivider({ className, ...props }: SectionDividerProps) {
  const reveal = useAnimatedReveal();

  return (
    <m.div
      aria-hidden="true"
      className={cn('section-divider mx-auto', className)}
      data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
      initial="hidden"
      animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
      variants={underlineDrawVariants}
      {...props}
    />
  );
}
