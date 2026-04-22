import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';

import { RevealBlock } from '../components/ui/RevealBlock';
import { type ResponsiveSource } from '../lib/responsiveImages';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';
import { getWorkProofImage } from '../lib/workProofImages';

const landscapingProofImage = getWorkProofImage('concept-landscaping-authority-site');

type ProofBlockData = {
  id: string;
  title: string;
  summary: string;
  businessType: string;
  badgeLabel: string;
  statusLabel: string;
  ctaLabel: string;
  demoUrl: string;
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

const restaurantProofImage = getWorkProofImage('demonstration-restaurant-reservation-site');
const roofingProofImage = getWorkProofImage('concept-roofing-conversion-site');

const proofBlocks: readonly ProofBlockData[] = [
  {
    id: 'demonstration-restaurant-reservation-site',
    title: 'Restaurant reservation site',
    summary: 'A restaurant site where the booking link, menu, and hours are impossible to miss on a phone.',
    businessType: 'Restaurant and hospitality',
    badgeLabel: 'Demonstration',
    statusLabel: 'Build example',
    ctaLabel: 'View the build →',
    demoUrl: 'https://restaurant.getaxiom.ca',
    originalWeakness: 'Guests had to hunt for the booking link, and the menu was hard to read on phones.',
    improved: 'The reservation path stays visible and the menu reads cleanly on mobile.',
    whyBetter:
      'People can book or check the menu without digging through the page, which matters when the decision happens fast.',
    image: restaurantProofImage.source,
    imageAlt: restaurantProofImage.alt ?? 'Restaurant reservation site',
    imagePosition: restaurantProofImage.position ?? 'center 24%',
  },
  {
    id: 'concept-landscaping-authority-site',
    title: 'Landscaping site',
    summary: 'A landscaping site that leads with past work and makes it easy to request a quote in under 30 seconds.',
    businessType: 'Landscaping and outdoor services',
    badgeLabel: 'Demonstration',
    statusLabel: 'Build example',
    ctaLabel: 'View the build →',
    demoUrl: 'https://landscaping.getaxiom.ca',
    originalWeakness: 'Past work was buried, and quote requests took too many clicks.',
    improved: 'Project photos come forward and the quote path is shorter.',
    whyBetter:
      'Local buyers can judge the work first and request a quote without digging through pages.',
    image: landscapingProofImage.source,
    imageAlt: landscapingProofImage.alt ?? 'Finished backyard with fresh lawn, planting beds, and a covered patio',
    imagePosition: landscapingProofImage.position ?? 'center 56%',
  },
  {
    id: 'concept-roofing-conversion-site',
    title: 'Roofing site',
    summary: 'A roofing site that separates urgent calls from estimate requests - so the right jobs reach you the right way.',
    businessType: 'Roofing and exterior services',
    badgeLabel: 'Demonstration',
    statusLabel: 'Build example',
    ctaLabel: 'View the build →',
    demoUrl: 'https://roofing.getaxiom.ca',
    originalWeakness: 'Storm traffic needs a fast path to inspection and estimate requests.',
    improved: 'Urgent calls and planned estimates have separate paths.',
    whyBetter:
      'Different visitors need different actions, so the page removes friction instead of making everyone read the same route.',
    image: roofingProofImage.source,
    imageAlt: roofingProofImage.alt ?? 'Roofing conversion site',
    imagePosition: roofingProofImage.position ?? 'center 36%',
  },
];

type ConceptProjectData = {
  title: string;
  subtitle: string;
  positioning: string;
  desc: string;
  roi: string;
  url: string;
  capabilities: string[];
};

const conceptProjects: readonly ConceptProjectData[] = [
  {
    title: 'HVAC Performance',
    subtitle: 'Apex Climate Systems',
    positioning: 'Dispatch-first infrastructure for emergency HVAC demand windows.',
    desc: 'When the first heatwave hits and your phones blow up, this system filters the tire-kickers so your techs only roll trucks for high-ticket emergency installs.',
    roi: 'Designed to lift emergency dispatch rates during peak weather events.',
    url: 'https://hvac.getaxiom.ca',
    capabilities: ['Emergency dispatch banner', 'Diagnostic intake routing', 'Dispatch qualification filter'],
  },
  {
    title: 'Roofing Performance',
    subtitle: 'Summit Roofing Co.',
    positioning: 'Storm protocol conversion system for high-volume inspection demand.',
    desc: "When hail storms hit and every roof in town leaks, your site loads instantly while your competitors' sites crash. You get the calls. They get voicemail.",
    roi: "Designed to capture storm-season leads while competitors' sites go down.",
    url: 'https://roofing.getaxiom.ca',
    capabilities: ['Storm protocol timeline', 'Material selector', 'Inspection funnel'],
  },
  {
    title: 'Landscaping Performance',
    subtitle: 'Verdant Landscapes',
    positioning: 'Portfolio-grade consultation system for premium outdoor projects.',
    desc: "You're bidding on $50K hardscape projects against companies with $200 websites. This fixes the gap between the quality of your work and the quality of your online presence.",
    roi: 'Designed to position premium design work with a portfolio that matches your craft.',
    url: 'https://landscaping.getaxiom.ca',
    capabilities: ['Featured project portfolio', 'Seasonal program flow', 'Design consultation funnel'],
  },
] as const;

function ConceptProjectCard({ project, index }: { project: ConceptProjectData; index: number }) {
  return (
    <RevealBlock as="div" delay={index * 0.08} variant="feature">
      <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,30,0.95)_0%,rgba(10,13,18,0.98)_100%)] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] md:p-6">
        <div className="flex flex-col gap-2">
          <p className="section-eyebrow">{project.subtitle}</p>
          <h3 className="text-[22px] font-semibold tracking-tight text-[#F2F4F7] sm:text-[24px]">
            {project.title}
          </h3>
          <p className="text-[14px] leading-[1.65] text-slate-200/90">{project.positioning}</p>
        </div>

        <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="section-eyebrow">Outcome signal</p>
          <p className="mt-3 text-[13px] leading-[1.7] text-slate-300">{project.roi}</p>
        </div>

        <p className="mt-4 text-[13px] leading-[1.7] text-slate-300">{project.desc}</p>

        <ul className="mt-5 space-y-2">
          {project.capabilities.map((capability) => (
            <li key={capability} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-300">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-axiom-accent" />
              <span>{capability}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg w-full whitespace-nowrap"
            aria-label={`Open ${project.title}`}
          >
            Open project
          </a>
        </div>
      </article>
    </RevealBlock>
  );
}

function NarrativeRow({ label, value }: NarrativeRowProps) {
  return (
    <div className="flex flex-col gap-2 py-4 first:pt-0 sm:grid sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-5">
      <dt className="section-eyebrow sm:pt-1">
        {label}
      </dt>
      <dd className="text-sm md:text-[15px] leading-relaxed text-slate-300">{value}</dd>
    </div>
  );
}

function ProofBlock({ proof, index }: { proof: ProofBlockData; index: number }) {
  const isReversed = index % 2 === 1;
  const textOrderClass = isReversed ? 'lg:order-2' : 'lg:order-1';
  const imageOrderClass = isReversed ? 'lg:order-1' : 'lg:order-2';

  return (
    <RevealBlock as="div" delay={index * 0.08} variant="feature">
      <article className="group/proof overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,30,0.95)_0%,rgba(10,13,18,0.98)_100%)] shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_20px_44px_rgba(0,0,0,0.24)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-stretch">
          <div className={`min-w-0 p-5 md:p-6 lg:p-8 ${textOrderClass}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 font-axiomMono text-xs uppercase tracking-wide text-white/78">
                {proof.statusLabel}
              </span>
              <span className="font-axiomMono text-xs uppercase tracking-wide text-slate-400">
                {proof.businessType}
              </span>
            </div>

            <h3 className="mt-4 text-[clamp(1.9rem,3vw,2.9rem)] font-semibold tracking-tight text-[#F2F4F7]">
              {proof.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm md:text-[15px] leading-relaxed text-slate-300">{proof.summary}</p>

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
            </div>
          </div>

          <figure className={`relative overflow-hidden bg-[#0b1120] ${imageOrderClass}`}>
            <span className="pointer-events-none absolute left-4 top-4 z-10 inline-flex rounded-full border border-white/15 bg-[#09101d]/80 px-2.5 py-1 font-axiomMono text-xs uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              {proof.badgeLabel}
            </span>
            <ResponsiveImage
              source={proof.image}
              sizes="(min-width: 1280px) 44vw, (min-width: 768px) 50vw, w-full"
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
        <main id="main-content" tabIndex={-1} className="axiom-container w-full pb-24 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-20">
            <div className="max-w-5xl">
              <p className="section-eyebrow">WORK</p>
              <div className="mt-2.5 overflow-hidden">
                <h1
                  data-startup-heading
                  className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]"
                >
                  The standard we build to.
                </h1>
              </div>
              <p data-startup-copy className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Every project starts with your current site. These show what the fixed version looks like.
              </p>
              <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  {CTA.primary.label}
                </Link>
                <Link
                  to={CTA.process.to}
                  className="inline-flex w-full items-center text-sm md:text-[15px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:w-auto"
                >
                  {CTA.process.label}
                </Link>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24">
            <div className="max-w-4xl">
              <p className="section-eyebrow">Examples</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                What we build
              </h2>
              <p className="mt-3 max-w-2xl text-sm md:text-[15px] leading-relaxed text-slate-300">
                Examples showing what a clear service-business website looks like.
              </p>
            </div>

            <div className="mt-10 space-y-8 md:space-y-10 reveal-stagger">
              {proofBlocks.map((proof, index) => (
                <ProofBlock key={proof.id} proof={proof} index={index} />
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24" variant="feature">
            <article className="cta-banner">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div className="max-w-2xl">
                  <p className="section-eyebrow">Next step</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    Ready to stop losing jobs to a bad site?
                  </h2>
                  <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-slate-300">
                Start a project and we’ll review the current site, what’s missing, and the first fixes that matter.
                  </p>
                </div>
                <aside className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-eyebrow">What happens next</p>
                  <p className="mt-4 font-axiomMono text-xs uppercase tracking-wide text-[#F2F4F7]">
                    Review → Scope → Build → Launch
                  </p>
                </aside>
                <div className="flex flex-wrap items-center gap-3 lg:col-span-2 lg:justify-end">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                    Start a project →
                  </Link>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-24">
            <div className="max-w-4xl">
              <p className="section-eyebrow">Concept builds</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                More concept projects
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300 md:text-base">
                The HVAC, roofing, and landscaping concepts also live here so work, proof, and demos stay in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {conceptProjects.map((project, index) => (
                <ConceptProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;

