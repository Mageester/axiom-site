import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Preloader from './Preloader';
import ResponsiveImage from './ResponsiveImage';
import { responsiveImages } from '../lib/responsiveImages';

type LayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Method', to: '/method' },
  { label: 'Work', to: '/works' },
  { label: 'About', to: '/about' },
];

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('main > section, main > article'))
      .filter((element, index) => index > 0 && !element.hasAttribute('data-hero-root') && element.dataset.reveal !== 'off');

    if (targets.length === 0) return;

    targets.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-order', String(index % 4));
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
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
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
      const cards = gsap.utils
        .toArray<HTMLElement>('[data-glass-card], .axiom-bento, .axiom-bento-card, .machined-card')
        .filter((element) => !element.closest('[aria-hidden="true"]'));

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (nav) {
        gsap.set(nav, { autoAlpha: 0, y: -18 });
        timeline.to(nav, { autoAlpha: 1, y: 0, duration: 0.5 }, 0);
      }

      if (logo) {
        gsap.set(logo, { autoAlpha: 0, x: -28, transformOrigin: 'left center' });
        timeline.to(logo, { autoAlpha: 1, x: 0, duration: 0.72, ease: 'expo.out' }, 0.08);
      }

      if (navLinks.length) {
        gsap.set(navLinks, { autoAlpha: 0, y: -10 });
        timeline.to(navLinks, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.04 }, 0.18);
      }

      if (heroContent.length) {
        gsap.set(heroContent, { autoAlpha: 0, y: 18 });
        timeline.to(heroContent, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 }, 0.22);
      }

      if (backgrounds.length) {
        gsap.set(backgrounds, { autoAlpha: 0 });
        timeline.to(backgrounds, { autoAlpha: 0.07, duration: 0.8, stagger: 0.08, ease: 'power1.out' }, 0.16);
      }

      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 22 });
        timeline.to(cards, { autoAlpha: 1, y: 0, duration: 0.56, stagger: 0.05 }, 0.36);
      }
    }, layoutRef);

    return () => {
      ctx?.revert();
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative pb-1 font-medium uppercase tracking-[0.2em] text-[11px] text-white/78 transition-colors duration-300 after:absolute after:bottom-[-7px] after:left-0 after:h-[1px] after:bg-amber-600 after:content-[''] after:transition-all after:duration-300 ${isActive ? 'text-white after:w-full' : 'after:w-0 hover:text-white hover:after:w-full'}`;

  return (
    <div ref={layoutRef} className="relative min-h-screen overflow-x-clip bg-[var(--axiom-base)] text-[#ECEFF3]">
      <Preloader targetRef={logoTargetRef} />

      <div className="pointer-events-none absolute inset-0 z-0">
        <div data-startup-bg className="fixed top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#B05D41] opacity-[0.15] blur-[120px]" />
        <div data-startup-bg className="fixed bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-[#B05D41] opacity-[0.15] blur-[120px]" />
        <div data-startup-bg className="engineering-grid animate-grid-drift" />
        <div data-startup-bg className="global-noise-floor" />
      </div>

      <nav
        ref={navRef}
        data-startup-nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'border-b border-white/[0.08] bg-[rgba(9,12,18,0.58)] backdrop-blur-sm'
            : 'border-b border-transparent bg-transparent backdrop-blur-0'
          }`}
      >
        <div className="relative h-20 flex items-center px-6 md:px-12">
          <div className="flex flex-1 basis-[44%] items-center justify-start">
            <button
              ref={logoTargetRef}
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex h-full items-center origin-left leading-none transition-transform duration-700 ease-in-out hover:scale-[1.04]"
              aria-label="Axiom Infrastructure home"
            >
              <ResponsiveImage
                source={responsiveImages.logoClear}
                sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 256px"
                alt="Axiom Infrastructure"
                className="block h-16 w-auto max-w-none object-left object-contain cursor-pointer transition-all duration-500 hover:brightness-125 md:h-20 lg:h-24"
                decoding="async"
                fetchPriority="high"
              />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-12 font-axiomMono md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} data-startup-link>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden flex-1 basis-[44%] items-center justify-end md:flex">
            <a href="/apply" className="btn-primary btn-attention btn-sm px-4 py-2 text-sm">
              BOOK CONSULTATION
            </a>
          </div>

          <div className="flex flex-1 basis-[44%] items-center justify-end md:hidden">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-[#F2F4F7] transition-all hover:border-white/35 hover:bg-white/[0.08] ${
                isMobileMenuOpen ? 'border-white/25 bg-white/[0.08]' : 'border-white/15 bg-white/[0.03]'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
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
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
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
        className={`fixed inset-x-4 top-[5.5rem] z-50 rounded-2xl border border-white/15 bg-[rgba(10,11,13,0.96)] p-5 shadow-[0_28px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-200 md:hidden ${
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
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm uppercase tracking-[0.14em] transition-colors ${
                  isActive ? 'bg-white/[0.08] text-[#F2F4F7]' : 'text-slate-300 hover:bg-white/[0.05] hover:text-[#F2F4F7]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a href="/apply" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary btn-attention btn-lg mt-5 w-full">
          BOOK CONSULTATION
        </a>
      </div>

      <div className="relative z-10 pt-24 md:pt-28 noise-overlay">{children}</div>
    </div>
  );
};

export default Layout;
