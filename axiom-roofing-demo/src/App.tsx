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
};

const isInspectionRoute = typeof window !== 'undefined' && window.location.pathname.includes('/inspection');

const navItems: NavItem[] = isInspectionRoute
  ? [
      { label: 'Proof', href: '#proof', id: 'proof' },
      { label: 'Process', href: '#process', id: 'process' },
      { label: 'Contact', href: '#contact', id: 'contact' },
    ]
  : [
      { label: 'Services', href: '#services', id: 'services' },
      { label: 'Proof', href: '#proof', id: 'proof' },
      { label: 'Process', href: '#process', id: 'process' },
      { label: 'Contact', href: '#contact', id: 'contact' },
    ];

const heroSignals = [
  { label: 'Priority intake', value: 'Call first for active leaks' },
  { label: 'Scope clarity', value: 'Photo-backed before crew day' },
  { label: 'Service area', value: 'Toronto + Durham' },
];

const services = [
  {
    number: '01',
    title: 'Leak and storm response',
    copy: 'Emergency containment, photo documentation, and temporary weatherproofing to stabilize the roof before a full scope is priced.',
    detail: 'Active leak triage and short-notice scheduling',
  },
  {
    number: '02',
    title: 'Full roof replacement',
    copy: 'Full replacement planned as a system: ventilation, underlayment, flashing, edges, and cleanup with clear closeout.',
    detail: 'Architectural shingles, flashing, ventilation, and cleanup',
  },
  {
    number: '03',
    title: 'Roofline and exterior support',
    copy: 'Soffit, fascia, and eavestrough work coordinated with roofing so drainage, edge details, and final curb read stay consistent.',
    detail: 'Integrated roofline finishing and water management',
  },
];

const proofOutcomes = [
  'Before, after, and the exact scope that changed the outcome',
  'Failure points documented before the crew was scheduled',
  'Cleanup, ventilation, and closeout expectations written upfront',
];

const processSteps = [
  {
    title: 'Inspection and evidence capture',
    copy: 'Photo-backed condition notes identify failure points, remaining life, and whether repair or replacement is the cleaner route.',
  },
  {
    title: 'Scope and material alignment',
    copy: 'We align manufacturer system details, installation sequence, and cleanup requirements before any crew date is confirmed.',
  },
  {
    title: 'Installation and closeout',
    copy: 'Crew execution follows the agreed scope, with final walkthrough, documentation, and warranty handoff completed at close.',
  },
];

const trustSignals = [
  'Licensed and insured crews with documented scope reviews',
  'CertainTeed and IKO system familiarity for Ontario conditions',
  'Photo records and written recommendations before contract signing',
  'Emergency call triage for active leak and storm-damage scenarios',
];

const contactExpectations = [
  'Initial response reviewed manually',
  'Issue-first inspection sequencing before quoting',
  'Address and access details confirmed on follow-up',
];

const imagery = {
  hero: '/images/roof-hero.webp',
  before: '/images/roof-before.webp',
  after: '/images/roof-after.webp',
  crew: '/images/roof-crew.webp',
};

const SectionIntro: React.FC<SectionIntroProps> = ({ eyebrow, title, copy }) => (
  <div>
    <p className="section-kicker">{eyebrow}</p>
    <h2 className="section-title">{title}</h2>
    {copy ? <p className="section-copy">{copy}</p> : null}
  </div>
);

const Header: React.FC<{ activeSection: string; isInspectionRoute: boolean }> = ({ activeSection, isInspectionRoute }) => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-base/90 backdrop-blur-xl">
    <div className="border-b border-white/10 bg-[#1a120d]/90">
      <div className="site-container flex min-h-10 items-center justify-between gap-4 py-2">
        <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ember-300">
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          Active leak or storm damage? Call first for triage.
        </p>
        {isInspectionRoute ? (
          <a
            href="tel:16475550164"
            className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-ember-300 lg:block"
          >
            Call for triage
          </a>
        ) : (
          <a
            href="/inspection"
            className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-ember-300 lg:block"
          >
            Request inspection
          </a>
        )}
      </div>
    </div>

    <div className="site-container py-4">
      <div className="flex items-center gap-4">
        <a href="#top" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember-500/25 bg-ember-500/10 text-ember-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11 2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold tracking-tight text-white">
              Blackridge Roofing &amp; Exteriors
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">
              Toronto and Durham Region
            </p>
          </div>
        </a>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
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

        {isInspectionRoute ? (
          <a href="tel:16475550164" className="btn-secondary ml-auto md:ml-4">
            Call for triage
          </a>
        ) : (
          <a href="/inspection" className="btn-secondary ml-auto md:ml-4">
            Request inspection
          </a>
        )}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <a key={item.id} href={item.href} className="nav-link">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section id="top" className="hero-shell scroll-mt-36">
    <div className="site-container hero-grid">
      <div>
        <p className="section-kicker">Roofing and exterior protection | Toronto and Durham</p>
        <h1 className="hero-title">
          {isInspectionRoute
            ? 'Request a photo-backed roof inspection.'
            : 'Roofing and exterior protection backed by evidence.'}
        </h1>
        <p className="hero-copy">
          {isInspectionRoute
            ? 'If there is an active leak, call first. Otherwise send the issue details and we will return the next step before crew day.'
            : "We identify the failure point, document the risk, and point to the smallest durable fix first. If replacement is the right call, you'll know why before crew day."}
        </p>

        <div className="hero-actions">
          {isInspectionRoute ? (
            <>
              <a href="#contact" className="btn-primary">
                Request inspection
              </a>
              <a
                href="tel:16475550164"
                className="inline-flex items-center text-[13px] font-medium uppercase tracking-[0.18em] text-stone-400 transition-colors hover:text-white"
              >
                Call for triage
              </a>
            </>
          ) : (
            <>
              <a href="/inspection" className="btn-primary">
                Request inspection
              </a>
              <a href="tel:16475550164" className="btn-secondary">
                Call for triage
              </a>
            </>
          )}
        </div>

        <ul className="hero-points">
          <li>Photo-backed recommendations on the first visit</li>
          <li>Repair-versus-replace guidance before scheduling</li>
          <li>Cleanup and closeout scope confirmed upfront</li>
        </ul>
      </div>

      <figure className="hero-figure">
        <picture>
          <source type="image/avif" srcSet="/images/roof-hero.avif" />
          <img
            src={imagery.hero}
            alt="Roofing technician staging material for a residential roof replacement"
            className="hero-image"
            loading="eager"
          />
        </picture>
        <figcaption className="hero-caption">
          {isInspectionRoute
            ? 'The first visit covers leak source, repair path, and whether replacement is actually warranted.'
            : 'First visit covers leak source, repair path, and whether replacement is actually warranted.'}
        </figcaption>
      </figure>
    </div>

    <div className="site-container">
      <div className="signal-strip">
        {heroSignals.map((signal) => (
          <div key={signal.label} className="signal-item">
            <p>{signal.label}</p>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Proof: React.FC = () => (
  <section id="proof" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionIntro
        eyebrow={isInspectionRoute ? 'Inspection proof' : 'Project references'}
        title={isInspectionRoute ? 'What the first visit confirms.' : 'Proof you can scan in a minute.'}
        copy={
          isInspectionRoute
            ? 'Photo-backed notes show the failure point, the repair path, and whether replacement is actually warranted.'
            : 'Before, after, and the exact scope that changed the outcome. No vague full-service promises.'
        }
      />

      <div className="proof-grid">
        <div className="proof-compare">
          <figure className="proof-figure">
            <picture>
              <source type="image/avif" srcSet="/images/roof-before.avif" />
              <img
                src={imagery.before}
                alt="Roof condition before replacement with visible wear and uneven aging"
                loading="lazy"
              />
            </picture>
            <figcaption>Before: aging sections, visible wear, and inconsistent roofline definition.</figcaption>
          </figure>

          <figure className="proof-figure">
            <picture>
              <source type="image/avif" srcSet="/images/roof-after.avif" />
              <img
                src={imagery.after}
                alt="Roof after replacement with cleaner geometry and updated shingle system"
                loading="lazy"
              />
            </picture>
            <figcaption>After: aligned shingle system, cleaner ridge read, and corrected edge details.</figcaption>
          </figure>
        </div>

        <div className="proof-content">
          <p>
            The strongest projects are readable before the proposal is finished. We document what failed, what
            was corrected, and how the replacement sequence protects the property long term.
          </p>

          <ul className="proof-list">
            {proofOutcomes.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="proof-notes">
            <div>Failure points are documented before the crew is booked.</div>
            <div>Cleanup, ventilation, and edge details are confirmed in writing.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Services: React.FC = () => {
  if (isInspectionRoute) {
    return null;
  }

  return (
  <section id="services" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionIntro
        eyebrow="Services"
        title="Most calls come down to three decisions."
        copy="Stop the leak, restore the system, or replace the roof with a scope that will not move once work starts."
      />

      <div className="service-list">
        {services.map((service) => (
          <article key={service.number} className="service-row">
            <p className="service-number">{service.number}</p>
            <div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </div>
            <p className="service-detail">{service.detail}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
  )
};

const Process: React.FC = () => (
  <section id="process" className="section-shell scroll-mt-32">
    <div className="section-inner process-grid">
      <div>
        <SectionIntro
          eyebrow="Inspection path"
          title={
            isInspectionRoute
              ? 'How the inspection turns into scope.'
              : 'What we confirm before a crew is booked.'
          }
          copy={
            isInspectionRoute
              ? 'You get the recommendation, the scope, and the schedule window before you commit.'
              : 'You get the recommendation, the scope, and the schedule window before you commit.'
          }
        />

        <div className="timeline">
          {processSteps.map((step, index) => (
            <article key={step.title} className="timeline-row">
              <p>0{index + 1}</p>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="trust-panel">
        <picture>
          <source type="image/avif" srcSet="/images/roof-crew.avif" />
          <img
            src={imagery.crew}
            alt="Roofing crew coordinating installation detail at the roof edge"
            loading="lazy"
          />
        </picture>

        <p className="trust-title">What the first visit covers</p>
        <ul>
          {trustSignals.map((signal) => (
            <li key={signal}>
              <span />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </section>
);

const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  if (!isInspectionRoute) {
    return (
      <section id="contact" className="section-shell scroll-mt-32 close-shell">
        <div className="section-inner close-grid">
          <div className="close-copy">
            <SectionIntro
              eyebrow="Inspection request"
              title="Start with the inspection."
              copy="If the roof is leaking, storm-damaged, or overdue for a clear read, the first visit should define the next step."
            />

            <a href="/inspection" className="btn-primary mt-8 w-full sm:w-auto">
              Request inspection
            </a>

            <ul className="close-list">
              {contactExpectations.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-shell">
            <h3>Need triage first?</h3>
            <p>Call before crew day if water is active or the roof needs a fast read.</p>
            <a href="tel:16475550164" className="btn-secondary mt-4 w-full">
              Call for triage
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-shell scroll-mt-32 close-shell">
        <div className="section-inner close-grid">
          <div className="close-copy">
            <SectionIntro
              eyebrow="Inspection request"
              title={isInspectionRoute ? 'Send the issue. We will return the next step.' : 'Send the issue and we will return the clear next step.'}
              copy={
                isInspectionRoute
                  ? 'For active leaks, call first so temporary protection can be triaged. For standard inspections, send the condition notes, roof age, and timing. Address can follow during review.'
                  : 'For active leaks, call first so temporary protection can be triaged. For standard inspections, send the condition notes and timing. Address can follow during review.'
              }
            />

            {isInspectionRoute ? (
              <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Active leak? <a href="tel:16475550164" className="text-ember-300 transition-colors hover:text-white">Call for triage</a>
              </p>
            ) : (
              <a
                href="tel:16475550164"
                className="btn-secondary mt-8 w-full sm:w-auto"
              >
                Call for triage
              </a>
            )}

          <ul className="close-list">
            {contactExpectations.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {submitted ? (
          <div className="form-shell success-shell">
            <h3>Inspection request received.</h3>
            <p>Our office will review your note and follow up with scheduling options and next steps.</p>
          </div>
        ) : (
          <form
            className="form-shell"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="field-grid">
              <label>
                <span className="field-label">Full name</span>
                <input type="text" required className="field-input" />
              </label>

              <label>
                <span className="field-label">Phone or email</span>
                <input type="text" required className="field-input" />
              </label>
            </div>

            <label>
              <span className="field-label">Issue details</span>
              <textarea
                rows={5}
                required
                className="field-textarea"
                placeholder="Leak location, roof age, visible damage, and preferred timing."
              />
            </label>

            <button type="submit" className="btn-primary w-full">
              Request inspection
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="site-container">
      {!isInspectionRoute ? (
        <div className="footer-cta">
          <div className="footer-cta-copy">
            <p className="footer-cta-kicker">Need a clear next step?</p>
            <h2 className="footer-cta-title">Call for triage or request an inspection.</h2>
            <p className="footer-cta-body">
              We review the issue, confirm the right scope, and make sure the recommendation is written before crew day.
            </p>
          </div>

          <div className="footer-cta-actions">
            <a href="tel:16475550164" className="btn-secondary">
              Call for triage
            </a>
            <a href="/inspection" className="btn-secondary">
              Request inspection
            </a>
          </div>
        </div>
      ) : null}

      <div className="footer-grid">
        <div>
          <p className="footer-brand">Blackridge Roofing &amp; Exteriors</p>
          <p className="footer-meta">Residential roofing and exterior support across Toronto and Durham.</p>
        </div>
        <div className="footer-links">
          {navItems.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div>
          <p className="footer-meta">Licensed and insured. Warranty and scope details provided in writing.</p>
          <p className="footer-meta">Copyright {new Date().getFullYear()} Blackridge Roofing &amp; Exteriors.</p>
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
      <Header activeSection={activeSection} isInspectionRoute={isInspectionRoute} />
      <main className="flex-1">
        <Hero />
        <Proof />
        <Services />
        <Process />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
