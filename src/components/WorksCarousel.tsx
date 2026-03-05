import React from 'react';

const projects = [
  {
    src: '/images/work-aether.jpg',
    alt: 'Project Aether interface showcase',
    title: 'PROJECT AETHER',
  },
  {
    src: '/images/case-study-2.jpg',
    alt: 'Project Nexus interface showcase',
    title: 'PROJECT NEXUS',
  },
  {
    src: '/images/case-study-1.jpg',
    alt: 'Project Sentinel interface showcase',
    title: 'PROJECT SENTINEL',
  },
];

const WorksCarousel: React.FC = () => {
  return (
    <section id="works" className="w-full px-6 md:px-8">
      <div className="mb-8">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Visual Precision in Motion</h2>
      </div>

      <div className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 w-full max-w-[100vw]">
        {projects.map((project, index) => (
          <div
            key={`${project.title}-${index}`}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] h-[400px] md:h-[600px] snap-center relative rounded-3xl overflow-hidden bg-[#0d1323]/60 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] group"
          >
            <img
              src={project.src}
              alt={project.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorksCarousel;
