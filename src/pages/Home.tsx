import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import BrandCarousel from '../components/BrandCarousel';
import Layout from '../components/Layout';
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
    summary: entry.summary.split('. ')[0].replace(/\.$/, '') + '.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    projectType: proofTypeLabel[entry.label] ?? entry.label,
  };
});

const capabilities = [
  {
    title: 'Built Around Your Business',
    detail:
      'We learn what you do, who your customers are, and what the website needs to accomplish.',
  },
  {
    title: 'Made to Build Trust',
    detail:
      'Clean design and clear messaging make your business look established and professional from the first click.',
  },
  {
    title: 'Designed to Get You Inquiries',
    detail:
      'Calls, forms, and booking actions are placed where they work — so the right visitors take the next step.',
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

const processStages = [
  {
    number: '01',
    title: 'Discover',
    detail: 'We learn about your business, your customers, and your goals.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'We agree on the pages, content, and structure before anything is built.',
  },
  {
    number: '03',
    title: 'Launch',
    detail: 'We design, build, test, and deliver a site you can be proud of.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Professional Websites for Established Businesses"
        description="Axiom builds professional websites for established businesses that need a stronger online presence, clearer messaging, and more customer inquiries."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Axiom Infrastructure',
          url: 'https://getaxiom.ca',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Serious websites for serious businesses
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We build websites that help established businesses look professional, earn trust fast, and turn more visitors into customers.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book Free Consultation
                  </Link>
                  <Link
                    to="/method"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
              <div className="mt-10 max-w-4xl md:mt-14">
                <BrandCarousel />
              </div>
            </div>
          </section>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">How We Work</p>
                <h2 className="mt-3 max-w-[11ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  A simple process that keeps things clear.
                </h2>
                <p className="mt-4 max-w-[30ch] text-sm leading-7 text-slate-300 md:text-base">
                  One call to understand your business. A clear plan. A professional launch.
                </p>
              </div>

              <div className="how-work-panel">
                <div className="how-work-panel-header">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.22em] text-[#A7B3BC]">Our process</p>
                </div>

                <div className="mt-6 grid gap-3 md:gap-4">
                  {processStages.map((stage, index) => (
                    <article key={stage.title} className={`how-work-stage how-work-stage-${index + 1}`}>
                      <div className="how-work-stage-number">{stage.number}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.08rem]">
                            {stage.title}
                          </h3>
                          <div className="h-px flex-1 bg-white/[0.08]" />
                        </div>
                        <p className="mt-2 max-w-[28ch] text-sm leading-6 text-slate-300 md:text-[0.95rem]">{stage.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-28" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  See what we build.
                </h2>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View all work
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
                      <h3 className="text-[1.35rem] font-semibold tracking-tight text-white sm:text-[1.55rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300/95">{item.summary}</p>

                      {item.demoUrl ? (
                        <div className="mt-auto pt-6">
                          <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors group-hover/deployment:text-[#e8bea8] group-focus-visible/deployment:text-[#e8bea8]">
                            View demo
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

          <RevealBlock as="section" className="pt-20 md:pt-24" variant="feature">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,33,0.94)_0%,rgba(10,15,26,0.97)_100%)] px-6 py-12 shadow-[0_22px_70px_rgba(0,0,0,0.24)] md:px-8 md:py-14 lg:px-10 lg:py-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-[-14%] h-40 w-40 rounded-full bg-[#4B6EAF]/10 blur-3xl md:h-52 md:w-52" />
                <div className="absolute bottom-[-16%] right-[8%] h-44 w-44 rounded-full bg-[#B05D41]/10 blur-3xl md:h-56 md:w-56" />
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">WHAT YOU GET</p>
                  <h2 className="mt-4 max-w-[12ch] text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.03em] text-[#F2F4F7]">
                    Every website includes these.
                  </h2>
                  <p className="mt-5 max-w-[38rem] text-sm leading-7 text-slate-300 md:text-base">
                    Good design is just the start. Every Axiom website is fast, flawless on mobile, and built to guide visitors toward calling or booking.
                  </p>
                </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
              {standardsCards.map((item, index) => (
                <RevealBlock
                  as="article"
                  key={item.title}
                  delay={index * 0.06}
                  variant="card"
                  className={`group relative flex h-full min-h-[15.5rem] flex-col rounded-[26px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_28px_rgba(0,0,0,0.16)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_34px_rgba(0,0,0,0.22)] md:p-7 ${
                    index === 0
                      ? 'lg:col-span-6 border border-white/12 bg-[linear-gradient(180deg,rgba(24,31,40,0.96)_0%,rgba(15,19,26,0.98)_100%)]'
                      : index < 3
                        ? 'lg:col-span-3 border border-white/8 bg-[linear-gradient(180deg,rgba(20,25,32,0.8)_0%,rgba(13,17,23,0.92)_100%)]'
                        : 'lg:col-span-6 border border-white/8 bg-white/[0.015]'
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-70 ${index === 0 ? 'via-white/14' : 'via-white/10'}`} />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,29,48,0.86)_0%,rgba(14,21,35,0.9)_100%)] text-[#d4a48e] transition-colors duration-300 group-hover:border-white/16 group-hover:text-[#e1b29b]">
                        {item.icon}
                      </div>
                      <h3 className={`mt-6 font-semibold tracking-[-0.02em] text-[#F2F4F7] ${index === 0 ? 'text-[1.28rem] md:text-[1.45rem]' : 'text-[1.08rem] md:text-[1.15rem]'}`}>
                        {item.title}
                      </h3>
                      <p className={`mt-3 text-sm leading-7 text-slate-300 ${index === 0 ? 'max-w-[34ch]' : 'max-w-[32ch]'}`}>
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
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Ready to upgrade your website?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Book a free 30-minute call. We&apos;ll review your current website, understand your goals, and outline the best next step.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    Book a Free Consultation
                  </Link>
                </div>

                <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">30-minute call</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Free, no obligation</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Founder-led</span>
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
