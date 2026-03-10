import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';
import { responsiveImages, type ResponsiveSource } from '../lib/responsiveImages';

interface WorkEntry {
  id: string;
  title: string;
  projectType: string;
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
  tone: 'default' | 'hospitality';
  layout: 'featured' | 'editorial' | 'compact';
}

const worksDisplayOrder = [
  'demonstration-restaurant-reservation-site',
  'concept-landscaping-authority-site',
  'concept-roofing-conversion-site',
] as const;

const proofImageBySlug: Record<string, ResponsiveSource> = {
  'demonstration-restaurant-reservation-site': responsiveImages.workRestaurant,
  'concept-landscaping-authority-site': responsiveImages.caseStudy1,
  'concept-roofing-conversion-site': responsiveImages.caseStudy2,
};

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Active Deployment': 'Active Deployment',
};

const layoutBySlug: Record<string, WorkEntry['layout']> = {
  'demonstration-restaurant-reservation-site': 'featured',
  'concept-landscaping-authority-site': 'compact',
  'concept-roofing-conversion-site': 'compact',
};

const imagePositionBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site': 'center 24%',
};

const imageAltBySlug: Record<string, string> = {
  'demonstration-restaurant-reservation-site':
    'Server presenting plated dishes in a warmly lit dining room',
};

const toneBySlug: Record<string, WorkEntry['tone']> = {
  'demonstration-restaurant-reservation-site': 'hospitality',
};

const oneSentence = (value: string) => {
  const parts = value.split('. ');
  if (parts.length <= 1) return value;
  return `${parts[0].replace(/\.$/, '')}.`;
};

const orderedCaseStudies = worksDisplayOrder
  .map((slug) => caseStudies.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof caseStudies)[number] => Boolean(entry));

const works: WorkEntry[] = orderedCaseStudies.map((entry) => ({
  id: entry.slug,
  title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
  projectType: proofTypeLabel[entry.label] ?? entry.label,
  audience: entry.businessType,
  businessContext: `${entry.niche} - ${entry.location}`,
  coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
  demonstrates: entry.demonstrates || entry.built[0] || 'Clearer page hierarchy and conversion pathways',
  scope: entry.deliverables.slice(0, 2).join(' + '),
  summary: oneSentence(entry.summary),
  image: proofImageBySlug[entry.slug] || responsiveImages.workAether,
  demoUrl: entry.demoUrl,
  imageAlt: imageAltBySlug[entry.slug],
  imagePosition: imagePositionBySlug[entry.slug],
  tone: toneBySlug[entry.slug] || 'default',
  layout: layoutBySlug[entry.slug] || 'compact',
}));

function WorkCard({ work }: { work: WorkEntry }) {
  const isFeatured = work.layout === 'featured';
  const isEditorial = work.layout === 'editorial';
  const isHospitality = work.tone === 'hospitality';
  const frameToneClass = isHospitality
    ? 'border-[#c79379]/35 hover:border-[#e4b89d]/60 hover:shadow-[0_0_74px_rgba(176,93,65,0.26)]'
    : 'border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_60px_rgba(176,93,65,0.1)]';
  const typeChipClass = isHospitality
    ? 'border-[#efdac6]/22 bg-[#1f140f]/60 text-[#f1dec9]'
    : 'border-white/10 bg-black/45 text-white/75';
  const audienceChipClass = isHospitality
    ? 'border-[#efdac6]/20 bg-[#1a110d]/55 text-[#e8d3be]'
    : 'border-white/10 bg-black/35 text-white/70';
  const featuredPanelClass = isHospitality
    ? 'border-[#efdac6]/24 bg-[#130d0a]/52'
    : 'border-white/15 bg-black/35';
  const cardCtaLabel = isHospitality ? 'Review Build Notes' : 'View Build Notes';

  return (
    <article
      className={`group overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border bg-[#0d1323]/80 transition-all duration-500 ${frameToneClass} ${
        isFeatured ? 'relative h-[520px] sm:h-[580px] md:col-span-2' : 'relative h-[430px] sm:h-[480px] md:col-span-1'
      }`}
    >
      {isFeatured ? (
        <>
          <ResponsiveImage
            source={work.image}
            sizes="(min-width: 1280px) 920px, (min-width: 768px) 92vw, 100vw"
            alt={work.imageAlt ?? work.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading={isFeatured ? 'eager' : 'lazy'}
            fetchPriority={isFeatured ? 'high' : 'auto'}
            decoding="async"
            style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-95 ${
              isHospitality
                ? 'bg-gradient-to-t from-[#080503]/96 via-[#2b190f]/58 to-transparent opacity-92'
                : 'bg-gradient-to-t from-black/92 via-black/45 to-transparent opacity-85'
            }`}
          />
          {isHospitality ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(176,93,65,0.36),transparent_46%)] opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
          ) : null}

          <div className="absolute left-5 top-5 z-10 flex flex-wrap items-center gap-2">
            <span className={`inline-block rounded-full border px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] backdrop-blur-md ${typeChipClass}`}>
              {work.projectType}
            </span>
            <span className={`inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] backdrop-blur-md ${audienceChipClass}`}>
              {work.audience}
            </span>
          </div>

          <div className={`absolute inset-x-5 bottom-5 z-10 rounded-2xl border p-5 backdrop-blur-md sm:p-6 ${featuredPanelClass}`}>
            <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.9rem]">{work.title}</h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-200">{work.summary}</p>
            <dl className="mt-4 grid gap-3 text-[11px] sm:grid-cols-3">
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-white/60">Core Problem</dt>
                <dd className="mt-1 leading-relaxed text-white/88">{work.coreProblem}</dd>
              </div>
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-white/60">Demonstrates</dt>
                <dd className="mt-1 leading-relaxed text-white/88">{work.demonstrates}</dd>
              </div>
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-white/60">Scope Snapshot</dt>
                <dd className="mt-1 leading-relaxed text-white/88">{work.scope}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {work.demoUrl ? (
                <a
                  href={work.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
                >
                  View Live Demo
                </a>
              ) : null}
              <Link
                to={`/works/${work.id}`}
                className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
              >
                {cardCtaLabel}
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col">
          <div className={`relative ${isEditorial ? 'h-[56%]' : 'h-[52%]'} overflow-hidden`}>
            <ResponsiveImage
              source={work.image}
              sizes="(min-width: 768px) 48vw, 100vw"
              alt={work.imageAlt ?? work.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              style={work.imagePosition ? { objectPosition: work.imagePosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute left-4 top-4 z-10">
              <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                {work.projectType}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-[#0d1323]/90 p-5">
            <h3 className="text-xl font-semibold tracking-tight text-white">{work.title}</h3>
            <p className="mt-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-300">{work.audience}</p>
            {isEditorial && <p className="mt-2 text-sm text-slate-300/95">{work.summary}</p>}
            <dl className="mt-3 grid gap-2 text-[11px]">
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Core Problem</dt>
                <dd className="mt-0.5 leading-relaxed text-slate-200">{work.coreProblem}</dd>
              </div>
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Demonstrates</dt>
                <dd className="mt-0.5 leading-relaxed text-slate-200">{work.demonstrates}</dd>
              </div>
              {isEditorial && (
                <div>
                  <dt className="font-axiomMono uppercase tracking-[0.12em] text-slate-400">Scope Snapshot</dt>
                  <dd className="mt-0.5 leading-relaxed text-slate-200">{work.scope}</dd>
                </div>
              )}
            </dl>
            <p className="mt-auto pt-3 text-[10px] uppercase tracking-[0.12em] text-slate-500">{work.businessContext}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {work.demoUrl ? (
                <a
                  href={work.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d4a48e] transition-colors hover:text-[#e8bea8]"
                >
                  View Live Demo
                </a>
              ) : null}
              <Link
                to={`/works/${work.id}`}
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
              >
                {cardCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

const Deployments: React.FC = () => {
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
        <section data-hero-root className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-6 pb-1 md:px-8 md:pt-10 md:pb-0">
          <div className="max-w-4xl">
            <div className="mt-2.5 max-w-4xl overflow-hidden">
              <h1 data-startup-heading className="text-left">Sample sites for real business use cases.</h1>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              Demonstration sites showing how we structure fast, high-trust, conversion-focused web systems for businesses where first impressions drive inquiries.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
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
              Unless marked Active Deployment, these examples are internal sample builds created to demonstrate structure, UX, and technical standards.
            </p>
          </div>
        </section>

        <section id="sample-builds" className="scroll-mt-28 mx-auto w-full max-w-7xl overflow-visible px-4 pt-2 pb-8 sm:px-6 md:px-8 md:pt-4">
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

        <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-visible px-6 pb-12 text-center md:px-8">
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
        </section>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
