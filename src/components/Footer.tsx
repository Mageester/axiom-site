import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#31363B]/40 bg-[#090A0B] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#F5F7FA] font-extrabold text-xl tracking-tighter">
          AXIOM<span className="text-[#E4572E]">.</span>
        </div>
        <p className="text-[#A7B3BC] text-[13px] tracking-wide">© 2026 Axiom Infrastructure. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
