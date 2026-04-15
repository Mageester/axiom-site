import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';
import { RevealBlock } from '../components/ui/RevealBlock';

const About: React.FC = () => {
  return (
    <>
      <SEO
        {...SEO_ROUTES.about}
        description="Axiom builds clear websites that explain the offer, surface proof, and make the next step obvious."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-16 md:px-10 md:pb-20">
          <RevealBlock as="section" data-hero-root className="pt-10 md:pt-16">
            <article className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.02] p-6 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-8 lg:p-10">
              <div className="max-w-4xl">
                <p className="section-eyebrow">About</p>
                <h1
                  data-startup-heading
                  className="mt-3 text-[clamp(2.35rem,5.8vw,4.35rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]"
                >
                  We build sites that earn attention before anyone explains them.
                </h1>
                <p data-startup-copy className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  You don’t need more pages, better fonts, or a redesign for the sake of it. You need a site where someone lands, immediately gets what you do, and knows exactly how to reach you. That’s the only problem we solve — and we solve it completely.
                </p>
                <div data-startup-actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to="/start-a-project" className="btn-primary btn-lg w-full whitespace-nowrap sm:w-auto">
                    Start a project
                  </Link>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-10 md:pt-16" variant="feature">
            <article className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.02]">
              <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
                <div className="p-6 md:p-8 lg:p-10">
                  <p className="section-eyebrow">What the work does</p>
                  <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  The work is done when the site doesn’t need explaining.
                  </h2>
                  <p className="mt-4 max-w-2xl text-[15px] md:text-sm leading-relaxed text-slate-300 md:text-base">
                    Most sites do not need more pages or more effects. They need the offer to read clearly, proof to appear early, and the next step to stay obvious.
                  </p>

                  <div className="mt-8">
                    <Link
                      to={CTA.work.to}
                      className="inline-flex items-center text-[15px] md:text-sm font-semibold tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                    >
                      See the work →
                    </Link>
                  </div>
                </div>

                <div className="border-t border-white/10 p-4 md:p-6 lg:border-l lg:border-t-0 lg:p-6">
                  <div className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(16,21,31,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-2">
                    <div className="divide-y divide-white/10">
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[15px] md:text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">01</div>
                        <div>
                          <p className="text-[15px] md:text-sm font-semibold text-[#F2F4F7]">What you do, who you serve, and why you’re the right call — readable before they scroll.</p>
                          <p className="mt-2 text-[15px] md:text-sm leading-6 text-slate-300">Not five clicks in. Not buried. Front and center, the moment someone lands.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[15px] md:text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">02</div>
                        <div>
                          <p className="text-[15px] md:text-sm font-semibold text-[#F2F4F7]">Your reviews, past work, and results are front and center.</p>
                          <p className="mt-2 text-[15px] md:text-sm leading-6 text-slate-300">Doubt doesn’t get a chance.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[15px] md:text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">03</div>
                        <div>
                          <p className="text-[15px] md:text-sm font-semibold text-[#F2F4F7]">One path forward.</p>
                          <p className="mt-2 text-[15px] md:text-sm leading-6 text-slate-300">Call, book, or request a quote — no hunting, no dead ends.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-10 md:pt-16" variant="feature">
            <article className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.02] p-6 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-8 lg:p-10">
              <div className="max-w-4xl">
                <p className="section-eyebrow">THE TEAM</p>
                <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  Built by two people who are serious about this.
                </h2>
              </div>

              <div className="mt-8 rounded-[var(--radius-card)] border border-white/5 bg-white/[0.01] p-3 md:mt-10 lg:p-4">
                <div className="flex flex-col md:flex-row flex-wrap gap-4">
                  <article className="flex min-w-[16rem] flex-1 items-start gap-4 rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-5 md:min-w-[18rem] md:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    <img
                      src="/photos/aidan-headshot.jpg"
                      alt="Aidan headshot"
                      className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-semibold tracking-tight text-[#F2F4F7]">Aidan</h3>
                      <p className="text-sm md:text-[15px] leading-relaxed text-slate-300">
                        Co-founder — strategy, systems, client work
                      </p>
                      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-slate-400">
                        Aidan keeps the project anchored to the business goal, the offer, and the next step a customer should take.
                        He handles the strategy, scope, and client communication so the work stays clear from first call to launch.
                      </p>
                    </div>
                  </article>

                  <article className="flex min-w-[16rem] flex-1 items-start gap-4 rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] p-5 md:min-w-[18rem] md:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    <img
                      src="/photos/riley-headshot.jpg"
                      alt="Riley headshot"
                      className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-semibold tracking-tight text-[#F2F4F7]">Riley</h3>
                      <p className="text-sm md:text-[15px] leading-relaxed text-slate-300">
                        Co-founder — design, build, technical delivery
                      </p>
                      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-slate-400">
                        Riley translates the strategy into the actual site, from visual direction through implementation.
                        He handles design, build quality, and technical delivery so the final result stays fast, stable, and clean.
                      </p>
                    </div>
                  </article>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-[15px] md:text-sm leading-relaxed text-slate-300 md:text-base">
                We’re based in Kitchener-Waterloo. We don’t use templates, we don’t outsource, and we don’t take on projects we can’t do well. Every site is built by us.
              </p>
            </article>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default About;
