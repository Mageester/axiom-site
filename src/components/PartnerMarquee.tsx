import React from 'react';

type Signal = {
  label: string;
};

const signals: Signal[] = [
  { label: 'Senior QA' },
  { label: 'Scope Locked' },
  { label: 'Founder Reviewed' },
  { label: 'Edge Powered' },
  { label: 'Speed Verified' },
  { label: 'Code Audited' },
  { label: 'Live Monitoring' },
  { label: 'Launch Ready' },
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
                  <span className="status-dot h-1.5 w-1.5 rounded-full" aria-hidden />
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
