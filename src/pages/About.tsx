import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';
import { RevealBlock } from '../components/ui/RevealBlock';

type SnapshotRow = {
  label: string;
  value: string;
};

const SNAPSHOT_ROWS: readonly SnapshotRow[] = [
  {
    label: 'Built for',
    value: 'Established businesses that need the site to do more of the explaining',
  },
  {
    label: 'Fixed first',
    value: 'Weak pages, buried proof, and unclear contact paths',
  },
  {
    label: 'Writing rule',
    value: 'Plain language, visible proof, and one clear next step',
  },
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        {...SEO_ROUTES.about}
        description="Axiom builds clear websites that explain the offer, surface proof, and make the next step obvious."
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
                  Clear websites that help businesses build trust.
                </h1>
                <p data-startup-copy className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom fixes weak pages, buried proof, and hard-to-find contact details. People should understand the business and the next step without digging.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to="/start-a-project" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    Start a project
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
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What the work does</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Make the business easier to trust.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Most sites do not need more pages or more effects. They need the offer to read clearly, proof to appear early, and the next step to stay obvious.
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Clear offer</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">People know what the business does in the first few seconds.</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Proof visible</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Reviews, photos, and past work show up before doubt sets in.</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-[#F2F4F7]">Easy contact</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Phone numbers, forms, and quote paths stay easy to find.</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={CTA.work.to}
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                >
                  {CTA.work.label}
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
