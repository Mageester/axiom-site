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

type ServiceRow = {
  title: string;
  body: string;
};

const SNAPSHOT_ROWS: readonly SnapshotRow[] = [
  {
    label: 'Focus',
    value: 'High-trust websites for established businesses',
  },
  {
    label: 'Scope',
    value: 'Positioning, design, development, and launch',
  },
  {
    label: 'Style',
    value: 'Quiet, technical, commercially sharp',
  },
];

const SERVICE_ROWS: readonly ServiceRow[] = [
  {
    title: 'Structure',
    body: 'Pages and navigation are organized so visitors understand the business quickly.',
  },
  {
    title: 'Design',
    body: 'The visual system stays restrained, legible, and consistent across devices.',
  },
  {
    title: 'Build',
    body: 'Responsive behavior, forms, and launch details are handled as part of the work.',
  },
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is a web studio that builds clearer, more credible websites for established businesses."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About | Axiom',
          description: 'Axiom is a web studio that builds clearer, more credible websites for established businesses.',
          url: 'https://getaxiom.ca/about',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-20">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-start">
              <div className="max-w-3xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
                <h1
                  data-startup-heading
                  className="mt-3 text-[clamp(2.35rem,5.8vw,4.35rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]"
                >
                  Clear websites for established businesses.
                </h1>
                <p data-startup-copy className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom sits between positioning, design, and development. The work is meant to help established businesses
                  feel clearer, stronger, and easier to trust.
                </p>
                <div data-startup-actions className="mt-7 flex flex-wrap items-center gap-3">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book Free Consultation
                  </Link>
                  <Link
                    to="/works"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    View Work
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

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What Axiom does</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                A narrow scope keeps the work clear.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Each project is aimed at improving how the business reads, feels, and converts without adding unnecessary
                noise.
              </p>
            </div>

            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {SERVICE_ROWS.map((item, index) => (
                <RevealBlock
                  as="div"
                  key={item.title}
                  delay={index * 0.06}
                  variant="card"
                  className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:py-6"
                >
                  <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">{item.body}</p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16" variant="feature">
            <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  If the fit looks right, the next step is a conversation.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We can review the current site, identify what is getting in the way, and outline the simplest version that
                  does the job well.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book Free Consultation
                </Link>
                <Link
                  to="/works"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
                >
                  View Work
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
