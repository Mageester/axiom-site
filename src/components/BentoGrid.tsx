import React from 'react';

const machinedShadow = {
  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.5)',
};

const cardBase =
  'bg-[#13171B] border border-[#31363B] rounded-3xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]';

const BentoGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
      <article className={`${cardBase} md:col-span-2 min-h-[400px] p-12`} style={machinedShadow}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />
        <div className="flex h-full max-w-3xl flex-col justify-between gap-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#A7B3BC]">Infrastructure Command</p>
          <h2 className="text-4xl md:text-5xl leading-[1.03] tracking-[-0.03em] font-black text-[#F5F7FA]">
            Uncompromising Architecture
          </h2>
          <p className="max-w-2xl text-[17px] leading-[1.65] text-[#A7B3BC]">
            Engineered surfaces, ruthless clarity, and conversion geometry built to dominate local search pressure and premium buyer trust.
          </p>
        </div>
      </article>

      <article className={`${cardBase} md:col-span-1 min-h-[400px] p-12 flex flex-col justify-between`} style={machinedShadow}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#A7B3BC]">Response Index</p>
        <div className="space-y-4">
          <p className="font-mono text-6xl tracking-tighter text-[#E4572E]">99.99%</p>
          <p className="text-sm uppercase tracking-[0.16em] text-[#A7B3BC]">Operational Uptime Envelope</p>
        </div>
        <p className="text-[15px] leading-[1.6] text-[#A7B3BC]">When demand spikes, the system stays live and dispatch-ready.</p>
      </article>

      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className={`${cardBase} min-h-[300px] p-10`} style={machinedShadow}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />
          <div className="flex h-full flex-col justify-between gap-6">
            <h3 className="text-2xl md:text-3xl leading-tight tracking-[-0.02em] font-bold text-[#F5F7FA]">Precision Lead Intake</h3>
            <p className="max-w-xl text-[16px] leading-[1.65] text-[#A7B3BC]">
              Qualification-first flow filters low-intent traffic and routes only revenue-grade opportunities to your board.
            </p>
          </div>
        </article>

        <article className={`${cardBase} min-h-[300px] p-10`} style={machinedShadow}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />
          <div className="flex h-full flex-col justify-between gap-6">
            <h3 className="text-2xl md:text-3xl leading-tight tracking-[-0.02em] font-bold text-[#F5F7FA]">Machined Conversion Flow</h3>
            <p className="max-w-xl text-[16px] leading-[1.65] text-[#A7B3BC]">
              Every panel, message, and CTA is tuned for authority so premium buyers move from curiosity to commitment faster.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BentoGrid;
