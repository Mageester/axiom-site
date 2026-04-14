import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import WorkPreviewGrid from '../components/WorkPreviewGrid';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';
import { CTA } from '../lib/cta';
import { HOME_JSON_LD, SEO_ROUTES } from '../lib/seo';

const homepageBenefitCallouts = [
  'Your offer is the first thing visitors see — not buried three scrolls down',
  'Real proof (reviews, photos, past work) builds trust before they pick up the phone',
  'One clear path to call, email, or request a quote - no hunting required',
] as const;

const Home: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.home} schema={HOME_JSON_LD} />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="relative isolate bg-[#0a0c10] pt-10 md:pt-20">
            <div className="max-w-5xl">
              <div className="max-w-4xl overflow-hidden">
                <h1 data-startup-heading className="text-[clamp(2.45rem,5.8vw,5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                  Your website is losing you jobs.
                </h1>
              </div>
              <p data-startup-copy className="mt-6 max-w-[48rem] text-base leading-relaxed text-slate-200/90 md:text-lg">
                Most business sites are slow, unclear, and built by someone who doesn’t understand what makes people call. We fix that — fast build, full ownership, zero recurring fees.
              </p>
              <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link to={CTA.primary.to} className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                  Start a project
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

          <RevealBlock as="section" className="pt-16 md:pt-20" variant="feature">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
              <div className="max-w-2xl">
                <p className="section-eyebrow">Why it matters</p>
                <h2 className="mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                  A slow site signals an unprofessional business.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] md:text-sm leading-7 text-slate-300 md:text-base">
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
                  <p className="mt-4 max-w-3xl text-[15px] md:text-sm leading-relaxed text-slate-300 md:text-base">
                We’ll review your current site, show what’s costing you trust, and tell you exactly what to fix.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link to={CTA.primary.to} className="btn-primary btn-lg whitespace-nowrap">
                      Start a project →
                    </Link>
                  </div>
                </div>

                <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-eyebrow">What happens next</p>
                  <div className="mt-4">
                    <p className="text-[15px] md:text-sm font-medium text-[#F2F4F7]">Review → Scope → Build → Launch</p>
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
