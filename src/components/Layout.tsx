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
      const hero = layoutRef.current?.querySelector<HTMLElement>('[data-hero-root]');
      const heading = layoutRef.current?.querySelector<HTMLElement>('[data-startup-heading]');
      const backgrounds = gsap.utils.toArray<HTMLElement>('[data-startup-bg]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-glass-card], .axiom-bento, .axiom-bento-card, .machined-card');

      if (!nav || !hero || !heading) return;

      split = new SplitType(heading, {
        types: 'words,chars',
        wordClass: 'startup-word',
        charClass: 'startup-char',
      });

      gsap.set(nav, { autoAlpha: 0, y: -50 });
      gsap.set(hero, { autoAlpha: 0 });
      gsap.set(backgrounds, { autoAlpha: 0 });
      gsap.set(split.chars, { autoAlpha: 0, yPercent: 110 });
      gsap.set(cards, { autoAlpha: 0, y: 40 });

      const timeline = gsap.timeline();

      timeline
        .to(nav, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.out' }, 0)
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
    `transition-colors ${isActive ? 'text-axiom-text-main' : 'text-axiom-text-mute hover:text-axiom-text-main'}`;

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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
          <button
            ref={logoTargetRef}
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center transition-transform duration-700 ease-in-out hover:scale-110"
            aria-label="Axiom Infrastructure home"
          >
            <img
              src="/photos/logoclear.png"
              alt="Axiom Infrastructure"
              className="h-14 md:h-16 w-auto object-contain cursor-pointer transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(176,93,65,0.4)]"
            />
          </button>

          <div className="hidden items-center gap-8 text-[11px] font-axiomMono uppercase tracking-[0.16em] text-axiom-text-mute md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/infrastructure" className={navLinkClass}>
              Infrastructure
            </NavLink>
            <NavLink to="/works" className={navLinkClass}>
              Works
            </NavLink>
            <NavLink to="/architects" className={navLinkClass}>
              Architects
            </NavLink>
          </div>

          <a href="/#intake" className="hidden md:flex btn-primary btn-sm px-4 py-2 text-sm">
            Start Your Project
          </a>
        </div>
      </nav>

      <div className="relative z-10 pt-28 md:pt-32 noise-overlay">{children}</div>
    </div>
  );
};

export default Layout;
