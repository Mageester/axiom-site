import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

// ═══════════════════════════════════════════════════════════════
// WORKS DATA — Image-first showcase entries
// ═══════════════════════════════════════════════════════════════
interface WorkEntry {
  id: string;
  title: string;
  category: string;
  image: string;
  span: 'sm' | 'md' | 'lg' | 'wide';
}

const works: WorkEntry[] = [
  {
    id: 'project-ember',
    title: 'Project Ember',
    category: 'Home Services',
    image: '/images/work-aether.jpg',
    span: 'sm',
  },
  {
    id: 'project-ironclad',
    title: 'Project Ironclad',
    category: 'Contracting',
    image: '/images/case-study-2.jpg',
    span: 'lg',
  },
  {
    id: 'project-clarity',
    title: 'Project Clarity',
    category: 'Clinics',
    image: '/images/case-study-1.jpg',
    span: 'md',
  },
  {
    id: 'project-hearth',
    title: 'Project Hearth',
    category: 'Restaurants',
    image: '/images/work-aether.jpg',
    span: 'wide',
  },
  {
    id: 'project-terrain',
    title: 'Project Terrain',
    category: 'Contracting',
    image: '/images/case-study-1.jpg',
    span: 'md',
  },
  {
    id: 'project-sovereign',
    title: 'Project Sovereign',
    category: 'Legal',
    image: '/images/case-study-2.jpg',
    span: 'sm',
  },
];

// ═══════════════════════════════════════════════════════════════
// WORK CARD — Image-first bento tile with hover overlay
// ═══════════════════════════════════════════════════════════════
function WorkCard({ work }: { work: WorkEntry }) {
  const heightMap = {
    sm: 'h-[280px] sm:h-[320px]',
    md: 'h-[320px] sm:h-[400px]',
    lg: 'h-[360px] sm:h-[460px]',
    wide: 'h-[280px] sm:h-[360px]',
  };

  const colSpanMap = {
    sm: '',
    md: '',
    lg: '',
    wide: 'md:col-span-2',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/[0.08] bg-[#0d1323]/80 ${heightMap[work.span]} ${colSpanMap[work.span]} cursor-pointer transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(176,93,65,0.1)]`}
    >
      {/* Image */}
      <img
        src={work.image}
        alt={work.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark gradient overlay — always visible, stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Category tag — top left */}
      <div className="absolute left-4 top-4 z-10">
        <span className="inline-block rounded-full border border-white/10 bg-black/40 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
          {work.category}
        </span>
      </div>

      {/* Info — bottom, slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 sm:p-6">
        <div className="translate-y-2 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{work.title}</h3>
          <p className="mt-1 text-sm text-white/50 opacity-0 transition-all duration-500 delay-75 group-hover:opacity-100">
            View case study →
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Works | Axiom Infrastructure"
        description="Selected work from Axiom Infrastructure, focused on positioning quality, conversion clarity, and execution standards."
      />
      <Layout>
        {/* ═══════════════════════════════════════════════════════
            HERO — Centered, minimal, Refract-inspired
        ═══════════════════════════════════════════════════════ */}
        <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-8 pb-0 text-center md:px-8 md:pt-16 overflow-visible">
          <h1 className="mb-4">
            Selected Work
          </h1>
          <p className="mb-8 max-w-md text-lg text-slate-400">
            A review of structure, presentation quality, and conversion intent.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/#intake" className="btn-primary btn-lg whitespace-nowrap">
              Request a Fit Call
            </a>
            <Link
              to="/infrastructure"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
            >
              Review Standards
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            WORKS GRID — Bento / masonry image-first layout
        ═══════════════════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-4 pb-8 overflow-visible">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BOTTOM CTA — Mirroring Refract's closing section
        ═══════════════════════════════════════════════════════ */}
        <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-12 text-center md:px-8 overflow-visible">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#B05D41]/[0.08] blur-[160px]" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/#intake" className="btn-primary btn-lg whitespace-nowrap">
                Request a Fit Call
              </a>
              <Link
                to="/infrastructure"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
              >
                Review Standards
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
