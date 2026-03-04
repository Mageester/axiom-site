import React from 'react';

type PartnerIcon = {
  name: string;
  svg: React.ReactNode;
};

const icons: PartnerIcon[] = [
  {
    name: 'Cloudflare',
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M6.45 17.45a3.15 3.15 0 0 1 .63-6.24 4.6 4.6 0 0 1 8.86 1.45 2.85 2.85 0 0 1 .72 5.62H6.45Z" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M12 4 3.5 19h17L12 4Z" />
      </svg>
    ),
  },
  {
    name: 'GSAP',
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M4 12a8 8 0 1 0 8-8v3.2a4.8 4.8 0 1 1-4.8 4.8H4Z" />
      </svg>
    ),
  },
  {
    name: 'AWS',
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M4.5 15.5c4.2 3.2 10.6 3.4 15 .6l.7 1.1c-4.8 3.1-11.8 2.9-16.5-.6l.8-1.1Zm2.6-6.8h2.1l1 2.5 1-2.5h2l-2 4.8h-2.1l-2-4.8Zm7.4 0h1.9v4.8h-1.9V8.7Zm3 0h2.1c1.2 0 2 .6 2 1.6 0 1.1-.8 1.7-2 1.7h-.7v1.5h-1.4V8.7Zm1.4 1v1.3h.6c.5 0 .8-.2.8-.6s-.3-.7-.8-.7h-.6Z" />
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <circle cx="12" cy="12" r="1.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
];

const PartnerMarquee: React.FC = () => {
  const track = [...icons, ...icons];

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-6">
      <div className="relative overflow-hidden rounded-full border border-white/10 bg-[#111]/40 backdrop-blur-md">
        <div className="animate-logo-cloud flex w-max items-center gap-6 px-6 py-4">
          {track.map((icon, index) => (
            <div
              key={`${icon.name}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-[#A7B3BC] grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform-gpu"
              title={icon.name}
              aria-label={icon.name}
            >
              {icon.svg}
              <span className="text-[11px] font-semibold tracking-[0.22em]">{icon.name.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
