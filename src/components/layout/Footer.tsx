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

export const Footer: React.FC<FooterProps> = ({ pathname }) => {
  const year = new Date().getFullYear();
  const footerLinkClass =
    'motion-link-accent min-h-11 text-[16px] leading-[1.7] text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]';

  return (
    <footer className="border-t border-[color:var(--hairline)] px-6 py-20 md:px-12">
      <div className="axiom-container grid gap-12 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-6">
          <a href="/" className="inline-flex items-center" aria-label="Axiom Infrastructure home">
            <img
              src="/axiomtransparentlogo.webp"
              alt=""
              width={240}
              height={63}
              className="block h-10 w-auto select-none object-contain"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="max-w-sm text-[15px] italic leading-[1.7] text-[var(--text-secondary)]">
            Websites built to convert. Not to decorate.
          </p>
          <p className="text-[14px] leading-[1.6] text-[var(--text-muted)]">&copy; {year} Axiom Infrastructure.</p>
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
                    isActive(pathname, link.href) && 'text-[var(--accent-solid)]'
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
                    isActive(pathname, link.href) && 'text-[var(--accent-solid)]'
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
