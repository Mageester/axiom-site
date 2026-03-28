import { useState } from 'react';

const primaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full bg-grove-500 px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:bg-grove-400 active:scale-[0.98]';
const secondaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/12 bg-transparent px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:border-white/25 hover:bg-white/5 active:scale-[0.98]';
const subtleButton =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 px-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/5';
const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-surface-base/90 px-4 py-3 text-[16px] text-white outline-none transition-colors placeholder:text-stone-600 focus:border-grove-400/50';
const labelClass = 'text-[13px] font-medium uppercase tracking-[0.22em] text-stone-400';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'Contact', href: '#contact' },
];

const heroPoints = [
  'Patios and outdoor rooms',
  'Front entry and curb appeal',
  'Planting, lighting, finish work',
];

const services = [
  {
    number: '01',
    title: 'Patios and outdoor rooms',
    copy: 'Dining terraces, lounge zones, and hardscape layouts that feel built for daily use, not just photos.',
    detail: 'Entertaining, family time, and better flow',
  },
  {
    number: '02',
    title: 'Front approaches and curb appeal',
    copy: 'Walkways, steps, edging, and planting that make the home read better from the street.',
    detail: 'Entry sequence and first impression',
  },
  {
    number: '03',
    title: 'Planting and softscape',
    copy: 'Layered planting plans, privacy screening, and low-maintenance structure that ages well.',
    detail: 'Seasonal color and softer boundaries',
  },
  {
    number: '04',
    title: 'Landscape lighting and finishing details',
    copy: 'Low-voltage lighting, final edges, and the quiet finishing work that makes the whole property feel complete.',
    detail: 'Evening use and long-term polish',
  },
];

const processSteps = [
  {
    title: 'Walk the site',
    copy: 'We look at access, drainage, sun exposure, traffic flow, and the spots where the property feels unfinished.',
  },
  {
    title: 'Shape the scope',
    copy: 'You get a clear plan for materials, sequencing, and what should happen now versus later.',
  },
  {
    title: 'Build and finish',
    copy: 'We install, refine, plant, and light the space so the final result feels intentional instead of patched together.',
  },
];

const materials = [
  {
    title: 'Natural stone and paver systems',
    copy: 'Durable surfaces that suit the style of the home and the way the space is used.',
  },
  {
    title: 'Composite decking and outdoor structures',
    copy: 'Clean lines and reliable performance where decking, seating, or overhead structure makes sense.',
  },
  {
    title: 'Low-voltage lighting',
    copy: 'A controlled evening read without harsh fixtures or overlighting.',
  },
  {
    title: 'Native and low-maintenance planting',
    copy: 'Structure, seasonality, and fewer maintenance headaches once the project is finished.',
  },
  {
    title: 'Drainage and grading',
    copy: 'The quiet work that protects the finish and keeps the space functional through the seasons.',
  },
];

const coverage = [
  'Toronto',
  'Etobicoke',
  'North York',
  'Mississauga',
  'Oakville',
  'Burlington',
  'Vaughan',
  'West GTA suburbs',
];

const checklist = [
  'How the front of the house reads from the street',
  'Where people gather, move, and enter the yard',
  'How water behaves after rain and snowmelt',
  'What should be planted now versus phased later',
  'Where lighting will matter after dark',
  'How much maintenance you want the space to ask for',
];

const SectionHeading = ({
  label,
  title,
  body,
  align = 'left',
}: {
  label: string;
  title: string;
  body: string;
  align?: 'left' | 'center';
}) => (
  <div className={align === 'center' ? 'mx-auto text-center' : ''}>
    <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.28em] text-grove-300/70">
      {label}
    </p>
    <h2
      className={`mt-4 font-serif text-[clamp(2.3rem,4vw,4.15rem)] leading-[0.98] tracking-tight text-white text-balance ${
        align === 'center' ? 'mx-auto max-w-4xl' : 'max-w-3xl'
      }`}
    >
      {title}
    </h2>
    <p
      className={`mt-6 text-[17px] leading-8 text-stone-300 ${
        align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-2xl'
      }`}
    >
      {body}
    </p>
  </div>
);

const BrandMark = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-grove-500/10 text-grove-300 shadow-inner shadow-black/30">
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17.2 12 5l5 12.2" />
      <path d="M9.1 12.1h5.8" />
    </svg>
  </div>
);

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-white/8 bg-surface-base/80 backdrop-blur-xl">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 py-4 sm:py-5">
        <a href="#top" className="flex items-center gap-3">
          <BrandMark />
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">
              Verdant Landscapes
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Outdoor living</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-stone-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={primaryButton}>
          Request a quote
        </a>
      </div>

      <div className="pb-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={subtleButton}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
    <div className="absolute inset-x-0 top-0 h-[760px]">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-grove-500/10 blur-3xl" />
      <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-emerald-400/5 blur-[140px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>

    <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
      <div className="relative z-10 max-w-2xl">
        <p className={labelClass}>Premium residential landscaping</p>
        <h1 className="mt-6 font-serif text-[clamp(3rem,6vw,5.9rem)] leading-[0.95] tracking-tight text-white text-balance">
          Outdoor rooms, front entries, and planting that make a home feel finished.
        </h1>
        <p className="mt-6 max-w-xl text-[18px] leading-8 text-stone-300 sm:text-[19px]">
          We shape patios, curb appeal, low-voltage lighting, and softscape details into spaces homeowners can
          actually live in. The work stays premium, practical, and easy to maintain.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#contact" className={primaryButton}>
            Request a quote
          </a>
          <a href="#projects" className={secondaryButton}>
            See recent work
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-stone-300">
          {heroPoints.map((point) => (
            <span key={point} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-grove-400" />
              {point}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[14px] text-stone-500">Residential projects across the Greater Toronto Area.</p>
      </div>

      <div className="relative z-10">
        <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-surface-card shadow-2xl shadow-black/35">
          <picture>
            <source
              type="image/avif"
              srcSet="/images/work-landscaping-640.avif 640w, /images/work-landscaping-960.avif 960w, /images/work-landscaping-1200.avif 1200w"
            />
            <source
              type="image/webp"
              srcSet="/images/work-landscaping-640.webp 640w, /images/work-landscaping-960.webp 960w, /images/work-landscaping-1200.webp 1200w"
            />
            <img
              src="/images/work-landscaping-1200.webp"
              alt="Premium residential landscaping with planting, patio work, and a finished outdoor living area"
              className="h-[clamp(420px,58vw,760px)] w-full object-cover object-center"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md rounded-[24px] border border-white/10 bg-surface-base/75 px-4 py-3 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Selected work</p>
              <p className="mt-2 text-[15px] leading-7 text-white">
                A single yard becomes a usable sequence: approach, gathering area, planting, and light.
              </p>
            </div>
            <div className="hidden rounded-[24px] border border-white/10 bg-surface-base/75 px-4 py-3 text-right backdrop-blur-md sm:block">
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">What homeowners ask for</p>
              <p className="mt-1 text-[15px] leading-6 text-stone-200">Clear scope · Strong curb appeal · Clean finish</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mx-auto mt-10 max-w-7xl border-y border-white/8 py-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-stone-300">
        <span className="font-medium text-white">Residential focus</span>
        <span className="text-stone-600">•</span>
        <span>Patios, outdoor rooms, and front-entry upgrades</span>
        <span className="text-stone-600">•</span>
        <span>Planting, low-voltage lighting, and finish work</span>
        <span className="text-stone-600">•</span>
        <span>Site visits by appointment</span>
      </div>
    </div>
  </section>
);

const Services = () => (
  <section id="services" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="max-w-xl">
          <SectionHeading
            label="What we handle"
            title="The work homeowners actually need."
            body="We focus on the parts of the property that change how a home feels from the street and from the back door."
          />

          <a href="#contact" className={`${secondaryButton} mt-8`}>
            Tell us your scope
          </a>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/8 bg-surface-card/65">
          {services.map((service, index) => (
            <article
              key={service.number}
              className={`grid gap-4 px-5 py-6 sm:grid-cols-[90px_1fr] sm:gap-6 sm:px-7 sm:py-7 ${
                index < services.length - 1 ? 'border-b border-white/8' : ''
              }`}
            >
              <div className="flex items-center gap-3 sm:block">
                <span className="text-[12px] uppercase tracking-[0.32em] text-grove-300/70">{service.number}</span>
              </div>

              <div>
                <h3 className="text-[21px] font-medium tracking-tight text-white sm:text-[23px]">{service.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-stone-300 sm:text-[16px]">{service.copy}</p>
                <p className="mt-3 text-[13px] uppercase tracking-[0.2em] text-stone-500">{service.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Process = () => (
  <section className="px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
        <SectionHeading
          label="How the work moves"
          title="A clear process, not a vague promise."
          body="We keep the early stage practical: site conditions, scope, materials, and the sequence of work are all discussed before the build starts."
        />

        <div className="overflow-hidden rounded-[32px] border border-white/8 bg-surface-card/55">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className={`grid gap-4 px-5 py-6 sm:grid-cols-[96px_1fr] sm:gap-6 sm:px-7 sm:py-7 ${
                index < processSteps.length - 1 ? 'border-b border-white/8' : ''
              }`}
            >
              <div className="font-serif text-[2.8rem] leading-none tracking-tight text-grove-300/70">
                0{index + 1}
              </div>
              <div>
                <h3 className="text-[21px] font-medium tracking-tight text-white sm:text-[22px]">{step.title}</h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-stone-300 sm:text-[16px]">{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        label="Recent work"
        title="Project scope is easier to trust when the outcome is obvious."
        body="We present projects the way homeowners experience them: how the approach reads, how the yard functions, and what changed after the work was finished."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="group relative overflow-hidden rounded-[34px] border border-white/8 bg-surface-card shadow-2xl shadow-black/20">
          <picture>
            <source type="image/webp" srcSet="/images/work-landscaping-1200.webp" />
            <img
              src="/images/work-landscaping-1200.webp"
              alt="Featured residential landscape project with patio work, planting, and lighting"
              className="h-full min-h-[34rem] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Featured project</p>
            <h3 className="mt-3 max-w-2xl font-serif text-[clamp(1.9rem,3vw,3rem)] leading-[0.98] tracking-tight text-white text-balance">
              Patio, planting, and lighting brought into one sequence.
            </h3>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-stone-200/90">
              We reshaped the main outdoor area so the house, the entry, and the yard feel connected. The result is
              quieter, clearer, and easier to use at night.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Patio plane', 'Curb appeal', 'Night use'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-surface-base/65 px-3 py-1.5 text-[12px] uppercase tracking-[0.22em] text-stone-200 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          <article className="overflow-hidden rounded-[30px] border border-white/8 bg-surface-card/70">
            <img
              src="/images/landscaping-concept.webp"
              alt="Editorial landscape concept for a front approach and planting composition"
              className="h-56 w-full object-cover object-center"
              loading="lazy"
            />
            <div className="p-6 sm:p-7">
              <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Curb appeal</p>
              <h4 className="mt-3 text-[22px] font-medium tracking-tight text-white">
                A cleaner front approach from the street.
              </h4>
              <p className="mt-3 text-[15px] leading-7 text-stone-300">
                Sharper planting structure, softer transitions, and an entry sequence that feels deliberate.
              </p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.2em] text-stone-500">
                More presence without looking overbuilt.
              </p>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/8 bg-surface-card/55 p-6 sm:p-7">
            <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">What this means</p>
            <p className="mt-3 text-[18px] leading-8 text-white text-balance sm:text-[20px]">
              The best landscape work solves a sequence problem, not just a surface problem.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                'Better flow between the house and yard',
                'Lighting that reads cleanly after dark',
                'Planting that still makes sense in three years',
                'Edges and joints that feel intentional',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300">
                  <span className="mt-2 h-2 w-2 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
);

const Materials = () => (
  <section className="px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
      <SectionHeading
        label="Materials and systems"
        title="The right systems make the finish feel effortless."
        body="Good landscaping is usually won in the details: drainage, the paver system, planting structure, and lighting that belongs to the house."
      />

      <div className="rounded-[32px] border border-white/8 bg-surface-card/55 p-6 sm:p-8">
        <div className="divide-y divide-white/8">
          {materials.map((material) => (
            <div key={material.title} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-6">
              <h3 className="text-[18px] font-medium tracking-tight text-white">{material.title}</h3>
              <p className="text-[15px] leading-7 text-stone-300">{material.copy}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[14px] leading-7 text-stone-500">
          Built for Ontario conditions and chosen for durability first.
        </p>
      </div>
    </div>
  </section>
);

const Coverage = () => (
  <section id="coverage" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl rounded-[36px] border border-white/8 bg-surface-card/55 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <SectionHeading
          label="Service area"
          title="Residential work across the Greater Toronto Area."
          body="Site visits are scheduled by appointment. If you are a little outside the core area, ask anyway."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map((city) => (
            <div key={city} className="flex items-center gap-3 text-[16px] text-stone-200">
              <span className="h-2 w-2 rounded-full bg-grove-400" />
              <span>{city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Checklist = () => (
  <section className="px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl rounded-[36px] border border-white/8 bg-gradient-to-br from-surface-card/85 via-surface-card/70 to-grove-950/15 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">
        <SectionHeading
          label="Before we quote"
          title="We check the things that make the estimate honest."
          body="A useful quote starts with the part of the yard that feels off, not with a generic package."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <div key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
              <span className="mt-2 h-2 w-2 rounded-full bg-grove-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="scroll-mt-28 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-grove-500/12 bg-gradient-to-br from-surface-card/95 via-surface-card/80 to-grove-950/20 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-xl">
            <SectionHeading
              label="Request a quote"
              title="Tell us what feels unfinished."
              body="Share the address, the area you want to improve, and the timing. We’ll reply with the next step and whether a site visit makes sense."
            />

            <div className="mt-8 space-y-4">
              {[
                'Patios and outdoor rooms',
                'Front-yard and curb appeal upgrades',
                'Planting and lighting details',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                  <span className="mt-2 h-2 w-2 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="tel:1-800-555-0300" className={secondaryButton}>
                Call 1-800-555-0300
              </a>
              <p className="text-[14px] text-stone-500">No pressure. Short notes are fine.</p>
            </div>
          </div>

          <div className="relative">
            {submitted ? (
              <div className="rounded-[28px] border border-grove-500/20 bg-surface-base/80 p-8 text-center shadow-2xl shadow-black/20">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-grove-500/30 bg-grove-500/10 text-grove-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-5 text-[24px] font-semibold tracking-tight text-white">Request received.</h3>
                <p className="mt-3 text-[15px] leading-7 text-stone-300">
                  We’ll review your note and follow up with the next step.
                </p>
              </div>
            ) : (
              <form
                className="rounded-[28px] border border-white/8 bg-surface-base/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 lg:p-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>Full name</span>
                    <input type="text" required className={fieldClass} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>Phone or email</span>
                    <input type="text" required className={fieldClass} />
                  </label>
                </div>

                <label className="mt-4 flex flex-col gap-2">
                  <span className={labelClass}>Property address</span>
                  <input type="text" className={fieldClass} placeholder="Street and city" />
                </label>

                <label className="mt-4 flex flex-col gap-2">
                  <span className={labelClass}>Project notes</span>
                  <textarea
                    rows={5}
                    required
                    className={`${fieldClass} resize-none`}
                    placeholder="Tell us what you want to change, what the yard needs, and when you'd like to start."
                  />
                </label>

                <button type="submit" className={`${primaryButton} mt-6 w-full`}>
                  Request quote
                </button>
                <p className="mt-4 text-center text-[14px] text-stone-500">
                  If you know the rough size or timeline, include it.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-white/8 px-4 pb-8 pt-14 sm:pt-16">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:gap-12">
        <div>
          <a href="#top" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">
                Verdant Landscapes
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Outdoor living</div>
            </div>
          </a>
          <p className="mt-5 max-w-xl text-[16px] leading-7 text-stone-300">
            Premium residential landscaping for patios, planting, lighting, and outdoor rooms that feel complete.
          </p>
          <a href="#contact" className={`${primaryButton} mt-6`}>
            Request a quote
          </a>
        </div>

        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Navigation</p>
          <div className="mt-5 grid gap-3 text-[15px] text-stone-300">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Contact</p>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-stone-300">
            <p>1-800-555-0300</p>
            <p>Residential projects across the Greater Toronto Area.</p>
            <p>Site visits by appointment.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-stone-500">© {new Date().getFullYear()} Verdant Landscapes.</p>
        <p className="text-[13px] text-stone-600">Residential landscaping and outdoor living across the GTA.</p>
      </div>
    </div>
  </footer>
);

const App = () => (
  <div className="min-h-screen bg-surface-base text-stone-200">
    <Header />
    <main id="top">
      <Hero />
      <Services />
      <Process />
      <Projects />
      <Materials />
      <Coverage />
      <Checklist />
      <ContactForm />
    </main>
    <Footer />
  </div>
);

export default App;
