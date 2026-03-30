import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { getWorkProofImage } from '../lib/workProofImages';

const WorkCaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = getCaseStudyBySlug(String(slug || ''));

  if (!entry) return <Navigate to="/works" replace />;

  const proofImage = getWorkProofImage(entry.slug);
  const image = proofImage.source;
  const imagePosition = proofImage.position;
  const imageAlt = proofImage.alt || entry.title;
  const detailNote =
    entry.label === 'Live Demo' && entry.demoUrl
      ? 'This page shows the live site and the choices behind it.'
      : 'This is the kind of work we do when the site has to make the next step obvious.';

  return (
    <>
      <SEO title={`${entry.title} | Axiom Work`} description={entry.summary} />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">
                {entry.businessType} / {entry.location}
              </p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                {entry.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">{entry.summary}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{detailNote}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {entry.demoUrl ? (
                  <a
                    href={entry.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#d4a48e] underline decoration-[#d4a48e]/35 underline-offset-4 transition-colors hover:text-[#e8bea8]"
                  >
                    Open live site
                  </a>
                ) : null}
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-16 md:pt-20">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <ResponsiveImage
                source={image}
                sizes="(min-width: 1280px) 760px, (min-width: 1024px) 48vw, 100vw"
                alt={imageAlt}
                className="aspect-[16/10] w-full rounded-[1.75rem] border border-white/10 object-cover"
                loading="eager"
                decoding="async"
                style={imagePosition ? { objectPosition: imagePosition } : undefined}
              />

              <div className="space-y-8">
                <div className="border-t border-white/10 pt-5">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC]">What was wrong</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{entry.primaryProblem}</p>
                  <ul className="mt-4 space-y-3">
                    {entry.problems.slice(0, 3).map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-300 md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC]">What changed</p>
                  <ul className="mt-4 space-y-3">
                    {entry.built.slice(0, 3).map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-300 md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC]">Why it matters</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{entry.demonstrates}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{entry.context}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Scope</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {entry.deliverables.slice(0, 3).map((item) => (
                  <p key={item} className="border-t border-white/10 pt-4 text-sm leading-7 text-slate-300 md:text-base">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                If your site has the same problem, send it over.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We will look at the current site, tell you what we would fix first, and say whether it is a fit.
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

export default WorkCaseStudyPage;
