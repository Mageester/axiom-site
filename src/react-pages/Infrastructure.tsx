import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

type ProcessStep = {
  id: string;
  stageLabel: string;
  title: string;
  timelineDescription: string;
  summary: string;
  bullets: readonly string[];
};

type ChecklistItem = {
  title: string;
  detail: string;
};

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: 'review',
    stageLabel: 'Review',
    title: 'Review',
    timelineDescription: 'We audit the current site and identify the friction that costs trust and leads.',
    summary: 'We look at the current site, what needs to change, and what people should find first.',
    bullets: [
      'We review the current site and note what needs to change.',
      'You point out what must stay and share any access we need.',
    ],
  },
  {
    id: 'scope',
    stageLabel: 'Scope',
    title: 'Scope',
    timelineDescription: 'We lock the page structure, proof blocks, and call paths before design starts.',
    summary: 'We settle the main pages, the proof to show, and where calls or forms should go.',
    bullets: [
      'We map the pages, proof, and contact path.',
      'You confirm the main offer and the pages that matter most.',
    ],
  },
  {
    id: 'build',
    stageLabel: 'Build',
    title: 'Build',
    timelineDescription: 'We write, design, and test the build so service, proof, and contact stay clear.',
    summary: 'We write the copy, shape the pages, and check how they hold up on phones and desktop.',
    bullets: [
      'We write, design, and build the pages.',
      'You review the draft and send notes.',
    ],
  },
  {
    id: 'launch',
    stageLabel: 'Launch',
    title: 'Launch',
    timelineDescription: 'We run launch checks, connect the domain, and ship with clear next steps.',
    summary: 'We test the forms, connect the domain, and make sure the site is ready to go live.',
    bullets: [
      'We test the forms, connect the domain, and check the live site.',
      'You approve the final version and help us update old links if needed.',
    ],
  },
];

const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  {
    title: 'Pages to build',
    detail: 'Which pages matter most right now.',
  },
  {
    title: 'Proof to surface',
    detail: 'Reviews, photos, and past work that should show up early.',
  },
  {
    title: 'Quote and contact paths',
    detail: 'Where each quote, call, or contact path should go.',
  },
  {
    title: 'Domain and redirects',
    detail: 'Domain, redirects, and final checks before the site goes live.',
  },
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

const ProcessTimeline: React.FC = () => (
  <RevealBlock
    as="div"
    variant="feature"
    className="reveal-stagger mt-7 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.98)_0%,rgba(9,12,18,0.99)_100%)] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.18)] md:p-7"
  >
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-4">
      {PROCESS_STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <RevealBlock
            as="article"
            delay={index * 0.06}
            variant="card"
            className="relative pl-7 lg:flex-1 lg:pl-0"
          >
            {index < PROCESS_STEPS.length - 1 ? (
              <div className="absolute left-[0.6rem] top-[3.1rem] bottom-[-1.4rem] w-[2px] bg-white/10 lg:hidden" aria-hidden="true" />
            ) : null}
            <span className="absolute left-0 top-[0.95rem] h-3 w-3 rounded-full border border-white/20 bg-[#0f1524] lg:hidden" aria-hidden="true" />
            <p className="font-axiomDisplay text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-accent">{step.stageLabel}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#A7B3BC]">{step.timelineDescription}</p>
          </RevealBlock>
          {index < PROCESS_STEPS.length - 1 ? (
            <div className="hidden h-[2px] flex-1 self-start bg-white/10 lg:block lg:translate-y-7" aria-hidden="true" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  </RevealBlock>
);

const Infrastructure: React.FC = () => {

  return (
    <>
      <SEO
        {...SEO_ROUTES.process}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="axiom-container w-full pb-16 md:pb-24">
          <section className="pt-4 md:pt-8">
            <div className="max-w-5xl">
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,31,0.96)_0%,rgba(10,13,19,0.99)_100%)] p-6 shadow-[0_18px_52px_rgba(0,0,0,0.2)] md:p-8 lg:p-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Process</p>
                <h1 data-startup-heading className="mt-3 max-w-3xl text-[clamp(2.35rem,7vw,4.7rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]">
                  Four stages from review to launch.
                </h1>
                <p data-startup-copy className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Each stage keeps the work clear, the decisions early, and the launch path simple.
                </p>
                <div data-startup-actions className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                    {CTA.primary.label}
                  </Link>
                  <Link
                    to={CTA.work.to}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    {CTA.work.label}
                  </Link>
                </div>
              </article>
            </div>
          </section>

          <section className="pt-6 md:pt-10">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.7fr)] xl:items-start xl:gap-8">
              <div>
                <div className="mb-5 flex flex-col gap-2 md:mb-6">
                  <p className="font-axiomMono text-xs uppercase tracking-[0.18em] text-[#A7B3BC]">Timeline</p>
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                    How the build moves.
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Clear checkpoints keep decisions early and launch predictable.
                  </p>
                </div>

                <ProcessTimeline />

              </div>

              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] md:p-6 xl:sticky xl:top-28">
                <p className="font-axiomMono text-xs uppercase tracking-[0.18em] text-[#A7B3BC]">
                  Before we build
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.1rem]">
                  What we need before the build.
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                  This keeps the work moving and cuts down on back-and-forth later.
                </p>

                <ul className="mt-5 divide-y divide-white/[0.08]">
                  {CHECKLIST_ITEMS.map((item) => (
                    <li key={item.title} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                        <CheckMark />
                      </span>
                      <div>
                        <p className="text-sm font-medium leading-relaxed text-slate-200 md:text-[0.96rem]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="pt-8 md:pt-10">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div>
                  <p className="font-axiomMono text-xs uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.8rem]">
                    Start with a review.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base lg:mt-3">
                    We&apos;ll look at the site and show the first changes worth making.
                  </p>
                </div>
                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-xs uppercase tracking-[0.18em] text-[#A7B3BC]">What comes next</p>
                  <div className="mt-4 divide-y divide-white/[0.08]">
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Review</p>
                    </div>
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Plan</p>
                    </div>
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Build</p>
                    </div>
                    <div className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium text-[#F2F4F7]">Launch</p>
                    </div>
                  </div>
                </aside>
                <div className="flex flex-wrap gap-3 lg:col-span-2 lg:justify-end">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                    {CTA.primary.label}
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

