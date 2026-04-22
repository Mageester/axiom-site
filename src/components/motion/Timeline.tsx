import * as React from 'react';
import { m } from 'framer-motion';
import { cn } from '../../lib/utils';
import { fadeUpVariants, staggerChildren, underlineDrawVariants, viewportOnce } from './variants';

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
      <m.div
        aria-hidden="true"
        className="absolute left-0 top-6 hidden h-px w-full origin-left bg-[color:var(--accent-solid)]/40 md:block"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={underlineDrawVariants}
      />
      {mobileVertical ? (
        <m.div
          aria-hidden="true"
          className="absolute left-6 top-0 h-full w-px origin-top bg-[color:var(--accent-solid)]/40 md:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={underlineDrawVariants}
        />
      ) : null}

      <m.div
        className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren}
      >
        {steps.map((step, index) => (
          <m.article
            key={`${step.kicker}-${index}`}
            className="relative rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] p-6 shadow-[var(--shadow-card)] backdrop-blur-[8px]"
            variants={fadeUpVariants}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:rgb(var(--accent-v2-rgb, var(--accent-current-rgb)) / 0.3)] bg-[color:rgba(255,255,255,0.03)] font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--accent-solid)]">
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
          </m.article>
        ))}
      </m.div>
    </div>
  );
}
