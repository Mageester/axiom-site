import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import { NavLink, useNavigate } from 'react-router-dom';
import Preloader from './Preloader';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const logoTargetRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      const nav = navRef.current;
      const logo = logoTargetRef.current;
      const navLinks = gsap.utils.toArray<HTMLElement>('[data-startup-link]');
      const hero = layoutRef.current?.querySelector<HTMLElement>('[data-hero-root]');
      const heading = layoutRef.current?.querySelector<HTMLElement>('[data-startup-heading]');
      const backgrounds = gsap.utils.toArray<HTMLElement>('[data-startup-bg]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-glass-card], .axiom-bento, .axiom-bento-card, .machined-card');

      if (!nav || !hero || !heading || !logo) return;

      split = new SplitType(heading, {
        types: 'words,chars',
        wordClass: 'startup-word',
        charClass: 'startup-char',
      });

      gsap.set(nav, { autoAlpha: 0, y: -50 });
      gsap.set(logo, { autoAlpha: 0, x: -150, scale: 0.72, transformOrigin: 'left center' });
      gsap.set(navLinks, { autoAlpha: 0, x: 28 });
      gsap.set(hero, { autoAlpha: 0 });
      gsap.set(backgrounds, { autoAlpha: 0 });
      gsap.set(split.chars, { autoAlpha: 0, yPercent: 110 });
      gsap.set(cards, { autoAlpha: 0, y: 40 });

      const timeline = gsap.timeline();

      timeline
        .to(nav, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.out' }, 0)
        .to(logo, { autoAlpha: 1, x: 0, scale: 1, duration: 0.72, ease: 'expo.out' }, 0.08)
        .to(navLinks, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out' }, 0.3)
        .to(hero, { autoAlpha: 1, duration: 0.2 }, 0.2)
        .to(split.chars, { autoAlpha: 1, yPercent: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' }, 0.3)
        .to(backgrounds, { autoAlpha: 0.04, duration: 0.6, stagger: 0.08, ease: 'power1.out' }, 0.6)
        .to(cards, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.6);
    }, layoutRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative pb-1 font-semibold uppercase tracking-[0.24em] text-[11px] text-white/80 transition-colors duration-300 after:absolute after:bottom-[-7px] after:left-0 after:h-[1px] after:bg-amber-600 after:content-[''] after:transition-all after:duration-300 ${isActive ? 'text-white after:w-full' : 'after:w-0 hover:text-white hover:after:w-full'}`;

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
            ? 'border-b border-white/5 bg-[rgba(9,10,11,0.82)] backdrop-blur-md'
            : 'border-b border-transparent bg-[rgba(9,10,11,0.45)]'
          }`}
      >
        <div className="relative h-20 flex items-center px-6 md:px-12">
          <div className="flex flex-1 basis-[44%] items-center justify-start">
            <button
              ref={logoTargetRef}
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center origin-left transition-transform duration-700 ease-in-out hover:scale-[1.04]"
              aria-label="Axiom Infrastructure home"
            >
              <img
                src="/photos/logoclear.png"
                alt="Axiom Infrastructure"
                className="h-24 w-auto max-w-none object-left object-contain cursor-pointer transition-all duration-500 hover:brightness-125 md:h-28 lg:h-32"
              />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-12 font-axiomMono md:flex">
            <NavLink to="/" className={navLinkClass} data-startup-link>
              Home
            </NavLink>
            <NavLink to="/infrastructure" className={navLinkClass} data-startup-link>
              Infrastructure
            </NavLink>
            <NavLink to="/works" className={navLinkClass} data-startup-link>
              Works
            </NavLink>
            <NavLink to="/architects" className={navLinkClass} data-startup-link>
              Architects
            </NavLink>
          </div>

          <div className="hidden flex-1 basis-[44%] items-center justify-end md:flex">
            <a href="/#intake" className="btn-primary btn-sm px-4 py-2 text-sm">
              Start Your Project
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-28 md:pt-32 noise-overlay">{children}</div>
    </div>
  );
};

export default Layout;
