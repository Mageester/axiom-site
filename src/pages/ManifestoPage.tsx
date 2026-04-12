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

const ManifestoPage: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.manifesto} />

      <Layout disableAmbientMotion hidePrimaryCta>
        <main id="main-content" tabIndex={-1} className="w-full bg-[#0A0A0A] text-[#F8F8F8]">
          {/* Hero: a full-height thesis statement with no CTA pressure. */}
          <section
            data-hero-root
            data-reveal="off"
            aria-labelledby="manifesto-hero-title"
            className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-[120px] md:min-h-[calc(100vh-7rem)] md:px-10"
          >
            <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
              <div className="h-1 w-[200px] rounded-full bg-[#D4AF37]" aria-hidden="true" />
              <header className="mt-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Manifesto
                </p>
                <h1
                  id="manifesto-hero-title"
                  className="mt-6 text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-[#F8F8F8] md:text-[56px]"
                >
                  We build websites like infrastructure.
                </h1>
                <p className="mx-auto mt-6 max-w-[720px] text-[18px] font-normal leading-[1.75] text-[#B8B8B8]">
                  Axiom believes a website should operate as a durable business system: clear in its message, rigorous in its execution, and accountable to outcomes.
                </p>
              </header>
              <p className="mt-10 text-[13px] uppercase tracking-[0.18em] text-[#B8B8B8]">
                Read the manifesto below
              </p>
            </div>
          </section>

          {/* Core manifesto: six non-negotiable beliefs rendered in a single authoritative column. */}
          <section
            data-reveal="off"
            aria-labelledby="manifesto-beliefs-title"
            className="border-t border-[#333333] px-6 py-[60px] md:px-10 md:py-[100px]"
          >
            <div className="mx-auto w-full max-w-[900px]">
              <header className="max-w-[680px]">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  What We Believe
                </p>
                <h2
                  id="manifesto-beliefs-title"
                  className="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#F8F8F8] md:text-[40px]"
                >
                  These are the standards behind every decision we make.
                </h2>
              </header>

              <ol className="mt-14 flex list-none flex-col gap-[80px] p-0">
                {manifestoPrinciples.map((principle) => (
                  <li key={principle.number} className="border-l-4 border-[#D4AF37] pl-[30px]">
                    <article aria-labelledby={`principle-${principle.number}-title`}>
                      <p className="text-[18px] font-bold leading-none tracking-[0.1em] text-[#D4AF37]">
                        {principle.number}
                      </p>
                      <h3
                        id={`principle-${principle.number}-title`}
                        className="mt-5 text-[22px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#D4AF37]"
                      >
                        {principle.title}
                      </h3>
                      <p className="mt-4 max-w-[720px] text-[16px] leading-[1.75] text-[#B8B8B8]">
                        {principle.description}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Refusals: short hard lines with no explanatory padding. */}
          <section
            data-reveal="off"
            aria-labelledby="manifesto-refuse-title"
            className="border-t border-[#333333] bg-[#1A1A1A] px-6 py-[60px] md:px-10 md:py-[100px]"
          >
            <div className="mx-auto w-full max-w-[900px]">
              <header className="max-w-[680px]">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  What We Refuse
                </p>
                <h2
                  id="manifesto-refuse-title"
                  className="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#F8F8F8] md:text-[40px]"
                >
                  These are the lines we do not cross.
                </h2>
              </header>

              <ul className="mt-12 space-y-6">
                {manifestoRefusals.map((refusal, index) => (
                  <li
                    key={refusal}
                    className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-4 text-left"
                  >
                    <span className="pt-0.5 text-[16px] font-semibold tracking-[0.08em] text-[#D4AF37]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[16px] font-normal leading-[1.75] text-[#F8F8F8]">
                      {refusal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Outcome: bridge the philosophy back to client reality without selling. */}
          <section
            data-reveal="off"
            aria-labelledby="manifesto-outcome-title"
            className="border-t border-[#333333] px-6 py-[60px] md:px-10 md:py-[100px]"
          >
            <div className="mx-auto w-full max-w-[700px] text-center">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                The Outcome
              </p>
              <h2
                id="manifesto-outcome-title"
                className="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#F8F8F8] md:text-[40px]"
              >
                What this philosophy produces in practice.
              </h2>
              <div className="mt-8 space-y-6">
                {manifestoOutcome.map((paragraph) => (
                  <p key={paragraph} className="text-[16px] leading-[1.75] text-[#B8B8B8]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Soft CTA: respectful next steps for readers who want more context. */}
          <section
            data-reveal="off"
            aria-labelledby="manifesto-next-step-title"
            className="border-t border-[#333333] bg-[#1A1A1A] px-6 py-[60px] md:px-10 md:py-[100px]"
          >
            <div className="mx-auto flex w-full max-w-[700px] flex-col items-center text-center">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                Next Step
              </p>
              <h2
                id="manifesto-next-step-title"
                className="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#F8F8F8] md:text-[40px]"
              >
                The philosophy is only useful if it shows up in the work.
              </h2>
              <p className="mt-6 max-w-[640px] text-[16px] leading-[1.75] text-[#B8B8B8]">
                If you want to see how these standards translate into real decisions, the work explains the application. If you want to discuss your own project, the conversation is open.
              </p>
              <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/works"
                  className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-[#D4AF37] px-6 py-3 text-[16px] font-medium text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C547] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                >
                  See how we think
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-transparent px-6 py-3 text-[16px] font-medium text-[#B8B8B8] underline decoration-transparent underline-offset-[6px] transition-colors duration-200 hover:text-[#E8C547] hover:decoration-[#E8C547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C547] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                >
                  Let&apos;s talk about your project
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default ManifestoPage;
