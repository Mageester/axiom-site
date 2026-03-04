import React from 'react';
import useReveal from '../hooks/useReveal';

const cardBase =
  'relative overflow-hidden rounded-[1.25rem] border border-[#31363B] border-t border-t-white/10 bg-[#13171B] machined-card transform-gpu transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:-translate-y-2 hover:scale-105 hover:border-[#B05D41]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]';

const revealClass = (isVisible: boolean, delayClass: string) =>
  `${isVisible ? `opacity-100 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] ${delayClass}` : 'opacity-0 translate-y-5'} transform-gpu`;

const BentoGrid: React.FC = () => {
  const visualReveal = useReveal<HTMLDivElement>();
  const strategyReveal = useReveal<HTMLDivElement>();
  const growthReveal = useReveal<HTMLDivElement>();

  return (
    <section className="grid grid-cols-1 gap-6 max-w-7xl mx-auto px-8 py-24 md:grid-cols-3">
      <div ref={visualReveal.ref} className={revealClass(visualReveal.isVisible, 'delay-0')}>
        <article className={`${cardBase} min-h-[420px]`}>
          <img
            src="/images/work-aether.jpg"
            alt="Project Aether cinematic website"
            className="h-[300px] w-full object-cover object-center"
            loading="lazy"
          />
          <div className="p-6">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Visual Engineering</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-[#F2F4F7]">Selected Work</h3>
            <p className="mt-2 text-[#A7B3BC] text-[14px] leading-[1.65]">Defining the standard for high-performance identities.</p>
          </div>
        </article>
      </div>

      <div ref={strategyReveal.ref} className={revealClass(strategyReveal.isVisible, 'delay-100')}>
        <article className={`${cardBase} md:col-span-2 min-h-[420px]`}>
          <img
            src="/images/case-study-1.jpg"
            alt="Strategic Architecture client website"
            className="h-[320px] w-full object-cover object-center"
            loading="lazy"
          />
          <div className="p-6 md:p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Strategic Architecture</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-[#F2F4F7]">Visual Case Studies</h3>
            <p className="mt-2 max-w-3xl text-[#A7B3BC] text-[15px] leading-[1.7]">Cinematic portfolio systems engineered for trust, premium perception, and measurable growth.</p>
          </div>
        </article>
      </div>

      <div ref={growthReveal.ref} className={revealClass(growthReveal.isVisible, 'delay-200')}>
        <article className={`${cardBase} md:col-span-3 min-h-[380px]`}>
          <img
            src="/images/case-study-4.jpg"
            alt="Infrastructure for Growth website showcase"
            className="h-[260px] w-full object-cover object-center"
            loading="lazy"
          />
          <div className="p-6 md:p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Infrastructure for Growth</p>
            <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-[#F2F4F7]">Cinematic Website Systems</h3>
            <p className="mt-2 text-[#A7B3BC] text-[15px] leading-[1.7]">Built to scale visual authority while preserving speed, reliability, and conversion clarity.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BentoGrid;
