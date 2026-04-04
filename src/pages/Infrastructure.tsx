import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

type ProcessStep = {
  number: string;
  title: string;
  summary: string;
};

type ChecklistItem = {
  title: string;
};

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    summary: 'Goals, scope, and fit are clarified early.',
  },
  {
    number: '02',
    title: 'Scope',
    summary: 'Pages, structure, and package direction align.',
  },
  {
    number: '03',
    title: 'Build',
    summary: 'Design, content, and performance are handled with intent.',
  },
  {
    number: '04',
    title: 'Launch',
    summary: 'Final review, technical checks, and a clean handoff.',
  },
];

const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  { title: 'Required pages and navigation flow' },
  { title: 'Lead capture and CTA placement' },
  { title: 'Content structure and message hierarchy' },
  { title: 'Domain, hosting, and launch path' },
  { title: 'Future expansion considerations' },
];

const CheckMark: React.FC = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#d4a48e]" fill="none" aria-hidden>
    <path
      d="M15.5 6.5 8.5 13.5 4.5 9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Infrastructure: React.FC = () => {
  return (
    <>
      <SEO
        title="Method | Axiom"
        description="Axiom's delivery method keeps launches controlled: one clear consultation, a defined scope, and a clean handoff for high-trust service firms."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Method | Axiom',
          description:
            "Axiom's delivery method keeps launches controlled: one clear consultation, a defined scope, and a clean handoff for high-trust service firms.",
          url: 'https://getaxiom.ca/method',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 pb-24 md:px-10 md:pb-32">
          <section className="pt-10 md:pt-16">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Method</p>
              <h1 className="mt-4 text-[clamp(2.35rem,7vw,4.7rem)] font-extrabold leading-[0.98] tracking-tight text-[#F2F4F7]">
                A clear process from first call to launch.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Founder-led planning, sharper scope, and a cleaner handoff from strategy to launch.
              </p>
              <div className="mt-8">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start the conversation
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-12 md:pt-16">
            <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  Four compact stages.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                A tighter view of the work so the next step is always obvious.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {PROCESS_STEPS.map((step) => (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.96)_0%,rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4a48e]/20 hover:shadow-[0_20px_54px_rgba(0,0,0,0.28)] md:p-6"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,164,142,0.08),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-axiomMono text-[11px] tracking-[0.18em] text-[#d4a48e]">
                      {step.number}
                    </span>
                    <span className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Stage
                    </span>
                  </div>
                  <div className="relative z-10 mt-5">
                    <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-tight text-[#F2F4F7]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 md:text-[0.96rem]">
                      {step.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-12 md:pt-16">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,26,0.98)_0%,rgba(10,13,19,0.98)_100%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:p-7">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">
                    Pre-build checklist
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.2rem]">
                    What we confirm before build
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-slate-400">
                  Compact, aligned, and locked before work begins.
                </p>
              </div>

              <ul className="mt-6 divide-y divide-white/[0.07]">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 py-3.5 md:py-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                      <CheckMark />
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-slate-200 md:text-[0.96rem]">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="pt-12 md:pt-16">
            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-7 text-center shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:p-10">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[14%] h-48 w-48 rounded-full bg-[#B05D41]/12 blur-3xl" />
                <div className="absolute -bottom-24 right-[8%] h-56 w-56 rounded-full bg-[#4B6EAF]/12 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  If the fit is right, we&apos;ll scope the work.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                  The first conversation is where goals, timing, and the cleanest next step become clear.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Start the conversation
                  </Link>
                </div>
              </div>
            </article>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Infrastructure;
