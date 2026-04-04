import React from 'react';
import { NavLink } from 'react-router-dom';

const contactLinkClass =
  'block text-sm text-[#B05D41] transition-all duration-300 hover:text-[#d7a189] hover:drop-shadow-[0_0_12px_rgba(176,93,65,0.45)]';

const routeLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block text-sm transition-colors ${isActive ? 'text-[#B05D41]' : 'text-[#F2F4F7] hover:text-[#B05D41]'}`;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-4 px-5 py-6 md:grid-cols-[1.6fr_0.9fr_0.9fr_1fr] md:gap-x-8 md:gap-y-10 md:px-8 md:py-12 md:items-start">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-black leading-[1.02] tracking-tight text-[#F2F4F7] md:text-4xl">AXIOM INFRASTRUCTURE</p>
          <p className="mt-2 max-w-md text-[11px] leading-[1.55] text-slate-300 md:mt-3 md:text-sm">
            Founder-led websites for established service businesses that need a sharper first impression and a cleaner path to inquiry.
          </p>
          <p className="mt-2 hidden max-w-md text-[11px] leading-relaxed text-slate-400 md:block md:text-xs">
            Sample and demonstration work is labeled transparently. No fabricated results or client claims.
          </p>
          <p className="mt-4 hidden text-[10px] uppercase tracking-[0.12em] text-slate-400 md:block md:mt-6">
            Copyright 2026 Axiom Infrastructure. All rights reserved.
          </p>
        </div>

        <nav className="space-y-1.5">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Navigate</p>
          <NavLink to="/" className={routeLinkClass}>Home</NavLink>
          <NavLink to="/method" className={routeLinkClass}>Method</NavLink>
          <NavLink to="/works" className={routeLinkClass}>Work</NavLink>
          <NavLink to="/about" className={routeLinkClass}>About</NavLink>
        </nav>

        <nav className="space-y-1.5">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Start</p>
          <NavLink to="/apply" className={routeLinkClass}>Book Consultation</NavLink>
          <NavLink to="/method" className={routeLinkClass}>Method</NavLink>
        </nav>

        <nav className="col-span-2 space-y-1.5 md:col-span-1">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
          <a href="mailto:contact@getaxiom.ca" className={contactLinkClass}>
            <span className="block">contact@getaxiom.ca</span>
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
