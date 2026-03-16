import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import PartnerMarquee from '../components/PartnerMarquee';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { caseStudies } from '../data/caseStudies';
import { getWorkProofImage } from '../lib/workProofImages';

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Live Demo': 'Live Demo',
  'In Progress': 'In Progress',
};

const homeSelectedWorkSlugs = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const selectedWorkEntries = homeSelectedWorkSlugs
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const selectedWork = selectedWorkEntries.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  return {
    id: entry.slug,
    title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    scope: entry.deliverables.slice(0, 2).join(' + '),
    summary: entry.summary,
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    industry: entry.niche,
    projectType: proofTypeLabel[entry.label] ?? entry.label,
  };
});

const capabilities = [
  {
    title: 'Built Around Your Business',
    detail:
      'We start by understanding what you do, what needs to be included, and what the site needs to help you achieve.',
  },
  {
    title: 'Made to Build Trust',
    detail:
      'A clear layout and modern design ensure your business looks established, capable, and trustworthy from the first click.',
  },
  {
    title: 'Designed to Generate Inquiries',
    detail:
      'Calls, forms, and booking actions are placed with intent so more of the right visitors take the next step.',
  },
];

const standardsCards = [
  {
    title: 'Fast, Reliable Hosting',
    detail:
      'Sites are delivered globally for fast loading, reliable uptime, and a smooth experience for every visitor.',
    desktopSpan: 'lg:col-span-4',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M7.5 15.5a3.5 3.5 0 0 1 .9-6.88 5 5 0 0 1 9.36 1.26A3 3 0 1 1 18 15.5H7.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Built for Speed',
    detail:
      'We structure layouts, media, and interactions to load instantly, so you never lose a visitor to slow wait times.',
    desktopSpan: 'lg:col-span-4',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M12 5v7l4 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M20 12A8 8 0 1 1 8.3 4.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Flawless on Mobile',
    detail:
      'We design from the phone up, ensuring your website feels completely natural, credible, and easy to use on any device.',
    desktopSpan: 'lg:col-span-4',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="10" x="7" y="4" />
        <path d="M10 7h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <circle cx="12" cy="17" fill="currentColor" r="1" />
      </svg>
    ),
  },
  {
    title: 'Clear and Accessible',
    detail:
      'Colors, contrast, structure, and text sizing are carefully reviewed to ensure a highly readable experience for everyone.',
    desktopSpan: 'lg:col-span-6',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2" fill="currentColor" />
        <path d="M6 9h12M12 7v12M8 21l4-7 4 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Rigorous Pre-Launch Checks',
    detail:
      'Core pages, contact forms, mobile layouts, and critical actions are fully tested before your website goes live.',
    desktopSpan: 'lg:col-span-6',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M8 7h8M8 12h4M8 17h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <path d="M17 16.5 18.8 18 22 14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <rect height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="14" x="5" y="4" />
      </svg>
    ),
  },
];

const method = [
  '01 — We learn the business and what the site needs to do',
  '02 — We plan the pages, structure, and conversion flow',
  '03 — We build, test, and launch to a higher standard',
];

const operationalSignals = [
  'Founder-led planning and review',
  'Requirements agreed before build begins',
  'Every key page checked before launch',
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Premium Websites for Growth-Focused Businesses"
        description="Axiom designs and builds premium websites for businesses that need stronger trust, clearer positioning, and better conversion structure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Custom websites built for serious local businesses.
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                  We build fast, professional websites that help established businesses look credible, rank higher, and generate more inquiries. No templates, no bloat.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a Discovery Call
                  </Link>
                  <Link
                    to="/method"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    View Our Process
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-10 md:pt-14">
            <p className="mb-3 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Our Standards
            </p>
            <PartnerMarquee />
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-28" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Featured Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">A selection of our custom builds, live projects, and category examples.</h2>
              </div>
                <Link
                  to="/works"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
                >
                  View Our Work
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {selectedWork.map((item, index) => {
                const card = (
                  <RevealBlock
                    as="article"
                    delay={index * 0.08}
                    variant="card"
                    className="flex min-h-[30rem] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_34px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/deployment:-translate-y-1 group-hover/deployment:border-[#d4a48e]/30 group-hover/deployment:shadow-[0_24px_60px_rgba(0,0,0,0.34)] group-focus-visible/deployment:-translate-y-1 group-focus-visible/deployment:border-[#d4a48e]/35 group-focus-visible/deployment:shadow-[0_24px_60px_rgba(0,0,0,0.34)]"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative overflow-hidden">
                      <ResponsiveImage
                        source={item.image}
                        sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                        alt={item.imageAlt ?? item.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover/deployment:scale-[1.03] group-focus-visible/deployment:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
                      <div className="absolute left-4 top-4">
                        <span className="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                          {item.projectType}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">
                        {item.industry}
                      </p>
                      <h3 className="mt-3 text-[1.35rem] font-semibold tracking-tight text-white sm:text-[1.55rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300/95">
                        {item.summary}
                      </p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                        {item.scope}
                      </p>

                      {item.demoUrl ? (
                        <div className="mt-auto pt-6">
                          <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors group-hover/deployment:text-[#e8bea8] group-focus-visible/deployment:text-[#e8bea8]">
                            View Demo
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </RevealBlock>
                );

                if (!item.demoUrl) {
                  return React.cloneElement(card, { key: item.id });
                }

                return (
                  <a
                    key={item.id}
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live demo for ${item.title}`}
                    className="group/deployment block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d18]"
                  >
                    {card}
                  </a>
                );
              })}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">How We Work</p>
                <h2 className="mt-3 max-w-[20ch] text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  A clear, professional process for building your website.
                </h2>
                <ol className="mt-5 space-y-3">
                  {method.map((step) => (
                    <li key={step} className="text-sm text-slate-300">
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-6 lg:col-span-8 md:grid-cols-3">
                {capabilities.map((item, index) => (
                  <RevealBlock as="article" key={item.title} className="axiom-bento h-full p-4 md:p-5" delay={index * 0.08} variant="card">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                  </RevealBlock>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">How The Project Is Run</p>
                <ul className="mt-3 space-y-2">
                  {operationalSignals.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">What The Site Has To Support</p>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed text-slate-300">Clear positioning at first glance</li>
                  <li className="text-sm leading-relaxed text-slate-300">A credible next step for the right buyer</li>
                  <li className="text-sm leading-relaxed text-slate-300">Clean performance across desktop and mobile</li>
                </ul>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24" variant="feature">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,33,0.94)_0%,rgba(10,15,26,0.97)_100%)] px-6 py-12 shadow-[0_22px_70px_rgba(0,0,0,0.24)] md:px-8 md:py-14 lg:px-10 lg:py-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-[-14%] h-40 w-40 rounded-full bg-[#4B6EAF]/10 blur-3xl md:h-52 md:w-52" />
                <div className="absolute bottom-[-16%] right-[8%] h-44 w-44 rounded-full bg-[#B05D41]/10 blur-3xl md:h-56 md:w-56" />
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">OUR STANDARDS</p>
                  <h2 className="mt-4 max-w-[12ch] text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.03em] text-[#F2F4F7]">
                    Standards built into every launch.
                  </h2>
                  <p className="mt-5 max-w-[38rem] text-sm leading-7 text-slate-300 md:text-base">
                    A professional website needs more than good design. Every Axiom build is structured to load fast, work flawlessly on mobile, and guide visitors toward booking or buying.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
                  {standardsCards.map((item, index) => (
                    <RevealBlock
                      as="article"
                      key={item.title}
                      delay={index * 0.06}
                      variant="card"
                      className={`group relative flex h-full min-h-[15.5rem] flex-col rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,41,0.82)_0%,rgba(12,18,31,0.94)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_34px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_42px_rgba(0,0,0,0.24)] md:p-7 ${item.desktopSpan}`}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-70" />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,29,48,0.96)_0%,rgba(14,21,35,0.96)_100%)] text-[#d4a48e] transition-colors duration-300 group-hover:border-white/16 group-hover:text-[#e1b29b]">
                        {item.icon}
                      </div>
                      <h3 className="mt-6 text-[1.15rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.2rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[36ch] text-sm leading-7 text-slate-300">
                        {item.detail}
                      </p>
                    </RevealBlock>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="intake" className="pt-22 md:pt-26" variant="feature">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#0f1628]/88 via-[#101726]/82 to-[#0b1120]/88 p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.35)] md:p-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[16%] h-52 w-52 rounded-full bg-[#B05D41]/14 blur-3xl" />
                <div className="absolute -bottom-28 right-[10%] h-64 w-64 rounded-full bg-[#4B6EAF]/14 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
              </div>

              <div className="relative z-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">NEXT STEPS</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Start Your Project
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Book a brief discovery call to discuss your business and current website goals. We will review your context and recommend a structured path forward.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    Book a Discovery Call
                  </Link>
                </div>

                <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">30-minute Zoom consultation</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Online only</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Founder-led review</span>
                </div>
              </div>
            </div>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
