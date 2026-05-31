import * as React from 'react';
import { cn } from '../../lib/utils';

const stats = [
  {
    key: 'performance',
    node: 'Core Web Vitals checked every build',
  },
  {
    key: 'custom',
    node: '2–4 week launch window',
  },
  {
    key: 'window',
    node: 'From $0 down or $3,500 one-time',
  },
  {
    key: 'canada',
    node: 'Based in KW, serving all of Canada',
  },
] as const;

export function ProofBar({ className }: { className?: string }) {
  return (
    <section className={cn('relative overflow-hidden border-y border-[color:rgba(255,255,255,0.04)]', className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/0.3)] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/0.04),transparent_50%)]" />
      <div className="axiom-container">
        <div className="grid gap-0 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={cn(
                'flex items-center justify-center px-6 py-5 text-center',
                'text-[0.95rem] font-medium leading-[1.5] tracking-[0.01em] text-[var(--text-secondary)]',
                index !== stats.length - 1 && 'border-b border-[color:var(--hairline)] lg:border-b-0 lg:border-r lg:border-[color:rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/0.25)]',
                index === stats.length - 1 && 'border-none'
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
