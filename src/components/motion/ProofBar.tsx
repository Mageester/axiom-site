import * as React from 'react';
import { m } from 'framer-motion';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { staggerChildren, fadeUpVariants } from './variants';
import { cn } from '../../lib/utils';

const stats = [
  {
    key: 'launch',
    node: '2-4 WEEK LAUNCH',
  },
  {
    key: 'vitals',
    node: 'CORE WEB VITALS',
  },
  {
    key: 'support',
    node: 'DIRECT SUPPORT',
  },
  {
    key: 'asterisks',
    node: 'NO ASTERISKS',
  },
] as const;

export function ProofBar({ className }: { className?: string }) {
  const reveal = useAnimatedReveal();

  return (
    <section ref={reveal.ref} className={cn('border-y border-[color:rgba(255,255,255,0.05)]', className)}>
      <div className="axiom-container">
        <m.div
          className="motion-surface grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
          data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
          initial="hidden"
          animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
          variants={staggerChildren}
        >
          {stats.map((stat, index) => (
            <m.div
              key={stat.key}
              className={cn(
                'motion-surface flex items-center justify-center text-center font-mono text-[0.875rem] uppercase tracking-[0.1em] text-[var(--accent-solid)]',
                index !== stats.length - 1 && 'lg:border-r lg:border-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.4)]'
              )}
              data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
              variants={fadeUpVariants}
            >
              {stat.node}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
