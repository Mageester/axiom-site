import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ResponsiveImage from '../components/ResponsiveImage';
import WorkPreviewGrid from '../components/WorkPreviewGrid';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { CTA } from '../lib/cta';
import { HOME_JSON_LD, SEO_ROUTES } from '../lib/seo';
import { responsiveImages } from '../lib/responsiveImages';

const homepageBenefitCallouts = [
  'Your offer is the first thing visitors see — not buried three scrolls down',
  'Real proof (reviews, photos, past work) builds trust before they pick up the phone',
  'One clear path to call, email, or request a quote - no hunting required',
] as const;

const processStages = [
  {
    number: '01',
    title: 'Review',
    detail: 'We review the current site, the friction points, and what is costing you trust. Usually takes 24-48 hours.',
  },
  {
    number: '02',
    title: 'Plan',
    detail: 'You get a one-page scope doc before we touch anything, so the pages, proof, and next steps are clear up front.',
  },
  {
    number: '03',
    title: 'Build',
    detail: 'We write, design, test, and launch the site. That includes copywriting, mobile testing, and speed optimization.',
  },
  {
    number: '04',
    title: 'Support',
    detail: 'We stay available after launch for updates, fixes, and follow-up questions.',
  },
] as const;

const Home: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.home} schema={HOME_JSON_LD} />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="relative pt-10 md:pt-20">
            <div className="max-w-6xl">
              <div>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                    The site should do the work before they call.
                  </h1>
                </div>
                <p data-startup-copy className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We build websites for businesses that need to be taken seriously — clear offer, visible proof, one path forward.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link to={CTA.work.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    See our work
                  </Link>
                  <Link
                    to={CTA.primary.to}
                    className="btn-secondary btn-lg w-full whitespace-nowrap sm:w-auto"
                  >
                    Start a project
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 xl:block" aria-hidden="true">
              <div className="relative w-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_54px_rgba(0,0,0,0.3)] bg-white/[0.02]">
                <ResponsiveImage
                  source={responsiveImages.workLandscaping}
                  sizes="(min-width: 1280px) 520px, 100vw"
                  alt="Premium service website design"
                  className="aspect-[4/3] w-full object-cover"
                  style={{ objectPosition: 'center 45%' }}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 font-axiomMono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                    System Output
                  </span>
                </div>
              </div>
            </div>
          </section>

          <WorkPreviewGrid />

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                <div className="max-w-2xl">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Why it matters</p>
                  <h2 className="mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                    Most sites lose the client in the first ten seconds.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                    We fix all three before we touch the design.
                  </p>
                  <div className="mt-8">
                    <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                      {CTA.primary.label}
                    </Link>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <div className="divide-y divide-white/[0.08]">
                    {[
                      "The offer isn't clear. Visitors can't tell what the business does or who it's for.",
                      "There's no proof. Reviews, photos, and past work are buried three pages deep.",
                      'The next step is missing. No clear way to call, book, or request a quote.',
                    ].map((callout, index) => (
                      <div key={callout} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-5">
                        <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">
                          0{index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-200 md:text-[15px]">{callout}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-start lg:gap-14">
              <div className="max-w-2xl lg:pt-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.26em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.45rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  How the work runs.
                </h2>
                <p className="mt-4 max-w-[36ch] text-sm leading-7 text-slate-300 md:text-base">
                  The process stays simple so you know what is happening, what comes next, and what you are getting.
                </p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {processStages.map((stage, index) => (
                  <RevealBlock
                    as="div"
                    key={stage.title}
                    delay={index * 0.05}
                    variant="card"
                    className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:py-6"
                  >
                    <div className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">
                      {stage.number}
                    </div>
                    <div>
                      <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[#F2F4F7] md:text-[1.08rem]">
                        {stage.title}
                      </h3>
                      <p className="mt-2 max-w-[38ch] text-sm leading-6 text-slate-300 md:text-[0.95rem]">
                        {stage.detail}
                      </p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="intake" className="pt-16 md:pt-24" variant="feature">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div className="max-w-3xl">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    If the site isn&apos;t earning trust, it&apos;s costing you work.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                    We&apos;ll review your current site, show what&apos;s costing you trust, and tell you exactly what to fix.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                      Start a project →
                    </Link>
                  </div>
                </div>

                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What happens next</p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[#F2F4F7]">Review → Scope → Build → Launch</p>
                  </div>
                </aside>
              </div>
            </article>
          </RevealBlock>

        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
