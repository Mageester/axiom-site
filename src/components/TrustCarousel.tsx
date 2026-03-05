import React from 'react';

type TrustCard = {
  quote: string;
  name: string;
  title: string;
};

const cards: TrustCard[] = [
  {
    quote: 'The new infrastructure elevated our brand while making the entire sales journey effortless.',
    name: 'Marcus Hale',
    title: 'CEO, Northline Mechanical',
  },
  {
    quote: 'The new infrastructure elevated our brand while making the entire sales journey effortless.',
    name: 'Jordan Price',
    title: 'CEO, Summit Roofing Group',
  },
  {
    quote: 'The new infrastructure elevated our brand while making the entire sales journey effortless.',
    name: 'Avery Cole',
    title: 'CEO, Evergreen Outdoor Co.',
  },
  {
    quote: 'The new infrastructure elevated our brand while making the entire sales journey effortless.',
    name: 'Taylor Grant',
    title: 'CEO, Ironclad Services',
  },
];

const StarRow: React.FC = () => (
  <div className="flex items-center gap-1 text-[#F59768]">
    {Array.from({ length: 5 }).map((_, index) => (
      <svg key={index} viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M10 1.7l2.6 5.27 5.82.85-4.2 4.1.99 5.8L10 14.95l-5.21 2.77.99-5.8-4.2-4.1 5.82-.85L10 1.7z" />
      </svg>
    ))}
  </div>
);

const TrustCarousel: React.FC = () => {
  return (
    <section aria-label="Client trust signals" className="w-full max-w-7xl mx-auto px-6 md:px-8">
      <div className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4">
        {cards.map((card) => (
          <article
            key={card.name}
            className="min-w-[80vw] md:min-w-[400px] snap-center p-8 rounded-2xl bg-[#0d1323]/60 border border-white/10 backdrop-blur-md"
          >
            <StarRow />
            <p className="mt-5 text-[17px] text-slate-300 leading-relaxed">
              “{card.quote}”
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c253b] ring-1 ring-white/20 text-[10px] font-bold tracking-[0.1em] text-[#F59768]">
                CEO
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F5F7FA]">{card.name}</p>
                <p className="text-xs text-slate-300">{card.title}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrustCarousel;

