import React from 'react';

type Signal = {
  label: string;
};

const signals: Signal[] = [
  { label: 'Thorough QA' },
  { label: 'Scope Locked' },
  { label: 'Founder Reviewed' },
  { label: 'Global Delivery' },
  { label: 'Speed Verified' },
  { label: 'Stricter Standards' },
  { label: 'Reliable Uptime' },
  { label: 'Launch Ready' },
];

const SignalIcon: React.FC<{ label: string }> = ({ label }) => {
  const iconClass = 'h-3.5 w-3.5 shrink-0 text-slate-300/85';

  if (label === 'Founder Reviewed') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (label === 'Global Delivery') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <path d="M13 3 6.5 13h4L9.5 21 17.5 10h-4.5L13 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }

  if (label === 'Speed Verified') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <path d="M5 15a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="m12 15 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (label === 'Stricter Standards') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <path d="M12 3 5.5 6v5.4c0 4.1 2.4 7.4 6.5 9.6 4.1-2.2 6.5-5.5 6.5-9.6V6L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m9.3 12.2 1.9 1.9 3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (label === 'Reliable Uptime') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <path
          d="M3.5 12h4l2.1-3.2 3 6 2.2-4.2H20.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (label === 'Launch Ready') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <path d="M8.5 15.5c2.7.3 5.4-1 7.7-3.4 2-2 3.2-4.3 3.4-6.7-2.4.2-4.7 1.4-6.7 3.4-2.3 2.3-3.6 5-3.4 7.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M7.5 16.5 5 19m4.8-2.9-1.3-1.3m3.5 1.1 1.3 1.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (label === 'Scope Locked') {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
        <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 10V7.8a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path d="m7.5 12 3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PartnerMarquee: React.FC = () => {
  const segment = [...signals, ...signals];

  return (
    <section aria-label="Our standards" className="w-full">
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
                  <SignalIcon label={label} />
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
