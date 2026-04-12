import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { caseStudies } from '../data/caseStudies';
import { CTA } from '../lib/cta';
import { HOME_JSON_LD, SEO_ROUTES } from '../lib/seo';
import { getWorkProofImage } from '../lib/workProofImages';

const homeSelectedWorkSlugs = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const selectedWorkEntries = homeSelectedWorkSlugs
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const homepageWorkPreviewBySlug: Record<string, { title: string; summary: string }> = {
  'demonstration-restaurant-reservation-site': {
    title: 'Restaurant reservation site',
    summary: 'Booking is easy to find, and the menu stays readable on phones.',
  },
  'concept-landscaping-authority-site': {
    title: 'Landscaping site',
    summary: 'Past work comes forward, and quote requests stay short.',
  },
  'concept-roofing-conversion-site': {
    title: 'Roofing site',
    summary: 'Urgent calls and planned estimates each have a clear path.',
  },
};

const homepageWorkPresentationBySlug: Record<string, { statusLabel: string; ctaLabel: string }> = {
  'demonstration-restaurant-reservation-site': {
    statusLabel: 'Live',
    ctaLabel: 'View live site',
  },
  'concept-landscaping-authority-site': {
    statusLabel: 'Demo',
    ctaLabel: 'View demo',
  },
  'concept-roofing-conversion-site': {
    statusLabel: 'Demo',
    ctaLabel: 'View demo',
  },
};

const selectedWork = selectedWorkEntries.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const preview = homepageWorkPreviewBySlug[entry.slug];
  const presentation = homepageWorkPresentationBySlug[entry.slug] ?? {
    statusLabel: entry.demoUrl ? 'Live' : 'Demo',
    ctaLabel: entry.demoUrl ? 'View live site' : 'View demo',
  };
  const cleanTitle = preview?.title ?? entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, '');
  return {
    id: entry.slug,
    title: cleanTitle,
    summary: preview?.summary ?? entry.summary.split('. ')[0].replace(/\.$/, '') + '.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    statusLabel: presentation.statusLabel,
    ctaLabel: presentation.ctaLabel,
    ariaLabel: `${presentation.ctaLabel} for ${cleanTitle}`,
  };
});
const hasSelectedWork = selectedWork.length > 0;

const heroTrustPoints = [
  'Service first',
  'Proof visible',
  'Works on phones',
  'Contact clear',
];

const siteImprovements = [
  {
    title: 'Show the service',
    detail: 'People should know what you do before they start hunting.',
  },
  {
    title: 'Show the proof',
    detail: 'Photos, reviews, and past work should be easy to find.',
  },
  {
    title: 'Show the contact path',
    detail: 'Phone, form, and email need to be obvious.',
  },
  {
    title: 'Work on phones',
    detail: 'The layout has to stay readable and usable on a small screen.',
  },
];

const processStages = [
  {
    number: '01',
    title: 'Review',
    detail: 'We look at the current site and the gaps that are costing trust.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'We agree on the pages, proof, and contact path before design starts.',
  },
  {
    number: '03',
    title: 'Build',
    detail: 'We write, design, test, and launch the site with mobile checks in place.',
  },
];

const manifestoTeaserPoints = [
  'Most sites hide the service until people start hunting.',
  'Proof arrives too late to build trust when it matters.',
  'Calls and quote requests pick up friction instead of clarity.',
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        {...SEO_ROUTES.home}
        schema={HOME_JSON_LD}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="relative pt-10 md:pt-20">
            <div className="max-w-6xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Infrastructure That Scales Your Empire
                  </h1>
                </div>
                <p data-startup-copy className="mt-6 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom Infrastructure builds clear, fast sites for service businesses that need the service, the proof, and the contact path to stay obvious.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link
                    to={CTA.primary.to}
                    className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto"
                  >
                    {CTA.primary.label}
                  </Link>
                  <Link
                    to={CTA.work.to}
                    className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white sm:w-auto"
                  >
                    {CTA.work.label}
                  </Link>
                </div>
              </div>
              <div data-startup-meta className="mt-7 w-full max-w-4xl border-t border-white/8 pt-4 md:mt-10 md:pt-5">
                <ul className="mt-1 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                  {heroTrustPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-slate-100">
                      <span className="h-2 w-2 rounded-full bg-[#d4a48e]" aria-hidden="true" />
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 pointer-events-none xl:block opacity-40" aria-hidden="true">
              <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
                <defs>
                  <radialGradient id="hero-topology-fade" cx="50%" cy="50%" r="50%">
                    <stop offset="40%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                  <mask id="hero-topology-mask">
                    <rect width="480" height="480" fill="url(#hero-topology-fade)" />
                  </mask>
                </defs>
                <g mask="url(#hero-topology-mask)">
                  <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
                    <path d="M40 40V440" />
                    <path d="M120 40V440" />
                    <path d="M200 40V440" />
                    <path d="M280 40V440" />
                    <path d="M360 40V440" />
                    <path d="M440 40V440" />
                    <path d="M40 40H440" />
                    <path d="M40 120H440" />
                    <path d="M40 200H440" />
                    <path d="M40 280H440" />
                    <path d="M40 360H440" />
                    <path d="M40 440H440" />
                    <path d="M40 40L200 200L360 120L440 280" />
                    <path d="M120 440L200 280L360 360L440 200" />
                    <path d="M120 120L280 280L360 360" />
                    <path d="M40 280L120 200L280 120L440 40" />
                  </g>
                  <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none">
                    <circle cx="120" cy="120" r="7" />
                    <circle cx="200" cy="200" r="9" />
                    <circle cx="280" cy="120" r="8" />
                    <circle cx="360" cy="360" r="10" />
                    <circle cx="440" cy="280" r="7" />
                  </g>
                  <g fill="#d4a48e">
                    <circle cx="120" cy="120" r="3.5" fillOpacity="0.3" />
                    <circle cx="280" cy="120" r="3.5" fillOpacity="0.3" />
                    <circle cx="360" cy="360" r="3.5" fillOpacity="0.3" />
                  </g>
                </g>
              </svg>
            </div>
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.16fr)_minmax(18rem,0.84fr)] lg:items-start">
                <div className="max-w-3xl">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Why it matters</p>
                  <h2 className="mt-3 max-w-[16ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                    Most service-business sites lose trust before the first call.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                    The Manifesto lays out why brochure-site thinking fails service businesses in KW and across Ontario, and what the web presence actually needs to do if it is supposed to help sales.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link to="/manifesto" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                      Read Why It Matters
                    </Link>
                    <Link
                      to={CTA.primary.to}
                      className="inline-flex min-h-11 items-center justify-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:w-auto"
                    >
                      Start a project
                    </Link>
                  </div>
                </div>

                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <p className="font-axiomMono text-[11.5px] uppercase tracking-[0.2em] text-[#A7B3BC]">What the page covers</p>
                  <div className="mt-4 divide-y divide-white/[0.08]">
                    {manifestoTeaserPoints.map((point) => (
                      <div key={point} className="py-4 first:pt-0 last:pb-0">
                        <p className="text-[14px] leading-[1.8] text-slate-200">{point}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
              <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Examples</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    What the standard looks like.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                    These examples keep the service, proof, and contact path visible.
                  </p>
                </div>
              </div>

            {hasSelectedWork ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {selectedWork.map((item, index) => {
                  const card = (
                    <RevealBlock
                      as="article"
                      delay={index * 0.08}
                      variant="card"
                      className="motion-surface flex min-h-[30rem] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_28px_rgba(0,0,0,0.16)] group-hover/deployment:-translate-y-0.5 group-hover/deployment:border-[#d4a48e]/30 group-hover/deployment:shadow-[0_18px_42px_rgba(0,0,0,0.26)] group-focus-visible/deployment:-translate-y-0.5 group-focus-visible/deployment:border-[#d4a48e]/35 group-focus-visible/deployment:shadow-[0_18px_42px_rgba(0,0,0,0.26)]"
                    >
                      <div className="relative overflow-hidden">
                        <ResponsiveImage
                          source={item.image}
                          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                          alt={item.imageAlt ?? item.title}
                          className="motion-media aspect-[16/10] w-full object-cover group-hover/deployment:scale-[1.015] group-focus-visible/deployment:scale-[1.015]"
                          loading="lazy"
                          decoding="async"
                          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                            {item.statusLabel}
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
                              {item.ctaLabel}
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
                      aria-label={item.ariaLabel}
                      className="group/deployment block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d18]"
                    >
                      {card}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F2F4F7]">
                  Current examples are unavailable.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  The work page still shows the current proof structure, and the intake page is open if you want to start a project now.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to={CTA.work.to} className="btn-primary btn-lg w-full sm:w-auto">
                    {CTA.work.label}
                  </Link>
                  <Link to={CTA.primary.to} className="btn-secondary w-full sm:w-auto">
                    {CTA.primary.label}
                  </Link>
                </div>
              </div>
            )}
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-start lg:gap-14">
              <div className="max-w-2xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">What matters</p>
                <h2 className="mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  What a good site has to do.
                </h2>
                <p className="mt-4 max-w-[36ch] text-sm leading-7 text-slate-300 md:text-base">
                  If people have to hunt for the service, proof, or contact path, the site is making the decision harder.
                </p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {siteImprovements.map((item, index) => (
                  <RevealBlock
                    as="div"
                    key={item.title}
                    delay={index * 0.05}
                    variant="card"
                    className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:py-6"
                  >
                    <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.detail}
                      </p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-start lg:gap-14">
              <div className="max-w-2xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  How the work runs.
                </h2>
                <p className="mt-4 max-w-[36ch] text-sm leading-7 text-slate-300 md:text-base">
                  We keep the process short so the work stays focused.
                </p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {processStages.map((stage, index) => (
                  <RevealBlock
                    as="div"
                    key={stage.title}
                    delay={index * 0.05}
                    variant="card"
                    className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:py-6"
                  >
                    <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">
                      {stage.number}
                    </div>
                    <div>
                      <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.08rem]">
                        {stage.title}
                      </h3>
                      <p className="mt-2 max-w-[30ch] text-sm leading-6 text-slate-300 md:text-[0.95rem]">
                        {stage.detail}
                      </p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="intake" className="pt-16 md:pt-24" variant="feature">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div className="max-w-3xl">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    Want a clearer site?
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Start a project and we&apos;ll review the current site, what&apos;s missing, and the first fixes that matter.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                      {CTA.primary.label}
                    </Link>
                  </div>
                </div>

                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What happens next</p>
                  <div className="mt-4 divide-y divide-white/[0.08]">
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Review current site</p>
                    </div>
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">See what&apos;s missing</p>
                    </div>
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Show the first fixes</p>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
