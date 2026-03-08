import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import PartnerMarquee from '../components/PartnerMarquee';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';

const proofImageBySlug: Record<string, string> = {
  'sample-hvac-kitchener': '/images/work-aether.jpg',
  'concept-landscaping-authority-site': '/images/case-study-1.jpg',
  'concept-roofing-conversion-site': '/images/case-study-2.jpg',
};

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Active Deployment': 'Active Deployment',
};

const selectedWork = caseStudies.map((entry) => ({
  id: entry.slug,
  title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
  projectType: proofTypeLabel[entry.label] ?? entry.label,
  audience: entry.businessType,
  coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
  demonstrates: entry.demonstrates || entry.built[0] || 'Clearer hierarchy and conversion pathways',
  scope: entry.deliverables.slice(0, 2).join(' + '),
  summary: entry.summary,
  image: proofImageBySlug[entry.slug] || '/images/work-aether.jpg',
}));

const capabilities = [
  {
    title: 'Clarity',
    detail: 'Offer and message hierarchy designed for faster buyer understanding.',
  },
  {
    title: 'Trust',
    detail: 'Confident visual systems and structure for stronger decision confidence.',
  },
  {
    title: 'Conversion Quality',
    detail: 'Clear action paths for higher-intent inquiries and fewer dead clicks.',
  },
];

const method = [
  'Fit alignment and scope lock',
  'Structure and conversion architecture',
  'Production, QA, and controlled release',
];

const buildStandards = [
  'Clear primary action path on every key page',
  'Cross-device QA before launch and intake flow checks',
  'Structure built for maintainability and speed',
];

const operationalSignals = [
  'Founder-led intake review',
  'Scope lock before production',
  'Controlled release checklist',
];

const Home: React.FC = () => {
  const [feature, ...stacked] = selectedWork;

  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Websites for Growth-Focused Businesses"
        description="Axiom designs and builds premium websites for businesses that need stronger trust, clearer positioning, and better conversion structure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="grid gap-7 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#d4a48e]">Axiom Infrastructure</p>
                <div className="mt-5 max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Premium websites for businesses where trust drives conversions.
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                  Senior-led web infrastructure for established service businesses that need stronger positioning, cleaner conversion flow, and reliable execution.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Apply for Fit Review
                  </Link>
                  <Link
                    to="/infrastructure"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See Method
                  </Link>
                </div>
              </div>

              <aside className="lg:col-span-4">
                <article data-glass-card className="axiom-bento p-5 md:p-6">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Engagement Snapshot</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-white/10 bg-[#0f1524]/40 p-3">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Call Format</p>
                      <p className="mt-1 text-sm text-slate-200">30-minute online Zoom consultation</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#0f1524]/40 p-3">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Decision Model</p>
                      <p className="mt-1 text-sm text-slate-200">Scope clarity before production starts</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#0f1524]/40 p-3">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Delivery Style</p>
                      <p className="mt-1 text-sm text-slate-200">Founder-led and selectively scoped</p>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </section>

          <section className="pt-10 md:pt-14">
            <p className="mb-3 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Operational signals
            </p>
            <PartnerMarquee />
          </section>

          <section className="pt-20 md:pt-28">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Proof objects built for trust and conversion clarity.</h2>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View Full Proof Library
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/65 lg:col-span-7">
                <img src={feature.image} alt={feature.title} className="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent" />
                <div className="absolute left-6 top-6 z-10 flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                    {feature.projectType}
                  </span>
                  <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
                    {feature.audience}
                  </span>
                </div>
                <div className="absolute inset-x-6 bottom-6 z-10 rounded-2xl border border-white/15 bg-black/35 p-6 backdrop-blur-md">
                  <h3 className="text-[clamp(1.55rem,2vw,2rem)] font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-200">{feature.summary}</p>
                  <dl className="mt-4 grid gap-3 text-[11px] uppercase tracking-[0.12em] text-slate-200/90 md:grid-cols-3">
                    <div>
                      <dt className="text-slate-300/65">Core Problem</dt>
                      <dd className="mt-0.5 normal-case tracking-normal text-slate-100">{feature.coreProblem}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-300/65">Demonstrates</dt>
                      <dd className="mt-0.5 normal-case tracking-normal text-slate-100">{feature.demonstrates}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-300/65">Scope Snapshot</dt>
                      <dd className="mt-0.5 normal-case tracking-normal text-slate-100">{feature.scope}</dd>
                    </div>
                  </dl>
                  <Link
                    to={`/works/${feature.id}`}
                    className="mt-4 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
                  >
                    View Build Notes
                  </Link>
                </div>
              </article>

              <div className="grid gap-5 lg:col-span-5">
                {stacked.map((item, index) => (
                  <article key={item.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/85">
                    <div className={`relative ${index === 0 ? 'h-[56%]' : 'h-[52%]'} overflow-hidden`}>
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute left-4 top-4">
                        <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                          {item.projectType}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">{item.audience}</p>
                      {index === 0 && <p className="text-sm text-slate-300/95">{item.summary}</p>}
                      <dl className="grid gap-2 text-[11px] text-slate-200/90">
                        <div>
                          <dt className="text-slate-300/65">Core Problem</dt>
                          <dd className="mt-0.5">{item.coreProblem}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-300/65">Demonstrates</dt>
                          <dd className="mt-0.5">{item.demonstrates}</dd>
                        </div>
                      </dl>
                      <Link
                        to={`/works/${item.id}`}
                        className="mt-2 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
                      >
                        Build Notes
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Delivery Method</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                A cleaner engagement model for high-intent business owners.
                </h2>
                <ol className="mt-5 space-y-3">
                  {method.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 font-axiomMono text-xs text-[#d4a48e]">0{index + 1}</span>
                      <p className="text-sm text-slate-300">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-6 lg:col-span-8 md:grid-cols-3">
                {capabilities.map((item) => (
                  <article key={item.title} className="axiom-bento p-5">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Build Standards</p>
                <ul className="mt-3 space-y-2">
                  {buildStandards.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Operational Signals</p>
                <ul className="mt-3 space-y-2">
                  {operationalSignals.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="intake" className="pt-22 md:pt-26">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Qualified Next Step</p>
              <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Apply for a fit review.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We review scope, technical requirements, and delivery fit before recommending the best package for your business.
              </p>
              <div className="mt-8 flex items-center justify-center">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Apply for Fit Review
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
