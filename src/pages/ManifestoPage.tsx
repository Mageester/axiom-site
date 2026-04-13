import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { SEO_ROUTES } from '../lib/seo';

type ManifestoPrinciple = {
  number: string;
  title: string;
  description: string;
};

const manifestoPrinciples: readonly ManifestoPrinciple[] = [
  {
    number: '01',
    title: 'Websites are infrastructure',
    description:
      'A serious business needs a website that can carry weight under pressure. It should inform, persuade, and perform with the same reliability expected from any core system.',
  },
  {
    number: '02',
    title: 'Performance is non-negotiable',
    description:
      'Speed is not cosmetic. Slow pages erode trust, reduce conversions, and weaken authority before a conversation begins, so performance is treated as a business requirement.',
  },
  {
    number: '03',
    title: 'Design serves strategy',
    description:
      'Every visual decision must earn its place. If typography, layout, or interaction does not improve clarity, trust, or user behavior, it does not belong.',
  },
  {
    number: '04',
    title: 'Clarity defeats cleverness',
    description:
      'Visitors should understand what a business does, why it matters, and where to go next without decoding slogans, hunting through pages, or tolerating ambiguity.',
  },
  {
    number: '05',
    title: 'Authority is built through consistency',
    description:
      'Credibility compounds when the message, the design system, and the technical execution all reinforce each other. Inconsistency creates doubt, and doubt costs action.',
  },
  {
    number: '06',
    title: 'Custom architecture matters',
    description:
      'A business with real ambition should not be forced into borrowed structure. We build around the business itself so the site reflects its standards, not a template\'s limits.',
  },
] as const;

const manifestoRefusals = [
  'We do not use templates dressed up as strategy',
  'We do not choose aesthetics over speed or clarity',
  'We do not publish before the system is tested',
  'We do not write vague copy that avoids commitment',
  'We do not treat launch as the end of responsibility',
] as const;

const manifestoOutcome = [
  'This philosophy produces websites that feel deliberate. They load quickly, explain the business clearly, and hold together under scrutiny because they were built to earn trust, not just attract attention.',
  'For clients, that means a digital presence that behaves like an asset. It supports sales, strengthens authority, and keeps doing its job long after the launch announcement is forgotten.',
] as const;

const accentColor = '#d4a48e';
const sectionLabelClass = 'font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#d4a48e]';

const ManifestoPage: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.manifesto} />

      <Layout disableAmbientMotion hidePrimaryCta>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="relative pt-10 md:pt-20">
            <div className="max-w-6xl">
              <div>
                <div className="h-1 w-[200px] rounded-full bg-[#d4a48e]" aria-hidden="true" />
                <header className="mt-10 max-w-4xl">
                  <p className={sectionLabelClass}>Manifesto</p>
                  <div className="mt-6 max-w-4xl overflow-hidden">
                    <h1
                      id="manifesto-hero-title"
                      className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]"
                    >
                      We build websites like infrastructure.
                    </h1>
                  </div>
                  <p className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                    Axiom believes a website should operate as a durable business system: clear in its message, rigorous in its execution, and accountable to outcomes.
                  </p>
                  <p className="mt-8 text-sm leading-6 text-slate-400">Read the manifesto below</p>
                </header>
              </div>
            </div>

          </section>

          <section aria-labelledby="manifesto-beliefs-title" className="pt-24 md:pt-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-start lg:gap-14">
              <div className="max-w-2xl lg:pt-2">
                <p className={sectionLabelClass}>What We Believe</p>
                <h2
                  id="manifesto-beliefs-title"
                  className="mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]"
                >
                  These are the standards behind every decision we make.
                </h2>
              </div>

              <ol className="list-none divide-y divide-white/10 border-y border-white/10 p-0">
                {manifestoPrinciples.map((principle) => (
                  <li key={principle.number}>
                    <article className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:py-6">
                      <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#d4a48e] md:pt-1">
                        {principle.number}
                      </div>
                      <div>
                        <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.08rem]">
                          {principle.title}
                        </h3>
                        <p className="mt-2 max-w-[38rem] text-sm leading-6 text-slate-300 md:text-[0.95rem]">
                          {principle.description}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section aria-labelledby="manifesto-refuse-title" className="pt-24 md:pt-28">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                <div className="max-w-2xl">
                  <p className={sectionLabelClass}>What We Refuse</p>
                  <h2
                    id="manifesto-refuse-title"
                    className="mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]"
                  >
                    These are the lines we do not cross.
                  </h2>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <div className="divide-y divide-white/[0.08]">
                    {manifestoRefusals.map((refusal, index) => (
                      <div key={refusal} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-5">
                        <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#d4a48e] md:pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <p className="text-sm font-semibold leading-7 text-[#F2F4F7] md:text-[15px]">{refusal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section aria-labelledby="manifesto-outcome-title" className="pt-24 md:pt-28 scroll-mt-32">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
                <div className="max-w-2xl">
                  <p className={sectionLabelClass}>The Outcome</p>
                  <h2
                    id="manifesto-outcome-title"
                    className="mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]"
                  >
                    What this philosophy produces in practice.
                  </h2>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <div className="space-y-6">
                    {manifestoOutcome.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-300 md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section aria-labelledby="manifesto-next-step-title" className="pt-24 md:pt-28">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="max-w-3xl">
                  <p className={sectionLabelClass}>Next Step</p>
                  <h2
                    id="manifesto-next-step-title"
                    className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl"
                  >
                    The philosophy is only useful if it shows up in the work.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                    If you want to see how these standards translate into real decisions, the work explains the application. If you want to discuss your own project, the conversation is open.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Link to="/works" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                      See how we think
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white sm:w-auto"
                    >
                      Let&apos;s talk about your project
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

export default ManifestoPage;
