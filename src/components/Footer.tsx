import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block text-sm transition-colors ${isActive ? 'text-[#F2F4F7]' : 'text-slate-300 hover:text-white'}`;

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.6fr_1fr_1fr] md:px-10 md:py-16">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-[#F2F4F7] md:text-3xl">Axiom Infrastructure</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Aidan Magee and Riley Hinsperger build the work themselves. We make simple websites for service businesses that need clearer calls and fewer dead ends.
          </p>
        </div>

        <nav className="space-y-3" aria-label="Footer pages">
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Pages</p>
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/method" className={linkClass}>Method</NavLink>
          <NavLink to="/works" className={linkClass}>Work</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/apply" className={linkClass}>Apply</NavLink>
        </nav>

        <div className="space-y-3">
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Contact</p>
          <a href="mailto:contact@getaxiom.ca" className="block text-sm text-slate-300 transition-colors hover:text-white">
            contact@getaxiom.ca
          </a>
          <a href="tel:+12267531833" className="block text-sm text-slate-300 transition-colors hover:text-white">
            226-753-1833
          </a>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Start on the Apply page. We review every inquiry ourselves and reply within one business day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
