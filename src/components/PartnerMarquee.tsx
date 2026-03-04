import React from 'react';

type PartnerIcon = {
  name: string;
  svg: React.ReactNode;
};

const icons: PartnerIcon[] = [
  {
    name: 'Cloudflare',
    svg: (
      <svg viewBox="0 0 48 48" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M11.6 33.2a6.8 6.8 0 0 1 1.5-13.4 9.9 9.9 0 0 1 19.1 3 6.1 6.1 0 0 1 1.6-.2 5.8 5.8 0 0 1 1.3 11.4H11.6Z" />
      </svg>
    ),
  },
  {
    name: 'AWS',
    svg: (
      <svg viewBox="0 0 48 48" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M9 31.5c8.2 5.8 20.8 6.2 29.4 1.2l1.5 2.4c-9.2 5.4-22.6 4.9-31.6-1.2L9 31.5Zm6.2-13.3h3.8l2 5.3 2-5.3h3.7l-3.8 9h-3.9l-3.8-9Zm14 0h3.5v9h-3.5v-9Zm5.4 0h4.1c2.4 0 3.8 1.2 3.8 3.1 0 2.2-1.5 3.2-3.9 3.2h-1.4V27h-2.6v-8.8Zm2.6 1.9v2.4h1.2c1 0 1.5-.4 1.5-1.2s-.6-1.2-1.5-1.2h-1.2Z" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg viewBox="0 0 48 48" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M24 10 7.6 37h32.8L24 10Z" />
      </svg>
    ),
  },
  {
    name: 'GSAP',
    svg: (
      <svg viewBox="0 0 48 48" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M24 9a15 15 0 1 0 15 15h-6a9 9 0 1 1-9-9V9Z" />
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden>
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <ellipse cx="24" cy="24" rx="17" ry="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <ellipse cx="24" cy="24" rx="17" ry="7" fill="none" stroke="currentColor" strokeWidth="2.2" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="17" ry="7" fill="none" stroke="currentColor" strokeWidth="2.2" transform="rotate(120 24 24)" />
      </svg>
    ),
  },
];

const PartnerMarquee: React.FC = () => {
  const track = [...icons, ...icons];

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-6" aria-label="Platform ecosystem">
      <div className="relative overflow-hidden rounded-full border border-white/10 bg-[#111]/40 backdrop-blur-md">
        <div className="animate-logo-cloud flex w-max items-center gap-4 px-5 py-3">
          {track.map((icon, index) => (
            <div
              key={`${icon.name}-${index}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#A7B3BC] grayscale opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              title={icon.name}
              aria-label={icon.name}
            >
              {icon.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
