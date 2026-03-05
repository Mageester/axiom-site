import React from 'react';
import useReveal from '../hooks/useReveal';

const cardClass =
  'rounded-2xl border border-white/10 bg-[#0d1323]/60 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_30px_rgb(0,0,0,0.5)] p-7 md:p-8 transition-all duration-300 ease-out';

const revealClass = (isVisible: boolean) =>
  `transform-gpu transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

const StatsGrid: React.FC = () => {
  const oneReveal = useReveal<HTMLDivElement>();
  const twoReveal = useReveal<HTMLDivElement>();
  const threeReveal = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="w-full max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div ref={oneReveal.ref} className={revealClass(oneReveal.isVisible)} style={{ transitionDelay: '0ms' }}>
          <article className={`${cardClass} flex flex-col space-y-4`}>
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-[#A7B3BC]">Authority Metric</p>
            <h3 className="text-3xl font-black tracking-tight text-[#F2F4F7] md:text-4xl">Revenue Supported: $50M+</h3>
            <p className="text-sm leading-[1.7] text-slate-300">Systems backing eight-figure revenue.</p>
            <svg viewBox="0 0 260 70" className="w-full" role="img" aria-label="Decorative amber bar chart">
              <rect x="8" y="34" width="24" height="28" rx="4" fill="#F59768" opacity="0.45" />
              <rect x="44" y="22" width="24" height="40" rx="4" fill="#F59768" opacity="0.55" />
              <rect x="80" y="12" width="24" height="50" rx="4" fill="#F59768" opacity="0.7" />
              <rect x="116" y="26" width="24" height="36" rx="4" fill="#F59768" opacity="0.6" />
              <rect x="152" y="8" width="24" height="54" rx="4" fill="#F59768" opacity="0.78" />
              <rect x="188" y="18" width="24" height="44" rx="4" fill="#F59768" opacity="0.65" />
              <rect x="224" y="4" width="24" height="58" rx="4" fill="#F59768" opacity="0.86" />
            </svg>
          </article>
        </div>

        <div ref={twoReveal.ref} className={revealClass(twoReveal.isVisible)} style={{ transitionDelay: '100ms' }}>
          <article className={`${cardClass} flex flex-col space-y-4`}>
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-[#A7B3BC]">Authority Metric</p>
            <h3 className="text-3xl font-black tracking-tight text-[#F2F4F7] md:text-4xl">Assets Deployed: 150+</h3>
            <p className="text-sm leading-[1.7] text-slate-300">Production-ready web infrastructure.</p>
            <svg viewBox="0 0 320 70" className="w-full" role="img" aria-label="Decorative amber sparkline">
              <path
                d="M4 54 C30 42, 58 46, 84 34 C110 22, 138 24, 166 18 C194 12, 220 20, 248 14 C274 8, 296 10, 316 6"
                fill="none"
                stroke="#F59768"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        </div>

        <div ref={threeReveal.ref} className={revealClass(threeReveal.isVisible)} style={{ transitionDelay: '200ms' }}>
          <article className={`${cardClass} flex flex-col space-y-4`}>
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-[#A7B3BC]">Authority Metric</p>
            <h3 className="text-3xl font-black tracking-tight text-[#F2F4F7] md:text-4xl">Enterprise DNA: &lt;30ms</h3>
            <p className="text-sm leading-[1.7] text-slate-300">Applying high-frequency architectural standards to your brand.</p>
            <svg viewBox="0 0 320 70" className="w-full" role="img" aria-label="Decorative amber wave line">
              <path
                d="M0 38 C24 14, 48 62, 72 38 C96 14, 120 62, 144 38 C168 14, 192 62, 216 38 C240 14, 264 62, 288 38 C300 28, 310 34, 320 38"
                fill="none"
                stroke="#F59768"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
