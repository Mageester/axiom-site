import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

type SectionLink = {
  id: string;
  label: string;
  shortLabel?: string;
};

type ProcessStep = {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: readonly string[];
};

type StackOption = {
  id: string;
  label: string;
  title: string;
  summary: string;
  bullets: readonly string[];
};

type ExpandableItem = {
  title: string;
  body: string;
};

const SECTION_LINKS: readonly SectionLink[] = [
  { id: 'process', label: 'Process' },
  { id: 'your-stack', label: 'Your Stack', shortLabel: 'Stack' },
  { id: 'clarify', label: 'What We Clarify', shortLabel: 'Clarify' },
  { id: 'faq', label: 'FAQ' },
];

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: 'call',
    number: '01',
    title: 'Online Strategy Call',
    summary:
      'Every project starts with a focused 30-minute Zoom meeting to understand your business, priorities, and required website capabilities.',
    points: [
      'Online only, clear agenda, no wasted time',
      'Pages, menus, forms, maps, booking, gallery, quote flow',
    ],
  },
  {
    id: 'scope',
    number: '02',
    title: 'Scope and Package Recommendation',
    summary:
      'We translate requirements into a clear scope and recommend the package that best fits your goals, timeline, and technical needs.',
    points: [
      'What is included now vs. phased later',
      'Delivery model aligned to your business reality',
    ],
  },
  {
    id: 'plan',
    number: '03',
    title: 'Website Planning and Structure',
    summary:
      'Before build starts, we define structure, navigation, and conversion pathways so each page has a clear purpose.',
    points: [
      'Page hierarchy and menu logic',
      'Content and CTA structure for faster buyer decisions',
    ],
  },
  {
    id: 'build',
    number: '04',
    title: 'Build and Review',
    summary:
      'Axiom implements the approved plan with performance-focused standards, then runs guided reviews to keep decisions efficient.',
    points: [
      'Desktop and mobile behavior verified',
      'Refinement checkpoints without scope drift',
    ],
  },
  {
    id: 'launch',
    number: '05',
    title: 'Launch and Infrastructure',
    summary:
      'We launch through a controlled release process and validate infrastructure, routing, and production readiness.',
    points: [
      'DNS, hosting, and domain routing validated',
      'Post-launch checks for reliability and speed',
    ],
  },
];

const STACK_OPTIONS: readonly StackOption[] = [
  {
    id: 'current',
    label: 'Use Current Setup',
    title: 'Work inside your current website and domain setup',
    summary:
      'If your current provider setup is stable, we can work within it and improve what matters without forcing a full migration.',
    bullets: [
      'Use your existing domain provider',
      'Keep useful infrastructure already in place',
      'Upgrade execution quality with less transition risk',
    ],
  },
  {
    id: 'domain-kept',
    label: 'Keep Domain',
    title: 'Keep your domain, replace the website experience',
    summary:
      'When the domain should stay but the site needs a full rebuild, we handle transition planning and release without unnecessary disruption.',
    bullets: [
      'Domain continuity preserved',
      'New build shipped with clean handoff planning',
      'Lower friction for existing customers and search presence',
    ],
  },
  {
    id: 'managed',
    label: 'Axiom-Managed',
    title: 'Let Axiom manage hosting and infrastructure directly',
    summary:
      'If you want a fully managed model, we can run infrastructure for you and keep technical operations centralized.',
    bullets: [
      'Single accountable technical owner',
      'Streamlined updates and release controls',
      'Less internal overhead for your team',
    ],
  },
];

const CLARIFY_ITEMS: readonly ExpandableItem[] = [
  {
    title: 'Required pages and navigation flow',
    body: 'We define exactly what pages are needed, how navigation should be organized, and where key actions should appear so users move through the site with minimal friction.',
  },
  {
    title: 'Feature requirements by business model',
    body: 'We scope feature requirements early, including booking, menu structures, maps, galleries, quote forms, and contact pathways aligned to your service model.',
  },
  {
    title: 'Lead capture and form routing',
    body: 'We clarify form inputs, destination routing, and response expectations so inbound leads are captured cleanly and handled without manual confusion.',
  },
  {
    title: 'Content structure and message hierarchy',
    body: 'We organize content blocks and messaging priorities around buyer intent so each page supports trust and conversion outcomes.',
  },
  {
    title: 'Domain, hosting, and release path',
    body: 'We confirm domain ownership, hosting responsibilities, and launch sequencing before production so rollout is smooth and predictable.',
  },
  {
    title: 'Near-term and future expansion needs',
    body: 'We identify what must ship now and what can expand later, so the initial build is stable without boxing your business into short-term decisions.',
  },
];

const FLEXIBILITY_ITEMS: readonly string[] = [
  'Existing site and domain provider',
  'Existing domain with a full rebuild',
  'Fully Axiom-managed hosting and infrastructure',
];

const FAQ_ITEMS: readonly ExpandableItem[] = [
  {
    title: 'How are consultations conducted?',
    body: 'Consultations are conducted online only through Zoom. This keeps scheduling fast and keeps the process focused.',
  },
  {
    title: 'How long is the first meeting?',
    body: 'The initial consultation is 30 minutes. We use that time to understand your business and define what the website must include.',
  },
  {
    title: 'Can Axiom work with my existing domain and provider?',
    body: 'Yes. If your current setup is workable, we can build around it. If needed, we can also handle infrastructure directly.',
  },
  {
    title: 'When do you recommend a package?',
    body: 'After the strategy call and scope definition. Recommendations are based on the project requirements and delivery needs.',
  },
];

const PROOF_POINTS: readonly ExpandableItem[] = [
  {
    title: 'Founder-led qualification',
    body: 'Strategy and scope decisions are handled directly by Axiom leadership, not delegated to a generic intake team.',
  },
  {
    title: 'Controlled launch standards',
    body: 'Release is handled with explicit checks for forms, routing, and production behavior across core devices.',
  },
  {
    title: 'Transparent work positioning',
    body: 'Sample and demonstration work is labeled clearly, with no fabricated claims, testimonials, or inflated outcomes.',
  },
];

const StepIcon: React.FC<{ id: string }> = ({ id }) => {
  const common = 'h-5 w-5 text-[#d4a48e]';

  if (id === 'call') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 18.5v2m4-2v2m-6.5 0h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'scope') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M6 5.5h12M6 12h8M6 18.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="m17.5 12.5 2 2 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (id === 'plan') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (id === 'build') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M14.5 5.5a4.5 4.5 0 0 0-5.8 5.8l-4.2 4.2 1.5 1.5 4.2-4.2a4.5 4.5 0 0 0 5.8-5.8l-2.3 2.3-2-2 2.8-1.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <path d="M5 19h14M6 15.5l5.8-9.8a.25.25 0 0 1 .4 0l5.8 9.8M12 7.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Infrastructure: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(SECTION_LINKS[0].id);
  const [activeStack, setActiveStack] = useState<string>(STACK_OPTIONS[0].id);
  const [openClarify, setOpenClarify] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);

  const activeStackData = useMemo(
    () => STACK_OPTIONS.find((option) => option.id === activeStack) ?? STACK_OPTIONS[0],
    [activeStack]
  );

  useEffect(() => {
    const handleScroll = () => {
      const offset = 220;
      let current = SECTION_LINKS[0].id;

      SECTION_LINKS.forEach((link) => {
        const element = document.getElementById(link.id);
        if (!element) return;

        if (window.scrollY + offset >= element.offsetTop) {
          current = link.id;
        }
      });

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const processCards = Array.from(document.querySelectorAll<HTMLElement>('[data-process-step]'));
    if (processCards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const indexValue = Number((entry.target as HTMLElement).dataset.stepIndex || 0);
          setActiveProcessStep(Number.isNaN(indexValue) ? 0 : indexValue);
        });
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0.25 }
    );

    processCards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node, index) => {
      node.classList.add('reveal-on-scroll');
      node.style.setProperty('--reveal-order', String(index % 6));
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const processProgress = ((activeProcessStep + 1) / PROCESS_STEPS.length) * 100;

  return (
    <>
      <SEO
        title="Method | Axiom Infrastructure"
        description="Premium web systems for high-trust service firms. A clear process from 30-minute Zoom consultation to launch and infrastructure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-10 md:pb-32">
          <section data-hero-root className="pt-8 md:pt-16">
            <div className="grid gap-6 md:grid-cols-12 md:items-start md:gap-8">
              <article className="axiom-bento card-snappy p-7 md:col-span-8 md:p-10" data-reveal>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Method</p>
                <div className="mt-4 max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2rem,8.2vw,4rem)] font-extrabold leading-[1.05] text-[#F2F4F7]">
                    How the Axiom process works.
                  </h1>
                </div>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                  A clear, structured path from your first Zoom consultation to launch. No guesswork, no bloated process, and no unclear handoff.
                </p>
                <div className="mt-8">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                    Book Consultation
                  </Link>
                </div>
              </article>

              <article className="axiom-bento card-snappy p-7 md:col-span-4 md:self-start md:p-8" data-reveal>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">First Call Focus</p>
                <ul className="mt-4 space-y-3">
                  <li className="text-sm leading-relaxed text-slate-300">30-minute online Zoom consultation</li>
                  <li className="text-sm leading-relaxed text-slate-300">Required pages, forms, maps, and key functionality</li>
                  <li className="text-sm leading-relaxed text-slate-300">Scope alignment and package recommendation</li>
                </ul>
              </article>
            </div>
          </section>

          <div className="z-30 mt-8 md:sticky md:top-24" data-reveal>
            <nav
              aria-label="Infrastructure page sections"
              className="hide-scrollbar overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(12,16,25,0.88)] p-1.5 backdrop-blur-xl md:rounded-full md:p-2"
            >
              <ul className="flex min-w-max items-center gap-1">
                {SECTION_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        className={`inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                          isActive
                            ? 'bg-[#B05D41]/20 text-[#F2F4F7] ring-1 ring-[#B05D41]/40'
                            : 'text-slate-300 hover:bg-white/[0.07] hover:text-[#F2F4F7]'
                        }`}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        <span className="hidden md:inline">{link.label}</span>
                        <span className="md:hidden">{link.shortLabel || link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <section id="process" data-method-section className="pt-14 md:pt-20">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4" data-reveal>
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Process</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Clear steps from first call to launch.</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                  The sequence is structured to reduce ambiguity and keep project decisions aligned.
                </p>

                <article className="axiom-bento mt-6 p-5" data-reveal>
                  <div className="flex items-center justify-between">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Step Progress</p>
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#d4a48e]">
                      {activeProcessStep + 1} / {PROCESS_STEPS.length}
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B05D41] to-[#F59768] transition-all duration-300 motion-reduce:transition-none"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                </article>
              </div>

              <ol className="grid gap-4 lg:col-span-8">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.id}
                    data-process-step
                    data-step-index={index}
                    data-reveal
                    className="axiom-bento card-snappy rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none md:p-7"
                  >
                    <div className="grid gap-4 md:grid-cols-12 md:items-start">
                      <div className="md:col-span-2">
                        <p className="font-axiomMono text-lg tracking-[0.18em] text-[#d4a48e]">{step.number}</p>
                      </div>
                      <div className="md:col-span-10">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
                            <StepIcon id={step.id} />
                          </span>
                          <h3 className="text-[clamp(1.16rem,2vw,1.55rem)] font-semibold text-[#F2F4F7]">{step.title}</h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{step.summary}</p>
                        <ul className="mt-4 space-y-2">
                          {step.points.map((point) => (
                            <li key={point} className="text-sm leading-relaxed text-slate-300">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="your-stack" data-method-section className="pt-16 md:pt-22">
            <div className="mb-7" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Your Stack</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Use your existing setup or shift to managed infrastructure.</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5" data-reveal>
                <div
                  role="group"
                  aria-label="Infrastructure setup options"
                  className="axiom-bento flex flex-col gap-2 p-3"
                >
                  {STACK_OPTIONS.map((option) => {
                    const selected = option.id === activeStack;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActiveStack(option.id)}
                        className={`rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-[#B05D41]/14 text-[#F2F4F7] ring-1 ring-[#B05D41]/45'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-[#F2F4F7]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7" data-reveal>
                <article
                  className="axiom-bento rounded-2xl p-6 md:p-8"
                >
                  <div
                    key={activeStackData.id}
                    className="animate-[fade-in-up_0.28s_ease-out] motion-reduce:animate-none"
                  >
                    <h3 className="text-2xl font-semibold text-[#F2F4F7]">{activeStackData.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{activeStackData.summary}</p>
                    <ul className="mt-4 space-y-2">
                      {activeStackData.bullets.map((bullet) => (
                        <li key={bullet} className="text-sm leading-relaxed text-slate-300">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section id="clarify" data-method-section className="pt-16 md:pt-22">
            <div className="mb-7" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What We Clarify</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">No build starts with unresolved assumptions.</h2>
            </div>

            <div className="grid gap-3">
              {CLARIFY_ITEMS.map((item, index) => {
                const expanded = openClarify === index;
                return (
                  <article key={item.title} className="axiom-bento rounded-2xl p-5 md:p-6" data-reveal>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 text-left"
                      aria-expanded={expanded}
                      aria-controls={`clarify-panel-${index}`}
                      onClick={() => setOpenClarify(expanded ? -1 : index)}
                    >
                      <span className="text-base font-semibold text-[#F2F4F7] md:text-lg">{item.title}</span>
                      <span className="font-axiomMono text-xs uppercase tracking-[0.12em] text-[#d4a48e]">
                        {expanded ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    <div
                      id={`clarify-panel-${index}`}
                      className={`overflow-hidden transition-all duration-300 motion-reduce:transition-none ${
                        expanded ? 'mt-3 max-h-64 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-slate-300 md:text-base">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pt-16 md:pt-22">
            <div className="mb-7" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Setup Flexibility</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Three ways to run delivery.</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {FLEXIBILITY_ITEMS.map((item) => (
                <article key={item} className="axiom-bento rounded-2xl p-5 md:p-6" data-reveal>
                  <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" data-method-section className="pt-16 md:pt-22">
            <div className="mb-7" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">FAQ</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Common process questions.</h2>
            </div>

            <div className="grid gap-3">
              {FAQ_ITEMS.map((item, index) => {
                const expanded = openFaq === index;
                return (
                  <article key={item.title} className="axiom-bento rounded-2xl p-5 md:p-6" data-reveal>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 text-left"
                      aria-expanded={expanded}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenFaq(expanded ? -1 : index)}
                    >
                      <span className="text-base font-semibold text-[#F2F4F7] md:text-lg">{item.title}</span>
                      <span className="font-axiomMono text-xs uppercase tracking-[0.12em] text-[#d4a48e]">
                        {expanded ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${index}`}
                      className={`overflow-hidden transition-all duration-300 motion-reduce:transition-none ${
                        expanded ? 'mt-3 max-h-56 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-slate-300 md:text-base">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pt-16 md:pt-22">
            <div className="mb-7" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Operational Proof</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Signals serious operators expect.</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PROOF_POINTS.map((item) => (
                <article key={item.title} className="axiom-bento rounded-2xl p-5 md:p-6" data-reveal>
                  <h3 className="text-lg font-semibold text-[#F2F4F7]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-12 md:pt-16">
            <article className="axiom-bento rounded-2xl p-6 md:p-8" data-reveal>
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Save For Later</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#F2F4F7] md:text-3xl">Need a one-page process overview for internal review?</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Request the infrastructure method summary and we will send a concise shareable overview your team can review asynchronously.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:aidan@getaxiom.ca?subject=Axiom%20Method%20Overview%20Request"
                  className="inline-flex rounded-full border border-white/20 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-white/35 hover:bg-white/[0.08]"
                >
                  Request Process Summary
                </a>
              </div>
            </article>
          </section>

          <section className="pt-16 md:pt-22">
            <div
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827]/85 via-[#10141f]/80 to-[#0d1323]/85 p-8 text-center md:p-12"
              data-reveal
            >
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Final Step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                Book your 30-minute Zoom consultation.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                We will review your requirements and recommend the package that best fits your business.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book Consultation
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
