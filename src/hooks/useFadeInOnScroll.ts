import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type FadeInResult<T extends HTMLElement> = {
  isVisible: boolean;
  ref: RefObject<T>;
};

export function useFadeInOnScroll<T extends HTMLElement>(): FadeInResult<T> {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

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

