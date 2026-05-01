import * as React from 'react';
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
    node: 'OWNERSHIP OPTIONAL',
  },
] as const;

export function ProofBar({ className }: { className?: string }) {
  return (
    <section className={cn('border-y border-[color:rgba(255,255,255,0.05)]', className)}>
      <div className="axiom-container">
        <div className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={cn(
                'motion-surface flex items-center justify-center text-center font-mono text-[0.875rem] uppercase tracking-[0.1em] text-[var(--accent-solid)]',
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
