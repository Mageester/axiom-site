import React from 'react';

type TrustCard = {
  heading: string;
  detail: string;
};

const cards: TrustCard[] = [
  {
    heading: 'Positioning Clarity',
    detail: 'Commercial narrative and page hierarchy aligned before production starts.',
  },
  {
    heading: 'Interaction Reliability',
    detail: 'Critical interaction paths are validated across viewport sizes before launch.',
  },
  {
    heading: 'Form Path Integrity',
    detail: 'Intake and contact paths are tested to reduce drop-off at key decision points.',
  },
  {
    heading: 'Release Discipline',
    detail: 'Every release follows a checklist with defined acceptance criteria.',
  },
];

const TrustCarousel: React.FC = () => {
  const segment = [...cards, ...cards];

  return (
    <section aria-label="Delivery proof" className="w-full max-w-7xl px-6 md:px-8">
      <div className="marquee-shell hide-scrollbar overflow-hidden">
        <div
          className="marquee-track"
          style={{ '--marquee-duration': '44s', '--marquee-gap': '1.25rem' } as React.CSSProperties}
        >
          {[0, 1].map((segmentIndex) => (
            <div key={segmentIndex} aria-hidden={segmentIndex === 1} className="marquee-segment py-1">
              {segment.map((card, index) => (
                <article
                  key={`${segmentIndex}-${card.heading}-${index}`}
                  className="min-w-[270px] max-w-[300px] rounded-2xl border border-white/10 bg-[#0d1323]/65 p-5 backdrop-blur-md md:min-w-[320px]"
                >
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{card.heading}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{card.detail}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustCarousel;
