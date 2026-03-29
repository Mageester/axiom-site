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
  { id: 'your-stack', label: 'Your Setup', shortLabel: 'Setup' },
  { id: 'clarify', label: 'Confirm', shortLabel: 'Confirm' },
  { id: 'faq', label: 'FAQ' },
];

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: 'call',
    number: '01',
    title: 'Intro Call',
    summary: 'Every project starts with a 30-minute Zoom call to understand your business and what the site needs to do.',
    points: ['Online only', 'Clear agenda'],
  },
  {
    id: 'scope',
    number: '02',
    title: 'Scope Plan',
    summary: 'We turn the requirements into a clear scope and recommend the package that fits best.',
    points: ['What is included now', 'What can wait until later'],
  },
  {
    id: 'plan',
    number: '03',
    title: 'Site Plan',
    summary: 'Before the build starts, we define the page structure, navigation, and main calls to action.',
    points: ['Page order and menu structure', 'Clear calls to action'],
  },
  {
    id: 'build',
    number: '04',
    title: 'Build and Check',
    summary: 'We build the site, review it, and keep the work focused on the approved plan.',
    points: ['Checked on desktop and mobile', 'No extra scope added'],
  },
  {
    id: 'launch',
    number: '05',
    title: 'Launch',
    summary: 'We launch the site cleanly and make sure everything works before handoff.',
    points: ['DNS and routing handled cleanly', 'Final checks before handoff'],
  },
];

const STACK_OPTIONS: readonly StackOption[] = [
  {
    id: 'current',
    label: 'Use Current Setup',
    title: 'Keep your current setup and improve the site',
    summary: 'If your domain and hosting are already fine, we can build inside that setup and improve the site without a full move.',
    bullets: ['Keep your current domain and provider', 'Avoid unnecessary migration work', 'Improve speed, structure, and user experience'],
  },
  {
    id: 'domain-kept',
    label: 'Keep Domain',
    title: 'Keep the domain. Replace the site.',
    summary: 'If the domain should stay but the website needs a reset, we handle the rebuild and launch plan.',
    bullets: ['Keep your existing domain in place', 'Launch a new site with a clean transition', 'Protect continuity for customers and search'],
  },
  {
    id: 'managed',
    label: 'Fully Managed',
    title: 'Let Axiom handle hosting and updates',
    summary: 'If you want a hands-off model, we can manage the technical side directly.',
    bullets: ['One team handling the technical side', 'Cleaner updates and release control', 'Less internal overhead for your business'],
  },
];

const CLARIFY_ITEMS: readonly ExpandableItem[] = [
  {
    title: 'Pages and navigation',
    body: 'We define the pages you need, how they should be arranged, and where key actions should appear.',
  },
  {
    title: 'Features the site needs',
    body: 'We scope the features early, including booking, menus, maps, galleries, quote forms, and contact paths.',
  },
  {
    title: 'Forms and lead routing',
    body: 'We define the form fields, where leads go, and what happens after someone sends a message.',
  },
  {
    title: 'Content order',
    body: 'We arrange the content so each page reads in a clear order.',
  },
  {
    title: 'Domain and launch',
    body: 'We confirm domain ownership, hosting, and launch steps before production.',
  },
  {
    title: 'Now vs. later',
    body: 'We separate what needs to ship now from what can wait.',
  },
];

const FAQ_ITEMS: readonly ExpandableItem[] = [
  {
    title: 'How are consultations conducted?',
    body: 'Consultations are online through Zoom.',
  },
  {
    title: 'How long is the first meeting?',
    body: 'The first call is 30 minutes.',
  },
  {
    title: 'Can Axiom work with my existing domain and provider?',
    body: 'Yes. If your setup works, we can build around it. If needed, we can handle the technical side.',
  },
  {
    title: 'When do you recommend a package?',
    body: 'After the first call and scope review.',
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
  const [processScrollProgress, setProcessScrollProgress] = useState<number>(0);
  const [isSectionNavPinned, setIsSectionNavPinned] = useState(false);
  const [sectionNavHeight, setSectionNavHeight] = useState(0);
  const sectionScrollFrame = useRef<number | null>(null);
  const sectionNavRef = useRef<HTMLElement | null>(null);

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
    const sectionNav = sectionNavRef.current;
    if (!sectionNav) return;

    let rafId = 0;

    const updatePinState = () => {
      rafId = 0;
      setSectionNavHeight(sectionNav.offsetHeight);
      const pinThreshold = sectionNav.offsetTop - 92;
      setIsSectionNavPinned(window.scrollY >= pinThreshold);
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updatePinState);
    };

    updatePinState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const processSection = document.getElementById('process');
    if (!processSection) return;

    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const rect = processSection.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const start = sectionTop - window.innerHeight * 0.35;
      const end = sectionTop + sectionHeight - window.innerHeight * 0.15;
      const total = Math.max(end - start, 1);
      const progress = Math.min(Math.max((window.scrollY - start) / total, 0), 1);

      setProcessScrollProgress(progress * 100);
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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

  const scrollToTarget = (target: HTMLElement, topOffset: number) => {
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

  const scrollToSection = (event: React.MouseEvent<HTMLElement>, sectionId: string) => {
    const isPlainLeftClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPlainLeftClick) return;

    const target = document.getElementById(sectionId);
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target, window.innerWidth >= 768 ? 132 : 118);
  };

  const processProgress = processScrollProgress;

  return (
    <>
      <SEO
        title="Method | Axiom"
        description="Axiom keeps projects clear with one call, a defined scope, and a clean launch."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-10 md:pb-32">
          <RevealBlock as="section" data-hero-root className="pt-8 md:pt-16" variant="feature">
            <div className="max-w-5xl">
              <article className="md:pr-6" data-reveal>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Method</p>
                <div className="mt-4 max-w-4xl overflow-hidden">
                  <h1 data-startup-heading className="text-[clamp(2rem,8.2vw,4rem)] font-extrabold leading-[1.05] text-[#F2F4F7]">
                    A clear process from first call to launch.
                  </h1>
                </div>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-slate-200/90 md:text-lg">
                  We plan the site, build it, and handle launch so the project stays clear and easy to approve.
                </p>
                <div className="mt-8">
                  <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                            Book Free Consultation
                  </Link>
                </div>
              </article>
            </div>
          </RevealBlock>

          <div className="mt-8" data-reveal style={sectionNavHeight > 0 ? { minHeight: `${sectionNavHeight}px` } : undefined}>
            <nav
              ref={sectionNavRef}
              aria-label="Method page sections"
              className={`hide-scrollbar overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(12,16,25,0.82)] p-1.5 backdrop-blur-lg transition-all duration-300 md:rounded-full md:p-1.5 ${
                isSectionNavPinned
                  ? 'fixed left-1/2 top-[5.25rem] z-40 w-[calc(100vw-2rem)] -translate-x-1/2 shadow-[0_18px_42px_rgba(0,0,0,0.28)] md:w-fit'
                  : 'relative mx-auto w-full md:w-fit'
              }`}
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
                  Each step keeps the project simple.
                </p>
              </div>

              <nav
                aria-label="Process steps"
                className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-md"
                data-reveal
              >
                {PROCESS_STEPS.map((step, index) => {
                  const isActive = activeProcessStep === index;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={(event) => scrollToSection(event, `process-step-${step.id}`)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`inline-flex min-w-max flex-1 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45 md:flex-none md:px-4 ${
                        isActive
                          ? 'border-[#d4a48e]/35 bg-[#B05D41]/12 text-[#F2F4F7] shadow-[0_0_0_1px_rgba(212,164,142,0.14)]'
                          : 'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-[#F2F4F7]'
                      }`}
                    >
                      <span className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">
                        {step.number}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.12em]">
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </nav>

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
                    id={`process-step-${step.id}`}
                    data-process-step
                    data-step-index={index}
                    data-reveal
                    aria-current={activeProcessStep === index ? 'step' : undefined}
                    className={`relative scroll-mt-32 border-l pl-5 py-6 transition-all duration-300 motion-reduce:transform-none md:pl-8 md:py-7 ${
                      activeProcessStep === index
                        ? 'border-[#d4a48e]/30 bg-[linear-gradient(180deg,rgba(19,25,34,0.7)_0%,rgba(11,15,21,0.9)_100%)]'
                        : 'border-white/10 opacity-85'
                    }`}
                  >
                    <div className={`absolute left-[-0.3rem] top-7 h-2.5 w-2.5 rounded-full ${activeProcessStep === index ? 'bg-[#d4a48e] shadow-[0_0_0_4px_rgba(212,164,142,0.14)]' : 'bg-white/35'}`} />
                    <div className="grid gap-4 md:grid-cols-12 md:items-start">
                      <div className="md:col-span-2">
                        <button
                          type="button"
                          aria-label={`Jump to ${step.title}`}
                          onClick={(event) => scrollToSection(event, `process-step-${step.id}`)}
                          className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-axiomMono text-lg tracking-[0.18em] text-[#d4a48e] transition-all duration-300 hover:border-[#d4a48e]/28 hover:bg-[#B05D41]/12 hover:text-[#f0cfbf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a48e]/45"
                        >
                          {step.number}
                        </button>
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
                We can work in your current setup, rebuild around your domain, or handle the technical side directly.
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
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">What we confirm</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">What we confirm before build.</h2>
            </div>

            <div className="grid gap-3">
              {CLARIFY_ITEMS.map((item, index) => {
                const expanded = openClarify === index;
                return (
                  <article key={item.title} className="border-b border-white/10 py-5 md:py-6" data-reveal>
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
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">Common questions.</h2>
            </div>

            <div className="grid gap-3">
              {FAQ_ITEMS.map((item, index) => {
                const expanded = openFaq === index;
                return (
                  <article key={item.title} className="border-b border-white/10 py-5 md:py-6" data-reveal>
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
                <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#A7B3BC]">Final step</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
                If it is a fit, we&apos;ll define the project.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                The first call covers goals, timing, and what the project needs.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start the conversation
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
