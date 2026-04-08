import React from 'react';
import { NavLink } from 'react-router-dom';

const contactLinkClass =
  'motion-link-accent block text-sm text-[#B05D41] hover:text-[#d7a189]';

const routeLinkClass = ({ isActive }: { isActive: boolean }) =>
  `motion-link-accent block text-sm ${isActive ? 'text-[#B05D41]' : 'text-[#F2F4F7] hover:text-[#B05D41]'}`;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-3 px-5 py-5 md:grid-cols-[1.6fr_0.9fr_0.9fr_1fr] md:gap-x-8 md:gap-y-10 md:px-8 md:py-12 md:items-start">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-black leading-[1.02] tracking-tight text-[#F2F4F7] md:text-4xl">AXIOM</p>
          <p className="mt-2 max-w-md text-[11px] leading-[1.45] text-slate-300 md:mt-3 md:text-sm">
            Websites for established businesses.
          </p>
          <p className="mt-4 hidden text-[10px] uppercase tracking-[0.12em] text-slate-400 md:block md:mt-6">
            Copyright 2026 Axiom. All rights reserved.
          </p>
        </div>

        <nav className="space-y-1.5">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Pages</p>
          <NavLink to="/" className={routeLinkClass}>Home</NavLink>
          <NavLink to="/works" className={routeLinkClass}>Work</NavLink>
          <NavLink to="/method" className={routeLinkClass}>Process</NavLink>
          <NavLink to="/about" className={routeLinkClass}>About</NavLink>
        </nav>

        <nav className="space-y-1.5">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Next step</p>
          <NavLink to="/apply" className={routeLinkClass}>Talk to Axiom</NavLink>
        </nav>

        <nav className="col-span-2 space-y-1.5 md:col-span-1">
          <p className="font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
          <NavLink to="/contact" className={routeLinkClass}>Send a message</NavLink>
          <a href="mailto:contact@getaxiom.ca" className={contactLinkClass}>
            <span className="block">contact@getaxiom.ca</span>
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
