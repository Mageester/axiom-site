import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ResponsiveSource } from '../../lib/responsiveImages';
import { AxiomButton } from '../ui/AxiomButton';
import { MetalButton } from '../ui/MetalButton';

export type CoverflowProject = {
  id: string;
  title: string;
  niche: string;
  outcome: string;
  meta?: string[];
  image: ResponsiveSource;
  alt: string;
  position?: string;
  href: string;
  ctaLabel?: string;
};

export interface WorkCoverflowProps {
  projects: CoverflowProject[];
  ctaHref?: string;
}

const LIME = '#c8ff00';

function useViewportTier() {
  const [tier, setTier] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqMobile = window.matchMedia('(max-width: 640px)');
    const mqTablet = window.matchMedia('(max-width: 1024px)');
    const update = () => {
      if (mqMobile.matches) setTier('mobile');
      else if (mqTablet.matches) setTier('tablet');
      else setTier('desktop');
    };
    update();
    mqMobile.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    return () => {
      mqMobile.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
    };
  }, []);

  return tier;
}

type SlideStyle = {
  translateX: number;
  translateZ: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  filter: string;
};

function computeSlideStyle(
  offset: number,
  tier: 'mobile' | 'tablet' | 'desktop',
  reduceMotion: boolean,
  cardWidth: number,
): SlideStyle {
  const abs = Math.abs(offset);

  if (reduceMotion) {
    return {
      translateX: offset * cardWidth * 1.05,
      translateZ: 0,
      rotateY: 0,
      scale: abs === 0 ? 1 : 0.92,
      opacity: abs > 1 ? 0 : 1,
      zIndex: 100 - abs,
      filter: 'none',
    };
  }

  const config = {
    mobile: { spacing: 0.62, rotate: 18, depth: 80, scaleStep: 0.1, opacityStep: 0.45, maxVisible: 1 },
    tablet: { spacing: 0.5, rotate: 30, depth: 160, scaleStep: 0.1, opacityStep: 0.32, maxVisible: 2 },
    desktop: { spacing: 0.42, rotate: 38, depth: 240, scaleStep: 0.11, opacityStep: 0.26, maxVisible: 3 },
  }[tier];

  const clampedAbs = Math.min(abs, config.maxVisible + 1);
  const sign = Math.sign(offset);

  return {
    translateX: sign * clampedAbs * cardWidth * config.spacing,
    translateZ: -Math.min(abs, config.maxVisible) * config.depth * 0.6,
    rotateY: -sign * Math.min(abs, config.maxVisible) * config.rotate,
    scale: Math.max(0.62, 1 - Math.min(abs, config.maxVisible) * config.scaleStep),
    opacity: abs > config.maxVisible ? 0 : 1 - Math.min(abs, config.maxVisible) * config.opacityStep,
    zIndex: 100 - abs,
    filter: abs === 0 ? 'saturate(1.05)' : `brightness(${Math.max(0.55, 1 - abs * 0.18)})`,
  };
}

export function WorkCoverflow({ projects, ctaHref = '/contact' }: WorkCoverflowProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const tier = useViewportTier();
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const goTo = React.useCallback(
    (idx: number) => {
      const len = projects.length;
      if (!len) return;
      const next = ((idx % len) + len) % len;
      setActiveIndex(next);
    },
    [projects.length],
  );

  const next = React.useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = React.useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const active = projects[activeIndex];

  const stageHeight = tier === 'mobile' ? 380 : tier === 'tablet' ? 460 : 560;
  const cardWidth = tier === 'mobile' ? 260 : tier === 'tablet' ? 360 : 440;
  const cardHeight = Math.round(cardWidth * 1.25);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected Axiom projects"
        tabIndex={0}
        className="group/coverflow relative outline-none"
        style={{ perspective: reduceMotion ? undefined : '1600px' }}
      >
        <div
          className="relative mx-auto w-full select-none overflow-hidden"
          style={{ height: stageHeight }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: reduceMotion ? undefined : 'preserve-3d' }}
            drag={reduceMotion ? false : 'x'}
            dragElastic={0.18}
            dragMomentum={false}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              const threshold = 60;
              if (info.offset.x < -threshold || info.velocity.x < -300) next();
              else if (info.offset.x > threshold || info.velocity.x > 300) prev();
            }}
          >
            {projects.map((project, idx) => {
              const offset = idx - activeIndex;
              const style = computeSlideStyle(offset, tier, reduceMotion, cardWidth);
              const isActive = offset === 0;

              return (
                <motion.div
                  key={project.id}
                  className="absolute"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex: style.zIndex,
                    left: '50%',
                    top: '50%',
                    marginLeft: -cardWidth / 2,
                    marginTop: -cardHeight / 2,
                  }}
                  animate={{
                    x: style.translateX,
                    rotateY: style.rotateY,
                    scale: style.scale,
                    opacity: style.opacity,
                    filter: style.filter,
                    translateZ: style.translateZ,
                  }}
                  initial={false}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }
                  }
                  aria-hidden={!isActive}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!isActive) goTo(idx);
                    }}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={isActive ? `${project.title}, currently selected` : `Show ${project.title}`}
                    className={cn(
                      'group relative block h-full w-full origin-center overflow-hidden bg-[#06080d] text-left',
                      'border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
                      'transition-[border-color] duration-300',
                      isActive && 'border-white/25',
                    )}
                    style={{ borderRadius: 6 }}
                  >
                    <picture className="block h-full w-full">
                      <source type="image/avif" srcSet={project.image.avifSrcSet} />
                      <source type="image/webp" srcSet={project.image.webpSrcSet} />
                      <img
                        src={project.image.fallbackSrc}
                        alt={project.alt}
                        loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                        className="block h-full w-full object-cover"
                        style={{ objectPosition: project.position ?? 'center' }}
                        width={1200}
                        height={1500}
                      />
                    </picture>

                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0)_38%,rgba(4,6,10,0.55)_72%,rgba(4,6,10,0.92)_100%)]" />

                    {isActive ? (
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.18em]"
                          style={{ color: LIME }}
                        >
                          {project.niche}
                        </span>
                        <h3 className="text-[clamp(1.15rem,1.6vw,1.5rem)] font-medium leading-[1.1] text-white">
                          {project.title}
                        </h3>
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                          {project.niche}
                        </span>
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#04060a] to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#04060a] to-transparent md:block" />

        <div className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 md:block">
          <AxiomButton variant="icon" onClick={prev} ariaLabel="Previous project">
            <ArrowLeftIcon className="h-4 w-4" />
          </AxiomButton>
        </div>
        <div className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 md:block">
          <AxiomButton variant="icon" onClick={next} ariaLabel="Next project">
            <ArrowRightIcon className="h-4 w-4" />
          </AxiomButton>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div
          className="flex items-center gap-[6px]"
          role="tablist"
          aria-label="Project selector"
        >
          {projects.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${p.title}`}
                onClick={() => goTo(idx)}
                className="group/seg flex h-5 items-center"
              >
                <span
                  className="block transition-[width,background-color] duration-300 ease-out"
                  style={{
                    width: isActive ? 24 : 14,
                    height: 1,
                    backgroundColor: isActive ? LIME : 'rgba(255,255,255,0.18)',
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="px-1.5 text-white/20">/</span>
          {String(projects.length).padStart(2, '0')}
        </div>
      </div>

      {active ? (
        <div className="mx-auto mt-6 max-w-3xl text-center md:mt-8">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span style={{ color: LIME }}>{active.niche}</span>
              {active.meta?.map((m) => (
                <React.Fragment key={m}>
                  <span aria-hidden className="text-white/20">/</span>
                  <span className="text-white/55">{m}</span>
                </React.Fragment>
              ))}
            </div>
            <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-[1.08] tracking-[-0.01em] text-white">
              {active.title}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-[0.96rem] leading-[1.65] text-white/60">
              {active.outcome}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative inline-flex min-h-11 items-center gap-2 px-1 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
              >
                {active.ctaLabel ?? 'Open demo'}
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden />
                <span
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{ backgroundColor: LIME }}
                  aria-hidden
                />
              </a>
              <MetalButton as="a" href={ctaHref}>
                <span>Start a project</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden style={{ color: LIME }} />
              </MetalButton>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

export default WorkCoverflow;
