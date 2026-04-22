import { useCallback, useEffect, useRef, useState } from 'react';

type CountUpResult<T extends HTMLElement> = {
  ref: (node: T | null) => void;
  value: number;
  isDone: boolean;
};

export function useCountUp<T extends HTMLElement>(target: number, duration: number): CountUpResult<T> {
  const elementRef = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const ref = useCallback((node: T | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined' || duration <= 0) {
      setValue(target);
      setIsDone(true);
      return;
    }

    let rafId = 0;
    let startTime: number | null = null;
    let started = false;

    const animate = (now: number) => {
      if (startTime === null) startTime = now;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextValue = Math.round(target * progress);

      setValue(nextValue);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        setValue(target);
        setIsDone(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started) return;

        started = true;
        observer.disconnect();
        rafId = window.requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [duration, target]);

  return { ref, value, isDone };
}
