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
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'hotjar',
    wordmarkClassName: 'font-axiomDisplay text-[1.4rem] font-semibold tracking-[-0.05em] text-white/[0.68] md:text-[1.65rem]',
  },
  {
    label: 'blender',
    icon: SiBlender,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'blender',
    wordmarkClassName: 'font-axiomDisplay text-[1.34rem] font-semibold tracking-[-0.05em] text-white/[0.68] md:text-[1.58rem]',
  },
  {
    label: 'figma',
    icon: SiFigma,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'Figma',
    wordmarkClassName: 'font-axiomDisplay text-[1.38rem] font-semibold tracking-[-0.045em] text-white/[0.7] md:text-[1.62rem]',
  },
  {
    label: 'hostinger',
    icon: SiHostinger,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'HOSTINGER',
    wordmarkClassName: 'font-axiomMono text-[0.84rem] font-medium uppercase tracking-[0.2em] text-white/[0.62] md:text-[0.92rem]',
  },
  {
    label: 'gsap',
    icon: SiGsap,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'GSAP',
    wordmarkClassName: 'font-axiomDisplay text-[1.42rem] font-semibold tracking-[-0.06em] text-white/[0.72] md:text-[1.7rem]',
  },
  {
    label: 'notion',
    icon: SiNotion,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'Notion',
    wordmarkClassName: 'font-axiomDisplay text-[1.38rem] font-semibold tracking-[-0.045em] text-white/[0.7] md:text-[1.62rem]',
  },
  {
    label: 'vercel',
    icon: SiVercel,
    iconClassName: 'h-6 w-6 md:h-7 md:w-7',
    wordmark: 'Vercel',
    wordmarkClassName: 'font-axiomDisplay text-[1.38rem] font-semibold tracking-[-0.045em] text-white/[0.7] md:text-[1.62rem]',
  },
  {
    label: 'aws',
    asset: '/partners/aws.svg',
    assetClassName: 'h-7 w-auto brightness-0 invert opacity-65 md:h-8',
  },
];

const marqueeBrands = [...brands, ...brands];

const BrandLogo: React.FC<{ brand: BrandMark }> = ({ brand }) => {
  const Icon = brand.icon;

  return (
    <div
      role="img"
      aria-label={brand.label}
      className="inline-flex h-10 flex-none shrink-0 items-center gap-2.5 text-white/60 transition-colors duration-300 ease-out hover:text-white/80 md:h-12"
    >
      {brand.asset ? (
        <img src={brand.asset} alt="" aria-hidden="true" className={brand.assetClassName} />
      ) : (
        <>
          {Icon ? <Icon aria-hidden="true" className={`shrink-0 text-white/[0.62] ${brand.iconClassName ?? ''}`} /> : null}
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
      className="logo-marquee-panel"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_36%,rgba(212,164,142,0.07),transparent_24%),radial-gradient(circle_at_82%_42%,rgba(255,255,255,0.03),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.01),transparent_14%,transparent_86%,rgba(255,255,255,0.01))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-14 bg-gradient-to-r from-[#0b1018] via-[#0b1018]/94 to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 bg-gradient-to-l from-[#0b1018] via-[#0b1018]/94 to-transparent md:w-20" />

      <div className="logo-marquee-viewport">
        <div className="logo-marquee-shell">
          <div
            className="logo-marquee-track items-center"
            style={{ '--marquee-duration': '22s', '--marquee-gap': 'clamp(1.9rem, 3vw, 3.4rem)' } as React.CSSProperties}
          >
            {marqueeBrands.map((brand, index) => (
              <div
                key={`${brand.label}-${index}`}
                aria-hidden={index >= brands.length}
                className="logo-marquee-item"
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
