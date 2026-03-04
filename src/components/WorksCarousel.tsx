import React from 'react';

const projects = [
  { src: '/images/work-aether.jpg', alt: 'Project Aether premium interface' },
  { src: '/images/case-study-1.jpg', alt: 'Dark mode product experience mockup' },
  { src: '/images/case-study-2.jpg', alt: 'High-end dashboard website concept' },
  { src: '/images/case-study-3.jpg', alt: 'Premium landing page visual system' },
];

const WorksCarousel: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <div className="mb-8">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Visual Authority in Motion</h2>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory space-x-8 overflow-x-scroll pb-4">
        {projects.map((project, index) => (
          <article
            key={project.src}
            className="group relative w-[85vw] min-w-[85vw] flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-[#2e344f] border-t border-t-white/10 bg-[#0d1323]/80 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.6)] md:w-[60vw] md:min-w-[60vw]"
          >
            <img
              src={project.src}
              alt={project.alt}
              className="h-[320px] w-full object-cover object-center md:h-[420px]"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-sm font-semibold tracking-wide text-[#F5F7FA] md:text-base">
                Visual Engineering - PROJECT AETHER
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WorksCarousel;
