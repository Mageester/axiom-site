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

const WEBSITE_PROBLEMS: readonly InfoCard[] = [
  {
    title: 'Slow Template Builds',
    body: 'Generic template sites often load slowly and lose attention before visitors reach the offer.',
  },
  {
    title: 'Outdated First Impression',
    body: 'Dated layouts and visual clutter can make a strong business look less credible online.',
  },
  {
    title: 'Limited Customization',
    body: 'Low-cost setups often lock businesses into layouts that do not match how they sell.',
  },
  {
    title: 'Weak User Flow',
    body: 'If pages and contact actions are unclear, visitors leave without taking the next step.',
  },
];

const DIFFERENTIATORS: readonly InfoCard[] = [
  {
    title: 'Performance Engineering',
    body: 'Speed is engineered in from day one, not added later.',
  },
  {
    title: 'Cloudflare Edge Delivery',
    body: 'Sites run through Cloudflare edge infrastructure for dependable routing and uptime.',
  },
  {
    title: 'Faster Load Times',
    body: 'Lean frontend code gets visitors to content and contact actions faster.',
  },
  {
    title: 'Reliability First',
    body: 'We ship with clean deployment standards and post-launch checks for forms and routing.',
  },
  {
    title: 'Scalable Foundation',
    body: 'Your site can grow with new pages and services without a rebuild.',
  },
];

const STANDARDS: readonly InfoCard[] = [
  {
    title: 'Extremely Fast Load Times',
    body: 'Pages should load quickly on real devices, not just in demos.',
  },
  {
    title: 'Ease Of Use',
    body: 'Navigation and page flow stay simple so visitors find what they need fast.',
  },
  {
    title: 'Hyper-Custom Design',
    body: 'Every build is custom to the business, never forced into a template.',
  },
];

const VALUES: readonly string[] = [
  'Pride in the work',
  'Long-term local business relationships',
  'Helping businesses grow',
  'Honesty in every recommendation',
  'Reliable delivery and support',
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
        title="About | Axiom Infrastructure"
        description="Axiom builds high-performance custom websites for local businesses. Meet Riley Hinsperger and Aidan Magee and see how we work."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-18" variant="feature">
            <div className="max-w-5xl">
              <article className="p-7 md:p-10">
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.15rem,5.8vw,4.3rem)] font-extrabold leading-[1.06] text-[#F2F4F7]">
                    About Axiom
                  </h1>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Axiom started after seeing local businesses stuck with slow, outdated websites. We build modern websites with an engineering-first delivery standard.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#why-axiom-exists" onClick={handleLearnMoreClick} className="btn-primary btn-lg whitespace-nowrap">
                    Learn more
                  </a>
                  <Link
                    to="/method"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    View Method
                  </Link>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="why-axiom-exists" className="scroll-mt-28 pt-16 md:pt-22">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Why Axiom Exists</h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-300 md:text-base">
                Too many local businesses have excellent service but websites that are slow, dated, or hard to use.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                Most owners do not have time to build their own site, so they settle for cheap templates. We remove that compromise with custom, high-performance websites.
              </p>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">The Problem With Most Websites</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {WEBSITE_PROBLEMS.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">The Axiom Guarantee</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {DIFFERENTIATORS.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                  <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Founders</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Riley Hinsperger and Aidan Magee are equal partners. Both build the websites and stand behind delivery quality.
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
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Our Standards</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {STANDARDS.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-6 md:p-7">
                  <h3 className="text-xl font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">How We Work</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {VALUES.map((value) => (
                <article key={value} className="axiom-bento card-snappy p-5 md:p-6">
                  <p className="text-sm font-medium leading-relaxed text-slate-200">{value}</p>
                </article>
              ))}
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
                  <li className="text-sm leading-relaxed text-slate-300">Local service businesses and local-search driven companies</li>
                  <li className="text-sm leading-relaxed text-slate-300">Small to medium business teams that need a serious web presence</li>
                  <li className="text-sm leading-relaxed text-slate-300">Owners who understand the value of a modern, fast website</li>
                </ul>
              </article>

              <article className="axiom-bento card-snappy p-6 md:p-7">
                <h3 className="text-lg font-semibold text-[#F2F4F7]">Not The Right Fit</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  We are not a fit for owners who do not see a modern website as core to credibility and local visibility.
                </p>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If your business is serious, your website should be too.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Book a discovery call and we will define the right scope for your business.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book a Discovery Call
                </Link>
                <Link
                  to="/method"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                >
                  See Infrastructure
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
