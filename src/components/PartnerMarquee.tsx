import React from 'react';

type PartnerLogo = {
  name: string;
  src: string;
};

const logos: PartnerLogo[] = [
  { name: 'Vercel', src: '/partners/vercel.svg' },
  { name: 'AWS', src: '/partners/aws.svg' },
  { name: 'Cloudflare', src: '/partners/cloudflare.svg' },
  { name: 'React', src: '/partners/react.svg' },
  { name: 'GSAP', src: '/partners/gsap.svg' },
];

const PartnerMarquee: React.FC = () => {
  const track = [...logos, ...logos, ...logos];

  return (
    <section className="w-full overflow-hidden py-6" aria-label="Platform ecosystem">
      <div className="flex w-full items-center overflow-hidden">
        <div className="animate-logo-cloud flex w-max items-center gap-6 px-6">
          {track.map((logo, index) => (
            <img
              key={`${logo.name}-${index}`}
              src={logo.src}
              alt={logo.name}
              className="h-7 w-7 brightness-0 invert opacity-50 transition-opacity duration-300 hover:opacity-100 md:h-8 md:w-8"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
