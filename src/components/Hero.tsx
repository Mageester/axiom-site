import React from 'react';

const Hero: React.FC = () => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInfrastructure = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="min-h-[90vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 w-full relative z-10 items-center">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E4572E]/40 bg-[#E4572E]/10 px-3 py-1 text-[10px] font-mono tracking-[0.2em] text-[#E4572E] mb-8 uppercase">
            Operator Status: Online
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-[#F5F7FA] leading-[1.05] tracking-tighter mb-6 text-left">
            Engineering Digital Authority.
          </h1>

          <p className="text-[#A7B3BC] text-lg max-w-lg mb-10 text-left leading-[1.65]">
            Build a high-performance infrastructure layer designed to scale demand, protect trust, and convert intent with precision.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
              Book a Strategy Call
            </button>
            <button
              type="button"
              onClick={scrollToInfrastructure}
              className="text-[#A7B3BC] text-[14px] font-medium tracking-wide hover:text-[#F5F7FA] transition-colors"
            >
              Explore Infrastructure -&gt;
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[70%] w-[70%] rounded-full bg-[#E4572E]/15 blur-[120px]" />
          </div>

          <div className="axiom-bento w-full max-w-[560px] p-10 md:p-12 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-20px_rgba(0,0,0,0.85)] border border-[#31363B] bg-[#13171B]/90 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
            <div className="relative flex h-full min-h-[320px] flex-col justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Infrastructure Core</p>

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
