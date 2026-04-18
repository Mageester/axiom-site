import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

type NavLink = {
  label: string;
  href: string;
};

export interface NavProps {
  pathname: string;
  hidePrimaryCta?: boolean;
}

const LINKS: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

const MOBILE_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  ...LINKS,
  { label: 'Process', href: '/process' },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const Nav: React.FC<NavProps> = ({ pathname, hidePrimaryCta = false }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const navLinkClass =
    'relative inline-flex items-center pb-1 text-[14px] font-medium text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-0 motion-safe:after:content-[\'\'] motion-safe:after:absolute motion-safe:after:left-0 motion-safe:after:bottom-0 motion-safe:after:h-px motion-safe:after:w-full motion-safe:after:origin-left motion-safe:after:scale-x-0 motion-safe:after:bg-current motion-safe:after:transition-transform motion-safe:after:duration-200 motion-safe:after:ease-out motion-safe:hover:after:scale-x-100 motion-reduce:after:scale-x-100';

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 px-3 sm:px-6">
        <div
        className={cn(
            'axiom-container flex items-center justify-between rounded-full border px-4 py-3.5 backdrop-blur-[20px] transition-[border-color,background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
            scrolled ? 'border-[color:var(--hairline-strong)]' : 'border-[color:var(--hairline)]'
          )}
          style={{
            backgroundColor: scrolled ? 'var(--nav-shell-bg-scrolled)' : 'var(--nav-shell-bg)',
            boxShadow: scrolled ? 'var(--shadow-nav-scrolled)' : 'var(--shadow-nav-rest)',
          }}
        >
          <a href="/" className="flex items-center gap-3" aria-label="Axiom Infrastructure home">
            <img
              src="/axiomtransparentlogo.webp"
              alt="Axiom"
              width={240}
              height={63}
              className="block h-9 w-auto select-none object-contain sm:h-10"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  navLinkClass,
                  isActive(pathname, link.href) && 'text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!hidePrimaryCta ? (
              <Button asChild className="hidden md:inline-flex">
                <a href="/start-a-project">Start a project</a>
              </Button>
            ) : null}

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-overlay)] text-[var(--text-primary)] transition-[filter,border-color,background-color] duration-200 hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-overlay-press)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-0"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200',
                    open && 'translate-y-[7px] rotate-45'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-200',
                    open && 'opacity-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[14px] h-px w-5 bg-current transition-transform duration-200',
                    open && '-translate-y-[7px] -rotate-45'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav-panel"
        className={cn(
          'fixed inset-0 z-40 px-6 py-8 backdrop-blur-[24px] transition-[opacity,visibility] duration-200 md:hidden',
          open ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
        )}
        style={{ backgroundColor: 'var(--nav-panel-bg)' }}
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full max-w-5xl flex-col justify-between pt-20">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="Axiom Infrastructure home">
              <img
                src="/axiomtransparentlogo.webp"
                alt="Axiom"
                width={240}
                height={63}
                className="block h-9 w-auto select-none object-contain sm:h-10"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-overlay)] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-0"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {MOBILE_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block text-[clamp(2.5rem,8vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white/60 transition-colors duration-200 hover:text-white',
                  isActive(pathname, link.href) && 'text-white',
                  index === 0 ? 'mt-2' : ''
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-[color:var(--hairline)] pt-6">
            <Button asChild className="w-full sm:w-auto">
              <a href="/start-a-project" onClick={() => setOpen(false)}>
                Start a project
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
