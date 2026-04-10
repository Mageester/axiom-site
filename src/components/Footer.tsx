import React from 'react';
import { NavLink } from 'react-router-dom';
import { CTA } from '../lib/cta';

const contactLinkClass =
  'motion-link-accent inline-flex min-h-11 items-center py-1.5 text-sm text-[#B05D41] hover:text-[#d7a189]';

const routeLinkClass = ({ isActive }: { isActive: boolean }) =>
  `motion-link-accent inline-flex min-h-11 items-center py-1.5 text-sm ${isActive ? 'text-[#B05D41]' : 'text-[#F2F4F7] hover:text-[#B05D41]'}`;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 md:grid-cols-[1.6fr_0.9fr_0.9fr_1fr] md:items-start md:gap-x-10 md:gap-y-10 md:px-8 md:py-12">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-black leading-[1.02] tracking-tight text-[#F2F4F7] md:text-4xl">AXIOM</p>
          <p className="mt-2 max-w-md text-[11px] leading-[1.45] text-slate-300 md:mt-3 md:text-sm">
            Clear websites for established businesses.
          </p>
          <p className="mt-2 max-w-md text-[11px] leading-[1.45] text-slate-400">
            Replies within one business day.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-slate-400 md:mt-6">
            © 2026 Axiom. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-col items-start gap-2" aria-label="Site pages">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Pages</p>
          <NavLink to="/" className={routeLinkClass}>Home</NavLink>
          <NavLink to="/works" className={routeLinkClass}>Work</NavLink>
          <NavLink to="/method" className={routeLinkClass}>Process</NavLink>
          <NavLink to="/about" className={routeLinkClass}>About</NavLink>
        </nav>

        <nav className="flex flex-col items-start gap-2" aria-label="Next step">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Next step</p>
          <NavLink to={CTA.primary.to} className={routeLinkClass}>{CTA.primary.label}</NavLink>
          <NavLink to={CTA.work.to} className={routeLinkClass}>{CTA.work.label}</NavLink>
        </nav>

        <nav className="col-span-2 flex flex-col items-start gap-2 md:col-span-1" aria-label="Contact and legal">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
          <div className="flex flex-col items-start gap-2">
            <NavLink to={CTA.contact.to} className={routeLinkClass}>Contact</NavLink>
            <a href="mailto:contact@getaxiom.ca" className={contactLinkClass}>
              contact@getaxiom.ca
            </a>
            <a href="tel:+12267531833" className={contactLinkClass}>
              226-753-1833
            </a>
          </div>
          <div className="mt-3 flex flex-col items-start gap-2">
            <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Legal</p>
            <NavLink to="/privacy" className={routeLinkClass}>Privacy Policy</NavLink>
            <NavLink to="/terms" className={routeLinkClass}>Terms of Service</NavLink>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
