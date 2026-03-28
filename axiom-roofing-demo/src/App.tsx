import React, { useEffect, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  id: string;
};

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  titleClassName?: string;
  className?: string;
};

type Stat = {
  value: string;
  label: string;
};

type ServiceCard = {
  label: string;
  title: string;
  summary: string;
  bullets: string[];
};

type ProcessStep = {
  step: string;
  title: string;
  desc: string;
};

type ProofStat = {
  label: string;
  value: string;
};

type ProofNote = {
  title: string;
  desc: string;
};

type MaterialGroup = {
  label: string;
  items: string[];
};

type ChecklistItem = {
  title: string;
  desc: string;
};

const phoneNumber = '+1 (647) 555-0164';
const phoneHref = 'tel:+16475550164';

const navItems: NavItem[] = [
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Systems', href: '#systems', id: 'systems' },
  { label: 'Coverage', href: '#coverage', id: 'coverage' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const heroStats: Stat[] = [
  { value: '24h', label: 'response target' },
  { value: 'Photo-backed', label: 'scope' },
  { value: 'Toronto + Durham', label: 'coverage' },
];

const trustPoints: Array<{ label: string; value: string }> = [
  { label: 'Roof systems', value: 'Shingle, flat roof, and low-slope support' },
  { label: 'Response', value: 'Storm triage and inspection-first scheduling' },
  { label: 'Documentation', value: 'Photos, notes, and a clear next step' },
  { label: 'Closeout', value: 'Cleanup, timing, and follow-up before we leave' },
];

const services: ServiceCard[] = [
  {
    label: '01',
    title: 'Roof inspections and leak tracing',
    summary: 'Find the source before anyone starts guessing.',
    bullets: ['Source-first diagnosis', 'Flashings, valleys, and penetrations', 'Photo-backed report with next steps'],
  },
  {
    label: '02',
    title: 'Repair and replacement planning',
    summary: 'Translate roof condition into a scope you can use.',
    bullets: ['Repair-first when the roof still has life', 'Cleaner tear-off and ventilation planning', 'Replacement timing that matches the condition'],
  },
  {
    label: '03',
    title: 'Storm response and protection',
    summary: 'Temporary protection when wind or hail moves fast.',
    bullets: ['Tarp and leak control', 'Insurance-ready documentation', 'Triage that prioritizes the active failure'],
  },
];

const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Read the roof',
    desc: 'We look for the actual failure point and document the surrounding condition instead of relying on a quick visual guess.',
  },
  {
    step: '02',
    title: 'Define the scope',
    desc: 'You get a repair, monitor, or replace recommendation in plain language so the next decision is easier to make.',
  },
  {
    step: '03',
    title: 'Schedule with weather',
    desc: 'Crews are booked around weather windows and material readiness so the work stays controlled once it starts.',
  },
  {
    step: '04',
    title: 'Close it out cleanly',
    desc: 'Cleanup, final photos, and follow-up guidance happen before we leave, not as an afterthought.',
  },
];

const proofStats: ProofStat[] = [
  { label: 'Inspection result', value: 'Lifted shingles and worn wall flashing were isolated as the likely source.' },
  { label: 'Scope', value: 'Targeted repair and temporary protection were recommended first.' },
  { label: 'Outcome', value: 'The client received a photo report and a realistic replacement horizon.' },
];

const proofNotes: ProofNote[] = [
  {
    title: 'What changed',
    desc: 'The valley, edge details, and exposed fasteners were tightened so the failure point stopped spreading.',
  },
  {
    title: 'What stayed',
    desc: 'Sound sections of the roof were left alone instead of being pulled into a bigger scope too early.',
  },
  {
    title: 'What came next',
    desc: 'The client got a repair-first estimate and a clear sense of when replacement would actually make sense.',
  },
];

const materialGroups: MaterialGroup[] = [
  {
    label: 'Shingle systems',
    items: ['CertainTeed', 'GAF', 'Owens Corning', 'IKO'],
  },
  {
    label: 'Low-slope assemblies',
    items: ['EPDM', 'TPO', 'Modified bitumen', 'Drainage detailing'],
  },
  {
    label: 'Critical details',
    items: ['Ice & water', 'Drip edge', 'Ventilation', 'Flashing'],
  },
];

const coverageAreas = [
  'Toronto',
  'East York',
  'Scarborough',
  'North York',
  'Etobicoke',
  'Vaughan',
  'Markham',
  'Durham Region',
];

const checklistItems: ChecklistItem[] = [
  {
    title: 'Roof edges and ridge lines',
    desc: 'We check the parts of the roof where wind and water usually begin to win.',
  },
  {
    title: 'Flashings at walls and penetrations',
    desc: 'Chimneys, skylights, vents, and sidewalls are where many leaks actually start.',
  },
  {
    title: 'Valleys, seams, and fastener lift',
    desc: 'We look for movement, separation, and wear before they become a larger failure.',
  },
  {
    title: 'Drainage and overflow paths',
    desc: 'Eavestroughs, scuppers, and downspouts should move water away instead of adding pressure.',
  },
  {
    title: 'Ventilation and moisture signs',
    desc: 'Heat, attic moisture, and airflow issues can shorten a roof life even when shingles still look fine.',
  },
  {
    title: 'Cleanup and closeout',
    desc: 'You should know what was protected, what was repaired, and what still needs attention.',
  },
];

const contactExpectations = [
  'Initial response within one business day',
  'Scope matched to the roof issue, not a generic intake flow',
  'Clear recommendation before any work is scheduled',
];

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  copy,
  titleClassName = '',
  className = '',
}) => (
  <div className={className}>
    <p className="section-kicker">{eyebrow}</p>
    <h2 className={`section-title ${titleClassName}`.trim()}>{title}</h2>
    {copy ? <p className="section-copy">{copy}</p> : null}
  </div>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path
      d="M4.5 10.5L8.1 14L15.5 6.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RoofMark: React.FC = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12.5L12 6L20 12.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11.5V19H17V11.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header: React.FC<{ activeSection: string }> = ({ activeSection }) => (
  <header className="sticky top-0 z-50">
    <div className="border-b border-white/6 bg-[#120f0d]/90 backdrop-blur-xl">
      <div className="site-container flex min-h-9 items-center justify-between gap-4 py-2">
        <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-stone-300">
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          Active leak or storm damage? Call first for triage.
        </p>
        <p className="hidden text-[11px] font-mono uppercase tracking-[0.22em] text-stone-500 lg:block">
          Toronto &amp; Durham Region
        </p>
      </div>
    </div>

    <div className="border-b border-white/8 bg-surface-base/88 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="site-container flex min-h-[72px] items-center gap-4 py-3">
        <a href="#top" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ember-500/20 bg-ember-500/10 text-ember-300">
            <RoofMark />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold tracking-tight text-white">Summit Roofing</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Toronto &amp; Durham Region
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
          Request inspection
        </a>
      </div>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section id="top" className="section-shell scroll-mt-32 pt-14 md:pt-20">
    <div className="site-container grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
      <div className="max-w-2xl">
        <div className="hero-pill">Licensed and insured | Toronto &amp; Durham Region</div>

        <h1 className="mt-6 max-w-[11ch] text-[clamp(3.25rem,8vw,6.25rem)] font-serif font-semibold leading-[0.9] tracking-[-0.06em] text-white text-balance">
          Roofing work with a clearer answer before the crew ever starts.
        </h1>

        <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-8 text-stone-300 text-balance">
          Summit Roofing handles inspections, leak tracing, repair planning, storm response, and replacement support with
          less noise and a more usable scope.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#contact" className="btn-primary">
            Request inspection
          </a>
          <a href={phoneHref} className="btn-secondary">
            Call for leak triage
          </a>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.06] sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="bg-surface-card/90 px-5 py-4">
              <p className="text-[1.65rem] font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-stone-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-ember-500/10 blur-[80px]" />

        <article className="site-card relative overflow-hidden p-4 md:p-5">
          <div className="overflow-hidden rounded-[24px] border border-white/8 bg-surface-elevated">
            <div className="relative aspect-[4/5]">
              <picture>
                <source srcSet="/roofing-concept.webp" type="image/webp" />
                <img
                  src="/roofing-concept.jpg"
                  alt="Residential roof repair in progress"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 26%' }}
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c]/55 via-transparent to-transparent" />

              <div className="absolute left-4 top-4 rounded-full border border-ember-500/20 bg-[#110f0d]/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ember-300 backdrop-blur-md">
                Inspection-first scope
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-white/10 bg-[#11100f]/82 p-4 backdrop-blur-md">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">Source</p>
                    <p className="mt-2 text-[14px] leading-6 text-white">Found before any broader work was sold.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">Timing</p>
                    <p className="mt-2 text-[14px] leading-6 text-white">Priority triage for active leaks and storm lift.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">Next step</p>
                    <p className="mt-2 text-[14px] leading-6 text-white">Repair-first when the roof still has life left.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
);

const TrustStrip: React.FC = () => (
  <div className="px-4 pb-8 sm:px-6 lg:px-8">
    <div className="site-container">
      <div className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03] backdrop-blur-sm">
        <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.label} className="bg-surface-base/35 px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">{point.label}</p>
              <p className="mt-3 text-[15px] leading-7 text-white">{point.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Services: React.FC = () => (
  <section id="services" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Services"
        title="Three core paths, presented without the clutter."
        titleClassName="max-w-[14ch]"
        copy="Most roofing jobs fall into a repair, replacement, or storm-response decision. The page should make that path obvious right away."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.label} className="site-card h-full p-7 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember-300/70">
              Service {service.label}
            </p>
            <h3 className="mt-4 text-[1.45rem] font-serif font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              {service.title}
            </h3>
            <p className="mt-4 max-w-[28ch] text-[15px] leading-7 text-stone-300">{service.summary}</p>
            <ul className="mt-6 space-y-3 text-[15px] leading-7 text-stone-300">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400/80" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Process: React.FC = () => (
  <section id="process" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Process"
        title="A tighter sequence from first look to final closeout."
        titleClassName="max-w-[15ch]"
        copy="Each phase is framed to reduce ambiguity, keep crews aligned, and make the next decision simpler."
      />

      <article className="site-card mt-12 overflow-hidden">
        {processSteps.map((step, index) => (
          <div
            key={step.step}
            className={`grid gap-4 px-6 py-6 md:grid-cols-[0.18fr_0.32fr_0.5fr] md:items-start md:px-7 ${
              index > 0 ? 'border-t border-white/6' : ''
            }`}
          >
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-ember-300/75">{step.step}</p>
            <h3 className="text-[1.18rem] font-serif font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              {step.title}
            </h3>
            <p className="text-[15px] leading-7 text-stone-300">{step.desc}</p>
          </div>
        ))}
      </article>
    </div>
  </section>
);

const Proof: React.FC = () => (
  <section id="work" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Recent work"
        title="A recent scope, shown as a decision path."
        titleClassName="max-w-[15ch]"
        copy="Proof should help a homeowner understand what changed, what stayed, and why the recommendation made sense."
      />

      <article className="site-card mt-12 overflow-hidden">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative min-h-[22rem] lg:min-h-full">
            <picture>
              <source srcSet="/roofing-concept.webp" type="image/webp" />
              <img
                src="/roofing-concept.jpg"
                alt="Roof inspection and repair work on a residential roof"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 22%' }}
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c]/55 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-[#110f0d]/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-stone-200 backdrop-blur-md">
              Photo-backed scope
            </div>
          </div>

          <div className="p-7 md:p-9 lg:p-10">
            <p className="section-kicker">Representative inspection</p>
            <h3 className="mt-4 max-w-[12ch] text-[clamp(1.85rem,3.2vw,2.8rem)] font-serif font-semibold leading-[0.98] tracking-[-0.05em] text-white text-balance">
              Leak tracing with a repair-first recommendation.
            </h3>
            <p className="mt-5 max-w-[34rem] text-[16px] leading-8 text-stone-300">
              The roof looked broadly tired, but the inspection narrowed the issue to lifted shingles, wall flashing, and a
              valley detail that had started to move. The client got a tighter scope instead of a premature tear-off.
            </p>

            <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.06] sm:grid-cols-3">
              {proofStats.map((stat) => (
                <div key={stat.label} className="bg-surface-card/90 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">{stat.label}</p>
                  <p className="mt-3 text-[14px] leading-7 text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {proofNotes.map((note) => (
                <div key={note.title}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ember-300/75">{note.title}</p>
                  <p className="mt-2 text-[15px] leading-7 text-stone-300">{note.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
);

const Systems: React.FC = () => (
  <section id="systems" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Systems"
        title="Materials and assemblies are chosen after the roof is actually read."
        titleClassName="max-w-[15ch]"
        copy="Different roofs need different assemblies. The recommendation should follow the inspection, not the brochure."
      />

      <article className="site-card mt-12 p-7 md:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <h3 className="text-[1.45rem] font-serif font-semibold leading-[1.03] tracking-[-0.04em] text-white">
              The assembly should match the condition, the weather, and the budget.
            </h3>
            <p className="mt-5 max-w-[34rem] text-[15px] leading-7 text-stone-300">
              We specify shingle systems, low-slope membranes, flashing, and edge details in a way that keeps the roof
              readable for the homeowner and buildable for the crew.
            </p>

            <ul className="mt-6 space-y-3 text-[15px] leading-7 text-stone-300">
              {['Roof condition first', 'Weather window second', 'Clean finish and follow-up last'].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ember-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {materialGroups.map((group) => (
              <div key={group.label}>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">{group.label}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[13px] text-stone-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  </section>
);

const Coverage: React.FC = () => (
  <section id="coverage" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Coverage"
        title="We keep the service area easy to scan."
        titleClassName="max-w-[14ch]"
        copy="Jobs are grouped by geography and urgency so the schedule stays practical when the weather turns."
      />

      <article className="site-card mt-12 p-7 md:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <div>
            <h3 className="text-[1.45rem] font-serif font-semibold leading-[1.03] tracking-[-0.04em] text-white">
              Toronto and surrounding areas stay straightforward to read.
            </h3>
            <p className="mt-5 max-w-[32rem] text-[15px] leading-7 text-stone-300">
              If the roof is actively leaking or recently damaged, the first move is to get the issue into the right
              inspection queue and avoid wasting time on the wrong scope.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {coverageAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[13px] text-stone-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {[
              'Share the property address and the issue you are seeing.',
              'We place the job in the right inspection or storm-response slot.',
              'You receive a photo-backed recommendation before the work moves forward.',
            ].map((item, index) => (
              <div key={item} className={`flex gap-4 ${index > 0 ? 'border-t border-white/6 pt-5' : ''}`}>
                <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-ember-300/75">
                  0{index + 1}
                </p>
                <p className="max-w-[34rem] text-[15px] leading-7 text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  </section>
);

const Checklist: React.FC = () => (
  <section id="checklist" className="section-shell scroll-mt-32">
    <div className="section-inner">
      <SectionHeading
        eyebrow="Pre-job checklist"
        title="What gets checked before any recommendation goes out."
        titleClassName="max-w-[15ch]"
        copy="This is the practical part of the page. Fewer assumptions, more signals, and a cleaner read on the roof."
      />

      <article className="site-card mt-12 p-7 md:p-9">
        <div className="grid gap-6 md:grid-cols-2">
          {checklistItems.map((item) => (
            <div key={item.title} className="flex gap-4">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ember-300" />
              <div>
                <h3 className="text-[1.1rem] font-serif font-semibold leading-tight tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-stone-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  </section>
);

const StormCTA: React.FC = () => (
  <section className="section-shell">
    <div className="section-inner">
      <article className="overflow-hidden rounded-[32px] border border-ember-500/18 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(30,27,24,0.96)_42%,rgba(15,14,13,0.98))] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="section-kicker">Storm response</p>
            <h2 className="mt-4 max-w-[12ch] text-[clamp(2.2rem,4vw,3.6rem)] font-serif font-semibold leading-[0.95] tracking-[-0.05em] text-white text-balance">
              Active leak, wind lift, or hail damage?
            </h2>
            <p className="mt-5 max-w-[42rem] text-[16px] leading-8 text-stone-300">
              Call first if the roof is still moving water or the weather has already done visible damage. The quickest
              move is often temporary protection and a direct read on whether repair or replacement planning comes next.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href={phoneHref} className="btn-primary">
              Call {phoneNumber}
            </a>
            <a href="#contact" className="btn-secondary">
              Request inspection
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
);

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="section-shell scroll-mt-32 pb-24 md:pb-28">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Contact"
          title="Request an estimate or inspection."
          titleClassName="max-w-[12ch]"
          copy="Tell us what you are seeing. We will reply with the right next step instead of a generic intake script."
        />

        <article className="site-card mt-12 overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/6 bg-white/[0.02] p-7 md:p-9 lg:border-b-0 lg:border-r">
              <p className="section-kicker">What to expect</p>
              <p className="mt-4 max-w-[26rem] text-[15px] leading-7 text-stone-300">
                The goal is to make the next step obvious before the work starts. That keeps the scope tighter and the
                conversation calmer.
              </p>

              <div className="mt-8 space-y-4">
                {contactExpectations.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ember-300" />
                    <span className="text-[15px] leading-7 text-stone-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/6 pt-6 text-[14px] leading-7 text-stone-400">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">Call</p>
                <a href={phoneHref} className="mt-2 inline-flex text-white">
                  {phoneNumber}
                </a>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">Service area</p>
                <p className="mt-2 text-stone-300">Toronto, Durham Region, and nearby communities.</p>
              </div>
            </div>

            <div className="p-7 md:p-9">
              {submitted ? (
                <div className="flex h-full flex-col justify-center rounded-[28px] border border-ember-500/18 bg-ember-500/8 p-8 md:p-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/25 bg-ember-500/12 text-ember-300">
                    <CheckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-[clamp(1.8rem,3vw,2.4rem)] font-serif font-semibold leading-[0.98] tracking-[-0.04em] text-white">
                    Request received.
                  </h3>
                  <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-stone-300">
                    We will reach out within one business day to confirm the issue, the right inspection slot, and the
                    next step.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a href={phoneHref} className="btn-secondary">
                      Call now
                    </a>
                    <a href="#services" className="btn-primary">
                      Review services
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="field-label" htmlFor="full-name">
                        Full name
                      </label>
                      <input
                        id="full-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        required
                        className="field-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="field-label" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Best number to reach you"
                        required
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="field-label" htmlFor="address">
                      Property address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="Street address or nearest intersection"
                      className="field-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="field-label" htmlFor="issue">
                      What is happening?
                    </label>
                    <textarea
                      id="issue"
                      name="issue"
                      rows={6}
                      placeholder="Leak location, storm damage, missing shingles, age of the roof, or anything else that matters."
                      required
                      className="field-textarea"
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-sm text-sm leading-6 text-stone-400">
                      Inspection requests are reviewed manually so the response matches the issue instead of a generic
                      intake flow.
                    </p>
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      Request inspection
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="px-4 pb-12 sm:px-6 lg:px-8">
    <div className="site-container border-t border-white/8 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[1.05rem] font-semibold tracking-tight text-white">Summit Roofing Co.</p>
          <p className="mt-2 max-w-[32rem] text-[15px] leading-7 text-stone-400">
            Roofing inspections, repairs, replacement planning, and storm response across Toronto and Durham Region.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-stone-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-stone-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Licensed and insured
          </span>
          <span>Copyright {new Date().getFullYear()} Summit Roofing Co.</span>
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
      const offset = window.scrollY + 220;
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
        <TrustStrip />
        <Services />
        <Process />
        <Proof />
        <Systems />
        <Coverage />
        <Checklist />
        <StormCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
