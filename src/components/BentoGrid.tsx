import React from 'react';
import useReveal from '../hooks/useReveal';

const cardBase =
  'relative overflow-hidden rounded-[1.25rem] border border-[#31363B] bg-[#13171B] transform-gpu transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:-translate-y-1 hover:scale-[1.02] hover:border-[#B05D41]/60 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3),0_8px_20px_0_rgba(0,0,0,0.6)]';

const revealClass = (isVisible: boolean, delayClass: string) =>
  `${isVisible ? `opacity-100 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] ${delayClass}` : 'opacity-0 translate-y-5'} transform-gpu`;

const BentoGrid: React.FC = () => {
  const workReveal = useReveal<HTMLDivElement>();
  const strategyReveal = useReveal<HTMLDivElement>();
  const showcaseReveal = useReveal<HTMLDivElement>();

  return (
    <section className="grid grid-cols-1 gap-6 max-w-7xl mx-auto px-8 py-24 md:grid-cols-3">
      <div ref={workReveal.ref} className={revealClass(workReveal.isVisible, 'delay-0')}>
        <article className={`${cardBase} min-h-[440px] p-8 md:p-10 flex flex-col justify-between`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Visual Engineering</p>
            <h2 className="text-[#F2F4F7] text-3xl font-black tracking-tight">Selected Work</h2>
            <p className="text-[#A7B3BC] text-[15px] leading-[1.7]">Defining the standard for high-performance identities.</p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0D11]/80 p-3">
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <img
                src="/images/work-aether.jpg"
                alt="Project Aether website showcase"
                className="h-56 w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B]/75 to-transparent" />
              <p className="absolute bottom-3 left-3 font-axiomMono text-[10px] uppercase tracking-[0.22em] text-[#D8B47A]">Project Aether</p>
            </div>
          </div>
        </article>
      </div>

      <div ref={strategyReveal.ref} className={revealClass(strategyReveal.isVisible, 'delay-150')}>
        <article className={`${cardBase} md:col-span-2 min-h-[440px] p-8 md:p-10`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="mb-8 space-y-4 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Strategic Branding</p>
            <h3 className="text-[#F2F4F7] text-3xl md:text-4xl font-black tracking-tight leading-[1.1]">Visual Case Studies</h3>
            <p className="text-[#A7B3BC] text-[16px] leading-[1.75]">Brand systems engineered for visibility, trust, and premium conversion across every high-value vertical.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#0A0D11]/80 p-4 md:col-span-2">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src="/images/case-study-1.jpg"
                  alt="Strategic architecture client website screenshot"
                  className="h-52 w-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B]/70 to-transparent" />
                <p className="absolute bottom-3 left-3 text-[#F2F4F7] text-sm font-semibold tracking-wide">Flagship Client Interface</p>
              </div>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#0A0D11]/80 p-4">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img src="/images/case-study-2.jpg" alt="Luxury commerce case study" className="h-40 w-full object-cover object-center" loading="lazy" />
              </div>
              <p className="mt-3 text-[#F2F4F7] text-sm font-semibold tracking-wide">Luxury Commerce Rebuild</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#0A0D11]/80 p-4">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img src="/images/case-study-3.jpg" alt="Enterprise SaaS positioning case study" className="h-40 w-full object-cover object-center" loading="lazy" />
              </div>
              <p className="mt-3 text-[#F2F4F7] text-sm font-semibold tracking-wide">Enterprise SaaS Positioning</p>
            </article>
          </div>
        </article>
      </div>

      <div ref={showcaseReveal.ref} className={revealClass(showcaseReveal.isVisible, 'delay-300')}>
        <article className={`${cardBase} md:col-span-3 min-h-[320px] p-8 md:p-10`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: 'Luxury Retail Identity', src: '/images/work-aether.jpg' },
              { label: 'B2B Platform Reframe', src: '/images/case-study-1.jpg' },
              { label: 'Premium Service Presence', src: '/images/case-study-2.jpg' },
            ].map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-[#0A0D11]/80 p-4">
                <div className="relative overflow-hidden rounded-xl border border-white/10">
                  <img src={item.src} alt={item.label} className="h-28 w-full object-cover object-center" loading="lazy" />
                </div>
                <p className="mt-3 text-[#A7B3BC] text-[13px] leading-[1.6]">{item.label}</p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default BentoGrid;
