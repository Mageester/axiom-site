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
  'Sample Case Study': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Active Deployment': 'Active Deployment',
};

const selectedWork = caseStudies.map((entry) => ({
  id: entry.slug,
  title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
  projectType: proofTypeLabel[entry.label] ?? entry.label,
  businessContext: `${entry.niche} - ${entry.location}`,
  scope: entry.deliverables.slice(0, 2).join(' + '),
  role: entry.built.slice(0, 2).join(' + '),
  summary: entry.summary,
  image: proofImageBySlug[entry.slug] || '/images/work-aether.jpg',
}));

const capabilities = [
  {
    title: 'Positioning Systems',
    detail: 'Message hierarchy built for stronger authority.',
  },
  {
    title: 'Conversion Systems',
    detail: 'Clear decision paths for higher-quality inquiries.',
  },
  {
    title: 'Delivery Systems',
    detail: 'Senior-led QA and release discipline.',
  },
];

const method = [
  'Fit alignment and scope lock.',
  'Structure and conversion architecture.',
  'Production, QA, and controlled release.',
];

const fitSignals = [
  { label: 'Engagement', value: 'Founder-led and selective' },
  { label: 'Typical Scope', value: 'Positioning + conversion rebuild' },
  { label: 'Response Window', value: 'Within one business day' },
];

const Home: React.FC = () => {
  const [feature, ...stacked] = selectedWork;

  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Web Systems for Service Firms"
        description="Axiom builds premium web systems for service firms focused on trust, conversion clarity, and reliable delivery."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#d4a48e]">Axiom Infrastructure</p>
                <div className="mt-5 max-w-5xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Premium websites for service firms where trust drives conversions.
                  </h1>
                </div>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Positioning, conversion architecture, and senior-led delivery for established operators.
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
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Best-Fit Profile</p>
                  <div className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0f1524]/45">
                    {fitSignals.map((item) => (
                      <div key={item.label} className="px-3 py-3">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                        <p className="mt-1 text-sm text-slate-200">{item.value}</p>
                      </div>
                    ))}
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
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Selected Work, Clearly Framed.</h2>
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-7">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{feature.projectType}</p>
                  <h3 className="mt-2 text-[clamp(1.6rem,2vw,2.1rem)] font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-200">{feature.summary}</p>
                  <dl className="mt-4 grid gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-200/90 md:grid-cols-2">
                    <div>
                      <dt className="text-slate-300/65">Business Context</dt>
                      <dd className="mt-0.5">{feature.businessContext}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-300/65">Scope</dt>
                      <dd className="mt-0.5">{feature.scope}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-slate-300/65">Axiom Role</dt>
                      <dd className="mt-0.5">{feature.role}</dd>
                    </div>
                  </dl>
                </div>
              </article>

              <div className="grid gap-5 lg:col-span-5">
                {stacked.map((item) => (
                  <article key={item.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/70">
                    <img src={item.image} alt={item.title} className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{item.projectType}</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-200/85">{item.businessContext}</p>
                      <dl className="mt-2 grid gap-1 text-[11px] text-slate-200/90">
                        <div>
                          <dt className="inline text-slate-300/65">Scope: </dt>
                          <dd className="inline">{item.scope}</dd>
                        </div>
                        <div>
                          <dt className="inline text-slate-300/65">Role: </dt>
                          <dd className="inline">{item.role}</dd>
                        </div>
                      </dl>
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
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Three systems for trust and lead quality.</h2>
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
          </section>

          <section className="pt-16 md:pt-20">
            <div className="grid gap-6 border-y border-white/10 py-8 md:grid-cols-12 md:py-10">
              <div className="md:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Method</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Engagement clarity in three steps.</h2>
              </div>
              <ol className="space-y-3 md:col-span-8">
                {method.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 font-axiomMono text-xs text-[#d4a48e]">0{index + 1}</span>
                    <p className="text-sm text-slate-300">{step}</p>
                  </li>
                ))}
              </ol>
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
                Best fit: established service firms with sales volume and clear growth mandate.
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
