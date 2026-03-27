import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { caseStudies } from '../data/caseStudies';
import type { ResponsiveSource } from '../lib/responsiveImages';
import { getWorkProofImage } from '../lib/workProofImages';

interface WorkEntry {
  id: string;
  title: string;
  businessType: string;
  statusLabel: string;
  isLiveDemo: boolean;
  summary: string;
  image: ResponsiveSource;
  demoUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
  experienceShift: string;
  proofPoints: string[];
  mobileFocus: string;
  before: string;
  after: string;
}

const worksDisplayOrder = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const statusDisplayLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Live Demo': 'Live Deployment',
  'In Progress': 'In Progress',
};

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const isLiveDemo = entry.label === 'Live Demo' && Boolean(entry.demoUrl);
  return {
    id: entry.slug,
    title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    businessType: entry.businessType.replace(/\s+Business$/, ''),
    statusLabel: statusDisplayLabel[entry.label] ?? entry.label,
    isLiveDemo,
    summary: entry.summary,
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
    experienceShift: entry.experienceShift,
    proofPoints: entry.proofPoints,
    mobileFocus: entry.mobileFocus,
    before: entry.before,
    after: entry.after,
  };
});

function WorkCard({ work }: { work: WorkEntry }) {
  const card = (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1323]/84 transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/proof:-translate-y-1 group-hover/proof:border-white/20 group-hover/proof:shadow-[0_24px_54px_rgba(0,0,0,0.36)]">
      <div className="relative h-[42%] overflow-hidden sm:h-[45%]">
        <ResponsiveImage
          source={work.image}
          sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
          alt={work.imageAlt ?? work.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/proof:scale-[1.03]"
          loading="lazy"
          decoding="async"
          style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/22 to-transparent" />
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
            {work.statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[#0c1221]/92 p-5 sm:p-6">
        <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">Business Type</p>
        <p className="mt-1 text-sm font-medium text-slate-200">{work.businessType}</p>
        <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight text-white sm:text-2xl">{work.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300/95">{work.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{work.experienceShift}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Before</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{work.before}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">After</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{work.after}</p>
          </article>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {work.proofPoints.slice(0, 2).map((point) => (
            <span
              key={point}
              className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-300"
            >
              {point}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-400">{work.mobileFocus}</p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 sm:gap-4">
          {work.isLiveDemo && work.demoUrl ? (
            <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e]">
              Open live site
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
              View case study
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (work.isLiveDemo && work.demoUrl) {
    return (
      <a
        href={work.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open live site for ${work.title}`}
        className="group/proof relative z-0 block h-full w-full rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d18]"
      >
        {card}
      </a>
    );
  }

  return (
      <Link
        to={`/work/${work.id}`}
        aria-label={`View case study for ${work.title}`}
        className="group/proof relative z-0 block h-full w-full rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d18]"
      >
      {card}
    </Link>
  );
}

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Work | Axiom"
        description="Selected work, live demos, and case studies showing how Axiom turns proof, structure, and mobile clarity into stronger websites."
        canonicalPath="/work"
      />
      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-16" variant="feature">
            <div className="max-w-4xl">
              <div className="overflow-hidden">
                <h1 data-startup-heading className="text-left">
                  Work & Proof
                </h1>
              </div>
              <p data-startup-copy className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Live demos and case studies from the kinds of websites Axiom builds for businesses that need a stronger first impression, a cleaner next step, and a better mobile flow.
              </p>
              <div data-startup-actions className="mt-5 flex flex-wrap items-center gap-3 md:mt-6 md:gap-3.5">
                <a href="#sample-builds" className="btn-primary btn-lg whitespace-nowrap">
                  View proof
                </a>
          <Link
            to="/process"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-axiom-text-main"
          >
            View process
                </Link>
              </div>
              <p data-startup-meta className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
                Live demos are clearly labeled. Case studies explain the thinking, the before/after shift, and the decisions behind the layout.
              </p>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 pt-10 md:pt-14" variant="feature">
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <article className="axiom-bento-card p-5 md:p-6">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Reservation-led</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Hospitality proof that leans on atmosphere, menu clarity, and a booking path that is impossible to miss.</p>
              </article>
              <article className="axiom-bento-card p-5 md:p-6">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Consultation-first</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Landscape and outdoor services framing that uses the portfolio as evidence, then points visitors toward the next step.</p>
              </article>
              <article className="axiom-bento-card p-5 md:p-6">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Urgent vs planned</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Roofing structure that separates immediate inspection intent from longer-term exterior project planning.</p>
              </article>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {works.map((work) => (
                <div key={work.id} className="h-full">
                  <WorkCard work={work} />
                </div>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-20">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <article className="lg:col-span-7 rounded-[28px] border border-white/10 bg-[#0d1323]/80 p-6 md:p-8">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">What the portfolio proves</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  The same design system can feel different when the proof and the next step are tuned to the buyer.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Each example below is built to make a stronger first impression, tighten the path to action, and keep the mobile experience easy to scan.
                </p>
              </article>

              <article className="lg:col-span-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this level of execution?</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Start an application and we will scope the right page path, proof structure, and conversion flow for your business.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                    Start Application
                  </Link>
                  <Link
                    to="/process"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
                  >
                    View Process
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            </div>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
