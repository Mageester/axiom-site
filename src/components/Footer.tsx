import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B] bg-[#090A0B]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-8 py-20 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:items-start">
        <div>
          <p className="text-3xl md:text-5xl font-black tracking-tight text-[#F2F4F7] leading-[1.05]">AXIOM INFRASTRUCTURE</p>
          <p className="mt-4 max-w-md text-sm leading-[1.8] text-[#A7B3BC]">Premium digital infrastructure crafted for ambitious brands that need elite aesthetics and enterprise-grade performance.</p>
          <p className="mt-8 text-xs tracking-[0.14em] uppercase text-[#A7B3BC]">© 2026 Axiom Infrastructure. All rights reserved.</p>
        </div>

        <nav className="space-y-3">
          <p className="text-xs font-axiomMono uppercase tracking-[0.18em] text-[#A7B3BC]">Navigate</p>
          <a href="#" className="block text-sm text-[#F2F4F7] transition-colors hover:text-[#B05D41]">Home</a>
        </nav>

        <nav className="space-y-3">
          <p className="text-xs font-axiomMono uppercase tracking-[0.18em] text-[#A7B3BC]">Services</p>
          <a href="#" className="block text-sm text-[#F2F4F7] transition-colors hover:text-[#B05D41]">Services</a>
        </nav>

        <nav className="space-y-3">
          <p className="text-xs font-axiomMono uppercase tracking-[0.18em] text-[#A7B3BC]">Company</p>
          <a href="#" className="block text-sm text-[#F2F4F7] transition-colors hover:text-[#B05D41]">About</a>
          <a href="#intake" className="block text-sm text-[#F2F4F7] transition-colors hover:text-[#B05D41]">Work With Us</a>
        </nav>

        <div className="space-y-3">
          <p className="text-xs font-axiomMono uppercase tracking-[0.18em] text-[#A7B3BC]">Social</p>
          <div className="flex items-center gap-4 text-[#F2F4F7]">
            <a aria-label="X" href="https://x.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#B05D41]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M18.9 3H22l-6.8 7.8L23.5 21h-6.5l-5.1-6.2L6.5 21H3.4l7.3-8.3L.5 3H7l4.6 5.7L18.9 3Zm-1.1 16.1h1.8L6 4.8H4.1l13.7 14.3Z" />
              </svg>
            </a>
            <a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#B05D41]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm15.19 9.9c0-3.45-1.84-5.06-4.29-5.06-1.98 0-2.87 1.09-3.37 1.86V8.5H9.4V20h3.38v-6.39c0-1.68.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.4V20h3.38v-7.1Z" />
              </svg>
            </a>
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#B05D41]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.45 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
