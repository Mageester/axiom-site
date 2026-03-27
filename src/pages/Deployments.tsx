import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  improvement: string;
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

const statusDisplayLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept',
  'Demonstration Site': 'Demo',
  'Live Demo': 'Live Deployment',
  'In Progress': 'In Progress',
};

const improvementCopyBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site': 'Live demo showing a clearer reservation flow and a more trustworthy first impression for diners.',
  'concept-landscaping-authority-site': 'Concept build showing a clearer quote path and a more trustworthy first impression for homeowners.',
  'concept-roofing-conversion-site': 'Concept build showing clearer priority for urgent and planned roofing inquiries.',
};

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const isLiveDemo = entry.label === 'Live Demo' && Boolean(entry.demoUrl);
  return {
    id: entry.slug,
    title: entry.title.replace(/^(Sample|Demo|Concept):\s*/, ''),
    businessType: entry.businessType.replace(/\s+Business$/, ''),
    statusLabel: statusDisplayLabel[entry.label] ?? entry.label,
    isLiveDemo,
    improvement: improvementCopyBySlug[entry.slug] ?? 'Built to create a clearer, more modern, and more trustworthy first impression.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
  };
});

function WorkCard({
  work,
  onOpen,
  featured = false,
}: {
  work: WorkEntry;
  onOpen: (work: WorkEntry) => void;
  featured?: boolean;
}) {
  const imageClassName = 'h-full w-full object-cover transition-transform duration-700 ease-out group-hover/proof:scale-[1.03]';

  const statusPill = (
    <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
      Status: {work.statusLabel}
    </span>
  );

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
      className={`group/proof relative z-0 mx-auto flex h-full w-full cursor-pointer rounded-[1.5rem] hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 ${
        featured ? 'min-h-[36rem] sm:min-h-[40rem]' : 'min-h-[31rem] sm:min-h-[34rem]'
      }`}
    >
      <article
        className={`flex h-full flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b1018]/86 transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/proof:-translate-y-1 group-hover/proof:border-white/20 group-hover/proof:shadow-[0_24px_54px_rgba(0,0,0,0.34)] ${
          featured ? 'flex-col xl:grid xl:grid-cols-[1.08fr_0.92fr]' : 'flex-col'
        }`}
      >
        {work.isLiveDemo && work.demoUrl ? (
          <a
            href={work.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={`relative block overflow-hidden ${featured ? 'min-h-[20rem] xl:min-h-full' : 'h-[40%] sm:h-[44%]'}`}
            aria-label={`Open live site for ${work.title}`}
          >
            <ResponsiveImage
              source={work.image}
              sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
              alt={work.imageAlt ?? work.title}
              className={imageClassName}
              loading="lazy"
              decoding="async"
              style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent" />
            <div className="absolute left-4 top-4 z-10">{statusPill}</div>
          </a>
        ) : (
          <div className={`relative overflow-hidden ${featured ? 'min-h-[20rem] xl:min-h-full' : 'h-[40%] sm:h-[44%]'}`}>
            <ResponsiveImage
              source={work.image}
              sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
              alt={work.imageAlt ?? work.title}
              className={imageClassName}
              loading="lazy"
              decoding="async"
              style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent" />
            <div className="absolute left-4 top-4 z-10">{statusPill}</div>
          </div>
        )}

        <div className={`flex flex-1 flex-col ${featured ? 'bg-[#0a0f16]/94 p-6 sm:p-8 xl:p-10' : 'bg-[#090e16]/94 p-4 sm:p-6'}`}>
          <div className="flex items-center gap-2">
            <span className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              {featured ? 'Selected work' : 'Business type'}
            </span>
            {featured ? <span className="h-1 w-1 rounded-full bg-slate-500" /> : null}
            <span className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">{work.businessType}</span>
          </div>
          <h3 className={`mt-4 font-semibold tracking-tight text-white ${featured ? 'text-[clamp(1.85rem,3.1vw,3rem)]' : 'text-[1.35rem] sm:text-2xl'}`}>{work.title}</h3>
          <p className={`mt-3 leading-relaxed text-slate-300/95 ${featured ? 'max-w-2xl text-[0.98rem]' : 'max-w-[34ch] text-[0.92rem] sm:text-[0.98rem]'}`}>{work.improvement}</p>
          <div className={`mt-auto flex flex-wrap items-center gap-3 pt-6 sm:gap-4 ${featured ? 'xl:pt-8' : 'sm:pt-6'}`}>
            {work.isLiveDemo && work.demoUrl ? (
              <a
                href={work.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
              >
                Open Live Site
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
                View Details
              </Link>
            ) : featured ? (
              <Link
                to={`/works/${work.id}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
              >
                View Details
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
        title="Work | Axiom"
        description="View our featured work, sample builds, concept builds, demos, and live deployments with clear labeling and business context."
      />
      <Layout>
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-8 pb-4 md:px-8 md:pt-12 md:pb-2" variant="feature">
          <div className="max-w-4xl">
            <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-slate-400">Curated showcase</p>
            <div className="mt-3 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Selected Work</h1>
            </div>
            <p data-startup-copy className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              A small set of live deployments, concept builds, demos, and sample builds. Each one is labeled clearly and shown with the business context behind it.
            </p>
            <div data-startup-actions className="mt-6 flex flex-wrap items-center gap-3 md:mt-7 md:gap-3.5">
              <a href="#sample-builds" onClick={handleViewSamplesClick} className="btn-primary btn-lg whitespace-nowrap">
                View selected work
              </a>
              <Link
                to="/method"
                className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-axiom-text-main"
              >
                How we build
              </Link>
            </div>
            <p data-startup-meta className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
              Clear labels. No fabricated results. No hidden context.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-4 pb-10 sm:px-6 md:px-8 md:pt-8">
          <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.14fr_0.86fr]">
            {works[0] ? (
              <RevealBlock as="article" delay={0.02} variant="card">
                <WorkCard work={works[0]} onOpen={openWorkDetails} featured />
              </RevealBlock>
            ) : null}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
              {works.slice(1).map((work, index) => (
                <RevealBlock as="article" key={work.id} delay={0.08 + index * 0.08} variant="card">
                  <WorkCard work={work} onOpen={openWorkDetails} />
                </RevealBlock>
              ))}
            </div>
          </div>
        </RevealBlock>

        <RevealBlock as="section" className="mx-auto w-full max-w-5xl px-6 pb-14 pt-8 md:px-8 md:pb-16 md:pt-10">
          <div className="rounded-3xl border border-white/10 bg-black/18 px-7 py-8 text-center md:px-10 md:py-10">
            <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-slate-400">Ready for a similar build</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F4F7] md:text-4xl">Need a site this clear?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              We can scope a similar website for your business without forcing a template.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                Book Free Consultation
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
