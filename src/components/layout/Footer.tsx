import * as React from 'react';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/Eyebrow';
import { cn } from '../../lib/utils';

export interface FooterProps {
  pathname: string;
}

const PAGES = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Process', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

const BrandMark = () => (
  <span
    aria-hidden="true"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-overlay)]"
  >
    <span
      className="h-3.5 w-3.5 rounded-[4px]"
      style={{ background: 'var(--accent-solid)', boxShadow: 'var(--shadow-brand-ring)' }}
    />
  </span>
);

export const Footer: React.FC<FooterProps> = ({ pathname }) => {
  const year = new Date().getFullYear();
  const footerLinkClass = 'text-[15px] text-white/40 transition-colors duration-200 hover:text-white/80';

  return (
    <footer className="border-t border-[color:var(--hairline)] px-6 py-20 md:px-12">
      <div className="axiom-container grid gap-12 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-6">
          <a href="/" className="flex items-center gap-3">
            <BrandMark />
            <span className="text-[15px] font-semibold tracking-[0.18em] text-[var(--text-primary)]">AXIOM</span>
          </a>
          <p className="max-w-sm text-sm italic leading-relaxed text-white/40">
            Websites built to convert. Not to decorate.
          </p>
          <p className="text-[13px] leading-[1.55] text-[var(--text-muted)]">© {year} Axiom Infrastructure.</p>
        </div>

        <div className="space-y-4">
          <Eyebrow>Pages</Eyebrow>
          <ul className="space-y-3">
            {PAGES.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    footerLinkClass,
                    isActive(pathname, link.href) && 'text-white/80'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <Eyebrow>Contact</Eyebrow>
          <ul className="space-y-3">
            <li>
              <a href="mailto:contact@getaxiom.ca" className={footerLinkClass}>
                contact@getaxiom.ca
              </a>
            </li>
            <li>
              <a href="tel:+12267531833" className={footerLinkClass}>
                (226) 753-1833
              </a>
            </li>
            <li>
              <Button asChild className="text-[15px]">
                <a href="/start-a-project">Start a project</a>
              </Button>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Eyebrow>Legal</Eyebrow>
          <ul className="space-y-3">
            {LEGAL.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    footerLinkClass,
                    isActive(pathname, link.href) && 'text-white/80'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
