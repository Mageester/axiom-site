import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

type ScrollMetrics = {
  progress: number;
  scrollY: number;
  viewportHeight: number;
};

const BACK_TO_TOP_SCROLL_THRESHOLD = 1.3;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
}

function getScrollMetrics(): ScrollMetrics {
  if (typeof window === 'undefined') {
    return { progress: 0, scrollY: 0, viewportHeight: 0 };
  }

  const root = document.documentElement;
  const scrollY = window.scrollY || root.scrollTop || 0;
  const viewportHeight = window.innerHeight || root.clientHeight || 0;
  const maxScroll = Math.max(root.scrollHeight - viewportHeight, 1);

  return {
    progress: Math.min(scrollY / maxScroll, 1),
    scrollY,
    viewportHeight,
  };
}

const FloatingAffordances: React.FC = () => {
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [metrics, setMetrics] = useState<ScrollMetrics>(() => getScrollMetrics());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId = 0;

    const updateMetrics = () => {
      rafId = 0;
      setMetrics(getScrollMetrics());
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateMetrics);
    };

    updateMetrics();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  const showBackToTop = metrics.scrollY >= BACK_TO_TOP_SCROLL_THRESHOLD * metrics.viewportHeight;

  const ring = useMemo(() => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - metrics.progress);

    return { radius, circumference, strokeDashoffset };
  }, [metrics.progress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!showBackToTop) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`motion-floating fixed bottom-4 left-4 z-[55] hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,14,22,0.78)] text-[#F2F4F7] shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-md hover:-translate-y-px hover:border-[#d4a48e]/30 hover:shadow-[0_14px_24px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 md:inline-flex ${
        showBackToTop ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={ring.radius} className="fill-none stroke-white/10" strokeWidth="2" />
        <circle
          cx="22"
          cy="22"
          r={ring.radius}
          className="fill-none stroke-[#d4a48e]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={ring.circumference}
          strokeDashoffset={ring.strokeDashoffset}
        />
      </svg>
      <ArrowUp className="relative h-4.5 w-4.5" aria-hidden="true" />
    </button>
  );
};

export default FloatingAffordances;
