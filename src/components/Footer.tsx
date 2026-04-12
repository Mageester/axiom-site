import React from 'react';
import { NavLink } from 'react-router-dom';
import { CTA } from '../lib/cta';

const contactLinkClass =
  'motion-link-accent flex w-fit min-h-11 items-center py-1 text-sm leading-6 text-[#B05D41] hover:text-[#d7a189]';

const routeLinkClass = ({ isActive }: { isActive: boolean }) =>
  `motion-link-accent flex w-fit min-h-11 items-center py-1 text-sm leading-6 ${isActive ? 'text-[#B05D41]' : 'text-[#F2F4F7] hover:text-[#B05D41]'}`;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto w-full max-w-[92rem] px-5 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_repeat(2,minmax(0,0.72fr))_minmax(0,0.84fr)] lg:gap-10 xl:gap-12">
          <div className="max-w-md">
            <p className="text-2xl font-black leading-[1.02] tracking-tight text-[#F2F4F7] md:text-4xl">AXIOM</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Clear websites for established businesses.
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Replies within one business day.
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.12em] text-slate-400">
              &copy; 2026 Axiom. All rights reserved.
            </p>
          </div>

          <nav className="space-y-3" aria-label="Site pages">
            <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Pages</p>
            <div className="space-y-1.5">
              <NavLink to="/" className={routeLinkClass}>Home</NavLink>
              <NavLink to="/works" className={routeLinkClass}>Work</NavLink>
              <NavLink to="/manifesto" className={routeLinkClass}>Manifesto</NavLink>
              <NavLink to="/method" className={routeLinkClass}>Process</NavLink>
              <NavLink to="/about" className={routeLinkClass}>About</NavLink>
            </div>
          </nav>

          <nav className="space-y-3" aria-label="Next step">
            <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Next step</p>
            <div className="space-y-1.5">
              <NavLink to={CTA.primary.to} className={routeLinkClass}>{CTA.primary.label}</NavLink>
              <NavLink to={CTA.work.to} className={routeLinkClass}>{CTA.work.label}</NavLink>
            </div>
          </nav>

          <div className="space-y-6">
            <nav className="space-y-3" aria-label="Contact">
              <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
              <div className="space-y-1.5">
                <NavLink to={CTA.contact.to} className={routeLinkClass}>Contact</NavLink>
                <a href="mailto:contact@getaxiom.ca" className={contactLinkClass}>
                  contact@getaxiom.ca
                </a>
                <a href="tel:+12267531833" className={contactLinkClass}>
                  226-753-1833
                </a>
              </div>
            </nav>

            <nav className="space-y-3 border-t border-white/[0.08] pt-5" aria-label="Legal">
              <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Legal</p>
              <div className="space-y-1.5">
                <NavLink to="/privacy" className={routeLinkClass}>Privacy Policy</NavLink>
                <NavLink to="/terms" className={routeLinkClass}>Terms of Service</NavLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
