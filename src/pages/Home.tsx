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

const selectedWork = selectedWorkEntries.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const preview = homepageWorkPreviewBySlug[entry.slug];
  return {
    id: entry.slug,
    title: preview?.title ?? entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    summary: preview?.summary ?? entry.summary.split('. ')[0].replace(/\.$/, '') + '.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    projectType: 'Live site',
  };
});

const heroProofPoints = [
  {
    title: 'Fast load times',
    detail: 'Pages open quickly on phones.',
  },
  {
    title: 'Clear mobile layouts',
    detail: 'Text stays easy to read on small screens.',
  },
  {
    title: 'Stronger trust',
    detail: 'The site reads like a real business.',
  },
  {
    title: 'Fewer weak pages',
    detail: 'We cut the parts people skip.',
  },
];

const weakSiteCosts = [
  {
    title: 'Smaller than it is',
    detail: 'A thin site can make a real business seem less established.',
  },
  {
    title: 'Trust drops early',
    detail: 'People leave before they see enough to call.',
  },
  {
    title: 'Proof gets buried',
    detail: 'Reviews, photos, and past work are hard to find.',
  },
  {
    title: 'Contact gets missed',
    detail: 'If the next step is hard to find, people move on.',
  },
];

const processStages = [
  {
    number: '01',
    title: 'Talk',
    detail: 'We look at the current site and the main goal.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'We set the page list, proof, and next step.',
  },
  {
    number: '03',
    title: 'Build',
    detail: 'We build the pages, check them on phones, and prepare launch.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Websites for Serious Businesses"
        description="Axiom builds websites for established businesses. Pages load quickly, stay clear on mobile, and help people trust the business sooner."
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
                    Serious websites for serious businesses
                  </h1>
                </div>
                <p data-startup-copy className="mt-6 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom builds fast websites for established businesses. The pages are clear, easy to use on phones, and help people trust the business sooner.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link to="/method" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    See how it works
                  </Link>
                  <Link
                    to="/apply"
                    className="inline-flex w-full items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:w-auto"
                  >
                    Talk to Axiom
                  </Link>
                </div>
              </div>
              <div data-startup-meta className="mt-8 flex flex-col items-center gap-4 md:mt-14 md:gap-8">
                <div className="w-full max-w-4xl">
                  <BrandCarousel />
                </div>
                <div className="w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                    {heroProofPoints.map((point) => (
                      <div key={point.title} className="bg-white/[0.015] px-3.5 py-3.5 sm:px-5 sm:py-4">
                        <p className="text-sm font-semibold tracking-[-0.02em] text-[#F2F4F7]">
                          {point.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {point.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">Why it matters</p>
                <h2 className="mt-3 max-w-[11ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  What a weak site does.
                </h2>
                <p className="mt-4 max-w-[30ch] text-sm leading-7 text-slate-300 md:text-base">
                  A weak site can make a good business look smaller, out of date, and harder to trust. It also makes contact harder.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {weakSiteCosts.map((item, index) => (
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

          <RevealBlock as="section" className="pt-16 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">What we cover first</p>
                <h2 className="mt-3 max-w-[11ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  The first call is simple.
                </h2>
                <p className="mt-4 max-w-[30ch] text-sm leading-7 text-slate-300 md:text-base">
                  We sort out the site, the pages, and the next step.
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
                        <p className="mt-2 max-w-[28ch] text-sm leading-6 text-slate-300 md:text-[0.95rem]">{stage.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-14 md:pt-28" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Examples</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  What these sites fixed.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Each one shows a clearer page, a better contact path, and less friction on mobile.
                </p>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                See examples
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
                            See site
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

          <RevealBlock as="section" id="intake" className="pt-16 md:pt-26" variant="feature">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#0f1628]/88 via-[#101726]/82 to-[#0b1120]/88 p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.35)] md:p-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[16%] h-52 w-52 rounded-full bg-[#B05D41]/14 blur-3xl" />
                <div className="absolute -bottom-28 right-[10%] h-64 w-64 rounded-full bg-[#4B6EAF]/14 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
              </div>

              <div className="relative z-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Need a better website?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We&apos;ll look at your current site and tell you what needs work.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    Talk to Axiom
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
