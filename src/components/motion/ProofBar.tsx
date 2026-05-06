import * as React from 'react';
import { cn } from '../../lib/utils';

const stats = [
  {
    key: 'performance',
    node: 'Performance verified before launch',
  },
  {
    key: 'custom',
    node: 'Custom design and development',
  },
  {
    key: 'window',
    node: '2-4 week standard build window',
  },
  {
    key: 'canada',
    node: 'Serving clients across Canada',
  },
] as const;

export function ProofBar({ className }: { className?: string }) {
  return (
    <section className={cn('home-proof-band border-y border-[color:rgba(255,255,255,0.05)]', className)}>
      <div className="axiom-container">
        <div className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={cn(
                'motion-surface flex items-center justify-center px-4 text-center font-display text-[0.96rem] font-medium leading-[1.45] tracking-[0.01em] text-[var(--text-secondary)]',
                index !== stats.length - 1 && 'lg:border-r lg:border-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.4)]'
              )}
              data-reveal
              data-motion="sceneOpen"
              suppressHydrationWarning
              style={{ '--reveal-delay': `${Math.min(920 + index * 120, 1400)}ms` } as React.CSSProperties}
            >
              {stat.node}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
