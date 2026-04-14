import React from 'react';
import MagneticWrapper from './MagneticWrapper';
import PartnerMarquee from './PartnerMarquee';
import { CTA } from '../lib/cta';

const HERO_VIDEO_SRC = '/assets/axiom-hero.mp4';

const Hero: React.FC = () => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWork = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section data-hero-root className="relative isolate min-h-[90vh] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden bg-[#0a0c10]">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.42)_0%,rgba(10,12,16,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,122,87,0.16),transparent_42%)]" />
      </div>

      <div className="relative z-10 flex min-h-[90vh] flex-col justify-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-12 lg:gap-0">
          <div className="mt-auto flex h-full flex-col items-start pb-12 text-left lg:col-span-5">
            <div className="relative mb-8">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[#253a7a]/30 blur-[200px]" />
              <div className="relative inline-block rounded-full border border-[#F59768]/20 bg-[#1c253b] px-4 py-1.5 text-[15px] md:text-sm font-semibold tracking-wide text-[#F59768]">
                Taking new projects — Ontario-based
              </div>
            </div>

            <div className="mb-10 overflow-hidden min-h-[2.3em] md:min-h-[1.2em]">
              <h1 data-startup-heading className="text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.1] tracking-tight text-[#F2F4F7] md:leading-[1.15]">
                Your website should be bringing you clients.
              </h1>
            </div>

            <p className="mb-8 max-w-lg text-lg leading-[1.65] text-slate-300">
              If it isn’t, it’s working against you. Axiom builds sites for Ontario businesses that are ready to grow — fast, clear, and built to convert.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <MagneticWrapper className="inline-flex">
                  <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
                    {CTA.primary.label}
                  </button>
                </MagneticWrapper>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1c2e5a]/40 px-3 py-1">
                  <span className="size-2 rounded-full bg-[#F59768] animate-pulse"></span>
                  <span className="text-[15px] md:text-xs font-medium tracking-wider text-[#F59768]">Taking projects now</span>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToWork}
                className="group inline-flex min-h-11 items-center justify-center px-1 text-[15px] md:text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-[#F2F4F7] hover:underline"
              >
                {CTA.work.label}
              </button>
            </div>
          </div>

          <div className="relative flex w-full items-center justify-center lg:col-span-7 perspective-[1000px]">
            <div data-glass-card className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(176,93,65,0.15)] transform md:-rotate-y-12 md:rotate-x-6 hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-[#0d1323]" />
              <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_50%_42%,rgba(176,93,65,0.34),transparent_36%),radial-gradient(circle_at_28%_68%,rgba(88,110,170,0.18),transparent_28%),conic-gradient(from_90deg_at_50%_50%,rgba(13,19,35,0.96)_0%,rgba(176,93,65,0.78)_52%,rgba(13,19,35,0.96)_100%)] opacity-55 blur-[80px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
                  <span className="text-white/40 font-bold tracking-widest text-[15px] md:text-sm">AXIOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          <PartnerMarquee />
        </div>
      </div>
    </section>
  );
};

export default Hero;
