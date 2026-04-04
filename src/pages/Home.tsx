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
    summary: entry.summary.split('. ')[0].replace(/\.$/, '') + '.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    projectType: proofTypeLabel[entry.label] ?? entry.label,
  };
});

const standardsCards = [
  {
    title: 'Clear on any screen',
    detail: 'Spacing and type stay composed from desktop to mobile.',
  },
  {
    title: 'Structured to earn trust',
    detail: 'The page makes the business feel established before it asks for action.',
  },
  {
    title: 'Checked before launch',
    detail: 'Core pages, forms, and mobile details are reviewed end to end.',
  },
  {
    title: 'Built to feel professional from first visit',
    detail: 'The whole experience is polished enough to inspire confidence immediately.',
  },
];

const processStages = [
  {
    number: '01',
    title: 'Discover',
    detail: 'We learn about your business, your customers, and your goals.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'We agree on the pages, content, and structure before anything is built.',
  },
  {
    number: '03',
    title: 'Launch',
    detail: 'We design, build, test, and deliver a site you can be proud of.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Professional Websites for Established Businesses"
        description="Axiom builds professional websites for established businesses that need a stronger online presence, clearer messaging, and more customer inquiries."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Axiom Infrastructure',
          url: 'https://getaxiom.ca',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Serious websites for serious businesses
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We build websites that help established businesses look professional, earn trust fast, and turn more visitors into customers.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book Free Consultation
                  </Link>
                  <Link
                    to="/method"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section data-reveal="off" className="pt-10 md:pt-14">
            <BrandCarousel />
          </section>

          <RevealBlock as="section" className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">How We Work</p>
                <h2 className="mt-3 max-w-[11ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  A simple process that keeps things clear.
                </h2>
                <p className="mt-4 max-w-[30ch] text-sm leading-7 text-slate-300 md:text-base">
                  One call to understand your business. A clear plan. A professional launch.
                </p>
              </div>

              <div className="how-work-panel">
                <div className="how-work-panel-header">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.22em] text-[#A7B3BC]">Our process</p>
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

          <RevealBlock as="section" className="pt-16 md:pt-28" variant="feature">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  See what we build.
                </h2>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View all work
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {selectedWork.map((item, index) => {
                const card = (
                  <RevealBlock
                    as="article"
                    delay={index * 0.08}
                    variant="card"
                    className="flex min-h-[30rem] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1221]/92 shadow-[0_10px_34px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/deployment:-translate-y-1 group-hover/deployment:border-[#d4a48e]/30 group-hover/deployment:shadow-[0_24px_60px_rgba(0,0,0,0.34)] group-focus-visible/deployment:-translate-y-1 group-focus-visible/deployment:border-[#d4a48e]/35 group-focus-visible/deployment:shadow-[0_24px_60px_rgba(0,0,0,0.34)]"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative overflow-hidden">
                      <ResponsiveImage
                        source={item.image}
                        sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                        alt={item.imageAlt ?? item.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover/deployment:scale-[1.03] group-focus-visible/deployment:scale-[1.03]"
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
                            View demo
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

          <RevealBlock as="section" className="pt-20 md:pt-24" variant="feature">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-12">
              <div className="max-w-xl lg:sticky lg:top-24">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">
                  WHAT YOU GET
                </p>
                <h2 className="mt-3 max-w-[13ch] text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  A clear standard, built into every site.
                </h2>
                <p className="mt-5 max-w-[32ch] text-sm leading-7 text-slate-300 md:text-base">
                  Every Axiom site is shaped to feel composed, trustworthy, and ready to take inquiries from the first visit.
                </p>
              </div>

              <div className="standards-panel">
                <div className="standards-lead">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.2em] text-[#A7B3BC]">
                      Included in every build
                    </p>
                    <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/60 md:inline-flex">
                      Axiom standard
                    </span>
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-end">
                    <div>
                      <h3 className="max-w-[12ch] text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-[#F2F4F7]">
                        Fast, stable, and calm by default.
                      </h3>
                      <p className="mt-4 max-w-[30ch] text-sm leading-7 text-slate-300 md:text-base">
                        Your site loads quickly, reads cleanly, and keeps the attention on your business.
                      </p>
                    </div>

                    <div className="hidden lg:block">
                      <div className="flex flex-col gap-3 border-l border-white/10 pl-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-white/55">
                          Why it matters
                        </p>
                        <p className="text-sm leading-6 text-slate-300">
                          The experience feels established before it asks for action.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="standards-support-grid">
                  {standardsCards.slice(0, 4).map((item, index) => (
                    <RevealBlock
                      as="article"
                      key={item.title}
                      delay={index * 0.06}
                      variant="card"
                      className="standards-support-item"
                    >
                      <span className="standards-support-mark" aria-hidden="true" />
                      <div className="min-w-0">
                        <h4 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.04rem]">
                          {item.title}
                        </h4>
                        <p className="mt-2 max-w-[30ch] text-sm leading-6 text-slate-300">
                          {item.detail}
                        </p>
                      </div>
                    </RevealBlock>
                  ))}
                </div>
              </div>
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
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Ready to upgrade your website?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Book a free 30-minute call. We&apos;ll review your current website, understand your goals, and outline the best next step.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    Book a Free Consultation
                  </Link>
                </div>

                <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">30-minute call</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Free, no obligation</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Founder-led</span>
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
