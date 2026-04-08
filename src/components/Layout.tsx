import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FloatingAffordances from './FloatingAffordances';
import Preloader from './Preloader';
import ResponsiveImage from './ResponsiveImage';
import { responsiveImages } from '../lib/responsiveImages';

type LayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/works' },
  { label: 'Process', to: '/method' },
];

const isActiveRoute = (pathname: string, to: string) => {
  if (to === '/') {
    return pathname === '/';
  }

  return pathname === to || pathname.startsWith(`${to}/`);
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const logoTargetRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let rafId = 0;

    const updateScrolledState = () => {
      rafId = 0;
      const nextIsScrolled = window.scrollY > 8;
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
  }, [location.pathname]);

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

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const nav = navRef.current;
      const logo = logoTargetRef.current;
      const navLinks = gsap.utils.toArray<HTMLElement>('[data-startup-link]');
      const heroContent = gsap.utils
        .toArray<HTMLElement>(
          '[data-startup-heading], [data-startup-copy], [data-startup-actions], [data-startup-meta]'
        )
        .filter((element) => !element.closest('[aria-hidden="true"]'));
      const backgrounds = gsap.utils.toArray<HTMLElement>('[data-startup-bg]');

      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (nav) {
        gsap.set(nav, { autoAlpha: 0, y: -10 });
        timeline.to(nav, { autoAlpha: 1, y: 0, duration: 0.42 }, 0);
      }

      if (logo) {
        gsap.set(logo, { autoAlpha: 0, x: -18, transformOrigin: 'left center' });
        timeline.to(logo, { autoAlpha: 1, x: 0, duration: 0.54 }, 0.06);
      }

      if (navLinks.length) {
        gsap.set(navLinks, { autoAlpha: 0, y: -8 });
        timeline.to(navLinks, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.03 }, 0.12);
      }

      if (heroContent.length) {
        gsap.set(heroContent, { autoAlpha: 0, y: 14 });
        timeline.to(heroContent, { autoAlpha: 1, y: 0, duration: 0.54, stagger: 0.06 }, 0.16);
      }

      if (backgrounds.length) {
        gsap.set(backgrounds, { autoAlpha: 0 });
        timeline.to(backgrounds, { autoAlpha: 0.06, duration: 0.72, stagger: 0.06, ease: 'power1.out' }, 0.08);
      }
    }, layoutRef);

    return () => {
      ctx?.revert();
    };
  }, []);

  const navLinkClass = (pathname: string, to: string) => {
    const active = isActiveRoute(pathname, to);

    return [
      'inline-flex items-center py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45',
      active ? 'text-[#F2F4F7]' : 'text-white/62 hover:text-[#EAEFF5]'
    ].join(' ');
  };

  const mobileNavLinkClass = (pathname: string, to: string) => {
    const active = isActiveRoute(pathname, to);

    return [
      'rounded-xl px-3 py-2.5 text-base font-medium transition-[color,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45',
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
      <Preloader targetRef={logoTargetRef} />

      <a href="#main-content" onClick={handleSkipToMain} className="skip-link">
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div data-startup-bg className="fixed left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full bg-[#697481] opacity-[0.13] blur-[120px]" />
        <div data-startup-bg className="fixed bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-[#B06E52] opacity-[0.09] blur-[120px]" />
        <div data-startup-bg className="engineering-grid animate-grid-drift" />
        <div data-startup-bg className="global-noise-floor" />
      </div>

      <nav ref={navRef} data-startup-nav className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <div
            className={`pointer-events-auto relative flex h-16 items-center rounded-[1.1rem] px-4 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[4.25rem] md:px-6 ${
              isScrolled
                ? 'border border-white/[0.07] bg-[rgba(11,13,17,0.48)] shadow-[0_8px_24px_rgba(0,0,0,0.10)] backdrop-blur-md'
                : 'border border-transparent bg-transparent shadow-none backdrop-blur-0'
            }`}
          >
          <div className="flex basis-[44%] flex-1 items-center justify-start">
              <button
                ref={logoTargetRef}
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex h-full origin-left items-center leading-none transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
                aria-label="Axiom home"
              >
                <ResponsiveImage
                  source={responsiveImages.logoClear}
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 256px"
                  alt="Axiom logo"
                  className="block h-11 w-auto max-w-none cursor-pointer object-contain object-left transition-opacity duration-200 hover:opacity-95 md:h-14 lg:h-16"
                  decoding="async"
                />
              </button>
          </div>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-startup-link
                aria-current={isActiveRoute(location.pathname, item.to) ? 'page' : undefined}
                className={navLinkClass(location.pathname, item.to)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden flex-1 basis-[44%] items-center justify-end md:flex">
            <Link to="/apply" className="btn-primary btn-sm px-4 py-2 text-sm">
              Talk to Axiom
            </Link>
          </div>

          <div className="flex flex-1 basis-[44%] items-center justify-end md:hidden">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-[#F2F4F7] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/35 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 ${
                isMobileMenuOpen ? 'border-white/25 bg-white/[0.08]' : 'border-white/15 bg-white/[0.03]'
              }`}
              aria-label={isMobileMenuOpen ? 'Close site navigation' : 'Open site navigation'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close site navigation' : 'Open site navigation'}</span>
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
      </nav>

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
        className={`fixed inset-x-4 top-[4.9rem] z-50 rounded-2xl border border-white/15 bg-[rgba(12,14,18,0.94)] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-lg transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-5 flex items-center">
          <p id="mobile-menu-title" className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">
            Navigation
          </p>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Mobile">
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

        <Link
          to="/apply"
          onClick={() => setIsMobileMenuOpen(false)}
          className="btn-primary btn-lg mt-5 w-full"
        >
          Talk to Axiom
        </Link>
      </div>

      <div className="relative z-10 pt-20 noise-overlay md:pt-28">{children}</div>

      <FloatingAffordances />
    </div>
  );
};

export default Layout;
