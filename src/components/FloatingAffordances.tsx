import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

type ScrollMetrics = {
  progress: number;
  scrollY: number;
  viewportHeight: number;
};

const CTA_SCROLL_THRESHOLD = 0.22;
const BACK_TO_TOP_SCROLL_THRESHOLD = 1;

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

  const showCta = metrics.progress >= CTA_SCROLL_THRESHOLD && !pathname.startsWith('/apply');
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

  if (!showCta && !showBackToTop) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed bottom-5 right-5 z-[55] hidden transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:block ${
          showCta ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <Link
          to="/apply#project-application-form"
          className="motion-floating group inline-flex items-center gap-3 rounded-full border border-white/12 bg-[rgba(10,14,22,0.88)] px-4 py-3 text-left shadow-[0_14px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:-translate-y-px hover:border-[#d4a48e]/35 hover:shadow-[0_18px_36px_rgba(0,0,0,0.28),0_0_0_1px_rgba(212,164,142,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#e8bea8] transition-[transform,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px group-hover:border-[#d4a48e]/30 group-hover:text-[#f0cfbf]">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="pr-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F2F4F7]">
              Book Free Consultation
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-slate-400">
              30-minute Zoom call
            </span>
          </span>
        </Link>
      </div>

      <div
        className={`fixed inset-x-4 bottom-4 z-[55] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          showCta ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <Link
          to="/apply#project-application-form"
          className="motion-floating flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-[rgba(10,14,22,0.9)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F2F4F7] shadow-[0_14px_30px_rgba(0,0,0,0.26)] backdrop-blur-xl hover:-translate-y-px hover:border-[#d4a48e]/35 hover:shadow-[0_18px_36px_rgba(0,0,0,0.3),0_0_0_1px_rgba(212,164,142,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          Book Free Consultation
        </Link>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`motion-floating fixed bottom-5 left-5 z-[55] inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-[rgba(10,14,22,0.88)] text-[#F2F4F7] shadow-[0_14px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:-translate-y-px hover:border-[#d4a48e]/35 hover:shadow-[0_18px_36px_rgba(0,0,0,0.28),0_0_0_1px_rgba(212,164,142,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 ${
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
        <ArrowUp className="relative h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
};

export default FloatingAffordances;
