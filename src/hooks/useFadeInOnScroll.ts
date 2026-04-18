import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type FadeInResult<T extends HTMLElement> = {
  isVisible: boolean;
  ref: RefObject<T>;
};

export function useFadeInOnScroll<T extends HTMLElement>(): FadeInResult<T> {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibleRatio = rect.height > 0 ? Math.max(0, visibleHeight / rect.height) : 0;

    setIsVisible(visibleRatio >= 0.15);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
