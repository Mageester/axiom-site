import React from 'react';
import useReveal from '../hooks/useReveal';

const cardBase =
  'relative overflow-hidden rounded-[1.25rem] border border-[#31363B] bg-[#13171B] transform-gpu transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.4,1)] hover:-translate-y-1 hover:scale-[1.02] hover:border-[#E4572E]/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3),0_8px_20px_0_rgba(0,0,0,0.6)]';

const revealClass = (isVisible: boolean, delayClass: string) =>
  `${isVisible ? `opacity-100 [animation-fill-mode:forwards] animate-[fade-in-up_0.6s_ease-out] ${delayClass}` : 'opacity-0 translate-y-5'} transform-gpu`;

const BentoGrid: React.FC = () => {
  const anchorReveal = useReveal<HTMLDivElement>();
  const deepDiveReveal = useReveal<HTMLDivElement>();
  const graphReveal = useReveal<HTMLDivElement>();
  const conversionReveal = useReveal<HTMLDivElement>();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 py-24">
      <div ref={anchorReveal.ref} className={revealClass(anchorReveal.isVisible, 'delay-0')}>
        <article className={`${cardBase} md:col-span-2 min-h-[440px] p-12 flex flex-col justify-between`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="space-y-6 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Performance Core</p>
            <h2 className="text-[#F5F7FA] text-4xl md:text-5xl font-black tracking-tighter leading-[1.04]">
              A Command Surface For Scale, Speed, And Authority
            </h2>
            <p className="text-[#A7B3BC] text-[17px] leading-[1.7] max-w-2xl">
              The anchor layer orchestrates performance architecture, preserving signal quality and conversion momentum under load.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-[#31363B] bg-[#090A0B] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] mb-4">Data Array</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Signal', value: 'LIVE' },
                { label: 'Latency', value: '0.38s' },
                { label: 'Scale', value: 'Elastic' },
                { label: 'Uptime', value: '99.99%' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#31363B] bg-[#13171B] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A7B3BC]">{item.label}</p>
                  <p className="mt-1 font-mono text-lg tracking-tight text-[#E4572E]">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#31363B]">
              <div className="h-full w-[84%] bg-[#E4572E] shadow-[0_0_16px_rgba(228,87,46,0.45)]" />
            </div>
          </div>
        </article>
      </div>

      <div ref={deepDiveReveal.ref} className={revealClass(deepDiveReveal.isVisible, 'delay-150')}>
        <article className={`${cardBase} md:row-span-2 min-h-[736px] p-10 flex flex-col justify-between items-start md:translate-x-[8.333333%]`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Deep-Dive Series</p>
            <h3 className="text-[#F5F7FA] text-3xl font-black tracking-tight leading-tight">Infrastructure Case Studies</h3>
            <p className="text-[#A7B3BC] text-[15px] leading-[1.7]">
              Long-form architecture breakdowns showing how premium systems move from static presence to controlled growth engines.
            </p>
          </div>

          <div className="w-full space-y-3">
            {['Performance Stack Audit', 'Conversion Flow Mapping', 'Authority Layer Deployment'].map((item) => (
              <div key={item} className="w-full rounded-xl border border-[#31363B] bg-[#090A0B] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div ref={graphReveal.ref} className={revealClass(graphReveal.isVisible, 'delay-300')}>
        <article className={`${cardBase} min-h-[360px] p-10 md:translate-x-[8.333333%]`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="h-full flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Status Graph</p>
              <h3 className="mt-4 text-[#F5F7FA] text-2xl font-bold tracking-tight">Runtime Throughput</h3>
            </div>

            <div className="mt-8 flex items-end gap-3 h-40">
              {[34, 58, 46, 79, 63, 91, 74].map((height, i) => (
                <div key={i} className="flex-1 rounded-t-md border border-[#31363B] bg-[#090A0B] relative overflow-hidden" style={{ height: `${height}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-[#E4572E] opacity-80" style={{ height: `${Math.max(18, height - 24)}%` }} />
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div ref={conversionReveal.ref} className={revealClass(conversionReveal.isVisible, 'delay-500')}>
        <article className={`${cardBase} md:col-span-2 min-h-[360px] p-12`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="h-full flex flex-col justify-between max-w-3xl">
            <div className="space-y-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Conversion Architecture</p>
              <h3 className="text-[#F5F7FA] text-3xl md:text-4xl font-black tracking-tighter leading-[1.1]">
                Geometry That Converts Intent Into Measurable Growth
              </h3>
              <p className="text-[#A7B3BC] text-[17px] leading-[1.75] max-w-2xl">
                Conversion layers remove friction between interest and commitment through precise sequencing, qualification control, and scalable signal routing.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {['Performance Layer', 'Scalable Control', 'Signal Clarity'].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-[#31363B] bg-[#090A0B] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BentoGrid;
