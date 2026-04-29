import { type RefObject, useEffect, useRef, useState } from 'react';

type AnimatedRevealResult = {
  shouldAnimate: boolean;
  ref: RefObject<HTMLElement>;
};

const useAnimatedReveal = <T extends HTMLElement = HTMLElement>(): AnimatedRevealResult => {
  const ref = useRef<T | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!node || reducedMotion || typeof IntersectionObserver === 'undefined') {
      setShouldAnimate(true);
      return undefined;
    }

    let frame = 0;
    let done = false;

    const reveal = () => {
      done = true;
      setShouldAnimate(true);
    };

    const revealIfInViewport = () => {
      if (done) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.04) {
        reveal();
      }
    };

    const scheduleViewportCheck = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        revealIfInViewport();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || done) return;
        reveal();
        observer.disconnect();
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    observer.observe(node);
    scheduleViewportCheck();
    window.addEventListener('scroll', scheduleViewportCheck, { passive: true });
    window.addEventListener('resize', scheduleViewportCheck);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleViewportCheck);
      window.removeEventListener('resize', scheduleViewportCheck);
    };
  }, []);

  return { shouldAnimate, ref: ref as RefObject<HTMLElement> };
};

export default useAnimatedReveal;
