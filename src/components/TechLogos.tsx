import React from 'react';
import { SiCloudflare, SiReact, SiTailwindcss, SiVite } from 'react-icons/si';

type TechLogo = {
  name: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
};

const techLogos: TechLogo[] = [
  { name: 'Cloudflare', Icon: SiCloudflare },
  { name: 'React', Icon: SiReact },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'Vite', Icon: SiVite },
];

const marqueeTechLogos = [...techLogos, ...techLogos];

const TechLogos: React.FC = () => {
  return (
    <section aria-label="Built with technology logos" className="py-12">
      <p className="text-center font-axiomMono text-[9px] uppercase tracking-[0.14em] text-[#A7B3BC]">BUILT WITH</p>
      <div className="logo-marquee-shell mt-5">
        <div className="logo-marquee-viewport">
          <div
            className="logo-marquee-track items-center"
            style={{ '--marquee-duration': '34s', '--marquee-gap': '2.5rem' } as React.CSSProperties}
          >
            {marqueeTechLogos.map(({ name, Icon }, index) => (
              <div key={`${name}-${index}`} className="logo-marquee-item" aria-hidden={index >= techLogos.length}>
                <span className="inline-flex items-center justify-center gap-10">
                  <Icon
                    aria-hidden="true"
                    className="h-7 w-7 brightness-0 invert opacity-30 transition-opacity duration-200 hover:opacity-60"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechLogos;
