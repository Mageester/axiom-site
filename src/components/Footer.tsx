import React from 'react';
import { NavLink } from 'react-router-dom';

const contactLinkClass =
  'block text-sm text-[#B05D41] transition-all duration-300 hover:text-[#d7a189] hover:drop-shadow-[0_0_12px_rgba(176,93,65,0.45)]';

const routeLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block text-sm transition-colors ${isActive ? 'text-[#B05D41]' : 'text-[#F2F4F7] hover:text-[#B05D41]'}`;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-8 py-20 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:items-start">
        <div>
          <p className="text-3xl font-black leading-[1.05] tracking-tight text-[#F2F4F7] md:text-5xl">AXIOM INFRASTRUCTURE</p>
          <p className="mt-4 max-w-md text-sm leading-[1.8] text-slate-300">
            Premium websites for businesses that need stronger trust signals, clearer conversion paths, and reliable execution.
          </p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400">
            Sample and demonstration work is labeled transparently. No fabricated results, testimonials, or client claims.
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.1em] text-slate-300">Copyright 2026 Axiom Infrastructure. All rights reserved.</p>
        </div>

        <nav className="space-y-3">
          <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-[#A7B3BC]">Navigate</p>
          <NavLink to="/" className={routeLinkClass}>Home</NavLink>
          <NavLink to="/infrastructure" className={routeLinkClass}>Method</NavLink>
          <NavLink to="/works" className={routeLinkClass}>Work</NavLink>
          <NavLink to="/about" className={routeLinkClass}>About</NavLink>
        </nav>

        <nav className="space-y-3">
          <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-[#A7B3BC]">Engagement</p>
          <NavLink to="/infrastructure" className={routeLinkClass}>Delivery Method</NavLink>
          <NavLink to="/works" className={routeLinkClass}>Selected Work</NavLink>
        </nav>

        <nav className="space-y-3">
          <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-[#A7B3BC]">Contact</p>
          <a href="mailto:aidan@getaxiom.ca" className={contactLinkClass}>
            aidan@getaxiom.ca
          </a>
          <a href="tel:+12267531833" className={contactLinkClass}>
            226-753-1833
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
