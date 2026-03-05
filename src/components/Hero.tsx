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
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] lg:grid-cols-12 lg:gap-0">
          <div className="mt-auto flex h-full flex-col items-start pb-12 text-left lg:col-span-5">
            <div className="relative mb-8">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[#253a7a]/30 blur-[200px]" />
              <div className="relative inline-block px-4 py-1.5 rounded-full bg-[#1c253b] text-[#F59768] text-sm font-semibold tracking-wide border border-[#F59768]/20">
                LIMITED: 2 DEPLOYMENT SLOTS REMAINING FOR Q1
              </div>
            </div>

            <h1 className="mb-10 text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.1] tracking-tight text-[#F2F4F7] md:leading-[1.15]">
              Premium Web Infrastructure for Contractors Ready to Dominate.
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-[1.65] text-slate-300">
              We build sub-second websites with cinematic visuals and bullet-proof conversions for HVAC, Roofing, and Landscaping leaders.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <MagneticWrapper className="inline-flex">
                  <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
                    Let's Start Your Project
                  </button>
                </MagneticWrapper>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1c2e5a]/40 px-3 py-1">
                  <span className="size-2 rounded-full bg-[#F59768] animate-pulse"></span>
                  <span className="text-xs font-medium text-[#F59768] tracking-wider">2 spots left for Q2</span>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToInfrastructure}
                className="group inline-flex items-center text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-[#F2F4F7] hover:underline"
              >
                Explore Infrastructure
              </button>
            </div>
          </div>

          <div className="relative flex w-full items-center justify-center lg:col-span-7">
            <div className="relative w-full lg:w-7/12 perspective-[1000px] [transform:rotateY(-5deg)_rotateX(2deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-all duration-700 ease-out">
              <video autoPlay muted loop playsInline className="w-full aspect-square md:aspect-[4/3] object-cover rounded-3xl drop-shadow-2xl brightness-110 saturate-110 border border-white/10">
                <source src="https://cdn.coverr.co/videos/coverr-abstract-glowing-lines-4552/1080p.mp4" type="video/mp4" />
              </video>
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
