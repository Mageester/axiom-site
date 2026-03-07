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
  businessContext: `${entry.niche} - ${entry.location}`,
  coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
  demonstrates: entry.demonstrates || entry.built[0] || 'Clearer hierarchy and conversion pathways',
  scope: entry.deliverables.slice(0, 2).join(' + '),
  role: entry.built.slice(0, 2).join(' + '),
  summary: entry.summary,
  image: proofImageBySlug[entry.slug] || '/images/work-aether.jpg',
}));

const capabilities = [
  {
    title: 'Clarity',
    detail: 'Offer and message hierarchy designed for fast buyer understanding.',
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
  'Fit alignment and scope lock.',
  'Structure and conversion architecture.',
  'Production, QA, and controlled release.',
];

const fitSignals = {
  bestFit: [
    'Established business with active offers and real buying traffic.',
    'Team ready to decide on scope and move quickly.',
    'Need stronger trust, positioning, and conversion structure.',
  ],
  notFit: [
    'Template refresh requests with no clear business objective.',
    'Projects seeking volume over quality or no-fit offers.',
  ],
};

const buildStandards = [
  'Clear primary action path on every key page.',
  'Cross-device QA before launch and on intake flow.',
  'Structure built for maintainability, speed, and consistency.',
];

const buildOutcomes = [
  'Buyer clarity in first-screen messaging',
  'Stronger trust during evaluation',
  'Higher-quality inquiry pathways',
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
            <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#d4a48e]">Axiom Infrastructure</p>
                <div className="mt-5 max-w-5xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Premium websites for businesses where trust drives conversions.
                  </h1>
                </div>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Positioning, conversion architecture, and senior-led delivery for established businesses.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Apply for Fit Review
                  </a>
                  <Link
                    to="/works"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
                  >
                    View Selected Work
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div data-glass-card className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Fit Guidance</p>
                  <div className="mt-3 space-y-4 rounded-xl border border-white/10 bg-[#0f1524]/45 p-3">
                    <div>
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Best Fit For</p>
                      <ul className="mt-2 space-y-2">
                        {fitSignals.bestFit.map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-slate-200">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Not For</p>
                      <ul className="mt-2 space-y-2">
                        {fitSignals.notFit.map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-slate-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-8 md:pt-10">
            <p className="mb-3 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Limited intake. Select engagements only.
            </p>
            <PartnerMarquee />
          </section>

          <section className="pt-20 md:pt-28">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Proof Objects</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Curated Sample and Demonstration Work.</h2>
              </div>
              <Link
                to="/works"
                className="hidden items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white md:inline-flex"
              >
                View Full Proof Library
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/70 lg:col-span-7">
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
                  <h3 className="text-[clamp(1.6rem,2vw,2.1rem)] font-semibold text-white">{feature.title}</h3>
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
            <div className="mt-6 flex md:hidden">
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View Full Proof Library
              </Link>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Capabilities</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Every Axiom build is designed to improve three buyer outcomes.</h2>
              </div>
              <div className="grid gap-6 lg:col-span-8 md:grid-cols-3">
                {capabilities.map((item) => (
                  <article key={item.title} className="border-t border-white/15 pt-4">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <ul className="grid gap-3 md:grid-cols-3">
                {buildOutcomes.map((item) => (
                  <li key={item} className="text-sm text-slate-300">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pt-16 md:pt-20">
            <div className="grid gap-6 border-y border-white/10 py-8 md:grid-cols-12 md:py-10">
              <div className="md:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Method</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Engagement clarity in three steps.</h2>
              </div>
              <div className="grid gap-5 md:col-span-8 lg:grid-cols-2">
                <ol className="space-y-3">
                  {method.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 font-axiomMono text-xs text-[#d4a48e]">0{index + 1}</span>
                      <p className="text-sm text-slate-300">{step}</p>
                    </li>
                  ))}
                </ol>
                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Build Standards</p>
                  <ul className="mt-3 space-y-2">
                    {buildStandards.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-7 md:p-10">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Investment</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Structured engagements for operators with real growth intent.
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0d1323]/55 p-5">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Positioning + Conversion Core</p>
                  <p className="mt-2 text-sm text-slate-400">For stronger market signal and cleaner conversion foundation.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0d1323]/55 p-5">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Multi-Page Growth System</p>
                  <p className="mt-2 text-sm text-slate-400">For broader architecture, governance, and continuity.</p>
                </div>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-slate-400">
                Best fit: established businesses with sales volume and clear growth mandate.
              </p>
            </div>
          </section>

          <section id="intake" className="pt-24 md:pt-28">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Qualified Next Step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Apply for a fit review.</h2>
              <div className="mt-8 flex items-center justify-center">
                <a href="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Apply for Fit Review
                </a>
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
