import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';

type SnapshotRow = {
  label: string;
  value: string;
};

const SNAPSHOT_ROWS: readonly SnapshotRow[] = [
  {
    label: 'Focus',
    value: 'Clear websites for established businesses',
  },
  {
    label: 'Scope',
    value: 'Pages, writing, build, launch',
  },
  {
    label: 'Style',
    value: 'Calm, direct, easy to use',
  },
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom builds clear websites for established businesses."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About | Axiom',
          description: 'Axiom builds clear websites for established businesses.',
          url: 'https://getaxiom.ca/about',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-20">
          <RevealBlock as="section" data-hero-root className="pt-10 md:pt-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-start">
              <div className="max-w-3xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
                <h1
                  data-startup-heading
                  className="mt-3 text-[clamp(2.35rem,5.8vw,4.35rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]"
                >
                  Axiom builds websites that are easy to read and trust.
                </h1>
                <p data-startup-copy className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  The work stays focused on what people need to know and how to reach you.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to="/apply" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    Talk to Axiom
                  </Link>
                  <Link
                    to="/works"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07] sm:w-auto"
                  >
                    See work
                  </Link>
                </div>
              </div>

              <aside
                data-startup-meta
                className="border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0"
              >
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">At a glance</p>
                <dl className="mt-4 space-y-4">
                  {SNAPSHOT_ROWS.map((row) => (
                    <div key={row.label} className="border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{row.label}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-slate-200">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-10 md:pt-16" variant="feature">
            <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  If the site feels weak, we can help.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We can look at the current site and point out the first thing worth fixing.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/apply" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  Talk to Axiom
                </Link>
                <Link
                  to="/works"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07] sm:w-auto"
                >
                  See work
                </Link>
              </div>
            </article>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default About;
