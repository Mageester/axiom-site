import React, { useEffect, useMemo, useState } from 'react';

type PreloaderProps = {
  targetRef: React.RefObject<HTMLElement>;
};

const Preloader: React.FC<PreloaderProps> = ({ targetRef }) => {
  const [active, setActive] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [departing, setDeparting] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const revealTimer = window.setTimeout(() => setRevealed(true), 40);

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
    }, 1600);

    const finishTimer = window.setTimeout(() => setActive(false), 3200);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(departTimer);
      window.clearTimeout(finishTimer);
    };
  }, [active, targetRef]);

  const logoStyle = useMemo(() => {
    const scale = departing ? 0.5 : revealed ? 1 : 12;
    const opacity = departing ? 0.98 : revealed ? 1 : 0;
    const blur = departing ? 0 : revealed ? 0 : 96;
    const yLift = departing ? -8 : revealed ? 0 : 22;
    const translate = departing ? `translate3d(${offset.x}px, ${offset.y + yLift}px, 0)` : `translate3d(0, ${yLift}px, 0)`;

    return {
      opacity,
      filter: `blur(${blur}px)`,
      willChange: 'transform, opacity, filter',
      transform: `translate(-50%, -50%) ${translate} scale(${scale})`,
      transition: 'transform 1350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease-out, filter 900ms ease-out',
    } as React.CSSProperties;
  }, [departing, offset.x, offset.y, revealed]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[120] bg-black transition-opacity duration-[1100ms] ease-out ${departing ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
      aria-hidden
    >
      <img
        src="/photos/logoclear.png"
        alt=""
        className="absolute left-1/2 top-1/2 h-40 w-auto object-contain drop-shadow-[0_0_48px_rgba(245,247,250,0.2)] md:h-48"
        style={logoStyle}
      />
    </div>
  );
};

export default Preloader;
