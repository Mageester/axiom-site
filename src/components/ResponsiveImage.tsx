import React from 'react';
import { ResponsiveSource } from '../lib/responsiveImages';

type ResponsiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  source: ResponsiveSource;
  sizes: string;
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  sizes,
  className,
  loading = 'lazy',
  decoding = 'async',
  ...imgProps
}) => {
  return (
    <picture className="block">
      <source type="image/avif" srcSet={source.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={source.webpSrcSet} sizes={sizes} />
      <img
        src={source.fallbackSrc}
        loading={loading}
        decoding={decoding}
        {...imgProps}
        className={['block', className].filter(Boolean).join(' ')}
      />
    </picture>
  );
};

export default ResponsiveImage;
