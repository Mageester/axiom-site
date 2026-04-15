import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, Phone } from 'lucide-react';
import { CTA } from '../lib/cta';
import { SITE_TELEPHONE } from '../lib/seo';

type ScrollMetrics = {
  progress: number;
  scrollY: number;
  viewportHeight: number;
};

type FloatingAffordancesProps = {
  mobileMenuOpen?: boolean;
};

const BACK_TO_TOP_SCROLL_THRESHOLD = 1.3;
const MOBILE_BAR_SCROLL_THRESHOLD = 0.38;
const MOBILE_BAR_SESSION_KEY = 'axiom-mobile-bar-unlocked';
const MOBILE_VIEWPORT_QUERY = '(max-width: 767px)';
const WORK_PREVIEW_SELECTOR = '[data-work-preview-grid]';

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

const FloatingAffordances: React.FC<FloatingAffordancesProps> = ({ mobileMenuOpen = false }) => {
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [metrics, setMetrics] = useState<ScrollMetrics>(() => getScrollMetrics());
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(MOBILE_VIEWPORT_QUERY);
    const updateViewport = () => setIsMobileViewport(media.matches);

    updateViewport();
    media.addEventListener('change', updateViewport);

    return () => media.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isMobileViewport) {
      setShowMobileBar(false);
      return;
    }

    try {
      if (window.sessionStorage.getItem(MOBILE_BAR_SESSION_KEY) === '1') {
        setShowMobileBar(true);
        return;
      }
    } catch {
      // Ignore storage failures and fall back to in-memory gating.
    }

    let rafId = 0;
    let observer: IntersectionObserver | null = null;

    const unlockMobileBar = () => {
      setShowMobileBar((previous) => {
        if (previous) return previous;

        try {
          window.sessionStorage.setItem(MOBILE_BAR_SESSION_KEY, '1');
        } catch {
          // Ignore storage failures.
        }

        return true;
      });
    };

    const updateMetrics = () => {
      rafId = 0;
      const nextMetrics = getScrollMetrics();
      setMetrics(nextMetrics);

      if (nextMetrics.progress >= MOBILE_BAR_SCROLL_THRESHOLD) {
        unlockMobileBar();
      }
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateMetrics);
    };

    const workPreviewGrid = document.querySelector<HTMLElement>(WORK_PREVIEW_SELECTOR);
    if (workPreviewGrid && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            unlockMobileBar();
          }
        },
        {
          root: null,
          threshold: 0.01,
          rootMargin: '0px 0px -35% 0px',
        },
      );
      observer.observe(workPreviewGrid);
    }

    updateMetrics();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobileViewport, pathname]);

  const showBackToTop = !mobileMenuOpen && metrics.scrollY >= BACK_TO_TOP_SCROLL_THRESHOLD * metrics.viewportHeight;

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

  const showMobileCta = isMobileViewport && !mobileMenuOpen && showMobileBar;

  return (
    <>
      {isMobileViewport ? (
        <div
          className={`fixed inset-x-0 bottom-0 z-[56] transition-[opacity,transform] duration-300 ease-[var(--motion-ease-standard)] motion-reduce:transition-none ${
            showMobileCta ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
          }`}
          aria-hidden={!showMobileCta}
        >
          <div className="border-t border-white/[0.08] bg-[linear-gradient(180deg,rgba(10,12,16,0.86)_0%,rgba(8,10,14,0.95)_100%)] shadow-[0_-10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl backdrop-saturate-150">
            <div className="axiom-container flex items-center gap-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
              <Link to={CTA.primary.to} className="btn-primary btn-md flex-1 justify-center">
                {CTA.primary.label}
              </Link>
              <a
                href={`tel:${SITE_TELEPHONE}`}
                aria-label="Call Axiom"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-component)] border border-white/12 bg-white/[0.03] text-[#F2F4F7] shadow-[0_6px_18px_rgba(0,0,0,0.16)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[var(--motion-ease-standard)] hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`motion-floating fixed bottom-4 left-4 z-[55] hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,14,22,0.78)] text-[#F2F4F7] shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-md hover:-translate-y-px hover:border-[#d4a48e]/30 hover:shadow-[0_14px_24px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 md:inline-flex`}
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
          <ArrowUp className="relative h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </>
  );
};

export default FloatingAffordances;
