import { PropsWithChildren, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const LENIS_LERP = 0.08;

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) return;

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      duration: 1.2,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
