import * as React from 'react';
import { m } from 'framer-motion';
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

function WorkImage({
  build,
  index,
  featured = false,
}: {
  build: Build;
  index: number;
  featured?: boolean;
}) {
  return (
    <m.div
      className={cn(
        'relative transform-gpu overflow-hidden rounded-[22px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.03)]',
        featured ? 'aspect-[16/11] lg:aspect-[1.18/1]' : 'aspect-[16/10] lg:aspect-[1.35/1]'
      )}
      whileHover={{ scale: 1.016 }}
      initial={false}
      transition={{
        scale: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <picture className="block h-full w-full">
        <source type="image/avif" srcSet={build.image.avifSrcSet} />
        <source type="image/webp" srcSet={build.image.webpSrcSet} />
        <img
          src={build.image.fallbackSrc}
          alt={build.alt}
          className="block h-full w-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchpriority={index === 0 ? 'high' : 'low'}
          decoding="async"
          width={1200}
          height={featured ? 1017 : 889}
          style={{ objectPosition: build.position }}
        />
      </picture>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(0,0,0,0.34)_100%)]" />
    </m.div>
  );
}

function CaseNotes({ build, compact = false }: { build: Build; compact?: boolean }) {
  return (
    <dl className={cn('grid gap-3', compact ? 'max-w-2xl' : 'sm:grid-cols-3 lg:grid-cols-1')}>
      {[
        ['ORIGINAL WEAKNESS', build.originalWeakness],
        ['AXIOM CHANGED', build.axiomChanged],
        ['WHY IT WORKS', build.whyItWorks],
      ].map(([label, value]) => (
        <div
          key={label}
          className={cn(
            'border-t border-[color:var(--hairline)] pt-4',
            !compact && 'sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0',
            !compact && 'lg:border-l-0 lg:border-t lg:pl-0 lg:pt-4'
          )}
        >
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
          <dd className="mt-2 text-[0.95rem] leading-[1.62] text-[var(--text-secondary)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CaseCard({
  build,
  index,
  featured = false,
}: {
  build: Build;
  index: number;
  featured?: boolean;
}) {
  const imageFirst = featured || index % 2 === 0;

  return (
    <m.article
      className={cn(
        'motion-surface premium-card group overflow-hidden rounded-[24px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] shadow-[var(--shadow-card)]',
        featured
          ? 'grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]'
          : 'grid gap-0 lg:grid-cols-[minmax(20rem,0.82fr)_minmax(0,1.18fr)]'
      )}
      data-reveal
      data-motion="depthCardReveal"
      suppressHydrationWarning
    >
      <div className={cn('p-3 sm:p-4', !imageFirst && 'lg:order-2')}>
        <WorkImage build={build} index={index} featured={featured} />
      </div>

      <div className={cn('flex min-w-0 flex-col p-6 sm:p-7 lg:p-8', !imageFirst && 'lg:order-1')}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--accent-solid)]">
              {build.eyebrow}
            </p>
            <h3
              className={cn(
                'mt-4 font-medium tracking-[-0.01em] text-[var(--text-primary)]',
                featured ? 'text-[clamp(1.55rem,2.35vw,2.4rem)] leading-[1.12]' : 'text-[clamp(1.2rem,1.45vw,1.55rem)]'
              )}
            >
              {build.title}
            </h3>
          </div>
          <span className="hidden shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:inline">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className={cn('mt-7', featured ? 'lg:mt-auto lg:pt-8' : 'lg:mt-8')}>
          <CaseNotes build={build} compact={!featured} />
        </div>

        <a
          href={build.href}
          target="_blank"
          rel="noopener noreferrer"
          className="motion-link-accent mt-7 inline-flex min-h-11 items-center self-start text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-solid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
        >
          View demo
        </a>
      </div>
    </m.article>
  );
}

export function WorkShowcase({ builds, filters }: WorkShowcaseProps) {
  const [activeFilter, setActiveFilter] = React.useState('all');

  const visibleBuilds = activeFilter === 'all' ? builds : builds.filter((build) => build.category === activeFilter);
  const [featuredBuild, ...supportingBuilds] = visibleBuilds;

  return (
    <div className="space-y-7 md:space-y-9">
      <div className="work-filter-scroll relative -mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0" data-reveal suppressHydrationWarning>
        <div className="inline-flex min-w-max items-center gap-1 rounded-full border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.025)] p-1">
          {filters.map((filter) => {
            const isActive = filter.value === activeFilter;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
                className="relative min-h-10 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)] transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:bg-[color:var(--surface-overlay)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
              >
                {isActive ? (
                  <m.span
                    layoutId="work-filter-pill"
                    className="absolute inset-0 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-surface)]"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
                <span className={cn('relative z-10', isActive && 'text-[var(--accent-solid)]')}>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {featuredBuild ? <CaseCard build={featuredBuild} index={0} featured /> : null}

      {supportingBuilds.length ? (
        <div className="grid gap-5 md:gap-6">
          {supportingBuilds.map((build, index) => (
            <CaseCard key={build.title} build={build} index={index + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
