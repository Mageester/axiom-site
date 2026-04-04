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

const marqueeBrands = [...brands, ...brands];

const BrandLogo: React.FC<{ brand: BrandMark }> = ({ brand }) => {
  const Icon = brand.icon;

  return (
    <div
      role="img"
      aria-label={brand.label}
      className="flex-none shrink-0 inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 ease-out hover:text-white"
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
  return (
    <div
      aria-label="Technology partners and tools"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-white/[0.08] bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(7,10,16,0.98))] py-7 md:py-9"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_36%,rgba(212,164,142,0.07),transparent_24%),radial-gradient(circle_at_82%_42%,rgba(255,255,255,0.035),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.01),transparent_14%,transparent_86%,rgba(255,255,255,0.01))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#070a10] to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-[#070a10] to-transparent md:w-24" />

      <div className="relative z-[2] px-5 md:px-8">
        <div className="marquee-shell">
          <div
            className="marquee-track items-center"
            style={{ '--marquee-duration': '18s', '--marquee-gap': 'clamp(2.4rem, 4vw, 4.75rem)' } as React.CSSProperties}
          >
            {marqueeBrands.map((brand, index) => (
              <div
                key={`${brand.label}-${index}`}
                aria-hidden={index >= brands.length}
                className="flex-none shrink-0 py-2 md:py-3"
              >
                <BrandLogo brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
