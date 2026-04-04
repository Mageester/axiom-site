import React, { useMemo, useState } from 'react';
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

function WorkCard({ work }: { work: WorkEntry }) {
  const card = (
    <article className={`flex h-full flex-1 flex-col overflow-hidden rounded-[1.75rem] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out group-hover/proof:-translate-y-1 group-hover/proof:shadow-[0_24px_54px_rgba(0,0,0,0.32)] ${
      work.isLiveDemo
        ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,34,0.94)_0%,rgba(11,15,22,0.98)_100%)]'
        : 'border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.82)_0%,rgba(11,15,20,0.96)_100%)]'
    }`}>
      <div className="relative h-[38%] overflow-hidden sm:h-[42%]">
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
          <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/78 backdrop-blur-md">
            {work.statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3.5 pt-3 sm:px-5 sm:pb-4 sm:pt-3.5">
        <h3 className="text-[1.28rem] font-semibold tracking-tight text-white sm:text-[1.95rem]">{work.title}</h3>
        <p className="mt-2 max-w-[34ch] text-[0.9rem] leading-relaxed text-slate-300/95 sm:text-[0.96rem]">{work.improvement}</p>
        <div className="mt-auto pt-3.5 sm:pt-4">
          <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors group-hover/proof:text-[#e8bea8]">
            View live site
          </span>
        </div>
      </div>
    </article>
  );

  return work.demoUrl ? (
    <a
      href={work.demoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View live site for ${work.title}`}
      className="group/proof relative z-0 mx-auto block h-full w-full cursor-pointer rounded-[1.5rem] hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 sm:min-h-[30rem]"
    >
      {card}
    </a>
  ) : (
    <div className="group/proof relative z-0 mx-auto h-full w-full rounded-[1.5rem] sm:min-h-[30rem]">{card}</div>
  );
}

const Deployments: React.FC = () => {
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
        description="Live deployments, demos, and case studies from the categories Axiom builds for, labeled clearly so you can judge fit and delivery quality quickly."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Work | Axiom',
          description: 'Live deployments, demos, and case studies from the categories Axiom builds for, labeled clearly so you can judge fit and delivery quality quickly.',
          url: 'https://getaxiom.ca/works',
        }}
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-0 pb-18 md:pb-24">
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-5 pb-0 md:px-8 md:pt-8 md:pb-0" variant="feature">
          <div className="max-w-4xl">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected work</p>
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Execution evidence, labeled by category.</h1>
            </div>
            <p data-startup-copy className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              Live work from the categories Axiom builds for.
            </p>
            <div data-startup-actions className="mt-5 flex flex-wrap items-center gap-3 md:mt-5 md:gap-3.5">
              <a href="#sample-builds" onClick={handleViewSamplesClick} className="btn-primary btn-lg whitespace-nowrap">
                View examples
              </a>
            </div>
          </div>
        </RevealBlock>

        <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter work by status">
              {STATUS_FILTERS.map((filter) => {
                const selected = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 sm:px-4 sm:py-2 sm:text-[11px] ${
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

            <label className="flex w-full flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
              <span className="lg:inline">Industry</span>
              <select
                value={industryFilter}
                onChange={(event) => setIndustryFilter(event.target.value)}
                className="w-full rounded-full border border-white/12 bg-[#0d1323]/80 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F2F4F7] outline-none transition-all focus:border-[#d4a48e]/45 focus:ring-2 focus:ring-[#d4a48e]/20 lg:w-auto lg:text-[11px]"
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

        <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-3 pb-6 sm:px-6 md:px-8 md:pt-5">
          {filteredWorks.length > 0 ? (
            <div className="mx-auto grid max-w-6xl gap-3.5 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
              {filteredWorks.map((work, index) => (
                <RevealBlock as="article" key={work.id} delay={index * 0.08} variant="card">
                  <WorkCard work={work} />
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

        <RevealBlock as="section" className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-visible px-6 pb-10 text-center md:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[#B05D41]/[0.08] blur-[140px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this standard for your category?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              We can scope a build around the business, the buyer, and the level of trust the site has to earn.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                Start the conversation
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
