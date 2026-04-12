import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FloatingAffordances from './FloatingAffordances';
import ResponsiveImage from './ResponsiveImage';
import { responsiveImages } from '../lib/responsiveImages';
import { CTA } from '../lib/cta';
import { shouldDisableHeavyMotion } from '../lib/motionPreferences';

type LayoutProps = {
  children: React.ReactNode;
  disableAmbientMotion?: boolean;
  hidePrimaryCta?: boolean;
};

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/works' },
  { label: 'Manifesto', to: '/manifesto' },
  { label: 'Process', to: '/method' },
  { label: 'About', to: '/about' },
];

const isActiveRoute = (pathname: string, to: string) => {
  if (to === '/') {
    return pathname === '/';
  }

  return pathname === to || pathname.startsWith(`${to}/`);
};

const Layout: React.FC<LayoutProps> = ({
  children,
  disableAmbientMotion = false,
  hidePrimaryCta = false,
}) => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const disableHeavyMotion = shouldDisableHeavyMotion();
  const disableAmbientVisuals = disableHeavyMotion || disableAmbientMotion;

  useEffect(() => {
    let rafId = 0;

    const updateScrolledState = () => {
      rafId = 0;
      const nextIsScrolled = window.scrollY > 12;
      setIsScrolled((previous) => (previous === nextIsScrolled ? previous : nextIsScrolled));
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (disableAmbientVisuals) {
      const root = layoutRef.current;
      if (!root) return;

      const targets = Array.from(root.querySelectorAll<HTMLElement>('main > section, main > article'))
        .filter(
          (element, index) =>
            index > 0 &&
            !element.hasAttribute('data-hero-root') &&
            element.dataset.reveal !== 'off' &&
            element.dataset.motionManaged !== 'true'
        );

      targets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const root = layoutRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('main > section, main > article'))
      .filter(
        (element, index) =>
          index > 0 &&
          !element.hasAttribute('data-hero-root') &&
          element.dataset.reveal !== 'off' &&
          element.dataset.motionManaged !== 'true'
      );

    if (targets.length === 0) return;

    targets.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-order', String(index % 3));
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((element) => element.classList.add('is-visible'));
      return () => undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [disableAmbientVisuals, location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    if (isMobileMenuOpen) {
      body.style.overflow = 'hidden';
      return () => {
        body.style.overflow = previousOverflow;
      };
    }

    body.style.overflow = previousOverflow;
    return;
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      lastFocusedRef.current?.focus();
      return;
    }

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTarget = mobileMenuRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])') || mobileMenuRef.current;
    window.requestAnimationFrame(() => focusTarget?.focus());
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const container = mobileMenuRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('aria-hidden'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const navLinkClass = (pathname: string, to: string) => {
    const active = isActiveRoute(pathname, to);

    return [
      'inline-flex items-center py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45',
      active ? 'text-[#F2F4F7]' : 'text-white/64 hover:text-[#EAEFF5]'
    ].join(' ');
  };

  const mobileNavLinkClass = (pathname: string, to: string) => {
    const active = isActiveRoute(pathname, to);

    return [
      'min-h-11 rounded-xl px-3 py-3 text-base font-medium transition-[color,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45',
      active ? 'bg-white/[0.06] text-[#F2F4F7]' : 'text-slate-300 hover:bg-white/[0.04] hover:text-[#F2F4F7]'
    ].join(' ');
  };

  const handleSkipToMain = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('main-content');
    if (!target) return;

    event.preventDefault();
    target.focus();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div ref={layoutRef} className="relative min-h-screen overflow-x-hidden bg-[var(--axiom-base)] text-[#ECEFF3]">
      <a href="#main-content" onClick={handleSkipToMain} className="skip-link">
        Skip to main content
      </a>

      {!disableAmbientVisuals && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <div data-startup-bg className="fixed left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full bg-[#697481] opacity-[0.13] blur-[120px]" />
          <div data-startup-bg className="fixed bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-[#B06E52] opacity-[0.09] blur-[120px]" />
          <div data-startup-bg className="engineering-grid animate-grid-drift" />
          <div data-startup-bg className="global-noise-floor" />
        </div>
      )}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-2.5 md:px-6 md:pt-3">
        <div className="mx-auto max-w-[92rem]">
          <div
            className={`pointer-events-auto relative flex h-[3.2rem] items-center rounded-[1rem] px-4 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[3.5rem] md:px-5 ${
              isScrolled
                ? 'border border-white/[0.03] bg-[linear-gradient(180deg,rgba(10,12,16,0.11)_0%,rgba(10,12,16,0.05)_100%)] shadow-[0_1px_0_rgba(255,255,255,0.02),0_10px_22px_rgba(0,0,0,0.035)] backdrop-blur-xl backdrop-saturate-150 md:backdrop-blur-2xl'
                : 'border border-transparent bg-transparent shadow-none backdrop-blur-0'
            }`}
          >
            <div className="flex basis-[44%] flex-1 items-center justify-start">
              <Link
                to="/"
                aria-label="Axiom home"
                className="inline-flex h-full origin-left items-center leading-none transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
              >
                <ResponsiveImage
                  source={responsiveImages.logoClear}
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 256px"
                  alt="Axiom logo"
                  width={515}
                  height={163}
                  loading="eager"
                  fetchPriority="high"
                  className="block h-12 w-auto max-w-none object-contain object-left transition-opacity duration-200 hover:opacity-95 md:h-14 lg:h-[3.75rem]"
                  decoding="async"
                />
              </Link>
            </div>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-6 md:flex"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActiveRoute(location.pathname, item.to) ? 'page' : undefined}
                className={navLinkClass(location.pathname, item.to)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 basis-[44%] items-center justify-end md:flex">
            {!hidePrimaryCta && (
              <Link
                to={CTA.primary.to}
                className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#F2F4F7] transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/24 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
              >
                {CTA.primary.label}
              </Link>
            )}
          </div>

          <div className="flex flex-1 basis-[44%] items-center justify-end md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-[#F2F4F7] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/35 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 ${
                isMobileMenuOpen ? 'border-white/25 bg-white/[0.08]' : 'border-white/15 bg-white/[0.03]'
              }`}
              aria-label={isMobileMenuOpen ? 'Close primary navigation' : 'Open primary navigation'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close primary navigation' : 'Open primary navigation'}</span>
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <div
        id="mobile-site-menu"
        ref={mobileMenuRef}
        role={isMobileMenuOpen ? 'dialog' : undefined}
        aria-modal={isMobileMenuOpen ? 'true' : undefined}
        aria-hidden={!isMobileMenuOpen}
        aria-labelledby="mobile-menu-title"
        className={`fixed inset-x-4 top-[4.9rem] z-50 rounded-2xl border border-white/15 bg-[rgba(12,14,18,0.94)] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-5 flex items-center">
          <p id="mobile-menu-title" className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">
            Primary navigation
          </p>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={isActiveRoute(location.pathname, item.to) ? 'page' : undefined}
              className={mobileNavLinkClass(location.pathname, item.to)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!hidePrimaryCta && (
          <Link
            to={CTA.primary.to}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#F2F4F7] transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/24 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
          >
            {CTA.primary.label}
          </Link>
        )}
      </div>

      <div className={`relative z-10 pt-20 md:pt-28 ${disableAmbientVisuals ? '' : 'noise-overlay'}`}>{children}</div>

      {!disableAmbientVisuals && <FloatingAffordances />}
    </div>
  );
};

export default Layout;
