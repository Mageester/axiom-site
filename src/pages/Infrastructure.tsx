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
    summary: 'We learn about your business, your customers, and what the site needs to do.',
  },
  {
    number: '02',
    title: 'Plan',
    summary: 'We agree on the pages, content, and goals before anything is built.',
  },
  {
    number: '03',
    title: 'Build',
    summary: 'We design, build, and refine the site with care and attention to detail.',
  },
  {
    number: '04',
    title: 'Launch',
    summary: 'Final review, testing, and your site goes live.',
  },
];

const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  { title: 'Pages and navigation' },
  { title: 'Contact forms and calls-to-action' },
  { title: 'Content and messaging' },
  { title: 'Domain, hosting, and launch details' },
  { title: 'Future updates and growth' },
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
        description="How Axiom builds websites: a clear four-step process from first call to launch, designed for established businesses that value quality and accountability."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Method | Axiom',
          description:
            'How Axiom builds websites: a clear four-step process from first call to launch, designed for established businesses that value quality and accountability.',
          url: 'https://getaxiom.ca/method',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-10 md:pb-20">
          <section className="pt-8 md:pt-12">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#A7B3BC]">Method</p>
              <h1 data-startup-heading className="mt-3 text-[clamp(2.35rem,7vw,4.7rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]">
                A clear process from first call to launch.
              </h1>
              <p data-startup-copy className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                One call to understand your business. A clear plan. A professional launch.
              </p>
              <div data-startup-actions className="mt-6">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book a Free Consultation
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-10 md:pt-12">
            <div className="mb-4 flex flex-col gap-2 md:mb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-4xl">
                  A simple four-step process.
                </h2>
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
                  </div>
                  <div className="relative z-10 mt-4">
                    <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-tight text-[#F2F4F7]">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-300 md:text-[0.96rem]">
                      {step.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-10 md:pt-12">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,26,0.98)_0%,rgba(10,13,19,0.98)_100%)] p-4 shadow-[0_18px_52px_rgba(0,0,0,0.22)] md:p-5">
              <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">
                    Pre-build checklist
                  </p>
                  <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.1rem]">
                    What we agree on before building
                  </h2>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-white/[0.07]">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 py-3 md:py-3.5">
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

          <section className="pt-10 md:pt-12">
            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-5 text-center shadow-[0_20px_54px_rgba(0,0,0,0.24)] md:p-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-[14%] h-48 w-48 rounded-full bg-[#B05D41]/12 blur-3xl" />
                <div className="absolute -bottom-24 right-[8%] h-56 w-56 rounded-full bg-[#4B6EAF]/12 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#F2F4F7] md:text-[2.8rem]">
                  Ready to get started?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Book a free call and we&apos;ll review your current website, understand your goals, and explain what we&apos;d do.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a Free Consultation
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
