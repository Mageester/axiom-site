import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import SingleItemCarousel from '../components/SingleItemCarousel';
import { RevealBlock } from '../components/ui/RevealBlock';
import { caseStudies } from '../data/caseStudies';
import type { ResponsiveSource } from '../lib/responsiveImages';
import { getWorkProofImage } from '../lib/workProofImages';

interface WorkEntry {
  id: string;
  title: string;
  projectType: string;
  statusLabel: string;
  isLiveDemo: boolean;
  audience: string;
  businessContext: string;
  coreProblem: string;
  demonstrates: string;
  scope: string;
  summary: string;
  image: ResponsiveSource;
  demoUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
}

const worksDisplayOrder = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Live Demo': 'Live Demo',
  'In Progress': 'In Progress',
};

const oneSentence = (value: string) => {
  const parts = value.split('. ');
  if (parts.length <= 1) return value;
  return `${parts[0].replace(/\.$/, '')}.`;
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
    projectType: proofTypeLabel[entry.label] ?? entry.label,
    statusLabel: entry.label,
    isLiveDemo,
    audience: entry.businessType,
    businessContext: `${entry.niche} - ${entry.location}`,
    coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
    demonstrates: entry.demonstrates || entry.built[0] || 'Clearer page hierarchy and conversion pathways',
    scope: entry.deliverables.slice(0, 2).join(' + '),
    summary: oneSentence(entry.summary),
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
  };
});

function WorkCard({ work, onOpen }: { work: WorkEntry; onOpen: (work: WorkEntry) => void }) {
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(work)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onOpen(work);
      }}
      className="group/proof relative z-0 mx-auto h-[560px] w-full max-w-[960px] cursor-pointer rounded-[1.5rem] hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 sm:h-[620px] lg:h-[650px]"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1323]/84 transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/proof:-translate-y-1 group-hover/proof:border-white/20 group-hover/proof:shadow-[0_24px_54px_rgba(0,0,0,0.36)]">
      {work.isLiveDemo && work.demoUrl ? (
        <a
          href={work.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="relative block h-[44%] overflow-hidden sm:h-[50%] lg:h-[52%]"
          aria-label={`View live demo for ${work.title}`}
        >
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
              {work.projectType}
            </span>
            <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
              {work.audience}
            </span>
          </div>
        </a>
      ) : (
        <div className="relative h-[44%] overflow-hidden sm:h-[50%] lg:h-[52%]">
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
              {work.projectType}
            </span>
            <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
              {work.audience}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col bg-[#0c1221]/92 p-4 sm:p-6">
        <h3 className="text-[1.35rem] font-semibold tracking-tight text-white sm:text-2xl">{work.title}</h3>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-slate-300/95 sm:text-sm">{work.summary}</p>
        <dl className="mt-3 grid gap-2.5 text-[10.5px] text-slate-200/90 sm:mt-4 sm:gap-3 sm:text-[11px] sm:grid-cols-3">
          <div>
            <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Core Problem</dt>
            <dd className="mt-1 leading-relaxed">{work.coreProblem}</dd>
          </div>
          <div>
            <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Demonstrates</dt>
            <dd className="mt-1 leading-relaxed">{work.demonstrates}</dd>
          </div>
          <div>
            <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Scope Snapshot</dt>
            <dd className="mt-1 leading-relaxed">{work.scope}</dd>
          </div>
        </dl>
        <p className="mt-3 font-axiomMono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:mt-4">{work.businessContext}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3.5 sm:gap-4 sm:pt-4">
          {work.isLiveDemo && work.demoUrl ? (
            <a
              href={work.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
            >
              View Live Demo
            </a>
          ) : work.statusLabel === 'In Progress' ? (
            <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Preview Soon
            </span>
          ) : null}
          {!work.isLiveDemo ? (
            <Link
              to={`/works/${work.id}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
            >
              Review Build Notes
            </Link>
          ) : null}
        </div>
      </div>
      </article>
    </div>
  );
}

const Deployments: React.FC = () => {
  const navigate = useNavigate();

  const openWorkDetails = (work: WorkEntry) => {
    if (work.isLiveDemo && work.demoUrl) {
      window.open(work.demoUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(`/works/${work.id}`);
  };

  const handleViewSamplesClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('sample-builds');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEO
        title="Work | Axiom Infrastructure"
        description="Truth-first proof objects from sample and demonstration builds, presented with clear business context, problem framing, and design intent."
      />
      <Layout>
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-6 pb-1 md:px-8 md:pt-10 md:pb-0" variant="feature">
          <div className="max-w-4xl">
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Sample sites for real business use cases.</h1>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              Demonstration sites showing how we structure fast, high-trust, conversion-focused web systems for businesses where first impressions drive inquiries.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-6 md:gap-3.5">
              <a href="#sample-builds" onClick={handleViewSamplesClick} className="btn-primary btn-lg whitespace-nowrap">
                View sample builds
              </a>
              <Link
                to="/method"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-axiom-text-main"
              >
                Review method
              </Link>
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
              Items marked Live Demo are currently reachable deployments. Build notes remain available where buyers want to review the underlying proof object as well.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-1 pb-8 sm:px-6 md:px-8 md:pt-4">
          <SingleItemCarousel
            items={works}
            getItemKey={(work) => work.id}
            ariaLabel="Sample builds carousel"
            loop={false}
            className="mx-auto max-w-5xl"
            renderItem={(work) => <WorkCard work={work} onOpen={openWorkDetails} />}
          />
        </RevealBlock>

        <RevealBlock as="section" className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-visible px-6 pb-12 text-center md:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#B05D41]/[0.08] blur-[160px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this level of execution?</h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a href="/apply" className="btn-primary btn-lg whitespace-nowrap">
                Book Consultation
              </a>
              <Link
                to="/method"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
              >
                Review Method
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </RevealBlock>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
