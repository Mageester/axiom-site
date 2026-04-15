import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import SocialProof from '../components/site/SocialProof';
import WorkPreviewGrid from '../components/WorkPreviewGrid';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { CTA } from '../lib/cta';
import { HOME_JSON_LD, SEO_ROUTES } from '../lib/seo';

const FREE_SITE_REVIEW_PATH = `${CTA.primary.to}?type=review`;

const homepageBenefitCallouts = [
  'Your offer is the first thing visitors see — not buried three scrolls down',
  'Real proof (reviews, photos, past work) builds trust before they pick up the phone',
  'One clear path to call, email, or request a quote - no hunting required',
] as const;

type LighthouseCard = {
  title: string;
  score: string;
  screenshot: string;
  screenshotAlt: string;
  description: string;
  accentClass: string;
  scoreClass: string;
};

const lighthouseCards: readonly LighthouseCard[] = [
  {
    title: 'Typical local business site: 35/100',
    score: '35/100',
    screenshot: '/images/lighthouse-before.png',
    screenshotAlt: 'Lighthouse performance report for a typical local business site',
    description: 'Slow, unclear, and full of unnecessary friction before a visitor can even decide to call.',
    accentClass: 'border-l-4 border-[#f29e5d]/70',
    scoreClass: 'text-[#f29e5d]',
  },
  {
    title: 'Axiom build: 98/100',
    score: '98/100',
    screenshot: '/images/lighthouse-after.png',
    screenshotAlt: 'Lighthouse performance report for an Axiom build',
    description: 'Lean structure, fast load, and a clear next step without the usual performance drag.',
    accentClass: 'border-l-4 border-[#d4a48e]/70',
    scoreClass: 'text-[#7ce0b1]',
  },
] as const;

const Home: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.home} schema={HOME_JSON_LD} />

      <Layout>
        <main id="main-content" tabIndex={-1} className="axiom-container w-full pb-24 md:pb-32">
          <section data-hero-root className="relative isolate bg-[#0a0c10] pt-16 md:pt-24">
            <div className="max-w-5xl">
              <div className="max-w-4xl overflow-hidden">
                <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                  Ontario service businesses lose calls to slow, unclear websites.
                </h1>
              </div>
              <p data-startup-copy className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                Most business sites are slow, unclear, and built by someone who doesn’t understand what makes people call. We fix that — fast build, full ownership, zero recurring fees.
              </p>
              <div
                className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 section-eyebrow"
                aria-label="Axiom performance highlights"
              >
                <span>12+ builds shipped</span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span>Sub-1s load times</span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span>Reply in 24hrs</span>
              </div>
              <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  Start a project
                </Link>
                <Link
                  to={FREE_SITE_REVIEW_PATH}
                  className="btn-secondary btn-lg w-full whitespace-nowrap sm:w-auto"
                >
                  Get a free site review
                </Link>
                <Link
                  to={CTA.work.to}
                  className="btn-secondary btn-lg w-full whitespace-nowrap sm:w-auto"
                >
                  See our work
                </Link>
              </div>
            </div>
          </section>

          <WorkPreviewGrid />

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature" aria-labelledby="pagespeed-heading">
            <div className="max-w-4xl">
              <p className="section-eyebrow">Performance proof</p>
              <h2 id="pagespeed-heading" className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Before and after PageSpeed
              </h2>
              <p className="mt-4 max-w-3xl text-sm md:text-[15px] leading-relaxed text-slate-300">
                Lighthouse screenshots from a typical local-business experience versus the Axiom rebuild.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {lighthouseCards.map((card) => (
                <article
                  key={card.title}
                  className={`machined-card overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22)] ${card.accentClass}`}
                >
                  <div className="border-b border-white/10 bg-[#07090c] p-3 md:p-4">
                    <div className="overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] border border-white/10 bg-black/20">
                      <img
                        src={card.screenshot}
                        alt={card.screenshotAlt}
                        width={1200}
                        height={840}
                        className="h-auto w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="section-eyebrow">Lighthouse</p>
                        <h3 className="mt-2 text-[1.35rem] font-bold tracking-tight text-[#F2F4F7]">
                          {card.title}
                        </h3>
                      </div>
                      <span className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-semibold ${card.scoreClass}`}>
                        {card.score}
                      </span>
                    </div>
                    <p className="mt-4 text-[15px] md:text-sm leading-relaxed text-slate-300">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature" aria-labelledby="speed-guarantee-heading">
            <article className="w-full overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
              <div className="border-l-4 border-[#B05D41] px-5 py-8 md:px-7 md:py-10">
                <div className="max-w-4xl">
                  <p className="section-eyebrow">Speed guarantee</p>
                  <h2 id="speed-guarantee-heading" className="mt-3 text-[clamp(1.75rem,3vw,2.65rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                    If your site loads in over one second, we fix it free.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm md:text-[15px] leading-relaxed text-slate-400">
                    No asterisks. That is the standard we build to.
                  </p>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature" aria-labelledby="social-proof-heading">
            <SocialProof headingId="social-proof-heading" />
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature">
            <article className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.02] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="max-w-2xl">
                <p className="section-eyebrow">Why it matters</p>
                <h2 className="mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  A slow site signals an unprofessional business.
                </h2>
                <p className="mt-4 max-w-xl text-sm md:text-[15px] leading-relaxed text-slate-300">
                  A confusing site sends the job to your competitor. A site with no clear next step leaves money on the table. We audit all three before anything gets built.
                </p>
                <div className="mt-8">
                  <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    {CTA.primary.label}
                  </Link>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" id="intake" className="pt-16 md:pt-24" variant="feature">
            <article className="cta-banner">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div className="max-w-3xl">
                  <p className="section-eyebrow">Next step</p>
                  <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If the site isn’t earning trust, it’s costing you work.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm md:text-[15px] leading-relaxed text-slate-300">
                We’ll review your current site, show what’s costing you trust, and tell you exactly what to fix.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                      Start a project →
                    </Link>
                  </div>
                </div>

                <aside className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-eyebrow">What happens next</p>
                  <div className="mt-4">
                    <p className="text-sm md:text-[15px] font-medium text-[#F2F4F7]">Review → Scope → Build → Launch</p>
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
