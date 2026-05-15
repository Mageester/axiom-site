import * as React from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import { cn } from '../../lib/utils';

export interface FooterProps {
  pathname: string;
}

const PAGES = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
    <footer className="site-footer relative overflow-hidden border-t border-[color:var(--hairline)] px-6 py-14 md:px-12 md:py-16" data-reveal data-motion="finalFrameFooter" suppressHydrationWarning>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,var(--accent-surface),transparent_34%)] opacity-70" />
      <div className="axiom-container grid gap-12 md:grid-cols-2 xl:grid-cols-4">
        <div className="footer-column space-y-6" data-reveal data-motion="finalFrameFooter" suppressHydrationWarning style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>
          <a href="/" className="inline-flex min-h-11 items-center" aria-label="Axiom Web home">
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
          <p className="max-w-sm text-[14px] leading-[1.7] text-[var(--text-muted)]">
            Based in Kitchener-Waterloo. A subsidiary of Axiom International.
          </p>
          <p className="text-[14px] leading-[1.6] text-[var(--text-muted)]">Copyright {year} Axiom Web.</p>
        </div>

        <div className="footer-column space-y-4" data-reveal data-motion="finalFrameFooter" suppressHydrationWarning style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
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

        <div className="footer-column space-y-4" data-reveal data-motion="finalFrameFooter" suppressHydrationWarning style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
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
              <a href="/start-a-project" className={footerLinkClass}>
                Start a project
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column space-y-4" data-reveal data-motion="finalFrameFooter" suppressHydrationWarning style={{ '--reveal-delay': '360ms' } as React.CSSProperties}>
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
