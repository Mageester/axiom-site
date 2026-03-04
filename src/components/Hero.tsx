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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-12">
        <div className="mt-auto flex h-full flex-col items-start pb-12 text-left lg:col-span-5">
          <div className="relative mb-8 opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.8s_ease-out] delay-[100ms]">
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-[#253a7a]/30 blur-[200px]" />
            <div className="relative inline-flex items-center rounded-full bg-[#1c253b] px-4 py-1 text-sm text-[#f08d5f]">
              LIMITED: 2 DEPLOYMENT SLOTS REMAINING FOR Q1
            </div>
          </div>

          <h1 className="mb-10 text-6xl font-black leading-[1.05] tracking-tighter text-[#F2F4F7] opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.8s_ease-out] delay-[300ms] md:text-7xl">
            Web Infrastructure That Elevates Every Industry.
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-[1.65] text-[#A7B3BC] opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.8s_ease-out] delay-[500ms]">
            From luxury e-commerce to complex SaaS, we engineer bespoke websites that combine stunning aesthetics with rock-solid performance.
          </p>

          <div className="flex flex-wrap items-center gap-8 opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.8s_ease-out] delay-[700ms]">
            <MagneticWrapper className="inline-flex">
              <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
                Let's Start Your Project
              </button>
            </MagneticWrapper>

            <button
              type="button"
              onClick={scrollToInfrastructure}
              className="group inline-flex items-center text-[14px] font-medium tracking-wide text-[#A7B3BC] transition-colors hover:text-[#F2F4F7]"
            >
              Explore Infrastructure
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
            </button>
          </div>
        </div>

        <div className="relative flex aspect-square w-full items-center justify-center perspective-[1000px] lg:col-span-7">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[74%] w-[74%] rounded-full bg-[#B05D41]/24 blur-[130px]" />
          </div>

          <div className="relative w-full max-w-[640px] rounded-[32px] border border-white/12 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_42px_90px_-30px_rgba(0,0,0,0.88),0_0_90px_rgba(176,93,65,0.22)] transform-gpu [transform:rotateY(-11deg)_rotateX(6deg)_scale(1.06)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:[transform:rotateY(-7deg)_rotateX(3deg)_scale(1.09)] opacity-0 [animation-fill-mode:forwards] animate-[splash-reveal_0.9s_ease-out] delay-[250ms]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0D11]/80 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D8B47A]">Axiom Monolith</p>
              <span className="rounded-full border border-[#B05D41]/40 bg-[#B05D41]/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#D8B47A]">
                Live
              </span>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-3">
              <article className="col-span-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Signature Work</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#F2F4F7]">Luxury Funnel Blueprint</h3>
                <div className="mt-4 h-24 rounded-xl border border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(176,93,65,0.25),transparent_55%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
              </article>

              <article className="col-span-2 rounded-2xl border border-white/10 bg-[#0A0D11]/85 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">Engagement</p>
                <p className="mt-3 font-mono text-3xl tracking-tight text-[#D8B47A]">+38%</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#A7B3BC]">Qualified demand routed from premium search channels.</p>
              </article>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Velocity', value: 'Sub-second' },
                { label: 'Signal', value: 'High Intent' },
                { label: 'Reliability', value: '99.99%' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/10 bg-[#0A0D11]/80 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A7B3BC]">{metric.label}</p>
                  <p className="mt-1 text-sm font-semibold tracking-tight text-[#F2F4F7]">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
