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
        <div className="lg:col-span-5 h-full flex flex-col items-start mt-auto pb-12">
          <div className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-0 inline-flex items-center gap-2 rounded-full border border-[#E4572E]/40 bg-[#E4572E]/10 px-3 py-1 text-[10px] font-mono tracking-[0.2em] text-[#E4572E] mb-8 uppercase">
            Operator Status: Online
          </div>

          <h1 className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-150 text-6xl md:text-7xl font-black text-[#F5F7FA] leading-[1.05] tracking-tighter text-left mb-10">
            Engineering Digital Authority.
          </h1>

          <p className="opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] delay-300 text-[#A7B3BC] text-lg max-w-lg text-left leading-[1.65] mb-8">
            Build a high-performance infrastructure layer designed to scale demand, protect trust, and convert intent with precision.
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

        <div className="lg:col-span-7 relative w-full aspect-square flex items-center justify-center perspective-[1000px] scale-110">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[70%] w-[70%] rounded-full bg-[#E4572E]/15 blur-[120px]" />
          </div>

          <div className="relative w-full max-w-[600px] rounded-3xl border border-[#31363B] bg-[#13171B]/90 p-10 md:p-12 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_80px_0_rgba(228,87,46,0.3)] [transform:rotateY(12deg)_rotateX(5deg)] hover:[transform:rotateY(-8deg)_rotateX(4deg)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.4,1)] transform-gpu">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
            <div className="relative flex h-full min-h-[320px] flex-col justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Processor Core</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#31363B] bg-[#090A0B] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Latency</p>
                  <p className="mt-2 font-mono text-2xl tracking-tight text-[#E4572E]">0.38s</p>
                </div>
                <div className="rounded-2xl border border-[#31363B] bg-[#090A0B] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Uptime</p>
                  <p className="mt-2 font-mono text-2xl tracking-tight text-[#E4572E]">99.99%</p>
                </div>
                <div className="rounded-2xl border border-[#31363B] bg-[#090A0B] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Coverage</p>
                  <p className="mt-2 font-mono text-2xl tracking-tight text-[#E4572E]">300+</p>
                </div>
                <div className="rounded-2xl border border-[#31363B] bg-[#090A0B] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Signal</p>
                  <p className="mt-2 font-mono text-2xl tracking-tight text-[#E4572E]">LIVE</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#31363B] bg-gradient-to-r from-[#090A0B] via-[#13171B] to-[#090A0B] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] mb-2">Processing Array</p>
                <div className="h-2 rounded-full bg-[#31363B] overflow-hidden">
                  <div className="h-full w-[82%] bg-[#E4572E] shadow-[0_0_16px_rgba(228,87,46,0.4)]" />
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
