import React from 'react';

type PartnerLogo = {
  name: string;
  src: string;
};

const logos: PartnerLogo[] = [
  { name: 'AWS', src: 'https://cdn.simpleicons.org/amazonaws/white' },
  { name: 'Vercel', src: 'https://cdn.simpleicons.org/vercel/white' },
  { name: 'React', src: 'https://cdn.simpleicons.org/react/white' },
  { name: 'Figma', src: 'https://cdn.simpleicons.org/figma/white' },
  { name: 'Cloudflare', src: 'https://cdn.simpleicons.org/cloudflare/white' },
  { name: 'GSAP', src: 'https://cdn.simpleicons.org/greensock/white' },
];

const PartnerMarquee: React.FC = () => {
  const seamless = [...logos, ...logos];

  return (
    <div className="w-full max-w-[100vw] overflow-hidden relative border-y border-white/5 py-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee-infinite items-center space-x-16 md:space-x-32 pr-16 md:pr-32">
        {seamless.map((logo, index) => (
          <div key={`${logo.name}-${index}`} className="flex-shrink-0">
            <img
              src={logo.src}
              alt={logo.name}
              className="h-10 md:h-12 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerMarquee;
