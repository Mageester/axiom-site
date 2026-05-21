import * as React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className={cn('relative overflow-visible pt-3 md:pt-5', className)}>
      <motion.div
        aria-hidden="true"
        className="timeline-rail absolute left-0 top-6 hidden h-px w-full origin-left bg-[linear-gradient(90deg,rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.12),rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.58),rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.12))] md:block"
        style={{ scaleX }}
      />
      {mobileVertical ? (
        <motion.div
          aria-hidden="true"
          className="timeline-rail timeline-rail-vertical absolute left-6 top-0 h-full w-px origin-top bg-[color:var(--accent-solid)]/40 md:hidden"
          style={{ scaleY }}
        />
      ) : null}

      <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {steps.map((step, index) => (
          <article
            key={`${step.kicker}-${index}`}
            className="motion-surface premium-card group relative rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] p-6 shadow-[var(--shadow-card)] backdrop-blur-[8px]"
            data-reveal
            data-motion="timelineSequence"
            suppressHydrationWarning
            style={
              {
                '--reveal-delay': `${Math.min(index * 150, 600)}ms`,
                '--reveal-x': index % 2 === 0 ? '-8px' : '8px',
              } as React.CSSProperties
            }
          >
            <div className="flex items-center gap-3">
              <span className="timeline-step-number flex h-10 min-w-[4.75rem] items-center justify-center rounded-[10px] border border-[color:var(--hairline-strong)] bg-[color:rgba(255,255,255,0.025)] px-3 font-display text-[0.72rem] font-medium uppercase tracking-[0.035em] text-[var(--accent-solid)] transition-[background-color,border-color] duration-[var(--motion-hover-settle)] ease-[var(--ease-cinematic)] group-hover:border-[color:var(--accent-border)] group-hover:bg-[color:rgba(255,255,255,0.04)]">
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
