import React from 'react';

const cardClass =
  'relative overflow-hidden rounded-3xl border border-[#31363B] bg-[#13171B] transition-all duration-500 hover:-translate-y-2 hover:border-[#E4572E]/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]';

const chamfer = {
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
};

const BentoGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 py-24">
      <article className={`${cardClass} md:col-span-2 min-h-[440px] p-12 flex flex-col justify-between`} style={chamfer}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

        <div className="space-y-6 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Authority Layer</p>
          <h2 className="text-[#F5F7FA] text-4xl md:text-5xl font-black tracking-tighter leading-[1.04]">
            Uncompromising Architecture For High-Stakes Acquisition
          </h2>
          <p className="text-[#A7B3BC] text-[17px] leading-[1.7] max-w-2xl">
            Every panel is engineered for conversion pressure, channeling intent signals into precision-qualified opportunities.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-[#31363B] bg-[#090A0B] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] mb-4">Data Array</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Signal', value: 'LIVE' },
              { label: 'Latency', value: '0.38s' },
              { label: 'Coverage', value: '300+' },
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

      <article className={`${cardClass} md:col-span-1 min-h-[440px] p-10 flex flex-col justify-between items-start`} style={chamfer}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Operational Metric</p>
          <p className="font-mono text-6xl tracking-tighter leading-none text-[#E4572E] drop-shadow-[0_0_22px_rgba(228,87,46,0.35)]">99.9%</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Efficiency</p>
        </div>

        <p className="text-[#A7B3BC] text-[15px] leading-[1.7] max-w-[28ch]">
          Engineered intake logic reduces wasted operator hours and compresses time-to-close across premium jobs.
        </p>
      </article>

      <article className={`${cardClass} md:col-span-1 min-h-[360px] p-10`} style={chamfer}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

        <div className="h-full flex flex-col justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Status Graph</p>
            <h3 className="mt-4 text-[#F5F7FA] text-2xl font-bold tracking-tight">Live Throughput</h3>
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

      <article className={`${cardClass} md:col-span-2 min-h-[360px] p-12`} style={chamfer}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

        <div className="h-full flex flex-col justify-between max-w-3xl">
          <div className="space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Conversion Geometry</p>
            <h3 className="text-[#F5F7FA] text-3xl md:text-4xl font-black tracking-tighter leading-[1.1]">
              Precision Architecture That Turns Demand Into Qualified Capital
            </h3>
            <p className="text-[#A7B3BC] text-[17px] leading-[1.75] max-w-2xl">
              We remove the friction between discovery and commitment with high-clarity UX sequencing, strict qualification logic, and intent-weighted capture paths built for premium contractors.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {['Qualified Calls', 'Asset Ownership', 'Operator Control'].map((chip) => (
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
    </section>
  );
};

export default BentoGrid;
