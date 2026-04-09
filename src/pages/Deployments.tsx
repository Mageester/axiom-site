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

const landscapingAfterAvif = new URL('../../axiom-landscaping-demo/public/images/landscaping-after.avif', import.meta.url).href;
const landscapingAfterWebp = new URL('../../axiom-landscaping-demo/public/images/landscaping-after.webp', import.meta.url).href;

const landscapingAfterSource: ResponsiveSource = {
  fallbackSrc: landscapingAfterWebp,
  avifSrcSet: `${landscapingAfterAvif} 1024w`,
  webpSrcSet: `${landscapingAfterWebp} 1024w`,
};

interface WorkEntry {
  id: string;
  title: string;
  statusLabel: string;
  ctaLabel: string;
  ariaLabel: string;
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

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const workPresentationBySlug: Record<string, { statusLabel: string; ctaLabel: string; improvement: string; image?: ResponsiveSource; imageAlt?: string; imagePosition?: string }> = {
  'demonstration-restaurant-reservation-site': {
    statusLabel: 'Live site',
    ctaLabel: 'View live site',
    improvement: 'The menu and booking link stay visible on phones.',
  },
  'concept-landscaping-authority-site': {
    statusLabel: 'Demo build',
    ctaLabel: 'Open demo',
    improvement: 'Past projects stay up front, and quote requests take fewer steps.',
    image: landscapingAfterSource,
    imageAlt: 'Finished backyard with fresh lawn, planting beds, and a covered patio',
    imagePosition: 'center 56%',
  },
  'concept-roofing-conversion-site': {
    statusLabel: 'Demo build',
    ctaLabel: 'Open demo',
    improvement: 'Urgent calls and estimate requests have separate paths.',
  },
};

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const presentation = workPresentationBySlug[entry.slug] ?? {
    statusLabel: entry.label === 'Live' ? 'Live site' : 'Demo build',
    ctaLabel: entry.label === 'Live' ? 'View live site' : 'Open demo',
    improvement: entry.summary,
  };
  const proofImage = getWorkProofImage(entry.slug);
  return {
    id: entry.slug,
    title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    statusLabel: presentation.statusLabel,
    ctaLabel: presentation.ctaLabel,
    ariaLabel: `${presentation.ctaLabel} for ${entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, '')}`,
    improvement: presentation.improvement,
    image: presentation.image ?? proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: presentation.imageAlt ?? proofImage.alt,
    imagePosition: presentation.imagePosition ?? proofImage.position,
  };
});

function WorkCard({ work }: { work: WorkEntry }) {
  const card = (
    <article className="motion-surface flex h-full flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/9 bg-[linear-gradient(180deg,rgba(18,23,31,0.9)_0%,rgba(11,15,21,0.98)_100%)] group-hover/proof:-translate-y-0.5 group-hover/proof:shadow-[0_18px_42px_rgba(0,0,0,0.26)]">
      <div className="relative h-[38%] overflow-hidden sm:h-[42%]">
        <ResponsiveImage
          source={work.image}
          sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
          alt={work.imageAlt ?? work.title}
          className="motion-media h-full w-full object-cover group-hover/proof:scale-[1.015]"
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
            {work.ctaLabel}
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
      aria-label={work.ariaLabel}
      className="group/proof relative z-0 mx-auto block h-full w-full cursor-pointer rounded-[1.5rem] hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 sm:min-h-[30rem]"
    >
      {card}
    </a>
  ) : (
    <div className="group/proof relative z-0 mx-auto h-full w-full rounded-[1.5rem] sm:min-h-[30rem]">{card}</div>
  );
}

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Work"
        description="Live and demo builds with clearer pages and easier contact."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Work',
          description: 'Live and demo builds with clearer pages and easier contact.',
          url: 'https://getaxiom.ca/works',
        }}
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-0 pb-18 md:pb-24">
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-4 pb-0 md:px-8 md:pt-8 md:pb-0" variant="feature">
          <div className="max-w-4xl">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work</p>
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Selected work.</h1>
            </div>
            <p data-startup-copy className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              A small, selective set of live and demo builds. Each one focuses on clearer structure, easier contact, and cleaner mobile use.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock as="section" id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-8 pb-6 sm:px-6 md:px-8 md:pt-10">
          <div className="mx-auto grid max-w-6xl gap-3.5 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {works.map((work, index) => (
              <RevealBlock as="article" key={work.id} delay={index * 0.08} variant="card">
                <WorkCard work={work} />
              </RevealBlock>
            ))}
          </div>
        </RevealBlock>

        <RevealBlock as="section" className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-visible px-6 pb-10 text-center md:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[#B05D41]/[0.08] blur-[140px]" />

          <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this level of clarity on your site?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Send the site through. We&apos;ll show the first changes worth making.
              </p>
              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link to="/apply#project-application-form" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  Start a project
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
