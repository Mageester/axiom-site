import React from 'react';
import {
  SiReact,
  SiHotjar,
  SiFigma,
  SiGreensock,
  SiNotion,
  SiVercel,
  SiSimpleicons as SiAmazonwebservices,
} from 'react-icons/si';

type Brand = {
  name: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const brands: Brand[] = [
  { name: 'React', Icon: SiReact },
  { name: 'Hotjar', Icon: SiHotjar },
  { name: 'Figma', Icon: SiFigma },
  { name: 'GSAP', Icon: SiGreensock },
  { name: 'Notion', Icon: SiNotion },
  { name: 'Vercel', Icon: SiVercel },
  { name: 'AWS', Icon: SiAmazonwebservices },
];

const PartnerMarquee: React.FC = () => {
  const track = [...brands, ...brands];

  return (
    <section aria-label="Platform ecosystem">
      <div className="w-full max-w-[100vw] overflow-hidden relative border-y border-white/5 py-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee-infinite hover:[animation-play-state:paused] items-center space-x-16 md:space-x-32 pr-16 md:pr-32">
          {track.map(({ name, Icon }, index) => (
            <div
              key={`${name}-${index}`}
              className="flex items-center space-x-3 opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer flex-shrink-0"
            >
              <Icon size={32} className="text-white md:[&]:size-9" />
              <span className="text-2xl md:text-3xl font-semibold tracking-tight text-white">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
