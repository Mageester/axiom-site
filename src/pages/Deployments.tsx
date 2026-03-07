import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';

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
  image: string;
  layout: 'featured' | 'editorial' | 'compact';
}

const proofImageBySlug: Record<string, string> = {
  'sample-hvac-kitchener': '/images/work-aether.jpg',
  'concept-landscaping-authority-site': '/images/case-study-1.jpg',
  'concept-roofing-conversion-site': '/images/case-study-2.jpg',
};

const proofTypeLabel: Record<string, string> = {
  'Sample Build': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Demonstration Site': 'Demonstration Site',
  'Active Deployment': 'Active Deployment',
};

const layoutBySlug: Record<string, WorkEntry['layout']> = {
  'sample-hvac-kitchener': 'featured',
  'concept-landscaping-authority-site': 'editorial',
  'concept-roofing-conversion-site': 'compact',
};

const oneSentence = (value: string) => {
  const parts = value.split('. ');
  if (parts.length <= 1) return value;
  return `${parts[0].replace(/\.$/, '')}.`;
};

const works: WorkEntry[] = caseStudies.map((entry) => ({
  id: entry.slug,
  title: entry.title.replace(/^Sample:\s*/, '').replace(/^Demo:\s*/, ''),
  projectType: proofTypeLabel[entry.label] ?? entry.label,
  audience: entry.businessType,
  businessContext: `${entry.niche} - ${entry.location}`,
  coreProblem: entry.primaryProblem || entry.problems[0] || 'Unclear trust and conversion structure',
  demonstrates: entry.demonstrates || entry.built[0] || 'Clearer page hierarchy and conversion pathways',
  scope: entry.deliverables.slice(0, 2).join(' + '),
  summary: oneSentence(entry.summary),
  image: proofImageBySlug[entry.slug] || '/images/work-aether.jpg',
  layout: layoutBySlug[entry.slug] || 'compact',
}));

function WorkCard({ work }: { work: WorkEntry }) {
  const isFeatured = work.layout === 'featured';
  const isEditorial = work.layout === 'editorial';

  return (
    <article
      className={`group overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/[0.08] bg-[#0d1323]/80 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(176,93,65,0.1)] ${
        isFeatured ? 'relative h-[520px] sm:h-[580px] md:col-span-2' : 'relative h-[430px] sm:h-[480px] md:col-span-1'
      }`}
    >
      {isFeatured ? (
        <>
          <img
            src={work.image}
            alt={work.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

          <div className="absolute left-5 top-5 z-10 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
              {work.projectType}
            </span>
            <span className="inline-block rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
              {work.audience}
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 z-10 rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:p-6">
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
            <Link
              to={`/works/${work.id}`}
              className="mt-4 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
            >
              View Build Notes
            </Link>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col">
          <div className={`relative ${isEditorial ? 'h-[56%]' : 'h-[52%]'} overflow-hidden`}>
            <img
              src={work.image}
              alt={work.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
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
            <Link
              to={`/works/${work.id}`}
              className="mt-2 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
            >
              View Build Notes
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Work | Axiom Infrastructure"
        description="Truth-first proof objects from sample and demonstration builds, presented with clear business context, problem framing, and design intent."
      />
      <Layout>
        <section className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-4 pb-2 md:px-8 md:pt-10">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Proof Library</p>
              <h1 className="mt-4 max-w-4xl text-left">Curated sample and demonstration builds for business-facing websites.</h1>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Apply for Fit Review
                </a>
                <Link
                  to="/infrastructure"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
                >
                  Review Method
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Each proof object includes</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>Business type and audience context</li>
                  <li>Core problem being solved</li>
                  <li>What the build demonstrates</li>
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  Unless labeled <span className="text-slate-200">Active Deployment</span>, these are sample or demonstration builds and do not claim client outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl overflow-visible px-4 pt-6 pb-8 sm:px-6 md:px-8">
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
                Apply for Fit Review
              </a>
              <Link
                to="/infrastructure"
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
