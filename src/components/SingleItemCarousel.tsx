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
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const slideRatio = useMemo(() => {
    if (viewportWidth >= 1280) return 0.66;
    if (viewportWidth >= 1024) return 0.7;
    if (viewportWidth >= 768) return 0.78;
    return 0.84;
  }, [viewportWidth]);

  const slideGap = viewportWidth >= 1024 ? 18 : 12;
  const slideWidth = Math.max((viewportWidth || 0) * slideRatio, 300);
  const stepWidth = slideWidth + slideGap;
  const centerOffset = Math.max((viewportWidth - slideWidth) / 2, 0);
  const translateX = centerOffset - trackIndex * stepWidth;

  useEffect(() => {
    setTrackIndex(canLoop ? 1 : 0);
    setIsTransitionEnabled(true);
    setIsAnimating(false);
  }, [canLoop, items.length]);

  useEffect(() => {
    if (!viewportRef.current) return;

    const node = viewportRef.current;
    const updateWidth = () => setViewportWidth(node.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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

  const handleTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;

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
      <div ref={viewportRef} className={`hide-scrollbar overflow-hidden px-1 md:px-2 ${viewportClassName ?? ''}`}>
        <div
          className={`flex touch-pan-y will-change-transform [transform:translateZ(0)] ${
            isTransitionEnabled
              ? 'transition-transform duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'
              : ''
          }`}
          style={{
            columnGap: `${slideGap}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
          }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {trackItems.map((item, index) => (
            <div
              key={resolveSlideKey(item, index)}
              className={`shrink-0 ${slideClassName ?? ''}`}
              style={{ width: `${slideWidth}px` }}
            >
              {(() => {
                const isActive = index === trackIndex;
                return (
              <div
                onClickCapture={(event) => {
                  if (isActive || !canLoop || isAnimating) return;
                  event.preventDefault();
                  event.stopPropagation();
                  if (index < trackIndex) {
                    goPrev(true);
                  } else {
                    goNext(true);
                  }
                }}
                className={`h-full transition-[transform,opacity] duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isActive
                    ? 'scale-100 opacity-100'
                    : 'cursor-pointer scale-[0.985] opacity-84 hover:scale-[0.992] hover:opacity-96'
                }`}
              >
                {renderItem(item, resolveItemIndex(index))}
              </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SingleItemCarousel;
