import React from 'react';
import { ResponsiveSource } from '../lib/responsiveImages';

type ResponsiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  source: ResponsiveSource;
  sizes: string;
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ source, sizes, ...imgProps }) => {
  const { fetchPriority, ...restImgProps } = imgProps;

  return (
    <picture>
      <source type="image/avif" srcSet={source.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={source.webpSrcSet} sizes={sizes} />
      <img
        src={source.fallbackSrc}
        srcSet={source.webpSrcSet}
        sizes={sizes}
        {...restImgProps}
        {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      />
    </picture>
  );
};

export default ResponsiveImage;
