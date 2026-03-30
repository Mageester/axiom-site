import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'We talk first',
    body: 'We start with a short call to understand the business, the site, and what needs to change.',
  },
  {
    number: '02',
    title: 'We map the pages',
    body: 'We decide what the site should say, what it should not say, and where the next step should live.',
  },
  {
    number: '03',
    title: 'We build and launch',
    body: 'We write the pages, check them on desktop and mobile, and launch when everything is ready.',
  },
];

const METHOD_NOTES = [
  'A real person reviews the project from the start.',
  'We keep the page structure simple and easy to follow.',
  'We only add what helps the business move forward.',
];

const METHOD_HANDOFF = [
  'A clear page plan',
  'Simple copy written in plain English',
  'A site that works on phones and desktop',
  'A clean handoff with no surprise extras',
];

const Infrastructure: React.FC = () => {
  return (
    <>
      <SEO
        title="Method | Axiom"
        description="Axiom keeps projects simple with one call, a clear plan, and a clean launch."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Method</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                A simple process from first call to launch.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                We keep the work clear. You know what we are doing, why it matters, and what happens next.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </Link>
                <p className="text-sm text-slate-300">One call. One plan. One launch.</p>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="max-w-xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">The process</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  Three steps, kept simple.
                </h2>
              </div>

              <div className="space-y-5 border-t border-white/10 pt-5">
                {PROCESS_STEPS.map((step) => (
                  <div key={step.number} className="grid gap-4 border-b border-white/[0.06] pb-5 md:grid-cols-[6rem_minmax(0,1fr)]">
                    <div>
                      <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">{step.number}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-[#F2F4F7] md:text-xl">{step.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">What we need</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  Enough context to do the work well.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  We do not need a long brief. We need a real description of the business, the offer, and the problem with the current site.
                </p>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                {METHOD_NOTES.map((note) => (
                  <p key={note} className="text-sm leading-7 text-slate-300 md:text-base">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">What launch includes</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                A clean handoff with no extra clutter.
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {METHOD_HANDOFF.map((item) => (
                  <p key={item} className="border-t border-white/10 pt-4 text-sm leading-7 text-slate-300 md:text-base">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                If it feels like a fit, start the application.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We will look at the project, confirm fit, and tell you the simplest next move.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <Link to="/apply" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                  Start on the Apply page
                </Link>
                .
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Infrastructure;
