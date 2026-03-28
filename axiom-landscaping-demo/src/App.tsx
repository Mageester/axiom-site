import { useState } from 'react';

const primaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full bg-grove-400 px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0b100a] transition-colors duration-200 hover:bg-grove-300 active:scale-[0.98]';
const secondaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98]';
const subtleButton =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]';
const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-surface-base/90 px-4 py-3 text-[16px] text-white outline-none transition-colors placeholder:text-stone-600 focus:border-grove-400/50';
const labelClass = 'text-[13px] font-medium uppercase tracking-[0.22em] text-stone-400';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Proof', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const heroPoints = [
  'Toronto and West GTA',
  'Photo-first quote review',
  'Site visits by appointment',
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
    title: 'Set the plan',
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
    <div className="hidden border-b border-white/5 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-500 sm:px-6 lg:px-8">
        <p>Residential landscaping and outdoor living for Toronto homes</p>
        <div className="flex items-center gap-4">
          <span>Toronto and West GTA</span>
          <a href="tel:+16475550139" className="text-stone-300 transition-colors hover:text-white">
            +1 (647) 555-0139
          </a>
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 py-4 sm:py-5">
        <a href="#top" className="flex items-center gap-3">
          <BrandMark />
          <div>
          <div className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">
              Northline Landscaping
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Toronto & West GTA</div>
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
      <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-grove-400/8 blur-[140px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>

    <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
      <div className="relative z-10 max-w-2xl">
        <p className={`${labelClass} animate-rise-in`}>Residential landscaping and outdoor living</p>
        <h1 className="animate-rise-in-delay-1 mt-6 font-serif text-[clamp(3rem,6vw,5.9rem)] leading-[0.95] tracking-tight text-white text-balance">
          Outdoor rooms that make the property feel finished.
        </h1>
        <p className="animate-rise-in-delay-2 mt-6 max-w-xl text-[18px] leading-8 text-stone-300 sm:text-[19px]">
          Northline shapes patios, planting, lighting, and front-approach work for Toronto homes that need
          more structure, more clarity, and a cleaner finish.
        </p>

        <div className="animate-rise-in-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#contact" className={primaryButton}>
            Request a quote
          </a>
          <a href="#projects" className={secondaryButton}>
            View projects
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
        <p className="mt-4 text-[14px] text-stone-500">
          Quotes shaped around finish level, not a generic package.
        </p>
      </div>

      <div className="relative z-10 animate-rise-in-delay-3">
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
              alt="Premium residential exterior with a finished patio, planting, and outdoor living structure"
              className="h-[clamp(420px,58vw,760px)] w-full object-cover object-center"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 max-w-md">
            <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">Selected work</p>
            <p className="mt-2 text-[15px] leading-7 text-white/90">
              A property feels settled when the approach, gathering space, planting, and light read as
              one composition.
            </p>
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
            label="What homeowners need"
            title="The work homeowners actually need."
            body="We focus on the parts of the property that change how a home feels from the street and from the back door."
          />

          <a href="#contact" className={`${secondaryButton} mt-8`}>
            Tell us what needs attention
          </a>
        </div>

        <div className="border-y border-white/8">
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

const ComparisonStudy = () => {
  const [compare, setCompare] = useState(58);

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-xl">
          <SectionHeading
            label="Transformation proof"
            title="The strongest proof is a finished property."
            body="A before-and-after only matters if it shows how the yard changed: structure, planting, circulation, and evening presence."
          />

          <div className="mt-10 space-y-4 border-l border-white/10 pl-5">
            {processSteps.map((step) => (
              <div key={step.title} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-grove-400" />
                <span>
                  <span className="block font-medium text-white">{step.title}</span>
                  <span className="block text-stone-300">{step.copy}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-surface-card/70 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="relative h-[clamp(26rem,56vw,42rem)]">
              <picture>
                <source type="image/webp" srcSet="/images/work-landscaping-640.webp 640w, /images/work-landscaping-960.webp 960w, /images/work-landscaping-1200.webp 1200w" sizes="(min-width: 1280px) 720px, (min-width: 1024px) 52vw, 100vw" />
                <img
                  src="/images/work-landscaping-1200.webp"
                  alt="Finished residential outdoor living space with patio, planting, and clean circulation"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ objectPosition: 'center 54%' }}
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
              >
                <img
                  src="/images/landscaping-concept.webp"
                  alt="Before treatment of the same outdoor living project"
                  className="absolute inset-0 h-full w-full object-cover object-center scale-[1.04] grayscale brightness-[0.55] contrast-[0.85] saturate-0"
                  style={{ objectPosition: 'center 42%' }}
                />
                <div className="absolute inset-0 bg-[#10140f]/60" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,9,0.12),rgba(10,12,9,0.72))]" />
              </div>

              <div className="absolute inset-y-0" style={{ left: `${compare}%`, transform: 'translateX(-50%)' }}>
                <div className="h-full w-px bg-white/45" />
                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  Compare
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={compare}
                onChange={(event) => setCompare(Number(event.target.value))}
                aria-label="Before and after comparison slider"
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
              />

              <div className="absolute left-4 top-4">
                <span className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-stone-200 backdrop-blur-md">
                  Before
                </span>
              </div>
              <div className="absolute right-4 top-4">
                <span className="inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-stone-200 backdrop-blur-md">
                  After
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <div className="max-w-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">
                    Transformation proof
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-white/90">
                    A yard becomes easier to read when the path, gathering space, planting, and light are
                    treated as one composition.
                  </p>
                </div>
                <div className="hidden text-right text-[11px] uppercase tracking-[0.24em] text-stone-300/70 sm:block">
                  Drag to compare
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="text-[12px] uppercase tracking-[0.26em] text-stone-500">
              Etobicoke residence
            </div>
            <div className="text-[12px] uppercase tracking-[0.26em] text-stone-500">
              Patio, planting, and lighting sequence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => (
  <section id="projects" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Recent work"
          title="Project scope is easier to trust when the finish is obvious."
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

          <article className="rounded-[30px] border border-white/8 bg-surface-card/40 p-6 sm:p-7">
              <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">
                What the sequence changes
              </p>
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

      <div className="border-y border-white/8 py-4 sm:py-6">
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
    <div className="mx-auto max-w-7xl border-y border-white/8 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <SectionHeading
          label="Service area"
          title="Residential work across Toronto and the West GTA."
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
    <div className="mx-auto max-w-7xl border-y border-white/8 py-20">
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
              body="Share the address, the area you want to improve, and the timing. Northline reviews fit, finish expectations, and whether a site visit makes sense."
            />

            <div className="mt-8 space-y-4">
              {[
                'Patios and outdoor rooms',
                'Front approaches and curb appeal',
                'Planting and lighting details',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                  <span className="mt-2 h-2 w-2 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="tel:+16475550139" className={secondaryButton}>
                Call +1 (647) 555-0139
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
                  We will review your note and follow up with the next step.
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
                  Request a quote
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
                Northline Landscaping
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Outdoor living</div>
            </div>
          </a>
          <p className="mt-5 max-w-xl text-[16px] leading-7 text-stone-300">
            Northline designs patios, planting, lighting, and outdoor rooms that feel complete.
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
            <p>+1 (647) 555-0139</p>
            <p>
              <a href="mailto:quotes@northlinelandscaping.ca" className="transition-colors hover:text-white">
                quotes@northlinelandscaping.ca
              </a>
            </p>
            <p>Toronto and West GTA. Outdoor rooms, patios, planting, and lighting.</p>
            <p>Site visits by appointment.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-stone-500">© {new Date().getFullYear()} Northline Landscaping.</p>
        <p className="text-[13px] text-stone-600">
          Residential landscaping and outdoor living across Toronto and the West GTA.
        </p>
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
        <ComparisonStudy />
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
