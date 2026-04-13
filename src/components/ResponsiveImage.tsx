import React from 'react';
import { fallbackResponsiveImage, type ResponsiveSource } from '../lib/responsiveImages';

type ResponsiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  source?: ResponsiveSource | null;
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
  const imageSource = source ?? fallbackResponsiveImage;

  return (
    <picture className="block">
      <source type="image/avif" srcSet={imageSource.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={imageSource.webpSrcSet} sizes={sizes} />
      <img
        src={imageSource.fallbackSrc}
        loading={loading}
        decoding={decoding}
        {...imgProps}
        className={['block', className].filter(Boolean).join(' ')}
      />
    </picture>
  );
};

export default ResponsiveImage;
