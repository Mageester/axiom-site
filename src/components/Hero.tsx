import React from 'react';
import MagneticWrapper from './MagneticWrapper';

const Hero: React.FC = () => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInfrastructure = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="min-h-[90vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto px-8 w-full relative z-10 items-center">
        <div className="lg:col-span-5 h-full flex flex-col items-start text-left mt-auto pb-12">
          <div className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-0 ticker-shimmer inline-flex items-center rounded-full px-3 py-1 text-xs bg-[#111]/80 border border-white/20 text-[#E4572E] mb-8 uppercase tracking-[0.12em] font-mono">
            RESERVED: 2 MORE Q1 SLOTS AVAILABLE
          </div>

          <h1 className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-150 text-6xl md:text-7xl font-black text-[#F5F7FA] leading-[1.05] tracking-tighter mb-10">
            Orchestrating Digital Authority
          </h1>

          <p className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-300 text-[#A7B3BC] text-lg max-w-lg leading-[1.65] mb-8">
            Engineering high-performance conversion geometry that turns demand into qualified deployment slots.
          </p>

          <div className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-500 flex flex-wrap items-center gap-8">
            <MagneticWrapper className="inline-flex">
              <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
                Book a Strategy Call
              </button>
            </MagneticWrapper>

            <button
              type="button"
              onClick={scrollToInfrastructure}
              className="group inline-flex items-center text-[#A7B3BC] text-[14px] font-medium tracking-wide hover:text-[#F5F7FA] transition-colors"
            >
              Explore Infrastructure
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 relative w-full aspect-square flex items-center justify-center perspective-[1000px]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[72%] w-[72%] rounded-full bg-[#E4572E]/15 blur-[120px]" />
          </div>

          <div className="relative w-full max-w-[620px] transform-gpu [transform:rotateY(-12deg)_rotateX(8deg)_scale(1.1)] rounded-3xl border border-[#31363B] bg-[#13171B]/92 p-10 md:p-12 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_80px_rgba(228,87,46,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:[transform:rotateY(-8deg)_rotateX(4deg)_scale(1.12)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />

            <div className="relative flex h-full min-h-[340px] flex-col justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Processor Core</p>

              <div className="relative rounded-2xl border border-[#31363B] bg-[#090A0B] p-5 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-[#E4572E]/35 blur-3xl animate-pulse" />
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#31363B] bg-[#13171B] p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Latency</p>
                    <p className="mt-1 font-mono text-lg tracking-tight text-[#E4572E]">0.38s</p>
                  </div>
                  <div className="rounded-xl border border-[#31363B] bg-[#13171B] p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Uptime</p>
                    <p className="mt-1 font-mono text-lg tracking-tight text-[#E4572E]">99.99%</p>
                  </div>
                  <div className="rounded-xl border border-[#31363B] bg-[#13171B] p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Scale</p>
                    <p className="mt-1 font-mono text-lg tracking-tight text-[#E4572E]">Elastic</p>
                  </div>
                  <div className="rounded-xl border border-[#31363B] bg-[#13171B] p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Signal</p>
                    <p className="mt-1 font-mono text-lg tracking-tight text-[#E4572E]">LIVE</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#31363B] bg-gradient-to-r from-[#090A0B] via-[#13171B] to-[#090A0B] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] mb-2">Processing Array</p>
                <div className="h-2 rounded-full bg-[#31363B] overflow-hidden">
                  <div className="h-full w-[84%] bg-[#E4572E] shadow-[0_0_16px_rgba(228,87,46,0.45)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
