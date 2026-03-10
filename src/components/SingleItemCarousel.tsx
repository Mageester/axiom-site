import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SingleItemCarouselProps<T> = {
  items: readonly T[];
  getItemKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  ariaLabel: string;
  intervalMs?: number;
  className?: string;
  viewportClassName?: string;
  slideClassName?: string;
};

function SingleItemCarousel<T>({
  items,
  getItemKey,
  renderItem,
  ariaLabel,
  intervalMs = 5000,
  className,
  viewportClassName,
  slideClassName,
}: SingleItemCarouselProps<T>) {
  const canLoop = items.length > 1;
  const trackItems = useMemo(() => {
    if (!canLoop) return [...items];
    return [items[items.length - 1], ...items, items[0]];
  }, [canLoop, items]);

  const [trackIndex, setTrackIndex] = useState<number>(canLoop ? 1 : 0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoplayResetSeed, setAutoplayResetSeed] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setTrackIndex(canLoop ? 1 : 0);
    setIsTransitionEnabled(true);
    setIsAnimating(false);
  }, [canLoop, items.length]);

  const step = useCallback(
    (direction: 1 | -1, manual: boolean) => {
      if (!canLoop || isAnimating) return;
      setIsAnimating(true);
      setTrackIndex((prev) => prev + direction);
      if (manual) setAutoplayResetSeed((seed) => seed + 1);
    },
    [canLoop, isAnimating]
  );

  const goNext = useCallback((manual = false) => step(1, manual), [step]);
  const goPrev = useCallback((manual = false) => step(-1, manual), [step]);

  const handleTransitionEnd = useCallback(() => {
    if (!canLoop) {
      setIsAnimating(false);
      return;
    }

    if (trackIndex === 0) {
      setIsTransitionEnabled(false);
      setTrackIndex(items.length);
    } else if (trackIndex === items.length + 1) {
      setIsTransitionEnabled(false);
      setTrackIndex(1);
    }

    setIsAnimating(false);
  }, [canLoop, items.length, trackIndex]);

  useEffect(() => {
    if (isTransitionEnabled) return;
    const raf = window.requestAnimationFrame(() => setIsTransitionEnabled(true));
    return () => window.cancelAnimationFrame(raf);
  }, [isTransitionEnabled]);

  useEffect(() => {
    if (!canLoop || isPaused) return;
    const timer = window.setInterval(() => {
      goNext(false);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplayResetSeed, canLoop, goNext, intervalMs, isPaused]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!canLoop) return;
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!canLoop || touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 48) return;
    if (delta > 0) {
      goPrev(true);
    } else {
      goNext(true);
    }
  };

  const resolveSlideKey = (item: T, index: number) => {
    if (!canLoop) return getItemKey(item, index);
    if (index === 0) return `clone-start-${getItemKey(item, items.length - 1)}`;
    if (index === trackItems.length - 1) return `clone-end-${getItemKey(item, 0)}`;
    return getItemKey(item, index - 1);
  };

  const resolveItemIndex = (index: number) => {
    if (!canLoop) return index;
    if (index === 0) return items.length - 1;
    if (index === trackItems.length - 1) return 0;
    return index - 1;
  };

  return (
    <section
      aria-label={ariaLabel}
      className={`relative ${className ?? ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      {canLoop ? (
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goPrev(true)}
          className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0d1323]/85 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#1a253d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 md:left-3"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="m14.5 5.5-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      <div className={`hide-scrollbar overflow-hidden ${viewportClassName ?? ''}`}>
        <div
          className={`flex touch-pan-y ${
            isTransitionEnabled
              ? 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
              : ''
          }`}
          style={{ transform: `translate3d(-${trackIndex * 100}%, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {trackItems.map((item, index) => (
            <div key={resolveSlideKey(item, index)} className={`w-full shrink-0 ${slideClassName ?? ''}`}>
              {renderItem(item, resolveItemIndex(index))}
            </div>
          ))}
        </div>
      </div>

      {canLoop ? (
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goNext(true)}
          className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0d1323]/85 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#1a253d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 md:right-3"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="m9.5 5.5 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
    </section>
  );
}

export default SingleItemCarousel;
