import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { CTA } from '../lib/cta';
import { responsiveImages } from '../lib/responsiveImages';
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
    duration: '1-2 days',
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
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-5 pb-16 md:px-10 md:pb-24">
          <section className="pt-4 md:pt-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.68fr)] xl:items-start">
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

              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] md:p-6 xl:mt-8">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">At a glance</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7]">What each stage covers.</h2>
                <div className="mt-5 divide-y divide-white/[0.08]">
                  {PROCESS_STEPS.map((step) => (
                    <div key={step.number} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-axiomMono text-[11px] tracking-[0.18em] text-[#d4a48e]">{step.number}</p>
                        <p className="mt-1 text-sm font-medium text-[#F2F4F7]">{step.title}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-300">
                        {step.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <RevealBlock as="section" className="pt-10 md:pt-16">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#0b1120] shadow-[0_18px_52px_rgba(0,0,0,0.2)]">
              <ResponsiveImage
                  source={responsiveImages.workAether}
                  sizes="(min-width: 768px) 100vw, 100vw"
                  alt="Process mapping and design architecture"
                  className="w-full h-[24rem] md:h-[32rem] object-cover"
                  style={{ objectPosition: 'center 40%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-lg">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#d4a48e]">The Output</p>
                  <p className="mt-3 text-[1.35rem] font-medium leading-[1.4] text-[#F2F4F7] sm:text-2xl">
                    A clear path creates a sharp result.
                  </p>
              </div>
            </div>
          </RevealBlock>

          <section className="pt-8 md:pt-14">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.7fr)] xl:items-start xl:gap-8">
              <div>
                <div className="mb-5 flex flex-col gap-2 md:mb-6">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">The steps</p>
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                    What happens at each stage.
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                    The main choices get settled early so the build stays clear.
                  </p>
                </div>

                <div className="space-y-4 reveal-stagger">
                    {PROCESS_STEPS.map((step, index) => (
                      <RevealBlock as="article" key={step.number} delay={index * 0.08} variant="card"
                      className="motion-surface overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.98)_0%,rgba(9,12,18,0.99)_100%)] shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
                    >
                      <div className="grid gap-0 lg:grid-cols-[11rem_minmax(0,1fr)]">
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 md:p-6 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r">
                          <div>
                            <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#d4a48e]">
                              {step.number}
                            </p>
                            <h3 className="mt-2 text-[1.1rem] font-semibold text-[#F2F4F7]">{step.title}</h3>
                          </div>
                          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-slate-300">
                            {step.duration}
                          </span>
                        </div>
                        <div className="p-5 md:p-6 lg:p-7">
                          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">{step.summary}</p>
                          <ul className="mt-4 space-y-2.5">
                            {step.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-2 text-sm leading-6 text-slate-300 md:text-[0.96rem]">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a48e]" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </RevealBlock>
                  ))}
                </div>
              </div>

              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] md:p-6 xl:sticky xl:top-28">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">
                  Before build starts
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.1rem]">
                  What we need first
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
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.8rem]">
                    Start with a review.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base lg:mt-3">
                    We&apos;ll look at the site and show the first changes worth making.
                  </p>
                </div>
                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What comes next</p>
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
