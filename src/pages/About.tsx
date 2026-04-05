import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';

type DetailCard = {
  title: string;
  body: string;
};

type ProfileRow = {
  label: string;
  value: string;
};

type ListGroup = {
  title: string;
  intro: string;
  items: readonly string[];
};

const PROFILE_ROWS: readonly ProfileRow[] = [
  {
    label: 'Focus',
    value: 'High-trust websites for established businesses',
  },
  {
    label: 'Scope',
    value: 'Positioning, structure, design, development, and launch',
  },
  {
    label: 'Best for',
    value: 'Businesses with real substance and uneven online presentation',
  },
  {
    label: 'Style',
    value: 'Restrained, technical, commercially sharp',
  },
];

const CAPABILITIES: readonly DetailCard[] = [
  {
    title: 'Positioning and structure',
    body: 'Page hierarchy, messaging sequence, and navigation are designed to help a visitor understand the business quickly.',
  },
  {
    title: 'Content direction',
    body: 'Copy is shaped around what needs to be understood, trusted, and acted on rather than filled with generic marketing language.',
  },
  {
    title: 'Design and interface',
    body: 'Visual systems are built to feel composed, specific, and credible across desktop and mobile.',
  },
  {
    title: 'Development and launch',
    body: 'Implementation, responsive behavior, interaction polish, and launch readiness are treated as part of the standard, not an afterthought.',
  },
];

const PRINCIPLES: readonly DetailCard[] = [
  {
    title: 'Clarity over theatrics',
    body: 'A strong website should be easy to understand. The goal is precision, not noise.',
  },
  {
    title: 'Trust is cumulative',
    body: 'Typography, spacing, copy, responsive behavior, and small interface details all contribute to whether a business feels credible.',
  },
  {
    title: 'Selective by design',
    body: 'Axiom favors deliberate work, tighter standards, and a smaller number of engagements over high-volume production.',
  },
];

const LIST_GROUPS: readonly ListGroup[] = [
  {
    title: 'Best fit',
    intro: 'Axiom tends to be strongest for:',
    items: [
      'Established service businesses, firms, and operators',
      'Companies that do strong work but are undersold by their current site',
      'Teams that care about reputation, buyer confidence, and a higher standard of presentation',
    ],
  },
  {
    title: 'Working style',
    intro: 'Engagements are typically defined by:',
    items: [
      'Direct communication and clear recommendations',
      'Thoughtful review cycles instead of endless variation',
      'Careful attention to responsive layouts, forms, and launch details',
    ],
  },
  {
    title: 'What the work should accomplish',
    intro: 'The finished site should make the business:',
    items: [
      'Easier to understand',
      'More credible at first impression',
      'More effective at guiding the right visitor toward inquiry or next step',
    ],
  },
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is a web studio focused on positioning, design, and development for established businesses that need a more credible, better-structured online presence."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About | Axiom',
          description:
            'Axiom is a web studio focused on positioning, design, and development for established businesses that need a more credible, better-structured online presence.',
          url: 'https://getaxiom.ca/about',
        }}
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-20">
          <RevealBlock as="section" data-hero-root className="pt-10 md:pt-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-start">
              <div className="max-w-4xl">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
                <h1
                  data-startup-heading
                  className="mt-3 text-[clamp(2.2rem,5.8vw,4.6rem)] font-extrabold leading-[0.96] tracking-tight text-[#F2F4F7]"
                >
                  Axiom is built to help established businesses present themselves online with more clarity, authority, and control.
                </h1>
                <p data-startup-copy className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  The work sits between positioning, design, and development. It is meant for companies that already have real
                  substance and need a site that communicates it properly.
                </p>
                <p data-startup-copy className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                  This page is the fuller overview: what Axiom does, how the work is approached, and what clients should expect
                  from the engagement.
                </p>
              </div>

              <aside
                data-startup-meta
                className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.96)_0%,rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.2)]"
              >
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Profile</p>
                <dl className="mt-4 space-y-4">
                  {PROFILE_ROWS.map((row) => (
                    <div key={row.label} className="border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{row.label}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-slate-200">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16" variant="feature">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.95)_0%,rgba(10,13,19,0.99)_100%)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
                <div className="max-w-md">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Overview</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    Many strong businesses are represented online by sites that undersell them.
                  </h2>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-slate-300 md:text-base">
                  <p>
                    Axiom exists to close that gap. The problem is usually not effort alone. More often it is a lack of structure,
                    restraint, and attention to the details that make a business feel current, trustworthy, and well run.
                  </p>
                  <p>
                    The work is not limited to how a homepage looks. It includes how the business is introduced, how services are
                    framed, how proof is handled, how action is invited, and how the entire experience holds together across every
                    screen.
                  </p>
                  <p>
                    The standard is simple: the site should feel calm, well judged, and commercially useful. Visitors should
                    understand what the business does, why it matters, and what to do next without being pushed through a generic
                    marketing pattern.
                  </p>
                </div>
              </div>
            </article>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Scope</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                What Axiom does
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                The work is shaped around the parts of a site that most strongly influence understanding, trust, and next-step
                action.
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <article
                  key={item.title}
                  className="motion-surface rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.96)_0%,rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                >
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Principles</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                What informs the work
              </h2>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {PRINCIPLES.map((item) => (
                <article
                  key={item.title}
                  className="motion-surface group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,29,0.96)_0%,rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:-translate-y-px hover:border-[#d4a48e]/20 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,164,142,0.08),transparent_44%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Fit</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Where Axiom fits best
              </h2>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {LIST_GROUPS.map((group) => (
                <article
                  key={group.title}
                  className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,29,0.95)_0%,rgba(10,13,20,0.98)_100%)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                >
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{group.intro}</p>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a48e]" aria-hidden />
                        <span className="text-sm leading-relaxed text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock as="section" className="pt-12 md:pt-16" variant="feature">
            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.96)_0%,rgba(10,13,19,0.99)_100%)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:p-8">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-[14%] h-44 w-44 rounded-full bg-[#B05D41]/12 blur-3xl" />
                <div className="absolute -bottom-20 right-[10%] h-52 w-52 rounded-full bg-[#4B6EAF]/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="max-w-2xl">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next step</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                    If the fit looks right, the next step is a conversation.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                    We can review the current site, clarify what it needs to do better, and outline what a stronger version should
                    accomplish.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book Consultation
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
