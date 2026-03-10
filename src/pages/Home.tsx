import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import PartnerMarquee from '../components/PartnerMarquee';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import SingleItemCarousel from '../components/SingleItemCarousel';
import { caseStudies } from '../data/caseStudies';
import { responsiveImages, type ResponsiveSource } from '../lib/responsiveImages';

const proofImageBySlug: Record<string, ResponsiveSource> = {
  'demonstration-restaurant-reservation-site': responsiveImages.workRestaurant,
  'concept-landscaping-authority-site': responsiveImages.caseStudy1,
  'concept-roofing-conversion-site': responsiveImages.caseStudy2,
};

const proofImagePositionBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site': 'center 24%',
};

const proofImageAltBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site':
    'Server presenting plated dishes in a warmly lit dining room',
};

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Active Deployment': 'Active Deployment',
};

const homeSelectedWorkSlugs = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;
const RESTAURANT_WORK_SLUG = 'demonstration-restaurant-reservation-site';

const selectedWorkEntries = homeSelectedWorkSlugs
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const selectedWork = selectedWorkEntries.map((entry) => ({
  id: entry.slug,
  title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
  projectType: proofTypeLabel[entry.label] ?? entry.label,
  audience: entry.businessType,
  coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
  demonstrates: entry.demonstrates || entry.built[0] || 'Clearer hierarchy and conversion pathways',
  scope: entry.deliverables.slice(0, 2).join(' + '),
  summary: entry.summary,
  image: proofImageBySlug[entry.slug] || responsiveImages.workAether,
  demoUrl: entry.demoUrl,
  imageAlt: proofImageAltBySlug[entry.slug],
  imagePosition: proofImagePositionBySlug[entry.slug],
}));

const capabilities = [
  {
    title: 'Built Around Your Business',
    detail:
      'We start by understanding what you do, what needs to be included, and what the site needs to help you achieve.',
  },
  {
    title: 'Made to Build Trust',
    detail:
      'Clear structure, stronger presentation, and cleaner messaging help the business look more established online.',
  },
  {
    title: 'Designed to Generate Inquiries',
    detail:
      'Calls, forms, and booking actions are placed with intent so more of the right visitors take the next step.',
  },
];

const method = [
  '01 — We learn the business and what the site needs to do',
  '02 — We plan the pages, structure, and conversion flow',
  '03 — We build, test, and launch to a higher standard',
];

const buildStandards = [
  'Make the offer easy to understand',
  'Guide visitors to a clear next step',
  'Work cleanly across desktop and mobile',
];

const operationalSignals = [
  'Founder-led planning and review',
  'Requirements agreed before build begins',
  'Every key page checked before launch',
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const openWorkDetails = (work: (typeof selectedWork)[number]) => {
    if (work.id === RESTAURANT_WORK_SLUG && work.demoUrl) {
      window.location.assign(work.demoUrl);
      return;
    }
    navigate(`/works/${work.id}`);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, work: (typeof selectedWork)[number]) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openWorkDetails(work);
  };

  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Websites for Growth-Focused Businesses"
        description="Axiom designs and builds premium websites for businesses that need stronger trust, clearer positioning, and better conversion structure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Premium websites for businesses where trust drives conversions.
                  </h1>
                </div>
                <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                  You do premium work. Your website should reflect that. We upgrade your online presence so you instantly build trust with the clients you actually want.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    BOOK CONSULTATION NOW
                  </Link>
                  <Link
                    to="/method"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See Method
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-10 md:pt-14">
            <p className="mb-3 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Operational signals
            </p>
            <PartnerMarquee />
          </section>

          <section className="pt-16 md:pt-28">
            <div className="mb-7 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Proof of work for credible, higher-performing websites.</h2>
              </div>
              <Link
                to="/works"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/28 hover:text-white"
              >
                View Full Proof Library
              </Link>
            </div>

            <SingleItemCarousel
              items={selectedWork}
              getItemKey={(item) => item.id}
              ariaLabel="Selected work projects"
              className="mx-auto max-w-5xl"
              renderItem={(item) => (
                <article
                  role="link"
                  tabIndex={0}
                  onClick={() => openWorkDetails(item)}
                  onKeyDown={(event) => handleCardKeyDown(event, item)}
                  className="group mx-auto flex h-[540px] w-full max-w-[940px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/85 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)] sm:h-[590px] lg:h-[610px]"
                >
                  {item.demoUrl ? (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="relative block h-[46%] overflow-hidden sm:h-[50%] lg:h-[52%]"
                      aria-label={`View live demo for ${item.title}`}
                    >
                      <ResponsiveImage
                        source={item.image}
                        sizes="(min-width: 1280px) 940px, (min-width: 768px) 90vw, 100vw"
                        alt={item.imageAlt ?? item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/22 to-transparent" />
                      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                        <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                          {item.projectType}
                        </span>
                        <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
                          {item.audience}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="relative h-[46%] overflow-hidden sm:h-[50%] lg:h-[52%]">
                      <ResponsiveImage
                        source={item.image}
                        sizes="(min-width: 1280px) 940px, (min-width: 768px) 90vw, 100vw"
                        alt={item.imageAlt ?? item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/22 to-transparent" />
                      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                        <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                          {item.projectType}
                        </span>
                        <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
                          {item.audience}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col bg-[#0c1221]/92 p-4 sm:p-6">
                    <h3 className="text-[1.35rem] font-semibold tracking-tight text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-[0.84rem] leading-relaxed text-slate-300/95 sm:text-sm">{item.summary}</p>
                    <dl className="mt-3 grid gap-2.5 text-[10.5px] text-slate-200/90 sm:mt-4 sm:gap-3 sm:text-[11px] sm:grid-cols-2">
                      <div>
                        <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Core Problem</dt>
                        <dd className="mt-1 leading-relaxed">{item.coreProblem}</dd>
                      </div>
                      <div>
                        <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Demonstrates</dt>
                        <dd className="mt-1 leading-relaxed">{item.demonstrates}</dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-3.5 sm:gap-4 sm:pt-4">
                      {item.demoUrl ? (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
                        >
                          View Live Demo
                        </a>
                      ) : null}
                      {!(item.id === RESTAURANT_WORK_SLUG && item.demoUrl) ? (
                        <Link
                          to={`/works/${item.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
                        >
                          Build Notes
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              )}
            />
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">How We Work</p>
                <h2 className="mt-3 max-w-[20ch] text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  A better way to build a serious business website.
                </h2>
                <ol className="mt-5 space-y-3">
                  {method.map((step) => (
                    <li key={step} className="text-sm text-slate-300">
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-6 lg:col-span-8 md:grid-cols-3">
                {capabilities.map((item) => (
                  <article key={item.title} className="axiom-bento h-full p-4 md:p-5">
                    <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">What The Site Needs To Do</p>
                <ul className="mt-3 space-y-2">
                  {buildStandards.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">How The Project Is Run</p>
                <ul className="mt-3 space-y-2">
                  {operationalSignals.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-slate-300">{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="intake" className="pt-22 md:pt-26">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#0f1628]/88 via-[#101726]/82 to-[#0b1120]/88 p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.35)] md:p-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[16%] h-52 w-52 rounded-full bg-[#B05D41]/14 blur-3xl" />
                <div className="absolute -bottom-28 right-[10%] h-64 w-64 rounded-full bg-[#4B6EAF]/14 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
              </div>

              <div className="relative z-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">NEXT STEPS</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Book Free Consultation now
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We review your scope, required functionality, and technical setup first, then guide you to the package that fits your business.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link to="/apply" className="btn-primary btn-attention btn-lg whitespace-nowrap">
                    BOOK CONSULTATION
                  </Link>
                </div>

                <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">30-minute Zoom consultation</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Online only</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/35 md:inline-block" />
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">Founder-led review</span>
                </div>
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
