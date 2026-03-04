import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B]/50 bg-[#090A0B] py-12 mt-32">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[#F5F7FA] font-extrabold text-2xl tracking-tighter">
          Axiom<span className="text-[#E4572E]">.</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-[#A7B3BC] text-sm tracking-wide">
          <p>© 2026 Axiom Infrastructure. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-[#A7B3BC] text-sm hover:text-[#F5F7FA] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[#A7B3BC] text-sm hover:text-[#F5F7FA] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
