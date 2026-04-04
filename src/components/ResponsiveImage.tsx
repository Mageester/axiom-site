import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveSource } from '../lib/responsiveImages';

type ResponsiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  source: ResponsiveSource;
  sizes: string;
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  sizes,
  onLoad,
  onError,
  className,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setIsLoaded(false);
  }, [source.avifSrcSet, source.webpSrcSet, source.fallbackSrc]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    if (image.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [source.avifSrcSet, source.webpSrcSet, source.fallbackSrc]);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setIsLoaded(true);
    onError?.(event);
  };

  return (
    <span className="relative block overflow-hidden">
      <picture className="block">
        <source type="image/avif" srcSet={source.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={source.webpSrcSet} sizes={sizes} />
        <img
          ref={imageRef}
          src={source.fallbackSrc}
          srcSet={source.webpSrcSet}
          sizes={sizes}
          {...imgProps}
          className={`${className ?? ''} block transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLoaded ? 'opacity-100' : 'opacity-0'}`.trim()}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-white/[0.08] to-white/[0.04] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse motion-reduce:animate-none'
        }`}
      />
    </span>
  );
};

export default ResponsiveImage;
