import React, { useEffect, useMemo, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { responsiveImages } from '../lib/responsiveImages';

type PreloaderProps = {
  targetRef: React.RefObject<HTMLElement>;
};

const Preloader: React.FC<PreloaderProps> = ({ targetRef }) => {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem('axiom-preloader-seen') !== '1';
  });
  const [revealed, setRevealed] = useState(false);
  const [departing, setDeparting] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const revealTimer = window.setTimeout(() => setRevealed(true), 24);

    const departTimer = window.setTimeout(() => {
      const target = targetRef.current?.getBoundingClientRect();
      if (target) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetX = target.left + target.width / 2;
        const targetY = target.top + target.height / 2;
        setOffset({ x: targetX - centerX, y: targetY - centerY });
      }
      setDeparting(true);
    }, 950);

    const finishTimer = window.setTimeout(() => {
      window.sessionStorage.setItem('axiom-preloader-seen', '1');
      setActive(false);
    }, 1820);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(departTimer);
      window.clearTimeout(finishTimer);
    };
  }, [active, targetRef]);

  const logoStyle = useMemo(() => {
    const scale = departing ? 0.68 : revealed ? 1 : 1.08;
    const opacity = departing ? 0.92 : revealed ? 1 : 0;
    const yLift = departing ? -4 : revealed ? 0 : 12;
    const translate = departing ? `translate3d(${offset.x}px, ${offset.y + yLift}px, 0)` : `translate3d(0, ${yLift}px, 0)`;

    return {
      opacity,
      willChange: 'transform, opacity',
      transform: `translate(-50%, -50%) ${translate} scale(${scale})`,
      transition: 'transform 880ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease-out',
    } as React.CSSProperties;
  }, [departing, offset.x, offset.y, revealed]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[120] bg-black transition-opacity duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${departing ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
      aria-hidden
    >
      <ResponsiveImage
        source={responsiveImages.logoClear}
        sizes="(min-width: 768px) 320px, 256px"
        alt="Axiom Infrastructure logo"
        className="absolute left-1/2 top-1/2 h-40 w-auto object-contain drop-shadow-[0_0_34px_rgba(245,247,250,0.16)] md:h-48"
        style={logoStyle}
        decoding="async"
      />
    </div>
  );
};

export default Preloader;
