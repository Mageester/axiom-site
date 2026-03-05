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
  const duplicatedSets = [0, 1];

  return (
    <section className="w-full overflow-hidden py-6" aria-label="Platform ecosystem">
      <div className="flex w-full items-center overflow-hidden">
        <div className="animate-marquee flex w-max items-center">
          {duplicatedSets.map((setIndex) => (
            <div key={setIndex} className="flex w-max items-center">
              {logos.map((logo) => (
                <div key={`${setIndex}-${logo.name}`} className="mx-8 md:mx-16 flex-shrink-0">
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-12 md:h-16 w-auto object-contain brightness-0 invert opacity-50 transition-opacity duration-300 hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
