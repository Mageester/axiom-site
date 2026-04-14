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
    title: 'Clarity over everything',
    description:
      'Your offer has to be readable the moment someone lands. Not buried, not vague. If they have to work for it, they&apos;re already gone.',
  },
  {
    number: '02',
    title: "Proof closes deals. Polish doesn't.",
    description:
      'Real results, real reviews, and real work shown early. That&apos;s what converts a visitor into a call.',
  },
  {
    number: '03',
    title: 'Slow sites lose jobs.',
    description:
      'Most people find you on their phone. If your site takes more than two seconds, they&apos;ve already moved on. Every build we ship loads fast &mdash; tested, not assumed.',
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
                    We build to one standard.
                  </h1>
                </div>
                <p className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                  If someone lands on your site and can&apos;t tell what you do, who you serve, and how to contact you in under five seconds &mdash; the site is broken. We don&apos;t ship broken sites.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="approach-principles-title" className="pt-28 md:pt-32">
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

          <section className="pt-28 md:pt-32">
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
                    to="/start-a-project"
                    className="btn-secondary btn-lg w-full whitespace-nowrap sm:w-auto"
                  >
                    Start a project &rarr;
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
