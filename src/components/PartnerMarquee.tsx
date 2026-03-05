import React from 'react';

const brands = ['AWS', 'REACT', 'VERCEL', 'GSAP', 'FIGMA', 'CLOUDFLARE'];

const PartnerMarquee: React.FC = () => {
  return (
    <section aria-label="Platform ecosystem">
      <div className="w-full overflow-hidden flex bg-[#090A0B] border-y border-white/5 py-8">
        <div className="flex w-max animate-infinite-scroll space-x-16 md:space-x-32 pr-16 md:pr-32">
          {brands.map((brand, index) => (
            <span
              key={`set-a-${brand}-${index}`}
              className="text-3xl md:text-5xl font-black tracking-tighter text-white opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap flex-shrink-0"
            >
              {brand}
            </span>
          ))}
          {brands.map((brand, index) => (
            <span
              key={`set-b-${brand}-${index}`}
              className="text-3xl md:text-5xl font-black tracking-tighter text-white opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap flex-shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
