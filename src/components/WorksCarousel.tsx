import React from 'react';

const projects = [
  {
    src: '/images/work-aether.jpg',
    alt: 'Project Aether interface showcase',
    title: 'Project Aether',
    sector: 'Home Services',
  },
  {
    src: '/images/case-study-2.jpg',
    alt: 'Project Nexus interface showcase',
    title: 'Project Nexus',
    sector: 'Contracting',
  },
  {
    src: '/images/case-study-1.jpg',
    alt: 'Project Sentinel interface showcase',
    title: 'Project Sentinel',
    sector: 'Professional Services',
  },
];

const WorksCarousel: React.FC = () => {
  const segment = [...projects, ...projects];

  return (
    <section id="works" className="w-full px-6 md:px-8" aria-label="Selected work carousel">
      <div className="mb-8">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Work</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Execution in Production</h2>
      </div>

      <div className="marquee-shell hide-scrollbar overflow-hidden">
        <div
          className="marquee-track"
          style={{ '--marquee-duration': '52s', '--marquee-gap': '1.5rem' } as React.CSSProperties}
        >
          {[0, 1].map((segmentIndex) => (
            <div key={segmentIndex} aria-hidden={segmentIndex === 1} className="marquee-segment pb-6">
              {segment.map((project, index) => (
                <article
                  key={`${segmentIndex}-${project.title}-${index}`}
                  className="relative h-[360px] w-[78vw] max-w-[520px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/65 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] md:h-[460px] md:w-[40vw]"
                >
                  <img src={project.src} alt={project.alt} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{project.sector}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksCarousel;
