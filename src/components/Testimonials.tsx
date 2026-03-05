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
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Founder Authority</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#F5F7FA] md:text-4xl">Built by Co-Founders and Architects</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {founders.map((founder) => (
          <article
            key={founder.name}
            className="rounded-2xl border border-[#2e344f] border-t border-t-white/10 bg-[#0d1323]/90 p-7 shadow-[0_20px_40px_rgba(0,0,0,0.6)] md:p-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1c253b] ring-2 ring-[#B05D41]/50 text-[#B05D41] font-bold text-xl">
                {founder.initials}
              </div>
              <p className="text-left">
                <span className="block text-lg font-semibold text-[#F5F7FA]">{founder.name}</span>
                <span className="text-sm text-[#A7B3BC]">{founder.role}</span>
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
