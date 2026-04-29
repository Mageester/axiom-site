import * as React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ResponsiveSource } from '../../lib/responsiveImages';

type Build = {
  eyebrow: string;
  title: string;
  category: string;
  originalWeakness: string;
  axiomChanged: string;
  whyItWorks: string;
  image: ResponsiveSource;
  alt: string;
  position?: string;
  href: string;
};

type Filter = {
  label: string;
  value: string;
};

export interface WorkShowcaseProps {
  builds: Build[];
  filters: Filter[];
}

function WorkImage({ build, styleType, index }: { build: Build; styleType: 'a' | 'b' | 'c'; index: number }) {
  const motionWrapClass =
    styleType === 'b'
      ? 'relative overflow-hidden rounded-[24px]'
      : styleType === 'c'
        ? 'relative overflow-visible'
        : 'relative overflow-hidden rounded-[24px]';

  return (
    <div className={motionWrapClass}>
      {styleType === 'c' ? (
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[24px] border border-[color:var(--accent-border)] bg-[rgba(255,255,255,0.02)]" aria-hidden="true" />
      ) : null}

      <m.div
        className={cn(
          'relative transform-gpu overflow-hidden rounded-[24px]',
          styleType === 'c' && 'border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] p-2'
        )}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.42, ease: [0.33, 1, 0.68, 1] }}
      >
        <picture className="block h-full w-full overflow-hidden rounded-[20px]">
          <source type="image/avif" srcSet={build.image.avifSrcSet} />
          <source type="image/webp" srcSet={build.image.webpSrcSet} />
          <img
            src={build.image.fallbackSrc}
            alt={build.alt}
            className={cn(
              'block h-full w-full object-cover',
              styleType === 'b' ? 'aspect-[4/5]' : 'aspect-[4/3]'
            )}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            style={{ objectPosition: build.position }}
          />
        </picture>

        {styleType === 'b' ? (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,rgba(0,0,0,0.62)_100%)]" />
        ) : null}
      </m.div>
    </div>
  );
}

export function WorkShowcase({ builds, filters }: WorkShowcaseProps) {
  const [activeFilter, setActiveFilter] = React.useState('all');

  const visibleBuilds = activeFilter === 'all' ? builds : builds.filter((build) => build.category === activeFilter);

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="relative mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mb-10" data-reveal suppressHydrationWarning>
        {filters.map((filter) => {
          const isActive = filter.value === activeFilter;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={isActive}
            className="relative min-h-11 rounded-full border border-transparent px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] transition-[color,border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:border-[color:var(--hairline)] hover:bg-[color:var(--surface-overlay)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
            >
              {isActive ? (
                <m.span
                  layoutId="work-filter-underline"
                  className="absolute inset-x-0 -bottom-px h-px bg-[color:var(--accent-solid)]"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className={cn(isActive && 'text-[var(--accent-solid)]')}>{filter.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 md:gap-10">
        <AnimatePresence initial={false}>
          {visibleBuilds.map((build, index) => {
            const styleType = index % 3 === 0 ? 'a' : index % 3 === 1 ? 'b' : 'c';
            const imageFirst = index % 2 === 0;

            if (styleType === 'b') {
              return (
                <m.article
                  key={build.title}
                  className="motion-surface premium-card group overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] shadow-[var(--shadow-card)]"
                  layout
                  transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                >
                  <div className="relative">
                    <WorkImage build={build} styleType={styleType} index={index} />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <div className="max-w-2xl rounded-[22px] border border-[color:rgb(var(--accent-v2-rgb,var(--accent-current-rgb))/_0.16)] bg-[linear-gradient(180deg,rgba(0,0,0,0.3),rgba(0,0,0,0.72))] p-5 backdrop-blur-[10px]">
                        <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--accent-solid)]">
                          {build.eyebrow}
                        </p>
                        <h3 className="mt-3 text-[clamp(1.25rem,1.5vw,1.5rem)] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
                          {build.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-[1rem] leading-[1.6] text-[var(--text-secondary)]">
                          {build.axiomChanged}
                        </p>
                        <a
                          href={build.href}
                          target="_blank"
                          rel="noreferrer"
                          className="motion-link-accent mt-4 inline-flex min-h-11 items-center text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-solid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
                        >
                          View demo
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-0 md:grid-cols-3">
                    <div className="md:col-span-1" />
                    <dl className="grid gap-0 md:col-span-2 md:grid-cols-3">
                      {[
                        ['Original weakness', build.originalWeakness],
                        ['Axiom changed', build.axiomChanged],
                        ['Why it works', build.whyItWorks],
                      ].map(([label, value]) => (
                        <div key={label} className="border-t border-[color:var(--hairline)] p-5 sm:p-6">
                          <dt className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            {label}
                          </dt>
                          <dd className="mt-2 text-[1rem] leading-[1.65] text-[var(--text-secondary)]">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </m.article>
              );
            }

            if (styleType === 'c') {
              return (
                <m.article
                  key={build.title}
                  className="motion-surface premium-card group grid gap-0 overflow-visible rounded-[28px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
                  layout
                  transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                >
                  <div className={`${imageFirst ? '' : 'lg:order-2'}`}>
                    <WorkImage build={build} styleType={styleType} index={index} />
                  </div>
                  <div className={`flex h-full flex-col justify-center p-6 sm:p-8 ${imageFirst ? '' : 'lg:order-1'}`}>
                    <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--accent-solid)]">
                      {build.eyebrow}
                    </p>
                    <h3 className="mt-4 text-[clamp(1.25rem,1.5vw,1.5rem)] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
                      {build.title}
                    </h3>
                    <p className="mt-3 text-[1rem] leading-[1.6] text-[var(--text-secondary)]">
                      {build.originalWeakness}
                    </p>
                    <div className="mt-6 space-y-4 border-t border-[color:var(--hairline)] pt-5">
                      <div>
                        <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">Axiom changed</p>
                        <p className="mt-2 text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{build.axiomChanged}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">Why it works</p>
                        <p className="mt-2 text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{build.whyItWorks}</p>
                      </div>
                    </div>
                    <a
                      href={build.href}
                      target="_blank"
                      rel="noreferrer"
                      className="motion-link-accent mt-6 inline-flex min-h-11 items-center self-start text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-solid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
                    >
                      View demo
                    </a>
                  </div>
                </m.article>
              );
            }

            return (
              <m.article
                key={build.title}
                className="motion-surface premium-card group overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] shadow-[var(--shadow-card)]"
                layout
                transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className={`grid gap-0 lg:grid-cols-2`}>
                  <div className={`${imageFirst ? '' : 'lg:order-2'}`}>
                    <WorkImage build={build} styleType={styleType} index={index} />
                  </div>
                  <div className={`flex h-full flex-col justify-center p-6 sm:p-8 lg:p-10 ${imageFirst ? '' : 'lg:order-1'}`}>
                    <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--accent-solid)]">
                      {build.eyebrow}
                    </p>
                    <h3 className="mt-4 text-[clamp(1.25rem,1.5vw,1.5rem)] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
                      {build.title}
                    </h3>

                    <dl className="mt-8 space-y-5">
                      <div className="space-y-2">
                        <dt className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">Original weakness</dt>
                        <dd className="text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{build.originalWeakness}</dd>
                      </div>
                      <div className="space-y-2 border-t border-[color:var(--hairline)] pt-5">
                        <dt className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">Axiom changed</dt>
                        <dd className="text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{build.axiomChanged}</dd>
                      </div>
                      <div className="space-y-2 border-t border-[color:var(--hairline)] pt-5">
                        <dt className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">Why it works</dt>
                        <dd className="text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{build.whyItWorks}</dd>
                      </div>
                    </dl>
                    <a
                      href={build.href}
                      target="_blank"
                      rel="noreferrer"
                      className="motion-link-accent mt-7 inline-flex min-h-11 items-center self-start text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-solid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
                    >
                      View demo
                    </a>
                  </div>
                </div>
              </m.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
