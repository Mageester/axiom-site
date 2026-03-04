import React, { useState } from 'react';

type IntakeAction = 'consultation' | 'details' | 'email' | null;

const baseCardClass =
  'rounded-2xl border border-white/10 border-t border-t-white/10 bg-white/[0.04] backdrop-blur-md p-6 machined-card transition-all duration-300 text-left';

const inputClass =
  'w-full rounded-xl px-5 py-4 text-[#F5F7FA] placeholder-[#A7B3BC] bg-white/[0.03] border border-white/10 border-t border-t-white/10 outline-none transition-all duration-300 focus:ring-2 focus:ring-[#B05D41]/40';

const IntakeTerminal: React.FC = () => {
  const [activeAction, setActiveAction] = useState<IntakeAction>(null);

  return (
    <section id="intake" className="w-full max-w-6xl mx-auto px-6 py-28">
      <div className="mb-10 flex items-center gap-3 rounded-full border border-white/10 border-t border-t-white/10 bg-[#111827]/70 px-4 py-2 w-fit machined-card">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22c55e] animate-pulse" aria-hidden />
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A7B3BC]">System Status : Online</p>
      </div>

      <div className="mb-8 space-y-3">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F4F7]">Start Your Project</h2>
        <p className="text-[#A7B3BC] max-w-2xl">Choose your preferred path. If you send details, the intake form unlocks below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button
          type="button"
          onClick={() => setActiveAction('consultation')}
          className={`${baseCardClass} ${activeAction === 'consultation' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
        >
          <p className="font-semibold text-[#F2F4F7] text-lg">Book a Consultation</p>
          <p className="mt-2 text-sm text-[#A7B3BC]">Schedule a strategic session and map your goals with our team.</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveAction('details')}
          className={`${baseCardClass} ${activeAction === 'details' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
        >
          <p className="font-semibold text-[#F2F4F7] text-lg">Send Project Details</p>
          <p className="mt-2 text-sm text-[#A7B3BC]">Open the guided form and submit project scope, timing, and budget.</p>
        </button>

        <a
          href="mailto:hello@getaxiom.ca"
          onClick={() => setActiveAction('email')}
          className={`${baseCardClass} ${activeAction === 'email' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
        >
          <p className="font-semibold text-[#F2F4F7] text-lg">Email Directly</p>
          <p className="mt-2 text-sm text-[#A7B3BC]">Reach us instantly at hello@getaxiom.ca for direct communication.</p>
        </a>
      </div>

      {activeAction === 'details' && (
        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl border border-white/10 border-t border-t-white/10 bg-[#10141c]/70 p-6 md:p-8 machined-card" onSubmit={(event) => event.preventDefault()}>
          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC]">Name</span>
            <input type="text" name="name" placeholder="Full name" className={inputClass} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC]">Email</span>
            <input type="email" name="email" placeholder="you@company.com" className={inputClass} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-[#A7B3BC]">Project Details</span>
            <textarea name="details" rows={6} placeholder="Share scope, goals, and timeline." className={inputClass} />
          </label>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary btn-lg w-full">Send Project Details</button>
          </div>
        </form>
      )}
    </section>
  );
};

export default IntakeTerminal;
