import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (heroBgRef.current) {
          const y = Math.min(window.scrollY * 0.1, 84);
          heroBgRef.current.style.transform = `translate3d(0, ${y}px, 0) scale(1.08)`;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="-mx-6 md:-mx-10 xl:-mx-20 relative min-h-[84vh] overflow-hidden px-6 md:px-10 xl:px-20">
      <div
        ref={heroBgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url('/roofing-concept.webp')",
          transform: 'translate3d(0,0,0) scale(1.08)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,10,11,0.22)_0%,rgba(9,10,11,0.74)_58%,rgba(9,10,11,0.96)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-axiom-base/58 via-axiom-base/20 to-axiom-base/82" />

      <div className="relative z-10 mx-auto flex min-h-[84vh] w-full max-w-[1160px] items-center justify-center py-20 md:py-28">
        <div className="relative mx-auto max-w-[980px] text-center">
          <div className="pointer-events-none absolute left-1/2 top-[44%] h-[300px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-axiom-accent/15 blur-[120px] [mask-image:radial-gradient(circle,black_54%,transparent_100%)]" />

          <p className="relative font-axiomMono text-[11px] uppercase tracking-[0.28em] text-axiom-text-mute">
            OPERATOR STATUS: INFRASTRUCTURE COMMAND ONLINE
          </p>

          <h1 className="hero-fade-in relative mt-6 font-axiomSans text-[44px] font-black leading-[0.93] tracking-[-0.045em] text-axiom-text-main sm:text-[58px] md:text-[74px] lg:text-[84px]">
            The Front Gate to Your Market.
          </h1>

          <p
            className="hero-fade-in relative mx-auto mt-8 max-w-[760px] text-[18px] leading-[1.6] text-axiom-text-mute md:text-[20px]"
            style={{ animationDelay: '0.38s' }}
          >
            Command premium calls with engineered web infrastructure built to convert demand spikes into qualified, high-ticket opportunities.
          </p>

          <div className="relative mt-14 flex justify-center py-6 md:mt-16 md:py-8">
            <Link to="/contact" className="btn-primary btn-lg magnetic-primary hero-primary-cta whitespace-nowrap px-10 md:px-12">
              Book a Strategy Call
            </Link>
          </div>

          <p className="relative mt-2 text-[12px] text-axiom-text-mute">
            Custom engagements start at <span className="font-semibold text-axiom-text-main">$7,500</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
