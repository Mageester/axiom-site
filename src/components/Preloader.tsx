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
    }, 1500);

    const finishTimer = window.setTimeout(() => setActive(false), 2350);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(departTimer);
      window.clearTimeout(finishTimer);
    };
  }, [active, targetRef]);

  const logoStyle = useMemo(() => {
    const scale = departing ? 0.34 : revealed ? 1 : 1.1;
    const opacity = departing ? 0 : revealed ? 1 : 0;
    const blur = departing ? 1 : revealed ? 0 : 20;
    const translate = departing ? `translate3d(${offset.x}px, ${offset.y}px, 0)` : 'translate3d(0, 0, 0)';

    return {
      opacity,
      filter: `blur(${blur}px)`,
      transform: `translate(-50%, -50%) ${translate} scale(${scale})`,
      transition: 'transform 800ms cubic-bezier(0.2, 0.8, 0.4, 1), opacity 800ms ease, filter 800ms ease',
    } as React.CSSProperties;
  }, [departing, offset.x, offset.y, revealed]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[120] bg-[#090A0B] transition-opacity duration-700 ${departing ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      aria-hidden
    >
      <img
        src="/logo.png"
        alt=""
        className="absolute left-1/2 top-1/2 h-28 w-auto md:h-36 object-contain drop-shadow-[0_0_48px_rgba(245,247,250,0.2)]"
        style={logoStyle}
      />
    </div>
  );
};

export default Preloader;
