import React from 'react';

type Signal = {
  label: string;
};

const signals: Signal[] = [
  { label: 'Two-Step Qualification Flow' },
  { label: 'Founder-Led Intake Review' },
  { label: 'Inquiry Path QA Checked' },
  { label: 'Scope Lock Before Build' },
  { label: 'Release Checklist Gates' },
  { label: 'Senior-Led QA Review' },
];

const PartnerMarquee: React.FC = () => {
  const segment = [...signals, ...signals];

  return (
    <section aria-label="Operational signals" className="w-full">
      <div className="marquee-shell hide-scrollbar relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="marquee-track"
          style={{ '--marquee-duration': '34s', '--marquee-gap': '2rem' } as React.CSSProperties}
        >
          {[0, 1].map((segmentIndex) => (
            <div key={segmentIndex} aria-hidden={segmentIndex === 1} className="marquee-segment">
              {segment.map(({ label }, index) => (
                <div
                  key={`${segmentIndex}-${label}-${index}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-[#10182a]/70 px-3.5 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B05D41]" aria-hidden />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
