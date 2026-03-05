import React from 'react';
import MagneticWrapper from './MagneticWrapper';
import PartnerMarquee from './PartnerMarquee';

const Hero: React.FC = () => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInfrastructure = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="min-h-[90vh]">
      <div className="flex min-h-[90vh] flex-col justify-center">
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-12 lg:gap-0">
          <div className="mt-auto flex h-full flex-col items-start pb-12 text-left lg:col-span-5">
            <div className="relative mb-8 opacity-0 [animation-fill-mode:forwards] animate-[fade-in-up_0.8s_ease-out] delay-[100ms]">
              <div className="pointer-events-none absolute -inset-8 rounded-full bg-[#253a7a]/30 blur-[200px]" />
              <div className="relative inline-block px-4 py-1.5 rounded-full bg-[#1c253b] text-[#f08d5f] text-sm font-semibold tracking-wide border border-[#f08d5f]/20">
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

          <div className="relative flex w-full items-center justify-center lg:col-span-7 opacity-0 [animation-fill-mode:forwards] animate-[splash-reveal_0.9s_ease-out] delay-[250ms]">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-2xl shadow-[0_0_80px_rgba(176,93,65,0.2)] flex items-center justify-center overflow-hidden perspective-[1000px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,93,65,0.4)_0%,transparent_70%)] opacity-50"></div>
              <div className="w-3/4 h-3/4 rounded-2xl border border-white/10 bg-[#0d1323]/80 shadow-2xl transform rotate-y-[-15deg] rotate-x-[10deg] [transform:rotateY(-15deg)_rotateX(10deg)] hover:rotate-y-0 hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-transform duration-700 ease-out flex items-center justify-center">
                <span className="text-white/20 font-bold tracking-widest">AXIOM CORE</span>
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
