import React, { useEffect, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  id: string;
};

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  titleClassName?: string;
  className?: string;
};

const navItems: NavItem[] = [
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const services = [
  {
    title: 'Shingle Systems',
    desc: 'Architectural and designer shingle installation with 50-year warranty coverage. Wind-rated to 210 km/h.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    title: 'Flat Roof Engineering',
    desc: 'Commercial-grade TPO and EPDM membrane systems. Full drainage analysis and structural load assessment.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
  {
    title: 'Storm Restoration',
    desc: 'Emergency tarp deployment and full insurance claim management. Same-day response for hail and wind damage.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const stats = [
  { value: '1,800+', label: 'Roofs Completed' },
  { value: '50yr', label: 'Warranty Coverage' },
  { value: '210km/h', label: 'Wind Rating' },
  { value: '24hr', label: 'Storm Response' },
];

const processSteps = [
  { step: '01', title: 'Inspection', desc: 'Drone-assisted structural assessment.' },
  { step: '02', title: 'Blueprint', desc: 'Material spec and load engineering.' },
  { step: '03', title: 'Installation', desc: 'Precision crew deployment.' },
  { step: '04', title: 'Certification', desc: 'Final inspection and warranty seal.' },
];

const contactExpectations = [
  'Initial response within 24 hours',
  'Inspection scope matched to the issue',
  'Clear next-step recommendation before work begins',
];

const cardClassName = 'site-card h-full p-6 md:p-7';

const SectionIntro: React.FC<SectionIntroProps> = ({ eyebrow, title, copy, titleClassName = '', className = '' }) => (
  <div className={className}>
    <p className="section-kicker">{eyebrow}</p>
    <h2 className={`section-title ${titleClassName}`.trim()}>{title}</h2>
    {copy ? <p className="section-copy">{copy}</p> : null}
  </div>
);

const Header: React.FC<{ activeSection: string }> = ({ activeSection }) => (
  <header className="sticky top-0 z-50">
    <div className="border-b border-white/6 bg-[#140f0d]/92 backdrop-blur-md">
      <div className="site-container flex min-h-9 items-center justify-between gap-4 py-2">
        <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-stone-300">
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          Emergency leak or storm damage? Fast temporary protection available.
        </p>
        <p className="hidden text-[11px] font-mono uppercase tracking-[0.18em] text-stone-500 lg:block">
          Priority response available
        </p>
      </div>
    </div>

    <div className="border-b border-white/8 bg-surface-base/88 shadow-[0_14px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="site-container flex h-16 items-center gap-4">
        <a href="#top" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember-500/25 bg-ember-500/10 text-ember-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold tracking-tight text-white">Summit Roofing</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">
              Structural Protection
            </p>
          </div>
        </a>

        <nav className="ml-auto hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.02] p-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`.trim()}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a href="#contact" className="btn-primary ml-auto shrink-0 md:ml-4">
          Storm Response
        </a>
      </div>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section id="top" className="section-shell scroll-mt-32 overflow-hidden pt-16 md:pt-20">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-ember-700/10 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-[-6rem] h-[32rem] w-[58rem] -translate-x-1/2 rounded-full bg-ember-500/5 blur-[140px]" />
      <div className="absolute right-[8%] top-[18%] h-52 w-52 rounded-full bg-white/[0.03] blur-[120px]" />
    </div>

    <div className="site-container relative z-10">
      <div className="max-w-[46rem]">
        <div className="hero-pill">
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          Licensed and insured contractors
        </div>

        <h1 className="mt-8 max-w-[10ch] text-[clamp(2.9rem,7vw,5.3rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
          Built to Withstand. Engineered to Last.
        </h1>

        <p className="mt-6 max-w-[38rem] text-[16px] leading-8 text-stone-300">
          We engineer roofing systems designed for absolute structural integrity. From precision shingle installation to full storm restoration across Ontario.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a href="#contact" className="btn-primary">
            Free Roof Inspection
          </a>
          <a href="tel:1-800-555-0200" className="btn-secondary">
            Call 1-800-555-0200
          </a>
        </div>

        <p className="mt-6 max-w-[34rem] text-sm leading-6 text-stone-400">
          Shingle systems, flat roof engineering, and storm restoration delivered with clearer scope, tighter execution, and cleaner closeout.
        </p>
      </div>
    </div>
  </section>
);

const Services: React.FC = () => (
  <section id="services" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionIntro
        eyebrow="Core Capabilities"
        title="Roofing services designed for durability and cleaner execution."
        titleClassName="max-w-[14ch]"
        copy="From designer shingles to flat roof membranes and emergency restoration, every scope is structured for performance, readability, and a more dependable closeout."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className={cardClassName}>
            <div className="panel-icon">{service.icon}</div>
            <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-white">{service.title}</h3>
            <p className="mt-4 max-w-[30ch] text-[15px] leading-7 text-stone-300">{service.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Stats: React.FC = () => (
  <section className="px-4 pb-20 sm:px-6 md:pb-24 lg:px-8">
    <div className="section-inner grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="site-card px-6 py-5 md:px-7 md:py-6">
          <p className="text-[2rem] font-semibold tracking-[-0.03em] text-white">{stat.value}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-stone-400">{stat.label}</p>
        </article>
      ))}
    </div>
  </section>
);

const Process: React.FC = () => (
  <section id="process" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionIntro
        eyebrow="Methodology"
        title="A tighter process from first inspection to final certification."
        titleClassName="max-w-[15ch]"
        copy="Each phase is framed to reduce ambiguity, keep crews aligned, and make the next decision easier to understand."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step) => (
          <article key={step.step} className={cardClassName}>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-ember-300/70">Step {step.step}</p>
            <h3 className="mt-6 text-[1.12rem] font-semibold tracking-[-0.02em] text-white">{step.title}</h3>
            <p className="mt-4 text-[15px] leading-7 text-stone-300">{step.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="section-shell scroll-mt-32 pb-24 md:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-ember-500/5 blur-[120px]" />
      </div>

      <div className="section-inner relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionIntro
            eyebrow="Get Started"
            title="Schedule an inspection with a cleaner intake process."
            titleClassName="max-w-[15ch]"
            copy="Our structural engineers assess the issue, match the right scope, and return with a recommendation you can act on with confidence."
          />

          <article className="site-card mt-8 p-6 md:p-7">
            <p className="section-kicker">What to expect</p>
            <ul className="mt-5 space-y-4 text-[15px] leading-7 text-stone-300">
              {contactExpectations.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {submitted ? (
          <div className="site-card glow-ember px-8 py-12 text-center md:px-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/30 bg-ember-500/10 text-ember-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-white">Inspection Scheduled.</h3>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-stone-300">
              Our team will contact you within 24 hours to confirm the scope and next steps.
            </p>
          </div>
        ) : (
          <form
            className="site-card p-8 md:p-10"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="field-label" htmlFor="full-name">
                  Full Name
                </label>
                <input id="full-name" type="text" required className="field-input" />
              </div>
              <div className="space-y-2">
                <label className="field-label" htmlFor="phone">
                  Phone
                </label>
                <input id="phone" type="tel" required className="field-input" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="field-label" htmlFor="address">
                Property Address
              </label>
              <input id="address" type="text" className="field-input" />
            </div>

            <div className="mt-6 space-y-2">
              <label className="field-label" htmlFor="issue">
                Describe the Issue
              </label>
              <textarea id="issue" rows={5} required className="field-textarea" />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm leading-6 text-stone-400">
                Every request is reviewed manually so the response matches the actual issue, not a generic intake flow.
              </p>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Request Inspection
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="px-4 pb-10 sm:px-6 lg:px-8">
    <div className="site-container">
      <div className="site-card flex flex-col gap-6 px-6 py-6 md:px-7 md:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-base font-semibold tracking-tight text-white">Summit Roofing Co.</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
            LIC# R-204819 | CertainTeed SELECT ShingleMaster
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-stone-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-stone-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Performance Optimized
          </span>
          <span className="text-stone-500">Copyright {new Date().getFullYear()} Summit Roofing. All rights reserved.</span>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    const updateActiveSection = () => {
      const offset = window.scrollY + 180;
      let current = '';

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && offset >= section.offsetTop) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <div className="page-shell">
      <Header activeSection={activeSection} />
      <main className="flex-1">
        <Hero />
        <Services />
        <Stats />
        <Process />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
