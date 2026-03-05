import React from 'react';
import useReveal from '../hooks/useReveal';

const cardShell =
  'group bento-hover relative overflow-hidden rounded-2xl bg-[#0d1323]/60 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]';

const thumbnails = [
  { src: '/images/case-study-1.jpg', alt: 'Cinematic project thumbnail one' },
  { src: '/images/case-study-2.jpg', alt: 'Cinematic project thumbnail two' },
  { src: '/images/case-study-3.jpg', alt: 'Cinematic project thumbnail three' },
  { src: '/images/case-study-4.jpg', alt: 'Cinematic project thumbnail four' },
];

const BentoGrid: React.FC = () => {
  const anchorReveal = useReveal<HTMLDivElement>();
  const depthReveal = useReveal<HTMLDivElement>();
  const monolithReveal = useReveal<HTMLDivElement>();

  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 auto-rows-[minmax(300px,auto)] gap-8 px-6 md:px-8 lg:grid-cols-6">
      <div
        ref={anchorReveal.ref}
        className={`reveal-on-scroll ${anchorReveal.isVisible ? 'is-visible' : ''} lg:col-span-3 lg:row-span-2`}
        style={{ ['--reveal-order' as string]: 0 } as React.CSSProperties}
      >
        <article className={cardShell}>
          <img
            src="/images/work-aether.jpg"
            alt="Premium website showcase"
            className="h-full min-h-[520px] w-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Portfolio Showcase</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Selected Work</h3>
            <button
              type="button"
              className="mt-6 inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-[#F5F7FA] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              View Project
            </button>
          </div>
        </article>
      </div>

      <div
        ref={depthReveal.ref}
        className={`reveal-on-scroll ${depthReveal.isVisible ? 'is-visible' : ''} lg:col-span-3 lg:row-span-1`}
        style={{ ['--reveal-order' as string]: 1 } as React.CSSProperties}
      >
        <article className={cardShell}>
          <div className="flex h-full min-h-[300px] flex-col justify-between p-8">
            <div>
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Strategic Depth</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-[#F5F7FA] md:text-3xl">
              Conversion Architecture for Premium Brands
            </h3>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-[#A7B3BC]">
                Positioning, narrative sequencing, and offer framing engineered to move high-intent buyers from curiosity to action.
              </p>
            </div>
            <button
              type="button"
              className="mt-6 inline-flex h-11 w-fit items-center rounded-full border border-white/20 px-5 text-sm font-medium text-[#F5F7FA] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              View Project
            </button>
          </div>
        </article>
      </div>

      <div
        ref={monolithReveal.ref}
        className={`reveal-on-scroll ${monolithReveal.isVisible ? 'is-visible' : ''} lg:col-span-6 lg:row-span-1`}
        style={{ ['--reveal-order' as string]: 2 } as React.CSSProperties}
      >
        <article className={cardShell}>
          <div className="flex h-full min-h-[320px] flex-col p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">The Monolith</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#F5F7FA] md:text-3xl">Project Thumbnail Stream</h3>
              </div>
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-[#F5F7FA] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                View Project
              </button>
            </div>
            <div className="mt-8 flex gap-6 overflow-x-auto pb-2">
              {thumbnails.map((item) => (
                <img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  className="h-40 min-w-[300px] rounded-xl border border-white/10 object-cover object-center md:h-48 md:min-w-[360px]"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BentoGrid;
