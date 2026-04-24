import * as React from 'react';
import { m } from 'framer-motion';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { cn } from '../../lib/utils';
import { fadeUpVariants, staggerChildren, underlineDrawVariants } from './variants';

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
  const reveal = useAnimatedReveal();

  return (
    <div className={cn('relative', className)}>
      {/* ── Desktop: horizontal connecting line ────────────────────────── */}
      <m.div
        aria-hidden="true"
        className="motion-surface pointer-events-none absolute left-0 top-[19px] hidden h-px w-full origin-left md:block"
        style={{ background: 'rgba(212,175,55,0.28)' }}
        data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
        initial="hidden"
        animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
        variants={underlineDrawVariants}
      />

      {/* ── Mobile: vertical connecting line ───────────────────────────── */}
      {mobileVertical ? (
        <m.div
          aria-hidden="true"
          className="motion-surface pointer-events-none absolute left-[19px] top-0 h-full w-px origin-top md:hidden"
          style={{ background: 'rgba(212,175,55,0.28)' }}
          data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
          initial="hidden"
          animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
          variants={{
            hidden: { scaleY: 0 },
            visible: {
              scaleY: 1,
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        />
      ) : null}

      {/* ── Stage grid ─────────────────────────────────────────────────── */}
      <m.div
        className="motion-surface relative grid gap-x-6 gap-y-10 md:grid-cols-4"
        data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
        initial="hidden"
        animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
        variants={staggerChildren}
      >
        {steps.map((step, index) => (
          <m.article
            key={`${step.kicker}-${index}`}
            className="motion-surface relative flex gap-5 md:flex-col md:gap-0"
            data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
            variants={fadeUpVariants}
          >
            {/* Node + kicker label */}
            <div className="flex flex-shrink-0 flex-col items-center md:flex-row md:items-start">
              {/* Gold numbered node */}
              <div
                className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  borderColor: 'rgba(212,175,55,0.35)',
                }}
              >
                <span
                  className="font-mono text-[0.8rem] font-semibold tabular-nums"
                  style={{ color: 'var(--accent-solid)' }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Mobile-only: vertical connector spur between node and content */}
              <div
                className="mt-1 h-4 w-px flex-shrink-0 md:hidden"
                aria-hidden="true"
                style={{ background: 'rgba(212,175,55,0.2)' }}
              />
            </div>

            {/* Content */}
            <div className="md:mt-7">
              {/* Day kicker */}
              <p
                className="font-mono text-[0.7rem] uppercase tracking-[0.14em]"
                style={{ color: 'var(--text-muted)' }}
              >
                {step.kicker}
              </p>

              {/* Stage title */}
              <h3
                className="mt-2 text-[clamp(1.1rem,1.4vw,1.25rem)] font-medium tracking-normal"
                style={{ color: 'var(--text-primary)' }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="mt-2 max-w-[22ch] text-[0.875rem] leading-[1.65]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {step.description}
              </p>
            </div>
          </m.article>
        ))}
      </m.div>
    </div>
  );
}
