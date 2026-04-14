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
            <article className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.02] p-6 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-8 lg:p-10">
              <div className="max-w-4xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
                <h1
                  data-startup-heading
                  className="mt-3 text-[clamp(2.35rem,5.8vw,4.35rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]"
                >
                  We build sites that earn attention before anyone explains them.
                </h1>
                <p data-startup-copy className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Most business owners don&apos;t need a fancier website. They need one that actually works — where someone lands, immediately understands what you do, and knows exactly how to reach you. That&apos;s it. That&apos;s all we build.
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
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
              <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
                <div className="p-6 md:p-8 lg:p-10">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What the work does</p>
                  <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    The work is done when the site doesn&apos;t need explaining.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Most sites do not need more pages or more effects. They need the offer to read clearly, proof to appear early, and the next step to stay obvious.
                  </p>

                  <div className="mt-8">
                    <Link
                      to={CTA.work.to}
                      className="inline-flex items-center text-sm font-semibold tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                    >
                      See the work &rarr;
                    </Link>
                  </div>
                </div>

                <div className="border-t border-white/10 p-4 md:p-6 lg:border-l lg:border-t-0 lg:p-6">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
                    <div className="divide-y divide-white/10">
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">01</div>
                        <div>
                          <p className="text-sm font-semibold text-[#F2F4F7]">What you do — obvious in seconds.</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">Not five clicks in. Not buried. Front and center, the moment someone lands.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">02</div>
                        <div>
                          <p className="text-sm font-semibold text-[#F2F4F7]">Why you — proven before they scroll.</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">Reviews, past work, and results show up early. Doubt doesn&apos;t get a chance to settle.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 px-5 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-5 md:px-6 md:py-6">
                        <div className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC] md:pt-1">03</div>
                        <div>
                          <p className="text-sm font-semibold text-[#F2F4F7]">One clear action.</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">Call, book, or request a quote. One path. No hunting, no confusion.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default About;

