import React, { useEffect, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { responsiveImages } from '../lib/responsiveImages';

const Preloader: React.FC = () => {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem('axiom-preloader-seen') !== '1';
  });
  const [revealed, setRevealed] = useState(false);
  const [departing, setDeparting] = useState(false);

  useEffect(() => {
    if (!active) return;

    const revealTimer = window.setTimeout(() => setRevealed(true), 40);
    const departTimer = window.setTimeout(() => setDeparting(true), 620);
    const finishTimer = window.setTimeout(() => {
      window.sessionStorage.setItem('axiom-preloader-seen', '1');
      setActive(false);
    }, 980);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(departTimer);
      window.clearTimeout(finishTimer);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[120] bg-black transition-opacity duration-500 ease-out ${departing ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
      aria-hidden
    >
      <ResponsiveImage
        source={responsiveImages.logoClear}
        sizes="(min-width: 768px) 320px, 256px"
        alt=""
        className={`absolute left-1/2 top-1/2 h-40 w-auto object-contain drop-shadow-[0_0_28px_rgba(245,247,250,0.16)] md:h-48 transition-all duration-500 ease-out ${
          departing ? 'scale-95 opacity-0' : revealed ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
        }`}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
};

export default Preloader;
