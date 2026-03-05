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
  const seamlessTrack = [...logos, ...logos];

  return (
    <section className="w-full py-6" aria-label="Platform ecosystem">
      <div className="w-full overflow-hidden">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center space-x-16">
          {seamlessTrack.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="mx-8 md:mx-16 flex-shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                className="h-12 md:h-16 w-auto object-contain brightness-0 invert opacity-50 transition-opacity duration-300 hover:opacity-100"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
