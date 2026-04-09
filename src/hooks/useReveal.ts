import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { shouldDisableHeavyMotion } from '../lib/motionPreferences';

type RevealResult<T extends HTMLElement> = {
  isVisible: boolean;
  ref: RefObject<T>;
};

const useReveal = <T extends HTMLElement>(): RevealResult<T> => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() => shouldDisableHeavyMotion());

  useEffect(() => {
    if (shouldDisableHeavyMotion()) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
};

export default useReveal;
