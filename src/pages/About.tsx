import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';

type InfoCard = {
  title: string;
  body: string;
};

const OPERATING_STANDARDS: readonly InfoCard[] = [
  {
    title: 'Clarity before build',
    body: 'We define the buyer, the offer, and the next step before design starts.',
  },
  {
    title: 'Execution that holds up',
    body: 'Performance, mobile behavior, and routing are checked before launch.',
  },
  {
    title: 'No mystery handoff',
    body: 'You know what is included, who is involved, and how the project is run.',
  },
];

const FIT_POINTS: readonly string[] = [
  'Businesses that want a site to feel more established',
  'Teams that need a clearer path to inquiry',
  'Owners who want a founder-led build, not a handoff',
];

const About: React.FC = () => {
  const handleLearnMoreClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('why-axiom-exists');
    if (!target) return;
    event.preventDefault();
    const topOffset = 110;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is run by Riley Hinsperger and Aidan Magee. We build custom websites for established businesses that need a more serious web presence."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-18" variant="feature">
            <div className="max-w-5xl">
              <article className="p-7 md:p-10">
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.15rem,5.8vw,4.3rem)] font-extrabold leading-[1.06] text-[#F2F4F7]">
                    Built for businesses that need a more serious web presence.
                  </h1>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom is a founder-led studio for businesses that need a website to feel established, not improvised. We focus on clarity, trust, and execution quality.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#why-axiom-exists" onClick={handleLearnMoreClick} className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white">
                    Learn more
                  </a>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="why-axiom-exists" className="scroll-mt-28 pt-16 md:pt-22">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Why Axiom Exists</h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-300 md:text-base">
                Too many strong local businesses are still represented by sites that look interchangeable, load slowly, or make the next step feel uncertain.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                We built Axiom for owners who want a site that looks established, behaves reliably, and supports a cleaner inquiry flow.
              </p>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Operating principles</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {OPERATING_STANDARDS.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Founders</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Riley Hinsperger and Aidan Magee are equal partners. We stay close to every build and treat delivery quality as part of the product.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="axiom-bento card-snappy p-6 md:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-axiomMono text-xs uppercase tracking-[0.14em] text-slate-200">
                    RH
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#F2F4F7]">Riley Hinsperger</h3>
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#A7B3BC]">Co-Founder | Equal Partner</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Riley leads architecture, frontend delivery, and performance standards on every build.
                </p>
                <div className="mt-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
                  <a
                    href="mailto:riley@getaxiom.ca"
                    className="mt-2 inline-flex text-sm text-[#F2F4F7] underline decoration-white/35 underline-offset-3 transition-colors hover:text-white"
                  >
                    riley@getaxiom.ca
                  </a>
                </div>
              </article>

              <article className="axiom-bento card-snappy p-6 md:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-axiomMono text-xs uppercase tracking-[0.14em] text-slate-200">
                    AM
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#F2F4F7]">Aidan Magee</h3>
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#A7B3BC]">Co-Founder | Equal Partner</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Aidan leads structure, user flow, and implementation quality on every build.
                </p>
                <div className="mt-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#A7B3BC]">Contact</p>
                  <a
                    href="mailto:aidan@getaxiom.ca"
                    className="mt-2 inline-flex text-sm text-[#F2F4F7] underline decoration-white/35 underline-offset-3 transition-colors hover:text-white"
                  >
                    aidan@getaxiom.ca
                  </a>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Who We&apos;re Built For</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="axiom-bento card-snappy p-6 md:p-7">
                <h3 className="text-lg font-semibold text-[#F2F4F7]">Best Fit Clients</h3>
                <ul className="mt-4 space-y-3">
                  {FIT_POINTS.map((point) => (
                    <li key={point} className="text-sm leading-relaxed text-slate-300">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="axiom-bento card-snappy p-6 md:p-7">
                <h3 className="text-lg font-semibold text-[#F2F4F7]">Not The Right Fit</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  We are not a fit for owners who want the cheapest option or do not see the website as core to credibility and lead quality.
                </p>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If your business needs a more serious web presence, start with a consultation.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We will define the scope that fits before any work starts.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                                Book Free Consultation
                </Link>
                <Link
                  to="/method"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                >
                  View Method
                </Link>
              </div>
            </div>
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default About;
