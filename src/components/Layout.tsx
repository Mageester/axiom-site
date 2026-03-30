import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  { label: 'Apply', to: '/apply' },
];

const isActiveRoute = (pathname: string, to: string) => {
  if (to === '/') {
    return pathname === '/';
  }

  return pathname === to || pathname.startsWith(`${to}/`);
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = isMobileMenuOpen ? 'hidden' : previousOverflow;

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navLinkClass = (pathname: string, to: string) => {
    const active = isActiveRoute(pathname, to);

    return [
      'inline-flex items-center rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
      active ? 'text-[#F2F4F7]' : 'text-white/60 hover:text-white',
    ].join(' ');
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--axiom-base)] text-[#ECEFF3]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="fixed left-[-12%] top-[-18%] h-[42vw] w-[42vw] rounded-full bg-[#697481] opacity-[0.10] blur-[110px]" />
        <div className="fixed bottom-[-14%] right-[-8%] h-[34vw] w-[34vw] rounded-full bg-[#B06E52] opacity-[0.08] blur-[110px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[rgba(11,13,17,0.82)] backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center px-6 md:px-10">
          <div className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
              aria-label="Axiom Infrastructure home"
            >
              <ResponsiveImage
                source={responsiveImages.logoClear}
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, 200px"
                alt="Axiom Infrastructure logo"
                className="block h-14 w-auto object-contain object-left md:h-16"
                decoding="async"
              />
            </button>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 font-axiomMono md:flex" aria-label="Primary">
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

          <div className="flex flex-1 items-center justify-end md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#F2F4F7] transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
              aria-label={isMobileMenuOpen ? 'Close site navigation' : 'Open site navigation'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
            >
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-site-menu"
          className={`border-t border-white/[0.06] bg-[rgba(11,13,17,0.98)] px-4 py-4 backdrop-blur-xl transition-all duration-200 md:hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 font-axiomMono" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActiveRoute(location.pathname, item.to) ? 'page' : undefined}
                className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.14em] text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-[#F2F4F7]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 pt-24 md:pt-28">{children}</div>
    </div>
  );
};

export default Layout;
