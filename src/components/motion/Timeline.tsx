import * as React from 'react';
import { cn } from '../../lib/utils';

export type TimelineStep = {
  kicker: string;
  title: string;
  description: string;
};

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
  mobileVertical?: boolean;
}

export function Timeline({ steps, className, mobileVertical = true }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="timeline-rail absolute left-0 top-6 hidden h-px w-full origin-left bg-[linear-gradient(90deg,rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.12),rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.58),rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.12))] md:block"
        data-reveal
        suppressHydrationWarning
      />
      {mobileVertical ? (
        <div
          aria-hidden="true"
          className="timeline-rail timeline-rail-vertical absolute left-6 top-0 h-full w-px origin-top bg-[color:var(--accent-solid)]/40 md:hidden"
          data-reveal
          suppressHydrationWarning
        />
      ) : null}

      <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {steps.map((step, index) => (
          <article
            key={`${step.kicker}-${index}`}
            className="motion-surface premium-card group relative rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] p-6 shadow-[var(--shadow-card)] backdrop-blur-[8px]"
            data-reveal
            suppressHydrationWarning
            style={{ '--reveal-delay': `${Math.min(index * 65, 260)}ms` } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 min-w-[3.25rem] items-center justify-center rounded-full border border-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.3)] bg-[color:rgba(255,255,255,0.03)] px-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.06em] text-[var(--accent-solid)] transition-[background-color,border-color,box-shadow] duration-[var(--duration-medium)] ease-[var(--ease-premium)] group-hover:border-[color:var(--accent-border-strong)] group-hover:bg-[color:var(--accent-surface)] group-hover:shadow-[0_0_0_5px_var(--accent-ring-soft)]">
                {step.kicker}
              </span>
              <div className="h-px flex-1 bg-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.35)] md:hidden" />
            </div>
            <h3 className="mt-5 text-[clamp(1.25rem,1.5vw,1.5rem)] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
              {step.title}
            </h3>
            <p className="mt-3 text-[1rem] leading-[1.6] text-[var(--text-secondary)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
