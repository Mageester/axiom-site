import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import type { ResponsiveSource } from '../lib/responsiveImages';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';
import { getWorkProofImage } from '../lib/workProofImages';

const landscapingAfterAvif = new URL('../../axiom-landscaping-demo/public/images/landscaping-after.avif', import.meta.url).href;
const landscapingAfterWebp = new URL('../../axiom-landscaping-demo/public/images/landscaping-after.webp', import.meta.url).href;

const landscapingAfterSource: ResponsiveSource = {
  fallbackSrc: landscapingAfterWebp,
  avifSrcSet: `${landscapingAfterAvif} 1024w`,
  webpSrcSet: `${landscapingAfterWebp} 1024w`,
};

type ProofBlockData = {
  id: string;
  title: string;
  summary: string;
  businessType: string;
  statusLabel: string;
  ctaLabel: string;
  demoUrl: string;
  proofSignal: string;
  originalWeakness: string;
  improved: string;
  whyBetter: string;
  image: ResponsiveSource;
  imageAlt: string;
  imagePosition?: string;
};

type NarrativeRowProps = {
  label: string;
  value: string;
};

const proofNotes = [
  'One live site and two working demos.',
  'Business, issue, change, result.',
  'Live links are included where available.',
] as const;

const restaurantProofImage = getWorkProofImage('demonstration-restaurant-reservation-site');
const roofingProofImage = getWorkProofImage('concept-roofing-conversion-site');

const proofBlocks: readonly ProofBlockData[] = [
  {
    id: 'demonstration-restaurant-reservation-site',
    title: 'Restaurant reservation site',
    summary: 'A restaurant site that keeps the booking link easy to find and the menu simple to scan on phones.',
    businessType: 'Restaurant and hospitality',
    statusLabel: 'Live site',
    ctaLabel: 'Open live site',
    demoUrl: 'https://restaurant.getaxiom.ca',
    proofSignal: 'Live on restaurant.getaxiom.ca',
    originalWeakness: 'Guests had to hunt for the booking link, and the menu was hard to read on phones.',
    improved: 'The reservation path stays visible and the menu reads cleanly on mobile.',
    whyBetter:
      'People can book or check the menu without digging through the page, which matters when the decision happens fast.',
    image: restaurantProofImage.source,
    imageAlt: restaurantProofImage.alt,
    imagePosition: restaurantProofImage.position,
  },
  {
    id: 'concept-landscaping-authority-site',
    title: 'Landscaping site',
    summary: 'A landscaping site that puts past work first and shortens the quote path.',
    businessType: 'Landscaping and outdoor services',
    statusLabel: 'Working demo',
    ctaLabel: 'Open demo',
    demoUrl: 'https://landscaping.getaxiom.ca',
    proofSignal: 'Working demo',
    originalWeakness: 'Past work was buried, and quote requests took too many clicks.',
    improved: 'Project photos come forward and the quote path is shorter.',
    whyBetter:
      'Local buyers can judge the work first and request a quote without digging through pages.',
    image: landscapingAfterSource,
    imageAlt: 'Finished backyard with fresh lawn, planting beds, and a covered patio',
    imagePosition: 'center 56%',
  },
  {
    id: 'concept-roofing-conversion-site',
    title: 'Roofing site',
    summary: 'A roofing site that separates urgent calls from planned estimate requests.',
    businessType: 'Roofing and exterior services',
    statusLabel: 'Working demo',
    ctaLabel: 'Open demo',
    demoUrl: 'https://roofing.getaxiom.ca',
    proofSignal: 'Working demo',
    originalWeakness: 'Storm traffic needs a fast path to inspection and estimate requests.',
    improved: 'Urgent calls and planned estimates have separate paths.',
    whyBetter:
      'Different visitors need different actions, so the page removes friction instead of making everyone read the same route.',
    image: roofingProofImage.source,
    imageAlt: roofingProofImage.alt,
    imagePosition: roofingProofImage.position,
  },
];

function NarrativeRow({ label, value }: NarrativeRowProps) {
  return (
    <div className="grid gap-2 py-4 first:pt-0 md:grid-cols-[10.5rem_minmax(0,1fr)] md:gap-5">
      <dt className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC] md:pt-1">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-slate-300 md:text-[0.98rem]">{value}</dd>
    </div>
  );
}

function ProofBlock({ proof, index }: { proof: ProofBlockData; index: number }) {
  const isReversed = index % 2 === 1;
  const textOrderClass = isReversed ? 'lg:order-2' : 'lg:order-1';
  const imageOrderClass = isReversed ? 'lg:order-1' : 'lg:order-2';

  return (
    <RevealBlock as="div" delay={index * 0.08} variant="feature">
      <article className="group/proof overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,30,0.95)_0%,rgba(10,13,18,0.98)_100%)] shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_20px_44px_rgba(0,0,0,0.24)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-stretch">
          <div className={`min-w-0 p-5 md:p-6 lg:p-8 ${textOrderClass}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/78">
                {proof.statusLabel}
              </span>
              <span className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                {proof.businessType}
              </span>
            </div>

            <h3 className="mt-4 text-[clamp(1.9rem,3vw,2.9rem)] font-semibold tracking-tight text-[#F2F4F7]">
              {proof.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{proof.summary}</p>

            <dl className="mt-6 divide-y divide-white/[0.08] border-t border-white/10">
              <NarrativeRow label="Original weakness" value={proof.originalWeakness} />
              <NarrativeRow label="Axiom changed" value={proof.improved} />
              <NarrativeRow label="Why it works" value={proof.whyBetter} />
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={proof.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${proof.ctaLabel} for ${proof.title}`}
                className="btn-primary btn-lg whitespace-nowrap"
              >
                {proof.ctaLabel}
              </a>
              <span className="text-sm leading-relaxed text-slate-400">
                {proof.proofSignal}
              </span>
            </div>
          </div>

          <figure className={`relative overflow-hidden bg-[#0b1120] ${imageOrderClass}`}>
            <ResponsiveImage
              source={proof.image}
              sizes="(min-width: 1280px) 44vw, (min-width: 768px) 50vw, 100vw"
              alt={proof.imageAlt}
              className="motion-media aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/proof:scale-[1.015]"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              style={proof.imagePosition ? { objectPosition: proof.imagePosition } : undefined}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
          </figure>
        </div>
      </article>
    </RevealBlock>
  );
}

const Deployments: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.work} />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:items-end lg:gap-12">
              <div className="max-w-5xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Selected work</p>
                <div className="mt-2.5 overflow-hidden">
                  <h1
                    data-startup-heading
                    className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]"
                  >
                    Work that holds up.
                  </h1>
                </div>
                <p data-startup-copy className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  One live site and two working demos. Each example shows the issue, the change, and the result.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    {CTA.primary.label}
                  </Link>
                  <Link
                    to={CTA.process.to}
                    className="inline-flex w-full items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:w-auto"
                  >
                    {CTA.process.label}
                  </Link>
                </div>
              </div>

              <aside className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">In this set</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                  {proofNotes.map((note) => (
                    <p key={note}>
                      {note}
                    </p>
                  ))}
                </div>
              </aside>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Examples</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Each example shows the business, issue, change, and result.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                The same structure keeps the comparisons easy to read.
              </p>
            </div>

            <div className="mt-10 space-y-8 md:space-y-10">
              {proofBlocks.map((proof, index) => (
                <ProofBlock key={proof.id} proof={proof} index={index} />
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
            <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    Want this level of clarity on your site?
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                    Start a project and we&apos;ll review the current site, what&apos;s missing, and the first fixes that matter.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                    {CTA.primary.label}
                  </Link>
                </div>
              </div>
            </article>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
