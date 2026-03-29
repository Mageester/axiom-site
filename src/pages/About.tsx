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
    title: 'Slow builds',
    body: 'Template sites are often slow and lose attention before people reach the offer.',
  },
  {
    title: 'Old first impression',
    body: 'Old layouts and clutter can make a strong business look less credible.',
  },
  {
    title: 'Hard to customize',
    body: 'Cheap setups often do not match how a business sells.',
  },
  {
    title: 'Unclear next step',
    body: 'If the next step is hard to find, people leave.',
  },
];

const DIFFERENTIATORS: readonly InfoCard[] = [
  {
    title: 'Fast pages',
    body: 'Speed is built in from day one.',
  },
  {
    title: 'Reliable hosting',
    body: 'Sites run through Cloudflare for speed and uptime.',
  },
  {
    title: 'Simple code',
    body: 'Lean code gets people to the content faster.',
  },
  {
    title: 'Works after launch',
    body: 'We check forms and links before and after launch.',
  },
  {
    title: 'Built to grow',
    body: 'The site can grow with new pages and services.',
  },
];

const STANDARDS: readonly InfoCard[] = [
  {
    title: 'Fast pages',
    body: 'Pages should load quickly on real devices.',
  },
  {
    title: 'Easy to use',
    body: 'Navigation and page flow stay simple.',
  },
  {
    title: 'Custom design',
    body: 'Every build is made for the business, not forced into a template.',
  },
];

const VALUES: readonly string[] = [
  'Do the work well',
  'Build long-term relationships',
  'Help businesses grow',
  'Give honest advice',
  'Deliver and support well',
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
        description="Axiom is a founder-led website partner for local businesses that want a better site and a clear process."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-8 md:pt-12" variant="feature">
            <div className="max-w-5xl">
              <article className="p-7 md:p-10">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About Axiom</p>
                <div className="max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.15rem,5.8vw,4.3rem)] font-extrabold leading-[1.06] text-[#F2F4F7]">
                    Built by two founders who do the work.
                  </h1>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  Axiom is for local businesses that want a website partner who keeps things clear and gets the work done.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#why-axiom-exists" onClick={handleLearnMoreClick} className="btn-primary btn-lg whitespace-nowrap">
                    See how we work
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

          <RevealBlock as="section" id="why-axiom-exists" className="scroll-mt-28 pt-12 md:pt-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Why Axiom exists</h2>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                We want websites that look good, load fast, and make it easy for the right people to get in touch.
              </p>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Why many sites fall short</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {WEBSITE_PROBLEMS.map((item) => (
                    <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                      <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">What every build needs</h2>
                </div>
                <div className="grid gap-4">
                  {DIFFERENTIATORS.map((item) => (
                    <article key={item.title} className="axiom-bento card-snappy p-5 md:p-6">
                      <h3 className="text-base font-semibold text-[#F2F4F7]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Founders</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Riley Hinsperger and Aidan Magee are equal partners. They both build the work.
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
                      Riley leads design, frontend work, and performance on every build.
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
                      Aidan leads structure, user flow, and build quality on every build.
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
              </article>

              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">What every build includes</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                  {STANDARDS.map((item) => (
                    <article key={item.title} className="axiom-bento card-snappy p-6 md:p-7">
                      <h3 className="text-xl font-semibold text-[#F2F4F7]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">What matters to us</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {VALUES.map((value) => (
                    <article key={value} className="axiom-bento card-snappy p-5 md:p-6">
                      <p className="text-sm font-medium leading-relaxed text-slate-200">{value}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="space-y-7">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Who it&apos;s for</h2>
                </div>
                <div className="grid gap-4">
                  <article className="axiom-bento card-snappy p-6 md:p-7">
                    <h3 className="text-lg font-semibold text-[#F2F4F7]">Best fit</h3>
                    <ul className="mt-4 space-y-3">
                      <li className="text-sm leading-relaxed text-slate-300">Local service businesses and local-search driven companies</li>
                      <li className="text-sm leading-relaxed text-slate-300">Small to medium business teams that need a serious web presence</li>
                      <li className="text-sm leading-relaxed text-slate-300">Owners who understand the value of a modern, fast website</li>
                    </ul>
                  </article>

                  <article className="axiom-bento card-snappy p-6 md:p-7">
                    <h3 className="text-lg font-semibold text-[#F2F4F7]">Not a fit</h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      We are not a fit for owners who do not see a modern website as important.
                    </p>
                  </article>
                </div>
              </article>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16" variant="feature">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If your business needs a better site, let&apos;s talk.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Book a consultation and we will confirm fit before we define the work.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start the conversation
                </Link>
                <Link
                  to="/method"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
                >
                  See Method
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
