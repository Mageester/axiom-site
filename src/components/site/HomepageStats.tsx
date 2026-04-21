import { useEffect, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

type AnimatedStatProps = {
  description: string;
  duration: number;
  unit: string;
  target: number;
};

type StaticStatProps = {
  description: string;
  unit: string;
  value: string;
};

function AnimatedStat({ description, duration, target, unit }: AnimatedStatProps) {
  const { ref: blockRef, isVisible } = useFadeInOnScroll<HTMLElement>();
  const { ref: countRef, value, isDone } = useCountUp<HTMLDListElement>(target, duration);
  const [showUnit, setShowUnit] = useState(false);
  const visibilityClass = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4';

  useEffect(() => {
    if (!isDone) return;

    const timeoutId = window.setTimeout(() => setShowUnit(true), 300);
    return () => window.clearTimeout(timeoutId);
  }, [isDone]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) return;

    setShowUnit(true);
  }, []);

  return (
    <div
      ref={blockRef}
      className={[
        visibilityClass,
        'flex flex-col gap-1 motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out motion-safe:will-change-[opacity,transform] motion-safe:transform-gpu motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dd ref={countRef} className="text-[52px] font-[600] leading-none tracking-[-0.04em] text-[var(--text-primary)] md:text-[64px]">
        {value}
      </dd>
      <dt
        className={[
          'font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--accent-solid)] opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-reduce:opacity-100',
          showUnit && 'opacity-100',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {unit}
      </dt>
      <p className="mt-2 text-[15px] leading-[1.7] text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

function StaticStat({ description, unit, value }: StaticStatProps) {
  const { ref: blockRef, isVisible } = useFadeInOnScroll<HTMLElement>();
  const [showUnit, setShowUnit] = useState(false);
  const visibilityClass = isVisible
    ? 'opacity-100 translate-y-0 scale-100'
    : 'opacity-0 translate-y-4 scale-[0.985]';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowUnit(true);
      return;
    }

    if (!isVisible) return;

    const timeoutId = window.setTimeout(() => setShowUnit(true), 300);
    return () => window.clearTimeout(timeoutId);
  }, [isVisible]);

  return (
    <div
      ref={blockRef}
      className={[
        visibilityClass,
        'flex flex-col gap-1 motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out motion-safe:will-change-[opacity,transform] motion-safe:transform-gpu motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dd className="text-[52px] font-[600] leading-none tracking-[-0.04em] text-[var(--text-primary)] md:text-[64px]">
        {value}
      </dd>
      <dt
        className={[
          'font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--accent-solid)] opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-reduce:opacity-100',
          showUnit && 'opacity-100',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {unit}
      </dt>
      <p className="mt-2 text-[15px] leading-[1.7] text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

export function HomepageStats() {
  return (
    <section className="border-t border-[color:var(--hairline)]">
      <div className="axiom-container py-10 md:py-14">
        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <AnimatedStat description="Typical turnaround from kickoff to live." duration={1000} target={14} unit="DAYS" />
          <StaticStat description="Performance floor, guaranteed in writing." unit="LOAD TIME" value="<1s" />
          <StaticStat
            description="Most clients start here for lower upfront cost and ongoing support."
            unit="PRIMARY PATH"
            value="MONTHLY"
          />
        </dl>
      </div>
    </section>
  );
}
