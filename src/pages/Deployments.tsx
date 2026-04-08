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
  kind: 'live' | 'demo';
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

const workPresentationBySlug: Record<
  string,
  { kind: 'live' | 'demo'; statusLabel: string; ctaLabel: string }
> = {
  'demonstration-restaurant-reservation-site': {
    kind: 'live',
    statusLabel: 'Live',
    ctaLabel: 'View live site',
  },
  'concept-landscaping-authority-site': {
    kind: 'demo',
    statusLabel: 'Demo',
    ctaLabel: 'View demo',
  },
  'concept-roofing-conversion-site': {
    kind: 'demo',
    statusLabel: 'Demo',
    ctaLabel: 'View demo',
  },
};

const improvementCopyBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site': 'Menu and booking are easy to find, especially on phones.',
  'concept-landscaping-authority-site': 'Past work is up front, and quote requests are easier to send.',
  'concept-roofing-conversion-site': 'Storm calls and planned estimates each have a clear path.',
};

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => {
  const proofImage = getWorkProofImage(entry.slug);
  const presentation = workPresentationBySlug[entry.slug] ?? {
    kind: entry.demoUrl ? 'live' : 'demo',
    statusLabel: entry.demoUrl ? 'Live' : 'Demo',
    ctaLabel: entry.demoUrl ? 'View live site' : 'View demo',
  };
  return {
    id: entry.slug,
    title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
    kind: presentation.kind,
    statusLabel: presentation.statusLabel,
    ctaLabel: presentation.ctaLabel,
    ariaLabel: `${presentation.ctaLabel} for ${entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, '')}`,
    improvement: improvementCopyBySlug[entry.slug] ?? 'Built to make the page clearer, easier to trust, and easier to contact.',
    image: proofImage.source,
    demoUrl: entry.demoUrl,
    imageAlt: proofImage.alt,
    imagePosition: proofImage.position,
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
        title="Work | Axiom"
        description="A small selection of restaurant, landscaping, and roofing sites that show how Axiom makes pages clearer and easier to use."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Work | Axiom',
          description: 'A small selection of restaurant, landscaping, and roofing sites that show how Axiom makes pages clearer and easier to use.',
          url: 'https://getaxiom.ca/works',
        }}
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-0 pb-18 md:pb-24">
        <RevealBlock as="section" data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-4 pb-0 md:px-8 md:pt-8 md:pb-0" variant="feature">
          <div className="max-w-4xl">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Work</p>
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Selected work that shows the standard.</h1>
            </div>
            <p data-startup-copy className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              One live site and two demos that show clearer pages, better proof, and easier contact.
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
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">Need this kind of cleanup?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We can review the site and tell you what to fix first.
              </p>
              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link to="/apply#project-application-form" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  Start a project
                </Link>
                <Link
                  to="/method"
                  className="group inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-axiom-text-main hover:underline sm:w-auto"
                >
                  See process
                  <svg className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
