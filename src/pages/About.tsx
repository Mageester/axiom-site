import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';

type CompactCard = {
  title: string;
  body: string;
};

const WHO_AXIOM_IS: readonly CompactCard[] = [
  {
    title: 'Founder-led',
    body: 'The person shaping the strategy is the same person building the site. That means clarity and accountability from start to finish.',
  },
  {
    title: 'Built for established businesses',
    body: 'We work with businesses that are already operating and need a website that matches the quality of their actual work.',
  },
  {
    title: 'Focused on results',
    body: 'The goal is simple: make your business easier to trust, easier to understand, and easier to contact.',
  },
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is a founder-led team that builds professional websites for established businesses — designed to look credible, communicate clearly, and bring in more customers."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About | Axiom',
          description:
            'Axiom is a founder-led team that builds professional websites for established businesses — designed to look credible, communicate clearly, and bring in more customers.',
          url: 'https://getaxiom.ca/about',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-18">
          <RevealBlock as="section" data-hero-root className="pt-8 md:pt-12" variant="feature">
            <div className="max-w-4xl">
              <article className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.94)_0%,rgba(10,13,19,0.98)_100%)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:p-7">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About Axiom</p>
                <div className="mt-3 max-w-3xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2rem,5.4vw,4rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]">
                  A founder-led team that builds websites the right way.
                </h1>
              </div>
              <p data-startup-copy className="mt-3 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Axiom is for businesses that want a website that actually works — one that looks professional, communicates clearly, and brings in more customers.
              </p>
                <div data-startup-actions className="mt-5 flex flex-wrap items-center gap-3">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a Free Consultation
                  </Link>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-10 md:pt-14">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Who Axiom is</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Founder-led, quality-focused, and built for businesses that take their reputation seriously.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Axiom exists to make your business look established, communicate clearly, and make it easier for the right customers to reach you.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {WHO_AXIOM_IS.map((item) => (
                <article
                  key={item.title}
                  className="motion-surface group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.96)_0%,rgba(10,14,21,0.98)_100%)] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:-translate-y-px hover:border-[#d4a48e]/20 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] md:p-5"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                  <div className="motion-fade pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,164,142,0.08),transparent_46%)] opacity-0 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-10 md:pt-14" variant="feature">
            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.96)_0%,rgba(10,13,19,0.98)_100%)] p-5 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:p-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-[16%] h-44 w-44 rounded-full bg-[#B05D41]/12 blur-3xl" />
                <div className="absolute -bottom-20 right-[10%] h-52 w-52 rounded-full bg-[#4B6EAF]/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                  If your business is serious, your website should feel that way too.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Book a free consultation and we&apos;ll review your current site, understand your goals, and explain what we&apos;d do.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a Free Consultation
                  </Link>
                  <Link
                    to="/works"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    View Work
                  </Link>
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
