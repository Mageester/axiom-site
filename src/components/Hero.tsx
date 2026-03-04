import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      const el = ctaRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      const radius = 50;
      const maxShift = 5;

      if (distance < radius && distance > 0.01) {
        const pull = ((radius - distance) / radius) * maxShift;
        setMagnetic({
          x: (dx / distance) * pull,
          y: (dy / distance) * pull,
        });
      } else {
        setMagnetic({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#090A0B] px-6 py-28 sm:px-10 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(112deg, rgba(245,247,250,0.12) 0px, rgba(245,247,250,0.12) 1px, transparent 1px, transparent 14px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 18%, rgba(245,247,250,0.3) 0.5px, transparent 0.5px), radial-gradient(circle at 78% 76%, rgba(245,247,250,0.26) 0.5px, transparent 0.5px)',
          backgroundSize: '3px 3px, 4px 4px',
          backgroundPosition: '0 0, 1px 1px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(9,10,11,0.1) 0%, rgba(9,10,11,0.64) 58%, rgba(9,10,11,0.94) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E4572E] opacity-20 blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.28em] text-[#A7B3BC]">
          OPERATOR STATUS: INFRASTRUCTURE COMMAND ONLINE
        </p>

        <h1 className="mx-auto mt-8 max-w-5xl text-6xl font-black leading-none tracking-[-0.045em] text-[#F5F7FA] md:text-8xl">
          The Front Gate to Your Market.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.65] text-[#A7B3BC] md:text-[20px]">
          Command premium calls with engineered web infrastructure built to convert demand spikes into qualified, high-ticket opportunities.
        </p>

        <div className="mt-14 flex justify-center md:mt-16">
          <button
            ref={ctaRef}
            type="button"
            onClick={() => navigate('/contact')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setMagnetic({ x: 0, y: 0 });
            }}
            className="group relative inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-[#E4572E]/70 bg-[#E4572E] px-8 text-[15px] font-semibold text-[#F5F7FA] transition-[box-shadow,filter] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0B] active:translate-y-[1px]"
            style={{
              transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0) scale(${hovered ? 1.05 : 1})`,
              transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease, filter 220ms ease',
              boxShadow:
                'inset 0 1px 0 rgba(245,247,250,0.25), 0 0 0 1px rgba(228,87,46,0.35), 0 14px 34px rgba(228,87,46,0.32)',
            }}
          >
            <span className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(245,247,250,0.16)_0%,rgba(245,247,250,0)_42%)]" />
            <span className="relative">Book a Strategy Call</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
