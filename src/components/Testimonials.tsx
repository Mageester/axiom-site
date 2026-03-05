import React from 'react';

type FounderProfile = {
  name: string;
  role: string;
  initials: string;
};

const founders: FounderProfile[] = [
  {
    name: 'Aidan Magee',
    role: 'Co-Founder & Architect',
    initials: 'AM',
  },
  {
    name: 'Riley Hinsperger',
    role: 'Co-Founder & Architect',
    initials: 'RH',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 md:px-8">
      <div className="mb-8">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Founder Perspective</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Built by Co-Founders and Architects</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {founders.map((founder) => (
          <article
            key={founder.name}
            className="rounded-2xl border border-white/10 bg-[#0d1323]/60 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_30px_rgb(0,0,0,0.5)] p-7 md:p-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1c253b] ring-2 ring-[#F59768]/50 text-[#F59768] font-bold text-xl">
                {founder.initials}
              </div>
              <p className="text-left">
                <span className="block text-lg font-semibold text-[#F5F7FA]">{founder.name}</span>
                <span className="text-sm text-slate-300">{founder.role}</span>
              </p>
            </div>

            <blockquote className="mt-6 text-lg italic leading-[1.6] text-[#F5F7FA]">
              "We bridge the gap between ambitious visual concepts and operational reality."
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
