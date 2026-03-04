import React from 'react';

const inputClass =
  'w-full rounded-xl px-6 py-5 text-[#F5F7FA] placeholder-[#A7B3BC] bg-white/5 backdrop-blur-md border border-white/10 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.4)] transition-all duration-300 outline-none focus:ring-2 focus:ring-[#E4572E]/40 focus:shadow-[0_0_30px_rgba(228,87,46,0.15)]';

const IntakeTerminal: React.FC = () => {
  return (
    <section id="intake" className="w-full max-w-4xl mx-auto px-6 py-32">
      <div className="space-y-0 mb-12">
        <p className="font-mono text-[#E4572E] text-sm tracking-widest uppercase mb-4">Secure Intake</p>
        <h2 className="text-5xl md:text-6xl font-black text-[#F5F7FA] tracking-tighter">Initialize Deployment.</h2>
      </div>

      <div className="rounded-3xl bg-[#1A1E23]/80 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.4)] p-6 md:p-8">
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1115]/60 px-4 py-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#34D399] animate-pulse" aria-hidden />
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A7B3BC]">System Status : Online</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(event) => event.preventDefault()}>
          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC] tracking-wide">Operator Name</span>
            <input type="text" name="operatorName" placeholder="Full legal name" className={inputClass} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC] tracking-wide">Corporate Entity</span>
            <input type="text" name="corporateEntity" placeholder="Company or holding entity" className={inputClass} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC] tracking-wide">Current Revenue Run-Rate</span>
            <input type="text" name="runRate" placeholder="$0" className={inputClass} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-[#A7B3BC] tracking-wide">Primary Objective</span>
            <input type="text" name="objective" placeholder="What outcome must this deployment secure?" className={inputClass} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-[#A7B3BC] tracking-wide">Operational Notes</span>
            <textarea
              name="message"
              rows={6}
              placeholder="Provide deployment constraints, timeline, and any non-negotiables."
              className={inputClass}
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="btn-primary btn-lg w-full mt-8 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_-6px_4px_rgba(0,0,0,0.3)_inset,0_4px_6px_rgba(0,0,0,0.5),0_4px_80px_rgba(228,87,46,0.3)]"
            >
              Request Authorization
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default IntakeTerminal;
