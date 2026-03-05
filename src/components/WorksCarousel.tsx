import React from 'react';

const projects = [
  {
    src: '/images/work-aether.jpg',
    alt: 'Project Aether premium interface',
    title: 'PROJECT AETHER',
    subtitle: 'Visual Engineering',
  },
  {
    src: '/images/case-study-1.jpg',
    alt: 'Project Sentinel premium interface',
    title: 'PROJECT SENTINEL',
    subtitle: 'Strategic Architecture',
  },
  {
    src: '/images/case-study-2.jpg',
    alt: 'Project Forge premium interface',
    title: 'PROJECT FORGE',
    subtitle: 'Conversion Design',
  },
  {
    src: '/images/case-study-3.jpg',
    alt: 'Project Orbit premium interface',
    title: 'PROJECT ORBIT',
    subtitle: 'Growth Infrastructure',
  },
];
const scrollProjects = [...projects, ...projects.slice(0, 2)];

const WorksCarousel: React.FC = () => {
  return (
    <section id="works" className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <div className="mb-8">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Visual Authority in Motion</h2>
      </div>

      <div className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory space-x-6 pb-8">
        {scrollProjects.map((project, index) => (
          <article
            key={`${project.src}-${index}`}
            className="group relative flex-shrink-0 min-w-[85vw] md:min-w-[65vw] h-[500px] md:h-[650px] snap-center rounded-2xl border border-white/10 bg-[#0d1323]/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden"
          >
            <img
              src={project.src}
              alt={project.alt}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050609]/90 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">{project.subtitle}</p>
              <p className="mt-2 text-sm font-semibold tracking-wide text-[#F5F7FA] md:text-base">{project.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WorksCarousel;
