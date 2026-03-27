import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { caseStudies } from '../data/caseStudies';
import { getWorkProofImage } from '../lib/workProofImages';

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
    label: entry.label,
    experienceShift: entry.experienceShift,
    proofPoints: entry.proofPoints,
    before: entry.before,
    after: entry.after,
    strategy: entry.strategy,
  };
});

const featuredProof = selectedWork[0];
const supportingProofs = selectedWork.slice(1);

const proofSignals = [
  {
    title: 'Lead with real proof',
    detail:
      'Visitors see one complete example first, so they can quickly understand the standard of work before anything else.',
  },
  {
    title: 'Clarity over noise',
    detail:
      'Every section focuses on what changed, why it matters, and what a serious buyer needs to know to move forward.',
  },
  {
    title: 'Built for mobile behavior',
    detail:
      'The page is structured for fast scanning on a phone, with clean paths to trust, proof, and the next action.',
  },
];

const processSteps = [
  {
    title: 'Strategy alignment',
    detail:
      'We align on goals, audience, and the exact journey the site needs to support.',
  },
  {
    title: 'Proof architecture',
    detail:
      'We select the right evidence, remove distractions, and structure the narrative to earn confidence quickly.',
  },
  {
    title: 'Production delivery',
    detail:
      'We ship a focused site, validate performance and mobile flow, and deliver a clean launch handoff.',
  },
];

const fitSignals = [
  'Service businesses that need trust to be established in the first few seconds',
  'Teams that want one clear next step, not five competing calls to action',
  'Owners who value mobile performance, clear positioning, and qualified inquiries',
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Premium Websites for Growth-Focused Businesses"
        description="Axiom creates premium websites for service businesses that need stronger positioning, faster trust, and higher-quality inbound demand."
        canonicalPath="/"
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div className="max-w-4xl overflow-hidden">
                <h1
                  data-startup-heading
                  className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]"
                >
                  Premium websites that help serious service businesses win trust early.
                </h1>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                We create focused, custom websites built around proof, clarity, and mobile performance, so the right buyers understand your value and take the next step with confidence.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                  Start Application
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                >
                  View Work
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-12 md:pt-14">
            <div className="grid gap-4 md:grid-cols-3">
              {proofSignals.map((signal) => (
                <article key={signal.title} className="axiom-bento-card h-full p-5 md:p-6">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">{signal.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{signal.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Flagship proof</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  A flagship case study that shows how strategy translates into results.
                </h2>
              </div>
                <Link
                to="/work"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View all work
              </Link>
            </div>

            {featuredProof ? (
              <div className="grid gap-6 lg:grid-cols-12">
                <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_34px_rgba(0,0,0,0.18)] lg:col-span-7">
                  <div className="relative overflow-hidden">
                    <ResponsiveImage
                      source={featuredProof.image}
                      sizes="(min-width: 1280px) 720px, (min-width: 768px) 90vw, 100vw"
                      alt={featuredProof.imageAlt ?? featuredProof.title}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={featuredProof.imagePosition ? { objectPosition: featuredProof.imagePosition } : undefined}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                        {featuredProof.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-2">
                    <div>
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Experience shift</p>
                      <h3 className="mt-3 text-[1.35rem] font-semibold tracking-tight text-white sm:text-[1.55rem]">
                        {featuredProof.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300/95">
                        {featuredProof.summary}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        {featuredProof.experienceShift}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Before</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{featuredProof.before}</p>
                      </article>
                      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">After</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{featuredProof.after}</p>
                      </article>
                    </div>

                    <article className="rounded-2xl border border-white/10 bg-[#0f1524]/65 p-4 xl:col-span-2">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#A7B3BC]">What had to work</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{featuredProof.strategy}</p>
                    </article>
                  </div>
                </article>

                <div className="grid gap-4 lg:col-span-5">
                  {featuredProof.proofPoints.map((point) => (
                    <article key={point} className="axiom-bento-card p-5 md:p-6">
                      <p className="text-sm leading-relaxed text-slate-300">{point}</p>
                    </article>
                  ))}
                  {featuredProof.demoUrl ? (
                    <a
                      href={featuredProof.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open live demo for ${featuredProof.title}`}
                      className="axiom-bento-card inline-flex items-center justify-between gap-4 p-5 md:p-6"
                    >
                      <div>
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Live demo</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">Open a live example to review the execution in detail.</p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e]">Open</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">More proof</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Additional case studies across different service categories.
                </h2>
              </div>
              <Link
                to="/apply#project-application-form"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
              >
                Start Application
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {supportingProofs.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_34px_rgba(0,0,0,0.18)]">
                  <div className="relative overflow-hidden">
                    <ResponsiveImage
                      source={item.image}
                      sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
                      alt={item.imageAlt ?? item.title}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <h3 className="text-[1.3rem] font-semibold tracking-tight text-white sm:text-[1.45rem]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300/95">{item.summary}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.experienceShift}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Before</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.before}</p>
                      </article>
                      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">After</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.after}</p>
                      </article>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.proofPoints.slice(0, 2).map((point) => (
                        <span
                          key={point}
                          className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300"
                        >
                          {point}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <Link
                        to={`/work/${item.id}`}
                        className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
                      >
                        View case study
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">How we work</p>
                <h2 className="mt-3 max-w-[18ch] text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  A tight process built for speed and control.
                </h2>
              </div>

              <div className="grid gap-4 lg:col-span-7 md:grid-cols-3">
                {processSteps.map((item) => (
                  <RevealBlock as="article" key={item.title} className="axiom-bento h-full p-4 md:p-5" variant="card">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                  </RevealBlock>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">How the project is run</p>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed text-slate-300">Founder-led strategy, direction, and review</li>
                  <li className="text-sm leading-relaxed text-slate-300">Scope and requirements locked before production</li>
                  <li className="text-sm leading-relaxed text-slate-300">Critical pages QA&apos;d before launch</li>
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Who the site is built for</p>
                <ul className="mt-3 space-y-2">
                  {fitSignals.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-20 md:pt-24" variant="feature">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If your website is expected to carry growth, it should be engineered for it.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Submit an application and we&apos;ll review your scope, conversion path, and proof strategy to determine fit.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                  Start Application
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                >
                  View Work
                </Link>
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
