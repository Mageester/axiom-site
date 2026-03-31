import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';
import { getWorkProofImage } from '../lib/workProofImages';

type WorkPreview = {
  id: string;
  title: string;
  summary: string;
  image: string;
  demoUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
  businessType: string;
  label: string;
};

const homeSelectedWorkSlugs = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const selectedWork: WorkPreview[] = homeSelectedWorkSlugs
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry))
  .map((entry) => {
    const proofImage = getWorkProofImage(entry.slug);

    return {
      id: entry.slug,
      title: entry.title,
      summary: entry.summary,
      image: proofImage.source,
      demoUrl: entry.demoUrl,
      imageAlt: proofImage.alt,
      imagePosition: proofImage.position,
      businessType: entry.businessType,
      label: entry.label === 'Live Demo' ? 'Live site' : 'Demo',
    };
  });

const proofPoints = [
  {
    title: 'Clearer trust on the first screen',
    body: 'We rewrite the opening message, trust points, and next step so people know they are in the right place fast.',
  },
  {
    title: 'Built by the two people you talk to',
    body: 'Aidan and Riley do the structure, writing, design, and launch work themselves.',
  },
  {
    title: 'Made for calls, quotes, and booked jobs',
    body: 'We focus on service businesses that rely on trust, mobile traffic, and a clear path to contact.',
  },
];

const processSteps = [
  'Audit what is weakening trust.',
  'Rewrite the page around one clear next step.',
  'Launch a faster, cleaner site.',
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | High-Trust Websites for Contractors and Service Businesses"
        description="Axiom is Aidan Magee and Riley Hinsperger. We rebuild weak service business websites into clearer, higher-trust sites that help turn visitors into calls and quote requests."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="max-w-4xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Axiom Infrastructure</p>
                <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,5.6vw,4.8rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                  High-trust websites for contractors and service businesses that need more qualified calls.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We rebuild weak websites into clearer, faster pages that look more credible and make the next step obvious.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a 30-minute fit call
                  </Link>
                  <Link
                    to="/works"
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                  >
                    See work examples
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.16em] text-slate-400">
                  <span>Founder-led</span>
                  <span className="hidden sm:inline">/</span>
                  <span>Built for trust and conversion</span>
                  <span className="hidden sm:inline">/</span>
                  <span>Reply within one business day</span>
                </div>
              </div>

              <div>
                <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1323]/82 shadow-[0_24px_70px_rgba(0,0,0,0.26)]">
                  <ResponsiveImage
                    source="/images/work-roofing.jpg"
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    alt="Roofing crew working on a residential roof"
                    className="aspect-[4/3] w-full object-cover"
                    loading="eager"
                    decoding="async"
                    style={{ objectPosition: 'center 36%' }}
                  />
                  <div className="p-5 md:p-6">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">What we fix</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Before</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">Vague message, weak proof, buried CTA.</p>
                      </div>
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">After</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">Clear offer, stronger trust, easier contact path.</p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="pt-16 md:pt-20">
            <div className="grid gap-6 md:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.title} className="border-t border-white/10 pt-4">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">{item.title}</p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="max-w-xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Why Axiom exists</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-tight text-[#F2F4F7]">
                  Good businesses should not look weaker online than they are in real life.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We fix vague messaging, thin proof, and buried calls to action.
                </p>
              </div>

              <div className="space-y-0">
                {processSteps.map((step, index) => (
                  <div key={step} className="border-t border-white/[0.08] py-5">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work examples</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  Strategic builds shaped around real conversion problems.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Live examples showing how we handle trust, CTA priority, and clearer service-business messaging.
                </p>
              </div>
              <Link
                to="/works"
                className="text-sm text-slate-300 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
              >
                See all work
              </Link>
            </div>

            <div className="mt-8 grid gap-6">
              {selectedWork.map((item) => {
                const card = (
                  <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1323]/82">
                    <ResponsiveImage
                      source={item.image}
                      sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
                      alt={item.imageAlt ?? item.title}
                      className="aspect-[16/9] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                    />
                    <div className="p-6 md:p-7">
                      <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">
                        {item.businessType} / {item.label}
                      </p>
                      <h3 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-[#F2F4F7]">{item.title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{item.summary}</p>
                      {item.demoUrl ? (
                        <div className="mt-5">
                          <span className="text-sm text-[#d4a48e]">Live demo available</span>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );

                if (item.demoUrl) {
                  return (
                    <a
                      key={item.id}
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
                      aria-label={`View live site for ${item.title}`}
                    >
                      {card}
                    </a>
                  );
                }

                return <div key={item.id}>{card}</div>;
              })}
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                Book a fit call and we will tell you what we would fix first.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We review the current site, tell you what we would fix first, and reply within one business day if it is a fit.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-7 text-slate-300 md:text-base">Review the site and offer</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">See what is likely costing you leads</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">Get a clear next step</li>
              </ul>
              <p className="mt-6 text-sm leading-7 text-slate-300">
                If that sounds right,{' '}
                <Link to="/apply" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                  book a 30-minute fit call
                </Link>
                .
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
