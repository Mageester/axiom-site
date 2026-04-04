import React from 'react';
import type { IconType } from 'react-icons';
import { SiBlender, SiFigma, SiGsap, SiHotjar, SiHostinger, SiNotion, SiVercel } from 'react-icons/si';

type BrandMark = {
  label: string;
  icon?: IconType;
  iconClassName?: string;
  wordmark?: string;
  wordmarkClassName?: string;
  asset?: string;
  assetClassName?: string;
};

const brands: BrandMark[] = [
  {
    label: 'hotjar',
    icon: SiHotjar,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'hotjar',
    wordmarkClassName: 'font-axiomDisplay text-[1.55rem] font-semibold tracking-[-0.05em] text-white/[0.78] md:text-[1.8rem]',
  },
  {
    label: 'blender',
    icon: SiBlender,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'blender',
    wordmarkClassName: 'font-axiomDisplay text-[1.45rem] font-semibold tracking-[-0.05em] text-white/[0.78] md:text-[1.7rem]',
  },
  {
    label: 'figma',
    icon: SiFigma,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'Figma',
    wordmarkClassName: 'font-axiomDisplay text-[1.5rem] font-semibold tracking-[-0.045em] text-white/[0.8] md:text-[1.75rem]',
  },
  {
    label: 'hostinger',
    icon: SiHostinger,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'HOSTINGER',
    wordmarkClassName: 'font-axiomMono text-[0.92rem] font-medium uppercase tracking-[0.22em] text-white/[0.72] md:text-[1rem]',
  },
  {
    label: 'gsap',
    icon: SiGsap,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'GSAP',
    wordmarkClassName: 'font-axiomDisplay text-[1.55rem] font-semibold tracking-[-0.06em] text-white/[0.82] md:text-[1.85rem]',
  },
  {
    label: 'notion',
    icon: SiNotion,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'Notion',
    wordmarkClassName: 'font-axiomDisplay text-[1.5rem] font-semibold tracking-[-0.045em] text-white/[0.8] md:text-[1.75rem]',
  },
  {
    label: 'vercel',
    icon: SiVercel,
    iconClassName: 'h-7 w-7 md:h-8 md:w-8',
    wordmark: 'Vercel',
    wordmarkClassName: 'font-axiomDisplay text-[1.5rem] font-semibold tracking-[-0.045em] text-white/[0.8] md:text-[1.75rem]',
  },
  {
    label: 'aws',
    asset: '/partners/aws.svg',
    assetClassName: 'h-8 w-auto brightness-0 invert opacity-80 md:h-10',
  },
];

const BrandLogo: React.FC<{ brand: BrandMark }> = ({ brand }) => {
  const Icon = brand.icon;

  return (
    <div
      role="img"
      aria-label={brand.label}
      className="inline-flex shrink-0 items-center gap-2.5 text-white/80 transition-colors duration-300 ease-out hover:text-white"
    >
      {brand.asset ? (
        <img src={brand.asset} alt="" aria-hidden="true" className={brand.assetClassName} />
      ) : (
        <>
          {Icon ? <Icon aria-hidden="true" className={`shrink-0 text-white/[0.76] ${brand.iconClassName ?? ''}`} /> : null}
          {brand.wordmark ? (
            <span className={`whitespace-nowrap ${brand.wordmarkClassName ?? 'font-axiomDisplay text-[1.5rem] font-semibold tracking-[-0.05em] text-white/80'}`}>
              {brand.wordmark}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
};

const BrandCarousel: React.FC = () => {
  const segment = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(8,12,20,0.98),rgba(8,10,16,0.96))] px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.26)] md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(212,164,142,0.08),transparent_28%),radial-gradient(circle_at_82%_48%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(to_right,rgba(255,255,255,0.01),transparent_18%,transparent_82%,rgba(255,255,255,0.01))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080c14] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080c14] to-transparent md:w-28" />

      <div className="marquee-shell relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="marquee-track items-center"
          style={{ '--marquee-duration': '38s', '--marquee-gap': '3.5rem' } as React.CSSProperties}
        >
          {[0, 1].map((segmentIndex) => (
            <div key={segmentIndex} aria-hidden={segmentIndex === 1} className="marquee-segment py-3 md:py-4">
              {segment.map((brand, index) => (
                <BrandLogo key={`${segmentIndex}-${brand.label}-${index}`} brand={brand} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
