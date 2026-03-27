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

const WHY_AXIOM: readonly InfoCard[] = [
  {
    title: 'Slow template builds',
    body: 'Generic sites can look acceptable at a glance and still lose attention before the real offer has a chance to land.',
  },
  {
    title: 'Weak first impression',
    body: 'Many good local businesses are undercut by pages that feel generic, crowded, or too light on proof.',
  },
  {
    title: 'No clear next step',
    body: 'If the page does not make the next action obvious, visitors often leave without ever becoming an inquiry.',
  },
  {
    title: 'Too much production noise',
    body: 'Heavy motion and decorative layers can make a site feel impressive while making it harder to read quickly.',
  },
];

const HOW_WE_WORK: readonly InfoCard[] = [
  {
    title: 'Proof before polish',
    body: 'We decide what has to convince the buyer first, then use layout and visual treatment to support that story.',
  },
  {
    title: 'Fewer moving parts',
    body: 'The site should feel intentional, not crowded. We keep the path simple so the right action is easy to see.',
  },
  {
    title: 'Built for mobile scanning',
    body: 'The first pass on a phone matters as much as the desktop version, so the structure has to work there too.',
  },
];

const VALUES: readonly string[] = [
  'We care about the first impression',
  'We keep the path to action simple',
  'We make mobile the default test',
  'We prefer clarity over spectacle',
  'We only promise what we can deliver well',
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
        description="Axiom builds high-performance custom websites for local businesses. Meet the founders and see the operating standard behind the work."
        canonicalPath="/about"
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-12 md:pt-18" variant="feature">
            <div className="max-w-5xl">
              <article className="rounded-[28px] border border-white/10 bg-[#0d1323]/70 p-7 md:p-10">
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.15rem,5.8vw,4.3rem)] font-extrabold leading-[1.06] text-[#F2F4F7]">
                    About Axiom
                  </h1>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Axiom is a small studio built for businesses that need their website to do more than look polished. We care about the judgment behind the page, the quality of the handoff, and whether the right visitor can understand the offer quickly.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
                  That means fewer assumptions, fewer distractions, and more attention on the parts that actually change how the site feels to a buyer.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#why-axiom-exists" onClick={handleLearnMoreClick} className="btn-primary btn-lg whitespace-nowrap">
                    Learn more
                  </a>
                  <Link
                    to="/work"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                  >
                    View Work
                  </Link>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="why-axiom-exists" className="scroll-mt-28 pt-16 md:pt-22">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Why Axiom exists</h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-300 md:text-base">
                Too many strong businesses are held back by sites that feel dated, overly generic, or hard to act on. We started Axiom to make the website feel like a better version of the business itself.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                The goal is not just a prettier homepage. The goal is a page structure that makes trust easier to earn, makes the next step easier to understand, and holds up on the phone where most visitors actually arrive.
              </p>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Operating standard</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">How we think about a good build.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {HOW_WE_WORK.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22">
            <div className="mb-7">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What we value</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">The principles that show up in the finished site.</h2>
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
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Founders</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Riley Hinsperger and Aidan Magee are equal partners. Both contribute to the work, and both stand behind the delivery quality.
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
                  Riley leads architecture, frontend delivery, and the performance standard behind each build.
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
                  Aidan leads structure, user flow, and the implementation quality that keeps the site easy to use.
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
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Who we work best with</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="axiom-bento card-snappy p-6 md:p-7">
                <h3 className="text-lg font-semibold text-[#F2F4F7]">Best fit clients</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-sm leading-relaxed text-slate-300">Local service businesses and local-search driven companies</li>
                  <li className="text-sm leading-relaxed text-slate-300">Small to medium business teams that need a serious web presence</li>
                  <li className="text-sm leading-relaxed text-slate-300">Owners who care about the first impression and the follow-through</li>
                </ul>
              </article>

              <article className="axiom-bento card-snappy p-6 md:p-7">
                <h3 className="text-lg font-semibold text-[#F2F4F7]">Not the right fit</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  We are not a fit for owners who want the fastest possible shortcut and do not see the website as core to credibility and local visibility.
                </p>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If the website is part of the sales conversation, it deserves a stronger standard.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Start an application and we will define the right scope for your business.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/apply#project-application-form" className="btn-primary btn-lg whitespace-nowrap">
                  Start Application
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                >
                  View Work
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
