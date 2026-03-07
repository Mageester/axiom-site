import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const proofItems = [
  {
    title: 'Positioning Architecture',
    detail:
      'Message structure, hierarchy, and page flow designed to signal market leadership in the first scroll.',
  },
  {
    title: 'Experience QA',
    detail:
      'Responsive QA, interaction reviews, and form-path testing before release so quality holds under real traffic.',
  },
  {
    title: 'Release Discipline',
    detail:
      'Every release is versioned, reviewed, and shipped against defined acceptance criteria.',
  },
];

const capabilities = [
  {
    title: 'Positioning-First Homepage Systems',
    detail:
      'We shape first impressions so your firm reads as the premium option before a conversation starts.',
  },
  {
    title: 'Conversion Paths for Qualified Demand',
    detail:
      'Every page guides serious buyers toward the next decision with less friction and clearer intent.',
  },
  {
    title: 'Editorial Brand Presentation',
    detail:
      'Typography, rhythm, and composition tuned to increase trust across desktop and mobile.',
  },
  {
    title: 'Operational Delivery',
    detail:
      'Release quality designed for teams that need reliability, not redesign churn.',
  },
];

const standards = [
  'Commercial framing is locked before production begins.',
  'Content hierarchy and conversion path are finalized before build.',
  'QA and release checklist are completed before handoff.',
];

const faqs = [
  {
    question: 'Who is Axiom best suited for?',
    answer:
      'Service businesses with established revenue, a real sales process, and the intent to strengthen market positioning.',
  },
  {
    question: 'Who is not a fit?',
    answer:
      'Teams prioritizing the lowest-cost option or immediate same-week turnaround.',
  },
  {
    question: 'What happens first?',
    answer:
      'A qualification call. If there is fit, we define scope, standards, and commercial objectives before production begins.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom Infrastructure | Digital Infrastructure for Premium Service Brands"
        description="Axiom builds high-trust digital infrastructure for service businesses that need stronger positioning, cleaner conversion paths, and reliable execution."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-20 md:pt-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#d4a48e]">Axiom Infrastructure</p>
                <div className="mt-5 max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.6rem,6vw,5.1rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    The digital standard for service firms that intend to lead their category.
                  </h1>
                </div>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">
                  We build web systems that strengthen trust, improve lead quality, and support higher-value sales conversations.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#intake" className="btn-primary btn-lg whitespace-nowrap">
                    Request a Fit Call
                  </a>
                  <Link
                    to="/works"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
                  >
                    Review Work
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div data-glass-card className="machined-card rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-7 md:p-8">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.2em] text-[#A7B3BC]">Engagement Profile</p>
                  <ul className="mt-5 space-y-4 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B05D41]" />
                      <span>Selective intake with limited active engagements.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B05D41]" />
                      <span>Built for firms where brand presentation directly influences deal value.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B05D41]" />
                      <span>Scoped around commercial outcomes, not visual novelty.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 md:pt-10">
            <div className="machined-card rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 md:px-8 md:py-5">
              <div className="grid gap-3 text-xs uppercase tracking-[0.16em] text-[#A7B3BC] md:grid-cols-3 md:gap-6">
                <p>Selective Intake</p>
                <p>Quality Gates Before Launch</p>
                <p>Senior-Led Delivery</p>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-28">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Proof</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Selected Work</h2>
              </div>
              <Link to="/works" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white md:inline-flex">
                Open Work Index
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {proofItems.map((item) => (
                <article key={item.title} className="machined-card rounded-2xl border border-white/10 bg-[#0d1323]/62 p-6">
                  <h3 className="text-xl font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>

            <p className="mt-6 max-w-3xl text-sm text-slate-400">
              Proof is presented through execution quality, delivery standards, and visible work output.
            </p>
          </section>

          <section className="pt-20 md:pt-28">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Capabilities</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
              Built to increase trust, sharpen positioning, and improve the quality of inbound opportunities.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {capabilities.map((item) => (
                <article key={item.title} className="machined-card rounded-2xl border border-white/10 bg-[#0d1323]/58 p-6 md:p-7">
                  <h3 className="text-xl font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-20 md:pt-28">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Standards</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Lean process. Strict standards.</h2>
              </div>
              <ol className="lg:col-span-7 space-y-4">
                {standards.map((item, index) => (
                  <li key={item} className="machined-card flex gap-4 rounded-2xl border border-white/10 bg-[#0d1323]/56 p-5 md:p-6">
                    <span className="mt-0.5 font-axiomMono text-xs text-[#d4a48e]">0{index + 1}</span>
                    <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="pt-20 md:pt-28">
            <div className="machined-card rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Investment</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Structured engagements, not one-off design tasks.</h2>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300">
                Engagements are scoped around commercial objectives, timeline constraints, and operating capacity. Investment is defined after qualification.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Positioning + Conversion Core</p>
                  <p className="mt-2 text-sm text-slate-400">For firms requiring a stronger market signal and a cleaner conversion foundation.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Multi-Page Growth System</p>
                  <p className="mt-2 text-sm text-slate-400">For teams requiring broader page architecture, governance, and continuity.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-28">
            <div className="grid gap-4">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">FAQ</p>
              {faqs.map((item) => (
                <article key={item.question} className="machined-card rounded-2xl border border-white/10 bg-[#0d1323]/55 p-6">
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.question}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="intake" className="pt-20 md:pt-28">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Qualified Next Step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">If fit is strong, we map the engagement within one call.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
                Send a concise brief with business context. We will confirm fit, define scope, and recommend the appropriate engagement path.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a href="mailto:aidan@getaxiom.ca" className="btn-primary btn-lg whitespace-nowrap">
                  Request a Fit Call
                </a>
                <a
                  href="mailto:aidan@getaxiom.ca?subject=Axiom%20Project%20Brief"
                  className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  Send Brief by Email
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
