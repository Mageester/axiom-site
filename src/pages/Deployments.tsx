import React, { useMemo, useState } from 'react';
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

const workPresentationBySlug: Record<string, { statusLabel: string; isLiveDemo: boolean }> = {
  'demonstration-restaurant-reservation-site': {
    statusLabel: 'Live Deployment',
    isLiveDemo: true,
  },
  'concept-landscaping-authority-site': {
    statusLabel: 'Demo',
    isLiveDemo: false,
  },
  'concept-roofing-conversion-site': {
    statusLabel: 'Demo',
    isLiveDemo: false,
  },
};

const improvementCopyBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site': 'Built to create a clearer, more modern, and more trustworthy first impression for diners.',
  'concept-landscaping-authority-site': 'Built to create a clearer, more modern, and more trustworthy first impression for homeowners.',
  'concept-roofing-conversion-site': 'Built to create a clearer, more modern, and more trustworthy first impression for roofing inquiries.',
};

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const presentation = workPresentationBySlug[entry.slug] ?? { statusLabel: 'Demo', isLiveDemo: Boolean(entry.demoUrl) };
  return {
    id: entry.slug,
    title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    businessType: entry.businessType.replace(/\s+Business$/, ''),
    statusLabel: presentation.statusLabel,
    isLiveDemo: presentation.isLiveDemo,
    improvement: improvementCopyBySlug[entry.slug] ?? 'Built to create a clearer, more modern, and more trustworthy first impression.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
  };
});

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'demo', label: 'Demo' },
] as const;

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
      className="group/proof relative z-0 mx-auto flex h-full min-h-[34rem] w-full cursor-pointer rounded-[1.5rem] hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 sm:min-h-[36rem]"
    >
      <article className="flex h-full flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1323]/84 transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/proof:-translate-y-1 group-hover/proof:border-white/20 group-hover/proof:shadow-[0_24px_54px_rgba(0,0,0,0.36)]">
      {work.isLiveDemo && work.demoUrl ? (
        <a
          href={work.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="relative block h-[42%] overflow-hidden sm:h-[45%]"
          aria-label={`Open live site for ${work.title}`}
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
              Status: {work.statusLabel}
            </span>
          </div>
        </a>
      ) : (
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
              Status: {work.statusLabel}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col bg-[#0c1221]/92 p-4 sm:p-6">
        <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">Business Type</p>
        <p className="mt-1 text-sm font-medium text-slate-200">{work.businessType}</p>
        <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight text-white sm:text-2xl">{work.title}</h3>
        <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-relaxed text-slate-300/95 sm:text-[0.98rem]">{work.improvement}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5 sm:gap-4 sm:pt-6">
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
          ) : null}
        </div>
      </div>
      </article>
    </div>
  );
}

const Deployments: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'demo'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  const availableIndustries = useMemo(
    () => ['all', ...new Set(works.map((work) => work.businessType).filter(Boolean))],
    []
  );

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const statusMatch =
        statusFilter === 'all' || (statusFilter === 'live' ? work.isLiveDemo : !work.isLiveDemo);
      const industryMatch = industryFilter === 'all' || work.businessType === industryFilter;
      return statusMatch && industryMatch;
    });
  }, [industryFilter, statusFilter]);

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
        description="Selected work, live deployments, and case studies from Axiom, labeled clearly so you can judge category relevance and delivery quality quickly."
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-0 pb-24 md:pb-28">
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-6 pb-1 md:px-8 md:pt-10 md:pb-0" variant="feature">
          <div className="max-w-4xl">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected work</p>
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Execution evidence, labeled by category.</h1>
            </div>
            <p data-startup-copy className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              Live deployments, demos, and case studies from the kinds of websites Axiom builds for businesses that need stronger trust and clearer category fit.
            </p>
            <div data-startup-actions className="mt-5 flex flex-wrap items-center gap-3 md:mt-6 md:gap-3.5">
              <a href="#sample-builds" onClick={handleViewSamplesClick} className="btn-primary btn-lg whitespace-nowrap">
                View examples
              </a>
              <Link
                to="/method"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-axiom-text-main"
              >
                View our process
              </Link>
            </div>
            <p data-startup-meta className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-300">
              Labels stay explicit so you can see what is a Sample Build, a Demo, or a Live Deployment without second-guessing the context.
            </p>
          </div>
        </RevealBlock>

        <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 md:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter work by status">
              {STATUS_FILTERS.map((filter) => {
                const selected = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 ${
                      selected
                        ? 'border-[#d4a48e]/35 bg-[#B05D41]/12 text-[#F2F4F7] shadow-[0_0_0_1px_rgba(212,164,142,0.12)]'
                        : 'border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-[#F2F4F7]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span>Industry</span>
              <select
                value={industryFilter}
                onChange={(event) => setIndustryFilter(event.target.value)}
                className="rounded-full border border-white/12 bg-[#0d1323]/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F2F4F7] outline-none transition-all focus:border-[#d4a48e]/45 focus:ring-2 focus:ring-[#d4a48e]/20"
              >
                <option value="all">All industries</option>
                {availableIndustries
                  .filter((industry) => industry !== 'all')
                  .map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </section>

        <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-3 pb-8 sm:px-6 md:px-8 md:pt-6">
          {filteredWorks.length > 0 ? (
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorks.map((work, index) => (
                <RevealBlock as="article" key={work.id} delay={index * 0.08} variant="card">
                  <WorkCard work={work} onOpen={openWorkDetails} />
                </RevealBlock>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <h2 className="text-2xl font-semibold text-[#F2F4F7]">No matching examples right now.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                Try a different status or industry filter to narrow the examples.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setIndustryFilter('all');
                }}
                className="btn-primary btn-lg mt-6"
              >
                Reset filters
              </button>
            </div>
          )}
        </RevealBlock>

        <RevealBlock as="section" className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-visible px-6 pb-12 text-center md:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#B05D41]/[0.08] blur-[160px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this level of execution?</h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                Book Free Consultation
              </Link>
              <Link
                to="/method"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
              >
                View Our Process
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </RevealBlock>

        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
