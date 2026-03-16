import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { getWorkProofImage } from '../lib/workProofImages';

const proofToneByLabel: Record<string, string> = {
  'Sample Build': 'border-[#B05D41]/30 text-[#d4a48e] bg-[#B05D41]/10',
  'Demonstration Site': 'border-white/20 text-slate-200 bg-white/[0.04]',
  'Concept Build': 'border-white/20 text-slate-200 bg-white/[0.04]',
  'Live Demo': 'border-emerald-300/25 text-emerald-200 bg-emerald-500/10',
  'In Progress': 'border-amber-300/25 text-amber-200 bg-amber-500/10',
};

const WorkCaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = getCaseStudyBySlug(String(slug || ''));

  if (!entry) return <Navigate to="/works" replace />;

  const proofImage = getWorkProofImage(entry.slug);
  const image = proofImage.source;
  const imagePosition = proofImage.position;
  const imageAlt = proofImage.alt || entry.title;
  const labelTone = proofToneByLabel[entry.label] || 'border-white/20 text-slate-200 bg-white/[0.04]';
  const isLiveDemo = entry.label === 'Live Demo' && Boolean(entry.demoUrl);
  const detailNote =
    isLiveDemo
      ? 'This page outlines a live project and the strategy behind it.'
      : entry.label === 'In Progress'
        ? 'This project is currently in development. Build notes are public, but the live preview is restricted until launch.'
        : `This page documents the layout intent, scope, and technical decisions for a ${entry.label.toLowerCase()}.`;

  return (
    <>
      <SEO title={`${entry.title} | Axiom Work`} description={entry.summary} />
      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
          <section className="pt-12 md:pt-16">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] ${labelTone}`}>{entry.label}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300">
                    {entry.businessType}
                  </span>
                </div>
                <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] font-semibold tracking-tight text-[#F2F4F7]">
                  {entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, '')}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{entry.summary}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                  {detailNote}
                </p>

                <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <dt className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Business Type</dt>
                    <dd className="mt-1 text-sm text-slate-200">{entry.businessType}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                    <dt className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Core Problem</dt>
                    <dd className="mt-1 text-sm text-slate-200">{entry.primaryProblem}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                    <dt className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Demonstrates</dt>
                    <dd className="mt-1 text-sm text-slate-200">{entry.demonstrates}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <dt className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Context</dt>
                    <dd className="mt-1 text-sm text-slate-200">{entry.location}</dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {isLiveDemo && entry.demoUrl ? (
                    <a
                      href={entry.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[#d4a48e]/35 bg-[#d4a48e]/12 px-5 py-3 text-sm font-medium text-[#e8bea8] transition-colors hover:border-[#e8bea8]/60 hover:bg-[#d4a48e]/18"
                    >
                      View Live Demo
                    </a>
                  ) : entry.label === 'In Progress' ? (
                    <span className="inline-flex items-center justify-center rounded-full border border-amber-300/25 bg-amber-500/10 px-5 py-3 text-sm font-medium text-amber-100">
                      Preview Soon
                    </span>
                  ) : null}
                  <Link to="/apply" className="btn-primary btn-lg inline-flex items-center justify-center">
                    Book Consultation
                  </Link>
                  <Link
                    to="/works"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    Back to Work
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="group relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[#0d1323]/80 md:h-[460px]">
                  <ResponsiveImage
                    source={image}
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 44vw, 100vw"
                    alt={imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={imagePosition ? { objectPosition: imagePosition } : undefined}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </section>

          <section className="pt-12 md:pt-16">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <article className="rounded-2xl border border-white/10 bg-[#0d1323]/75 p-6">
                  <h2 className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Build Context</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{entry.context}</p>
                </article>

                <article className="rounded-2xl border border-white/10 bg-[#0d1323]/75 p-6">
                  <h2 className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Primary Problems</h2>
                  <ul className="mt-3 space-y-3">
                    {entry.problems.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/35" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="space-y-6 lg:col-span-5">
                <article className="rounded-2xl border border-white/10 bg-[#0d1323]/75 p-6">
                  <h2 className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">What This Build Demonstrates</h2>
                  <ul className="mt-3 space-y-3">
                    {entry.built.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d4a48e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-white/10 bg-[#0d1323]/75 p-6">
                  <h2 className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Scope Snapshot</h2>
                  <ul className="mt-3 space-y-2">
                    {entry.deliverables.slice(0, 3).map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Planning targets are directional unless validated in a live deployment.
                  </p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Our Transparency Standard</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    We label our portfolio clearly so you always know what is a live client website, a demonstration build, or an active concept. No fabricated results.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="pt-14 md:pt-16">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-7 text-center md:p-10">
              <h2 className="text-3xl font-semibold tracking-tight text-[#F2F4F7] md:text-4xl">Need this level of website quality?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We can scope a similar architecture for your business context and conversion goals without template constraints.
              </p>
              <div className="mt-7 flex items-center justify-center">
                <Link to="/apply" className="btn-primary btn-lg inline-flex items-center justify-center">
                  Book Consultation
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default WorkCaseStudyPage;
