import * as React from 'react';
import { m } from 'framer-motion';
import { cn } from '../../lib/utils';
import { underlineDrawVariants, viewportOnce } from './variants';

export interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SectionDivider({ className, ...props }: SectionDividerProps) {
  return (
    <m.div
      aria-hidden="true"
      className={cn('section-divider mx-auto', className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={underlineDrawVariants}
      {...props}
    />
  );
}
