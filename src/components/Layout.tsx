import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Preloader from './Preloader';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const logoTargetRef = useRef<HTMLButtonElement>(null);
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? 'text-axiom-text-main' : 'text-axiom-text-mute hover:text-axiom-text-main'}`;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--axiom-base)] text-[#ECEFF3]">
      <Preloader targetRef={logoTargetRef} />

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="fixed top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#B05D41] opacity-[0.15] blur-[120px]" />
        <div className="fixed bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-[#B05D41] opacity-[0.15] blur-[120px]" />
        <div className="engineering-grid animate-grid-drift" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
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
              src="/logo.png"
              alt="Axiom Infrastructure"
              className="h-10 md:h-12 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </button>

          <div className="hidden items-center gap-8 text-[11px] font-axiomMono uppercase tracking-[0.16em] text-axiom-text-mute md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/infrastructure" className={navLinkClass}>
              Infrastructure
            </NavLink>
            <NavLink to="/deployments" className={navLinkClass}>
              Deployments
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

      <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden rotate-90 lg:block">
        <p className="font-axiomMono text-xs uppercase tracking-widest text-[#d2b49c]">
          TRUSTED BY HIGH-STAKES TEAMS
        </p>
      </div>

      <div className="relative z-10 pt-28 md:pt-32 noise-overlay">{children}</div>
    </div>
  );
};

export default Layout;
