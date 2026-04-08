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

const homepageWorkPreviewBySlug: Record<string, { title: string; summary: string }> = {
  'demonstration-restaurant-reservation-site': {
    title: 'Restaurant reservation site',
    summary: 'Booking is easy to find, and the menu is simple to scan.',
  },
  'concept-landscaping-authority-site': {
    title: 'Landscaping site',
    summary: 'Past work is easier to see, and quote requests are easy to send.',
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

const heroTrustPoints = [
  'Fast on phones',
  'Easy to read',
  'Proof in the right place',
  'Easy next step',
];

const siteImprovements = [
  {
    title: 'Clearer pages',
    detail: 'People can tell what you do and where to go next.',
  },
  {
    title: 'Stronger proof',
    detail: 'Reviews, photos, and past work show up sooner.',
  },
  {
    title: 'Better on phones',
    detail: 'The site stays easy to use when people check it on mobile.',
  },
  {
    title: 'Fewer weak spots',
    detail: 'Old pages, mixed messages, and buried contact points get cleaned up.',
  },
];

const processStages = [
  {
    number: '01',
    title: 'Review',
    detail: 'We review the current site and what needs to change.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'We decide which pages matter, what proof to show, and how people should get in touch.',
  },
  {
    number: '03',
    title: 'Build',
    detail: 'We write, design, build, and check the site before it goes live.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Websites for Serious Businesses"
        description="Axiom builds clear websites for established businesses. People can see what you do, find proof fast, and know how to contact you."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Axiom',
          url: 'https://getaxiom.ca',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-10 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    A site that makes the business easy to trust
                  </h1>
                </div>
                <p data-startup-copy className="mt-6 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  People should see what you do, find proof fast, and know how to reach you. We build sites that make that clear.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link to="/works" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    See work
                  </Link>
                  <Link
                    to="/apply"
                    className="inline-flex w-full items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:w-auto"
                  >
                    Start a project
                  </Link>
                </div>
              </div>
              <div data-startup-meta className="mt-7 w-full max-w-4xl border-t border-white/8 pt-4 md:mt-10 md:pt-5">
                <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                  {heroTrustPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-slate-200/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4a48e]" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  What these sites fixed.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Each one shows a clearer offer, better proof, or an easier next step.
                </p>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                See work
              </Link>
            </div>

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
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">What we fix</p>
                <h2 className="mt-3 max-w-[10ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  What gets cleaned up.
                </h2>
                <p className="mt-4 max-w-[32ch] text-sm leading-7 text-slate-300 md:text-base">
                  Most sites do not need more pages. They need clearer pages, better proof, and fewer weak spots.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {siteImprovements.map((item, index) => (
                  <RevealBlock
                    as="article"
                    key={item.title}
                    delay={index * 0.05}
                    variant="card"
                    className="motion-surface relative overflow-hidden rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#d4a48e] shadow-[0_0_0_4px_rgba(212,164,142,0.08)]"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  How the work runs.
                </h2>
                <p className="mt-4 max-w-[32ch] text-sm leading-7 text-slate-300 md:text-base">
                  We review the site, set the page plan, then build and check everything before launch.
                </p>
              </div>

              <div className="how-work-panel">
                <div className="how-work-panel-header">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.22em] text-[#A7B3BC]">The steps</p>
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
                        <p className="mt-2 max-w-[30ch] text-sm leading-6 text-slate-300 md:text-[0.95rem]">{stage.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="intake" className="pt-16 md:pt-24" variant="feature">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#0f1628]/88 via-[#101726]/82 to-[#0b1120]/88 p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.35)] md:p-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[16%] h-52 w-52 rounded-full bg-[#B05D41]/14 blur-3xl" />
                <div className="absolute -bottom-28 right-[10%] h-64 w-64 rounded-full bg-[#4B6EAF]/14 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
              </div>

              <div className="relative z-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Start with a site review.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We&apos;ll look at the current site and tell you what needs attention first.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    Start a project
                  </Link>
                </div>

                <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">30-minute call</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">No obligation</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Clear next step</span>
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
