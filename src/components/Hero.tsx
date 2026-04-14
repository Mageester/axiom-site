import React from 'react';
import MagneticWrapper from './MagneticWrapper';
import PartnerMarquee from './PartnerMarquee';

const Hero: React.FC = () => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWork = () => {
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section data-hero-root className="relative isolate min-h-[90vh] overflow-hidden bg-[#0a0c10]">
      <div className="relative z-10 flex min-h-[90vh] flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-8 lg:px-12">
          <div className="max-w-5xl text-left">
            <div className="mb-10 overflow-hidden min-h-[2.3em] md:min-h-[1.2em]">
              <h1 data-startup-heading className="text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.1] tracking-tight text-[#F2F4F7] md:leading-[1.15]">
                Your website should be bringing you clients.
              </h1>
            </div>

            <p className="mb-8 max-w-lg text-lg leading-[1.65] text-slate-300">
              If it isn’t, it’s working against you. Axiom builds sites for Ontario businesses that are ready to grow — fast, clear, and built to convert.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <MagneticWrapper className="inline-flex">
                <button type="button" onClick={scrollToIntake} className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </button>
              </MagneticWrapper>

              <button
                type="button"
                onClick={scrollToWork}
                className="btn-secondary btn-lg whitespace-nowrap"
              >
                See our work
              </button>
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
