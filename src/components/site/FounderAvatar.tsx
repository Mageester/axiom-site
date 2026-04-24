import React from 'react';
import type { ResponsiveSource } from '../../lib/responsiveImages';

type FounderAvatarProps = {
  alt?: string;
  initials: string;
  source?: ResponsiveSource;
  name: string;
  className?: string;
};

const AVATAR_SIZES = '(min-width: 768px) 96px, 80px';

const FounderAvatar: React.FC<FounderAvatarProps> = ({ alt, initials, source, name, className = '' }) => {
  const shellClass = [
    'relative block h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,38,0.98)_0%,rgba(10,13,19,1)_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:h-24 md:w-24',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!source) {
    return (
      <div className={shellClass} aria-label={name}>
        <div className="flex h-full w-full items-center justify-center text-[1.55rem] font-semibold tracking-normal text-[#d4a48e]">
          {initials}
        </div>
      </div>
    );
  }

  return (
    <picture className={shellClass}>
      <source type="image/avif" srcSet={source.avifSrcSet} sizes={AVATAR_SIZES} />
      <source type="image/webp" srcSet={source.webpSrcSet} sizes={AVATAR_SIZES} />
      <img
        src={source.fallbackSrc}
        alt={alt || `${name} portrait`}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};

export default FounderAvatar;
