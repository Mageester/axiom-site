import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

type ProcessStep = {
  number: string;
  title: string;
  duration: string;
  summary: string;
  bullets: readonly string[];
};

type ChecklistItem = {
  title: string;
  detail: string;
};

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Review',
    duration: '1–2 days',
    summary: 'We look at the current site, what needs to change, and what people should find first.',
    bullets: [
      'We review the current site and note what needs to change.',
      'You point out what must stay and share any access we need.',
    ],
  },
  {
    number: '02',
    title: 'Plan',
    duration: '2–3 days',
    summary: 'We settle the main pages, the proof to show, and where calls or forms should go.',
    bullets: [
      'We map the pages, proof, and contact path.',
      'You confirm the main offer and the pages that matter most.',
    ],
  },
  {
    number: '03',
    title: 'Build',
    duration: '2–4 weeks',
    summary: 'We write the copy, shape the pages, and check how they hold up on phones and desktop.',
    bullets: [
      'We write, design, and build the pages.',
      'You review the draft and send notes.',
    ],
  },
  {
    number: '04',
    title: 'Launch',
    duration: '1 day',
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
    title: 'Proof to show',
    detail: 'Reviews, photos, and past work that should show up early.',
  },
  {
    title: 'Calls and forms',
    detail: 'Where each quote, call, or contact path should go.',
  },
  {
    title: 'Launch setup',
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

const Infrastructure: React.FC = () => {
  return (
    <>
      <SEO
        {...SEO_ROUTES.process}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 pb-14 md:px-10 md:pb-18">
          <section className="pt-4 md:pt-8">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Process</p>
              <h1 data-startup-heading className="mt-3 text-[clamp(2.35rem,7vw,4.7rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]">
                Four stages from review to launch.
              </h1>
              <p data-startup-copy className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Each step shows what happens, what we need from you, and where the work is headed.
              </p>
              <div data-startup-actions className="mt-5">
                <div className="flex flex-wrap items-center gap-3">
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
              </div>
            </div>
          </section>

          <section className="pt-6 md:pt-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] xl:items-start">
              <div>
                <div className="mb-4 flex flex-col gap-2 md:mb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">The steps</p>
                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                      What happens at each stage.
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                      The main choices get settled early so the build stays clear.
                    </p>
                  </div>
                </div>

                <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                  <div className="relative">
                    <div className="absolute left-4 right-4 top-4 hidden h-px bg-white/10 md:block" />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {PROCESS_STEPS.map((step) => (
                        <div key={step.number} className="relative flex items-center gap-3">
                          <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0f1524] font-axiomMono text-[10px] tracking-[0.18em] text-[#d4a48e]">
                            {step.number}
                          </span>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#F2F4F7]">{step.title}</p>
                            <p className="text-[11px] text-slate-400">{step.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2.5 md:grid-cols-2 md:gap-3">
                  {PROCESS_STEPS.map((step) => (
                    <article
                      key={step.number}
                      className="motion-surface group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.98)_0%,rgba(9,12,18,0.99)_100%)] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:-translate-y-px hover:border-[#d4a48e]/20 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] md:p-5"
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                      <div className="motion-fade pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,164,142,0.1),transparent_42%)] opacity-80 group-hover:opacity-100" />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-[-0.85rem] rounded-full bg-[#B05D41]/10 blur-xl" />
                          <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-axiomMono text-[11px] tracking-[0.18em] text-[#d4a48e]">
                            {step.number}
                          </span>
                        </div>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-300">
                          {step.duration}
                        </span>
                      </div>
                      <div className="relative z-10 mt-4">
                        <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-tight text-[#F2F4F7]">
                          {step.title}
                        </h3>
                        <ul className="mt-3 space-y-2.5">
                          {step.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2 text-sm leading-6 text-slate-300 md:text-[0.96rem]">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a48e]" aria-hidden="true" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <article className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,26,0.98)_0%,rgba(10,13,19,0.98)_100%)] p-4 shadow-[0_18px_52px_rgba(0,0,0,0.22)] md:p-5 xl:mt-[3.4rem]">
              <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
                  <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">
                      Before build starts
                    </p>
                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.1rem]">
                      What we need first
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                      This keeps the work moving and cuts down on back-and-forth later.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-white/[0.07]">
                  {CHECKLIST_ITEMS.map((item) => (
                    <li key={item.title} className="flex items-start gap-3 py-3 md:py-3.5">
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

          <section className="pt-7 md:pt-9">
            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-5 text-center shadow-[0_20px_54px_rgba(0,0,0,0.24)] md:p-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[14%] h-48 w-48 rounded-full bg-[#B05D41]/12 blur-3xl" />
                <div className="absolute -bottom-24 right-[8%] h-56 w-56 rounded-full bg-[#4B6EAF]/12 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.8rem]">
                  Start with a review.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                  We&apos;ll look at the site and show the first changes worth making.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
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
