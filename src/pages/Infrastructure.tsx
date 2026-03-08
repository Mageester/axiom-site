import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const METHOD_STEPS = [
  {
    number: '01',
    title: 'Online Strategy Call',
    summary:
      'Every project begins with a 30-minute Zoom consultation. It is online only and focused on understanding your business model, customer flow, and what your website needs to do.',
    clarifies: 'Pages, menus, booking, contact forms, maps, galleries, quote forms, and other required functionality.',
  },
  {
    number: '02',
    title: 'Scope & Package Recommendation',
    summary:
      'After the call, we convert requirements into a clear scope and recommend the package that best fits your goals, timeline, and operational needs.',
    clarifies: 'What is included now, what can phase later, and the right engagement structure for delivery quality.',
  },
  {
    number: '03',
    title: 'Website Planning & Structure',
    summary:
      'Before production, we map information architecture, navigation, page hierarchy, and lead pathways so every screen has a clear purpose.',
    clarifies: 'Content structure, CTA hierarchy, feature placement, and key user journeys across desktop and mobile.',
  },
  {
    number: '04',
    title: 'Build & Review',
    summary:
      'Axiom handles implementation with performance and maintainability standards, then guides your team through focused review checkpoints.',
    clarifies: 'Visual refinement, interaction behavior, copy placement, and conversion-path QA before launch approval.',
  },
  {
    number: '05',
    title: 'Launch & Infrastructure',
    summary:
      'We release with controlled launch procedures and post-launch verification to ensure reliability and speed from day one.',
    clarifies: 'Domain routing, hosting, analytics wiring, and whether we work in your current stack or run infrastructure directly.',
  },
] as const;

const FLEXIBILITY_OPTIONS = [
  {
    title: 'Current Website + Domain',
    detail:
      'If you already have a website and domain provider, we can integrate with your current setup and migrate only what is needed.',
  },
  {
    title: 'Domain Kept, Site Rebuilt',
    detail:
      'If your domain is established but your website needs replacement, we rebuild the site while preserving domain continuity and trust signals.',
  },
  {
    title: 'Fully Axiom-Managed',
    detail:
      'If you prefer a hands-off approach, we can handle hosting and infrastructure directly with a managed delivery model.',
  },
] as const;

const PREBUILD_CLARITY = [
  'Required pages and navigation structure',
  'Booking, menu, map, and gallery requirements',
  'Lead capture and form workflows',
  'Messaging hierarchy and content structure',
  'Domain, DNS, hosting, and launch path',
  'Near-term needs and future expansion considerations',
] as const;

const Infrastructure: React.FC = () => {
  return (
    <>
      <SEO
        title="Method | Axiom Infrastructure"
        description="Axiom's client method: a clear 30-minute Zoom consultation, structured scope planning, premium build delivery, and controlled launch."
      />
      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-10 md:pt-16">
            <div className="grid gap-6 md:grid-cols-12 md:gap-8">
              <article className="axiom-bento card-snappy p-7 md:col-span-8 md:p-10">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Method</p>
                <div className="mt-4 max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2.2rem,5vw,4.35rem)] font-extrabold leading-[1.06] text-[#F2F4F7]">
                    A clear process for building the right website for your business.
                  </h1>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Every project starts with a structured 30-minute Zoom consultation to define scope, priorities, and next steps before any production work begins.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book a Strategy Call
                  </Link>
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">
                    30-minute Zoom consultation | online only
                  </p>
                </div>
              </article>

              <article className="axiom-bento card-snappy p-7 md:col-span-4 md:p-8">
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Process Signal</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#F2F4F7]">Clarity Before Production</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  We use a structured intake and planning sequence so decisions are aligned before build begins.
                </p>
                <div className="mt-6 rounded-xl border border-white/10 bg-[#0f1524]/55 p-4">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Default Engagement Sequence</p>
                  <ol className="mt-3 space-y-2">
                    <li className="text-sm text-slate-300">01 - Strategy call</li>
                    <li className="text-sm text-slate-300">02 - Scope + package recommendation</li>
                    <li className="text-sm text-slate-300">03 - Planning, build, and launch</li>
                  </ol>
                </div>
              </article>
            </div>
          </section>

          <section className="pt-14 md:pt-20">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Why This Method Exists</p>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-slate-300 md:text-lg">
                Most website projects break down when expectations stay vague. Axiom's method is built to create alignment early, reduce decision friction, and deliver a cleaner build process from first meeting through launch.
              </p>
            </div>
          </section>

          <section className="pt-16 md:pt-22">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Five-Step Process</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Structured, client-facing, and easy to follow.</h2>
              </div>
            </div>

            <ol className="grid gap-4 md:gap-5">
              {METHOD_STEPS.map((step) => (
                <li key={step.number} className="axiom-bento card-snappy p-6 md:p-7">
                  <div className="grid gap-4 md:grid-cols-12 md:items-start">
                    <div className="md:col-span-2">
                      <p className="font-axiomMono text-lg tracking-[0.18em] text-[#d4a48e]">{step.number}</p>
                    </div>
                    <div className="md:col-span-10">
                      <h3 className="text-[clamp(1.2rem,2vw,1.65rem)] font-semibold text-[#F2F4F7]">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{step.summary}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        <span className="font-medium text-[#F2F4F7]">Clarifies:</span> {step.clarifies}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="pt-16 md:pt-22">
            <div className="mb-7">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Setup Flexibility</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Use your current setup or let Axiom run the stack.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {FLEXIBILITY_OPTIONS.map((item) => (
                <article key={item.title} className="axiom-bento card-snappy p-6">
                  <h3 className="text-xl font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-16 md:pt-22">
            <div className="mb-7">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Pre-Build Clarity</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">What we clarify before we build.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PREBUILD_CLARITY.map((item, index) => (
                <article key={item} className="axiom-bento card-snappy p-5">
                  <p className="font-axiomMono text-[10px] uppercase tracking-[0.15em] text-[#d4a48e]">{String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-20 md:pt-26">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Next Step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Book your 30-minute online Zoom consultation.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We will review your goals, confirm required website functionality, and recommend the package that best fits your business.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book a Strategy Call
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Infrastructure;
