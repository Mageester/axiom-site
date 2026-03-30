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
    title: 'Visitors understand it faster',
    body: 'The page says what you do, what people should do next, and how to contact you.',
  },
  {
    title: 'Built by Aidan and Riley',
    body: 'You work directly with the founders who design, write, and launch the site.',
  },
  {
    title: 'Made for real service work',
    body: 'We focus on calls, quote requests, reservations, and simple forms.',
  },
];

const processSteps = [
  'We learn what you sell, who you want to reach, and what the current site is missing.',
  'We write the page around one clear action.',
  'We build, check, and launch without adding work the business does not need.',
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom | Simple Websites for Service Businesses"
        description="Axiom is Aidan Magee and Riley Hinsperger. We build websites that help service businesses get more calls."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Axiom Infrastructure</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.6vw,4.8rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                Websites that help service businesses get more calls.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                We are Aidan Magee and Riley Hinsperger. We build the site ourselves. Most businesses come to us after spending money on a site that looked fine but did not bring in leads.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </Link>
                <p className="text-sm text-slate-300">One short call. We review the business and the current site.</p>
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
                  We make pages that help people decide faster.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  Most clients come to us after a site that looked finished but did not bring in leads. We fix the order, the message, and the path to contact.
                </p>
              </div>

              <div className="space-y-0">
                {processSteps.map((step, index) => (
                  <div key={step} className={`${index > 0 ? 'border-t border-white/8' : 'border-t border-white/8'} py-5`}>
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
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Recent work</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  Proof from real projects.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  These examples are built around real business problems, not a visual style exercise.
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
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">What happens next</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                Send the site and we will tell you what happens next.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We review the business, the current site, and the lead path. If it is a fit, we reply within one business day with a clear next step.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-7 text-slate-300 md:text-base">We review the site and the offer.</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">We tell you what we would fix first.</li>
                <li className="text-sm leading-7 text-slate-300 md:text-base">If it is a fit, we send the next step.</li>
              </ul>
              <p className="mt-6 text-sm leading-7 text-slate-300">
                If that sounds right,{' '}
                <Link to="/apply" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                  start on the Apply page
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
