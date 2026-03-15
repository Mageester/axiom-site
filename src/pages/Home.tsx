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
      'Clear structure, stronger presentation, and cleaner messaging help the business look more established online.',
  },
  {
    title: 'Designed to Generate Inquiries',
    detail:
      'Calls, forms, and booking actions are placed with intent so more of the right visitors take the next step.',
  },
];

const standardsCards = [
  {
    title: 'Cloudflare Edge Hosting',
    detail:
      'Production deployments run through Cloudflare’s edge network for global delivery, caching control, and cleaner launch operations.',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M7.5 15.5a3.5 3.5 0 0 1 .9-6.88 5 5 0 0 1 9.36 1.26A3 3 0 1 1 18 15.5H7.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Performance-Optimized Architecture',
    detail:
      'Layouts, media, and interaction layers are structured for fast loading and stable rendering instead of being patched after design is approved.',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M12 5v7l4 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M20 12A8 8 0 1 1 8.3 4.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Mobile-First Development',
    detail:
      'Every build is planned from the smaller viewport up so the mobile experience is deliberate, usable, and commercially credible.',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="10" x="7" y="4" />
        <path d="M10 7h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <circle cx="12" cy="17" fill="currentColor" r="1" />
      </svg>
    ),
  },
  {
    title: 'Accessibility Standards',
    detail:
      'Hierarchy, contrast, focus treatment, and interaction states are reviewed so the site feels cleaner to use and more dependable to buyers.',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2" fill="currentColor" />
        <path d="M6 9h12M12 7v12M8 21l4-7 4 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: 'Launch QA Checklist',
    detail:
      'Every key page, CTA path, responsive state, and content handoff is checked before launch so the finished site ships in a release-ready state.',
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
        title="Axiom Infrastructure | Premium Websites for Growth-Focused Businesses"
        description="Axiom designs and builds premium websites for businesses that need stronger trust, clearer positioning, and better conversion structure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Websites built to make your business look credible instantly.
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                  Visitors decide whether to trust a company in seconds. We design and build websites that present the business clearly, look established immediately, and make the next step feel worth taking.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    BOOK CONSULTATION NOW
                  </Link>
                  <Link
                    to="/method"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See Method
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-10 md:pt-14">
            <p className="mb-3 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Operational signals
            </p>
            <PartnerMarquee />
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-28" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Deployments</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Live demo deployments presented as a clean studio portfolio.</h2>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View Full Proof Library
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {selectedWork.map((item, index) => (
                <RevealBlock
                  as="article"
                  key={item.id}
                  delay={index * 0.08}
                  variant="card"
                  className="group/deployment flex min-h-[30rem] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_34px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#d4a48e]/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.34)]"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative overflow-hidden">
                    <ResponsiveImage
                      source={item.image}
                      sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                      alt={item.imageAlt ?? item.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover/deployment:scale-[1.03]"
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

                    <div className="mt-auto pt-6">
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
                      >
                        View Demo
                      </a>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">How We Work</p>
                <h2 className="mt-3 max-w-[20ch] text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  A better way to build a serious business website.
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

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Build Standards</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Technical standards that protect the quality of the final build.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Design quality matters, but premium sites also need dependable infrastructure, disciplined implementation, and clean launch procedures. We build for that from the start.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {standardsCards.map((item, index) => (
                <RevealBlock
                  as="article"
                  key={item.title}
                  delay={index * 0.07}
                  variant="card"
                  className="group rounded-[24px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#d4a48e]/28 hover:bg-white/[0.05] hover:shadow-[0_22px_54px_rgba(0,0,0,0.28)]"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#111a2c] text-[#d4a48e] transition-colors duration-300 group-hover:border-[#d4a48e]/30 group-hover:text-[#e4b59f]">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#F2F4F7]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.detail}
                  </p>
                </RevealBlock>
              ))}
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
                  Book Free Consultation now
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We review your scope, required functionality, and technical setup first, then guide you to the package that fits your business.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    BOOK CONSULTATION
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
