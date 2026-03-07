import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import PartnerMarquee from '../components/PartnerMarquee';
import { SEO } from '../components/SEO';

const selectedWork = [
  {
    title: 'Project Ember',
    sector: 'Home Services',
    focus: 'Positioning architecture and qualified lead routing.',
    image: '/images/work-aether.jpg',
    size: 'feature',
  },
  {
    title: 'Project Ironclad',
    sector: 'Contracting',
    focus: 'Conversion flow refinement for higher-intent inquiries.',
    image: '/images/case-study-2.jpg',
    size: 'stack',
  },
  {
    title: 'Project Clarity',
    sector: 'Professional Services',
    focus: 'Editorial presentation standards across key decision pages.',
    image: '/images/case-study-1.jpg',
    size: 'stack',
  },
];

const capabilities = [
  {
    title: 'Positioning Systems',
    detail: 'Strategic message hierarchy and page composition designed to increase perceived authority.',
  },
  {
    title: 'Conversion Systems',
    detail: 'Decision-focused page flow and intake paths tuned for higher-quality opportunities.',
  },
  {
    title: 'Delivery Systems',
    detail: 'Senior-led production standards, QA controls, and release discipline from kickoff to launch.',
  },
];

const method = [
  'Qualification: fit, constraints, and commercial objective alignment.',
  'Architecture: structure, messaging, and conversion path definition.',
  'Delivery: production, QA, and controlled release handoff.',
];

const Home: React.FC = () => {
  const [feature, ...stacked] = selectedWork;

  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Web Infrastructure for Service Firms"
        description="Axiom builds premium web infrastructure for service firms focused on stronger trust signals, cleaner conversion paths, and reliable execution."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-20 md:pt-28">
            <div className="grid items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#d4a48e]">Axiom Infrastructure</p>
                <div className="mt-5 max-w-5xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Premium web infrastructure for service firms where trust decides deal value.
                  </h1>
                </div>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                  We deliver positioning, conversion, and release systems designed for businesses that need to present and perform at a higher level.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href="#intake" className="btn-primary btn-lg whitespace-nowrap">
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
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Fit Profile</p>
                  <p className="mt-3 text-sm text-slate-300">
                    Best suited for established service firms with active sales volume, serious growth intent, and internal follow-through.
                  </p>
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

          <section className="pt-24 md:pt-32">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Proof in delivery.</h2>
              </div>
              <Link to="/works" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white md:inline-flex">
                Open Work Index
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/70 lg:col-span-7">
                <img src={feature.image} alt={feature.title} className="h-[440px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-7">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{feature.sector}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 max-w-lg text-sm text-slate-200">{feature.focus}</p>
                </div>
              </article>

              <div className="grid gap-5 lg:col-span-5">
                {stacked.map((item) => (
                  <article key={item.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/70">
                    <img src={item.image} alt={item.title} className="h-[212px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">{item.sector}</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-200">{item.focus}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Capabilities</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Three systems that move commercial outcomes.</h2>
              </div>
              <div className="grid gap-6 lg:col-span-8 md:grid-cols-3">
                {capabilities.map((item) => (
                  <article key={item.title} className="border-t border-white/15 pt-4">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
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
                  <p className="mt-2 text-sm text-slate-400">For firms requiring a stronger market signal and a cleaner conversion foundation.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0d1323]/55 p-5">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Multi-Page Growth System</p>
                  <p className="mt-2 text-sm text-slate-400">For teams requiring broader page architecture, governance, and continuity.</p>
                </div>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-slate-400">
                Best fit: established service firms with sales volume, internal follow-through, and a clear growth mandate.
              </p>
            </div>
          </section>

          <section id="intake" className="pt-24 md:pt-28">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Qualified Next Step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Apply for an engagement review.</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                Share your business context and objective. We will confirm fit and propose the right engagement path.
              </p>
              <div className="mt-8 flex items-center justify-center">
                <a href="mailto:aidan@getaxiom.ca" className="btn-primary btn-lg whitespace-nowrap">
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
