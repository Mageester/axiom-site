import * as React from 'react';
import { m } from 'framer-motion';
import { ArrowUpRightIcon } from 'lucide-react';
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

function CaseNotes({ build }: { build: Build }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {[
        ['Original weakness', build.originalWeakness],
        ['Axiom changed', build.axiomChanged],
        ['Why it works', build.whyItWorks],
      ].map(([label, value]) => (
        <div key={label} className="rounded-[18px] border border-[color:var(--hairline)] bg-[rgba(7,10,16,0.28)] p-4">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
          <dd className="mt-2 text-[0.92rem] leading-[1.6] text-[var(--text-secondary)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PreviewFrame({ build, active }: { build: Build; active: boolean }) {
  if (!active) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[#02050b] shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[rgba(5,8,14,0.9)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        </div>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">Interactive preview</span>
      </div>

      <div className="relative h-[280px] overflow-hidden bg-[#05070d] sm:h-[340px]">
        <iframe
          title={`${build.title} live demo`}
          src={build.href}
          loading="eager"
          className="absolute left-0 top-0 h-[128%] w-[128%] origin-top-left scale-[0.78] border-0 bg-white"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}

function DemoPanel({
  build,
  index,
  active,
  onActivate,
}: {
  build: Build;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <m.article
      layout
      className={cn(
        'group relative overflow-hidden rounded-[26px] border border-[color:var(--hairline)] bg-[rgba(255,255,255,0.02)] shadow-[var(--shadow-card)]',
        active ? 'min-h-[38rem]' : 'min-h-[7.25rem]'
      )}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      data-reveal
      data-motion="depthCardReveal"
      suppressHydrationWarning
    >
      <div className="absolute inset-0">
        <picture className="block h-full w-full">
          <source type="image/avif" srcSet={build.image.avifSrcSet} />
          <source type="image/webp" srcSet={build.image.webpSrcSet} />
          <img
            src={build.image.fallbackSrc}
            alt={build.alt}
            className={cn(
              'block h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-premium)]',
              active ? 'scale-[1.03]' : 'scale-100'
            )}
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            width={1200}
            height={900}
            style={{ objectPosition: build.position }}
          />
        </picture>
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            active
              ? 'bg-[linear-gradient(90deg,rgba(4,8,14,0.88)_0%,rgba(4,8,14,0.76)_34%,rgba(4,8,14,0.18)_66%,rgba(4,8,14,0.08)_100%)]'
              : 'bg-[linear-gradient(90deg,rgba(4,8,14,0.78)_0%,rgba(4,8,14,0.5)_44%,rgba(4,8,14,0.2)_100%)]'
          )}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_20%,rgba(0,0,0,0.36)_100%)]" />
      </div>

      {!active ? (
        <button
          type="button"
          onClick={onActivate}
          aria-label={`Open ${build.title} preview`}
          className="absolute inset-0 z-30 cursor-pointer"
        />
      ) : null}

      <div
        className={cn(
          'relative z-20 flex h-full min-h-[inherit] flex-col justify-between gap-6 p-5 sm:p-6 lg:p-7',
          active && 'lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(20rem,0.96fr)] lg:items-end lg:gap-8'
        )}
      >
        <div className="max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.68)]">
                {build.eyebrow}
              </p>
              <h3
                className={cn(
                  'mt-3 max-w-xl font-medium tracking-[-0.01em] text-white',
                  active ? 'text-[clamp(1.65rem,2.9vw,2.7rem)] leading-[1.05]' : 'text-[clamp(1.15rem,1.45vw,1.5rem)] leading-[1.15]'
                )}
              >
                {build.title}
              </h3>
            </div>
            <span className="shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.56)]">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <m.div
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              height: active ? 'auto' : 0,
              marginTop: active ? 28 : 0,
            }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-xl text-[0.98rem] leading-[1.7] text-[rgba(255,255,255,0.78)]">
              Structured as a live demonstration environment: premium positioning, clear navigation paths, and a conversion flow that holds together under real use.
            </p>

            <div className="mt-6">
              <CaseNotes build={build} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={build.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.16)] bg-white px-5 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#04070d] transition-transform duration-[var(--duration-fast)] hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
              >
                Open live demo
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]">
                Hover or tap another title to switch the active environment
              </span>
            </div>
          </m.div>
        </div>

        <m.div
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 22,
          }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className={cn('pointer-events-none lg:self-stretch', active && 'pointer-events-auto')}
        >
          <PreviewFrame build={build} active={active} />
        </m.div>
      </div>
    </m.article>
  );
}

export function WorkShowcase({ builds, filters }: WorkShowcaseProps) {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const visibleBuilds = React.useMemo(
    () => (activeFilter === 'all' ? builds : builds.filter((build) => build.category === activeFilter)),
    [activeFilter, builds]
  );
  const [activeBuildHref, setActiveBuildHref] = React.useState(builds[0]?.href ?? '');

  React.useEffect(() => {
    if (!visibleBuilds.length) {
      setActiveBuildHref('');
      return;
    }

    const stillVisible = visibleBuilds.some((build) => build.href === activeBuildHref);
    if (!stillVisible) {
      setActiveBuildHref(visibleBuilds[0].href);
    }
  }, [activeBuildHref, visibleBuilds]);

  return (
    <div className="space-y-7 md:space-y-9">
      <div
        className="work-filter-scroll relative -mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0"
        data-reveal
        suppressHydrationWarning
      >
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

      <div className="space-y-3">
        {visibleBuilds.map((build, index) => (
          <DemoPanel
            key={build.href}
            build={build}
            index={index}
            active={build.href === activeBuildHref}
            onActivate={() => setActiveBuildHref(build.href)}
          />
        ))}
      </div>
    </div>
  );
}
