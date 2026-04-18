import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { shouldDisableRevealMotion } from '../lib/motionPreferences';

type RevealResult<T extends HTMLElement> = {
  isVisible: boolean;
  ref: RefObject<T>;
};

const useReveal = <T extends HTMLElement>(): RevealResult<T> => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (shouldDisableRevealMotion()) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const isNearViewport = element.getBoundingClientRect().top <= window.innerHeight * 0.94;
    if (isNearViewport) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

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
};

export default useReveal;
