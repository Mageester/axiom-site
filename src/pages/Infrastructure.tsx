import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { RevealBlock } from '../components/ui/RevealBlock';

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
    label: 'Work Within Current Setup',
    title: 'Work within your current setup and improve what matters',
    summary:
      'If your current domain and hosting are already in a good place, we can build within that environment and upgrade the site without forcing a full move.',
    bullets: [
      'Keep your current domain and provider',
      'Avoid unnecessary migration work',
      'Improve performance, structure, and user experience',
    ],
  },
  {
    id: 'domain-kept',
    label: 'Keep Domain, Rebuild Site',
    title: 'Keep the domain. Replace the site experience.',
    summary:
      'If the domain should stay but the website needs a full reset, we handle the rebuild and launch planning so the transition stays clean and low-friction.',
    bullets: [
      'Keep your existing domain in place',
      'Launch a new site with a clean transition',
      'Protect continuity for customers and search visibility',
    ],
  },
  {
    id: 'managed',
    label: 'Fully Managed by Axiom',
    title: 'Let Axiom handle hosting, deployment, and upkeep',
    summary:
      'If you want a more hands-off model, we can manage the technical side directly so updates, releases, and ongoing site operations stay centralized.',
    bullets: [
      'One team handling the technical side',
      'Cleaner updates and release control',
      'Less internal overhead for your business',
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
  const sectionScrollFrame = useRef<number | null>(null);

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

  useLayoutEffect(() => {
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

  useEffect(
    () => () => {
      if (sectionScrollFrame.current !== null) {
        window.cancelAnimationFrame(sectionScrollFrame.current);
      }
    },
    []
  );

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const isPlainLeftClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPlainLeftClick) return;

    const target = document.getElementById(sectionId);
    if (!target) return;
    event.preventDefault();

    const topOffset = window.innerWidth >= 768 ? 132 : 118;
    const targetTop = Math.max(target.getBoundingClientRect().top + window.scrollY - topOffset, 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });
      return;
    }

    const startTop = window.scrollY;
    const distance = targetTop - startTop;
    const duration = 560;
    const startedAt = performance.now();
    const easeInOut = (time: number) =>
      time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;

    if (sectionScrollFrame.current !== null) {
      window.cancelAnimationFrame(sectionScrollFrame.current);
    }

    const animate = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOut(elapsed);
      window.scrollTo({ top: startTop + distance * eased, left: 0, behavior: 'auto' });

      if (elapsed < 1) {
        sectionScrollFrame.current = window.requestAnimationFrame(animate);
      } else {
        sectionScrollFrame.current = null;
      }
    };

    sectionScrollFrame.current = window.requestAnimationFrame(animate);
  };

  const processProgress = ((activeProcessStep + 1) / PROCESS_STEPS.length) * 100;

  return (
    <>
      <SEO
        title="Method | Axiom Infrastructure"
        description="Premium web systems for high-trust service firms. A clear process from 30-minute Zoom consultation to launch and infrastructure."
      />

      <Layout>
        <main className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-8 md:pt-16" variant="feature">
            <div className="max-w-5xl">
              <article className="md:pr-6" data-reveal>
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
            </div>
          </RevealBlock>

          <div className="z-30 mt-8 md:sticky md:top-24" data-reveal>
            <nav
              aria-label="Infrastructure page sections"
              className="hide-scrollbar mx-auto w-full overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(12,16,25,0.82)] p-1.5 backdrop-blur-lg md:w-fit md:rounded-full md:p-1.5"
            >
              <ul className="flex min-w-max items-center gap-0.5 md:gap-1">
                {SECTION_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        onClick={(event) => scrollToSection(event, link.id)}
                        className={`inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
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

          <RevealBlock as="section" id="process" data-method-section className="pt-14 md:pt-20">
            <div className="mx-auto w-full max-w-[1220px]">
              <div className="mx-auto w-full max-w-[740px]" data-reveal>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Clear steps from first call to launch.</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                  The sequence is structured to reduce ambiguity and keep project decisions aligned.
                </p>
              </div>

              <ol className="mx-auto mt-10 grid w-full max-w-[960px] gap-5 md:mt-12 md:gap-6">
                <li className="axiom-bento rounded-2xl px-4 py-3 md:px-5 md:py-3.5" data-reveal aria-label="Step progress">
                  <div className="flex items-center justify-between">
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Progress</p>
                    <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#d4a48e]">
                      {activeProcessStep + 1} / {PROCESS_STEPS.length}
                    </p>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B05D41] to-[#F59768] transition-all duration-300 motion-reduce:transition-none"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                </li>
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
          </RevealBlock>

          <RevealBlock as="section" id="your-stack" data-method-section className="pt-14 md:pt-18">
            <div className="mb-6 max-w-4xl" data-reveal>
              <h2 className="mt-1 text-[clamp(1.95rem,4.6vw,3.35rem)] font-bold leading-[1.08] tracking-tight text-[#F2F4F7]">
                Keep what works. Replace what doesn&apos;t.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                We can work within your current setup, rebuild around your existing domain, or manage the technical side for you directly.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
              <div className="lg:col-span-5" data-reveal>
                <div
                  role="group"
                  aria-label="Website setup options"
                  className="axiom-bento flex flex-col gap-1.5 rounded-2xl p-2.5 md:p-3"
                >
                  {STACK_OPTIONS.map((option) => {
                    const selected = option.id === activeStack;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActiveStack(option.id)}
                        className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B05D41]/45 ${
                          selected
                            ? 'border-[#B05D41]/40 bg-[#B05D41]/14 text-[#F2F4F7] shadow-[inset_0_0_0_1px_rgba(176,93,65,0.16)]'
                            : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-[#F2F4F7]'
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
                  className="axiom-bento rounded-2xl p-6 md:p-7"
                >
                  <div
                    key={activeStackData.id}
                    className="animate-[fade-in-up_0.28s_ease-out] motion-reduce:animate-none"
                  >
                    <h3 className="text-[clamp(1.35rem,2.3vw,2rem)] font-semibold leading-tight text-[#F2F4F7]">{activeStackData.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">{activeStackData.summary}</p>
                    <ul className="mt-5 list-disc space-y-2.5 pl-5">
                      {activeStackData.bullets.map((bullet) => (
                        <li key={bullet} className="text-sm leading-relaxed text-slate-300 md:text-[0.97rem]">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock as="section" id="clarify" data-method-section className="pt-16 md:pt-22">
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
          </RevealBlock>

          <RevealBlock as="section" id="faq" data-method-section className="pt-16 md:pt-22">
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
          </RevealBlock>

          <RevealBlock as="section" className="pt-16 md:pt-22" variant="feature">
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
          </RevealBlock>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default Infrastructure;
