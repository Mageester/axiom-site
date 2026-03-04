import React from 'react';

const inputClass =
  'w-full bg-[#13171B] border border-[#31363B] rounded-xl px-6 py-5 text-[#F5F7FA] placeholder-[#A7B3BC] transition-all duration-300 outline-none focus:border-[#E4572E] focus:ring-1 focus:ring-[#E4572E]/50 focus:shadow-[0_0_15px_rgba(228,87,46,0.15)]';

const IntakeTerminal: React.FC = () => {
  return (
    <section id="intake" className="w-full max-w-4xl mx-auto px-6 py-32">
      <div className="space-y-0">
        <p className="font-mono text-[#E4572E] text-sm tracking-widest uppercase mb-4">Secure Intake</p>
        <h2 className="text-5xl md:text-6xl font-black text-[#F5F7FA] tracking-tighter mb-12">Initiate Deployment.</h2>
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
          <button type="submit" className="btn-primary btn-lg w-full mt-8">
            Request Authorization
          </button>
        </div>
      </form>
    </section>
  );
};

export default IntakeTerminal;
