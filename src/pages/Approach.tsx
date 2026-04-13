import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { SEO_ROUTES } from '../lib/seo';

type ApproachPrinciple = {
  number: string;
  title: string;
  description: string;
};

const approachPrinciples: readonly ApproachPrinciple[] = [
  {
    number: '01',
    title: 'Clarity comes first',
    description:
      'A visitor should understand the offer, the proof, and the next step without decoding the page.',
  },
  {
    number: '02',
    title: 'Speed protects trust',
    description:
      'Fast pages keep trust high and reduce drop-off on phones, where most people first meet the site.',
  },
  {
    number: '03',
    title: 'Proof beats polish',
    description:
      'Specific examples, outcomes, and contact paths do more work than vague slogans or long copy.',
  },
] as const;

const eyebrowClass = 'font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#d4a48e]';

const Approach: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.approach} />

      <Layout disableAmbientMotion hidePrimaryCta>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="relative pt-10 md:pt-20">
            <div className="max-w-6xl">
              <div className="max-w-4xl">
                <p className={eyebrowClass}>Our Approach</p>
                <div className="mt-6 max-w-4xl overflow-hidden">
                  <h1 className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    Clear websites are built on a few hard rules.
                  </h1>
                </div>
                <p className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We keep the work focused on clarity, speed, and proof so service businesses can earn attention and action without noise.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="approach-principles-title" className="pt-24 md:pt-28">
            <div className="max-w-6xl">
              <h2 id="approach-principles-title" className="sr-only">
                Three principles
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                {approachPrinciples.map((principle) => (
                  <article
                    key={principle.number}
                    className="machined-card h-full rounded-2xl border border-white/10 bg-[var(--axiom-elevated)] p-6 md:p-7"
                  >
                    <p className={eyebrowClass}>{principle.number}</p>
                    <h3 className="mt-3 text-[1.05rem] font-semibold tracking-tight text-[#F2F4F7]">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{principle.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-24 md:pt-28">
            <article className="machined-card overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className={eyebrowClass}>Next Step</p>
                  <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    If the site still needs explanation, the work is not done.
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/works" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    See the work
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white sm:w-auto"
                  >
                    Start a conversation
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

export default Approach;
