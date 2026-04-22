import * as React from 'react';
import { m } from 'framer-motion';
import { viewportOnce, staggerChildren, fadeUpVariants } from './variants';
import { cn } from '../../lib/utils';

const stats = ['14 DAYS', '$0 DOWN', '<1s LOAD', 'NO ASTERISKS'] as const;

export function ProofBar({ className }: { className?: string }) {
  return (
    <section className={cn('border-y border-[color:rgba(255,255,255,0.05)]', className)}>
      <div className="axiom-container">
        <m.div
          className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
        >
          {stats.map((stat, index) => (
            <m.div
              key={stat}
              className={cn(
                'flex items-center justify-center text-center font-mono text-[0.875rem] uppercase tracking-[0.1em] text-[var(--accent-solid)]',
                index !== stats.length - 1 && 'lg:border-r lg:border-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.4)]'
              )}
              variants={fadeUpVariants}
            >
              {stat}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
