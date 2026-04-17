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

const BrandMark = () => (
  <span
    aria-hidden="true"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white/[0.03]"
  >
    <span
      className="h-3.5 w-3.5 rounded-[4px]"
      style={{ background: 'var(--accent)', boxShadow: '0 0 0 5px var(--accent-glow)' }}
    />
  </span>
);

export const Nav: React.FC<NavProps> = ({ pathname, hidePrimaryCta = false }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

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
            'axiom-container flex items-center justify-between rounded-full border backdrop-blur-[20px] transition-[padding,border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
            scrolled
              ? 'border-[color:rgba(255,255,255,0.1)] bg-[rgba(10,10,12,0.82)] px-4 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.24)]'
              : 'border-[color:var(--hairline)] bg-[rgba(10,10,12,0.7)] px-4 py-3.5 shadow-[0_16px_30px_rgba(0,0,0,0.16)]'
          )}
        >
          <a href="/" className="flex items-center gap-3 text-[15px] font-semibold tracking-[-0.01em]">
            <BrandMark />
            <span className="tracking-[0.18em]">AXIOM</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[14px] font-medium text-[var(--text-secondary)] transition-[color,opacity] duration-200 hover:text-[var(--text-primary)]',
                  isActive(pathname, link.href) && 'text-[var(--text-primary)]'
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white/[0.03] text-[var(--text-primary)] transition-[filter,border-color,background-color] duration-200 hover:border-white/10 hover:bg-white/[0.05] md:hidden"
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
          'fixed inset-0 z-40 bg-[rgba(10,10,12,0.96)] px-6 py-8 backdrop-blur-[24px] transition-[opacity,visibility] duration-200 md:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full max-w-5xl flex-col justify-between pt-20">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 text-[15px] font-semibold tracking-[0.18em]">
              <BrandMark />
              <span>AXIOM</span>
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white/[0.03] text-[var(--text-primary)]"
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
                  'block text-[clamp(2.5rem,8vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--text-primary)] transition-opacity duration-200',
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
