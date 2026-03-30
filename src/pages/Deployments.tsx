import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';
import type { ResponsiveSource } from '../lib/responsiveImages';
import { getWorkProofImage } from '../lib/workProofImages';

type WorkEntry = {
  id: string;
  slug: string;
  title: string;
  businessType: string;
  summary: string;
  context: string;
  changed: string;
  image: ResponsiveSource;
  demoUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
};

const worksDisplayOrder = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);

  return {
    id: entry.slug,
    slug: entry.slug,
    title: entry.title,
    businessType: entry.businessType,
    summary: entry.summary,
    context: entry.context,
    changed: entry.demonstrates,
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
  };
});

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Work | Axiom"
        description="Real examples of service websites built to help people decide and contact the business faster."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                Real examples, clearly shown.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Most of these examples start with the same problem: the site looked finished, but it did not help visitors decide or contact the business quickly.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Aidan and Riley build and review the work themselves.
              </p>
              <div className="mt-8">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="space-y-16">
              {works.map((work, index) => {
                const content = (
                  <div className="space-y-4">
                    <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC]">{work.businessType}</p>
                    <h2 className="text-[clamp(1.9rem,3.3vw,3rem)] font-bold tracking-tight text-[#F2F4F7]">
                      {work.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{work.summary}</p>
                    <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{work.context}</p>
                    <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                      What changed: <span className="text-[#F2F4F7]">{work.changed}</span>
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                      <Link
                        to={`/works/${work.slug}`}
                        className="text-sm text-slate-300 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
                      >
                        Read more
                      </Link>
                      {work.demoUrl ? (
                        <a
                          href={work.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#d4a48e] underline decoration-[#d4a48e]/35 underline-offset-4 transition-colors hover:text-[#e8bea8]"
                        >
                          Open live site
                        </a>
                      ) : null}
                    </div>
                  </div>
                );

                const image = (
                  <ResponsiveImage
                    source={work.image}
                    sizes="(min-width: 1280px) 720px, (min-width: 1024px) 48vw, 100vw"
                    alt={work.imageAlt ?? work.title}
                    className="aspect-[16/10] w-full rounded-[1.75rem] border border-white/10 object-cover"
                    loading="lazy"
                    decoding="async"
                    style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
                  />
                );

                return (
                  <article key={work.id} className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-2 lg:items-center">
                    <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>{image}</div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : undefined}>{content}</div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                If your site is not helping people contact you faster, send it over.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We will review it ourselves and tell you what we would fix first.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <Link to="/apply" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                  Start on the Apply page
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

export default Deployments;
