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
  businessContext: string;
  scope: string;
  role: string;
  summary: string;
  image: string;
  span: 'sm' | 'md' | 'lg';
}

const proofImageBySlug: Record<string, string> = {
  'sample-hvac-kitchener': '/images/work-aether.jpg',
  'concept-landscaping-authority-site': '/images/case-study-1.jpg',
  'concept-roofing-conversion-site': '/images/case-study-2.jpg',
};

const proofTypeLabel: Record<string, string> = {
  'Sample Case Study': 'Sample Build',
  'Concept Build': 'Concept Build',
  'Active Deployment': 'Active Deployment',
};

const spanBySlug: Record<string, WorkEntry['span']> = {
  'sample-hvac-kitchener': 'lg',
  'concept-landscaping-authority-site': 'md',
  'concept-roofing-conversion-site': 'sm',
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
  businessContext: `${entry.niche} - ${entry.location}`,
  scope: entry.deliverables.slice(0, 2).join(' + '),
  role: entry.built.slice(0, 2).join(' + '),
  summary: oneSentence(entry.summary),
  image: proofImageBySlug[entry.slug] || '/images/work-aether.jpg',
  span: spanBySlug[entry.slug] || 'md',
}));

function WorkCard({ work }: { work: WorkEntry }) {
  const heightMap = {
    sm: 'h-[360px] sm:h-[410px]',
    md: 'h-[440px] sm:h-[490px]',
    lg: 'h-[500px] sm:h-[560px]',
  };

  const colSpanMap = {
    sm: 'md:col-span-1',
    md: 'md:col-span-1',
    lg: 'md:col-span-2',
  };

  const isCompact = work.span === 'sm';

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/[0.08] bg-[#0d1323]/80 ${heightMap[work.span]} ${colSpanMap[work.span]} transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(176,93,65,0.1)]`}
    >
      <img
        src={work.image}
        alt={work.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/30 to-transparent opacity-75 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute left-4 top-4 z-10">
        <span className="inline-block rounded-full border border-white/10 bg-black/40 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
          {work.projectType}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <div className="translate-y-2 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{work.title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/75">{work.businessContext}</p>
          {!isCompact && <p className="mt-2 text-sm text-white/90">{work.summary}</p>}
          <dl className={`mt-3 grid gap-2 text-[11px] text-white/85 ${isCompact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            <div>
              <dt className="font-axiomMono uppercase tracking-[0.12em] text-white/60">Scope</dt>
              <dd className="mt-0.5 leading-relaxed">{work.scope}</dd>
            </div>
            {!isCompact && (
              <div>
                <dt className="font-axiomMono uppercase tracking-[0.12em] text-white/60">Role</dt>
                <dd className="mt-0.5 leading-relaxed">{work.role}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Work | Axiom Infrastructure"
        description="Proof objects from current sample and concept builds, with explicit scope, context, and Axiom role."
      />
      <Layout>
        <section className="relative mx-auto w-full max-w-7xl overflow-visible px-6 pt-4 pb-2 md:px-8 md:pt-10">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Proof Library</p>
              <h1 className="mt-4 max-w-4xl text-left">Current work with context, scope, and role clarity.</h1>
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
                  <li>Business context and market frame</li>
                  <li>Concrete scope snapshot</li>
                  <li>Explicit Axiom execution role</li>
                </ul>
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
