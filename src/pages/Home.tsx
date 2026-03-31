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
  'We audit what is making the current site feel weaker than the business behind it.',
  'We rebuild the message, proof, and page order around one clear next step.',
  'We launch a faster, cleaner site that is easier to trust and easier to contact.',
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
            <div className="max-w-5xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Axiom Infrastructure</p>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,5.6vw,4.8rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                High-trust websites for contractors and service businesses that need more qualified calls.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                We are Aidan Magee and Riley Hinsperger. We rebuild weak service business websites into clearer, faster pages that make the business look more credible and make the next step easier to take.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                Most clients come to us after paying for a site that looked finished but still felt vague, thin on proof, or harder to contact through than it should have been.
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
                  Too many good businesses still look smaller, weaker, or less proven than they really are online.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  A weak site does not just look dated. It creates doubt. People hesitate when the homepage is vague, the proof is thin, or the next step is harder to find than it should be.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We fix the message, the proof, and the path to contact so the site supports the business instead of quietly slowing it down.
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
                  These are live examples that show how we structure trust, call-to-action priority, and service-business messaging. They are here to show how we think, not to fake client proof.
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
                We review the business, the current site, and where trust or conversion is breaking down. If it is a fit, we reply within one business day with a clear next step.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-7 text-slate-300 md:text-base">We review the offer, structure, trust signals, and contact path.</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">We tell you what is likely costing you calls or quote requests.</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">If it is a fit, we outline the best next move.</li>
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
