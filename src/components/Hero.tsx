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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:gap-0 px-8 lg:grid-cols-12">
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

          <div className="relative w-full max-w-[760px] overflow-hidden rounded-[32px] border border-white/10 machined-card transform-gpu [transform:rotateY(-9deg)_rotateX(4deg)_scale(1.04)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:[transform:rotateY(-5deg)_rotateX(2deg)_scale(1.07)] opacity-0 [animation-fill-mode:forwards] animate-[splash-reveal_0.9s_ease-out] delay-[250ms] shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
            <img
              src="/images/hero-chip.jpg"
              alt="Cinematic 3D processor hardware"
              className="h-[520px] w-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B]/65 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
