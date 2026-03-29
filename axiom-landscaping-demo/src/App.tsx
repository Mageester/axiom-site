import { useState } from 'react'

const primaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full bg-grove-400 px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0b100a] transition-colors duration-200 hover:bg-grove-300 active:scale-[0.98]'
const secondaryButton =
  'inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98]'
const subtleButton =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]'
const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-surface-base/90 px-4 py-3 text-[16px] text-white outline-none transition-colors placeholder:text-stone-600 focus:border-grove-400/50'
const labelClass = 'text-[13px] font-medium uppercase tracking-[0.22em] text-stone-400'

const imagery = {
  hero: 'https://images.pexels.com/photos/17240696/pexels-photo-17240696.jpeg?auto=compress&cs=tinysrgb&w=1900&h=1260&fit=crop',
  featured: 'https://images.pexels.com/photos/34037980/pexels-photo-34037980.jpeg?auto=compress&cs=tinysrgb&w=1500&h=1100&fit=crop',
  curbAppeal: 'https://images.pexels.com/photos/30196217/pexels-photo-30196217.jpeg?auto=compress&cs=tinysrgb&w=1300&h=980&fit=crop',
  afterDark: 'https://images.pexels.com/photos/35828688/pexels-photo-35828688.jpeg?auto=compress&cs=tinysrgb&w=1300&h=980&fit=crop',
  before: '/images/landscaping-before.webp',
  after: '/images/landscaping-after.webp',
}

const getPathname = () => {
  if (typeof window === 'undefined') {
    return '/'
  }

  const normalized = window.location.pathname.replace(/\/+$/, '')
  return normalized || '/'
}

const isQuoteRoute = getPathname() === '/quote'

const heroTitle = isQuoteRoute
  ? 'Quotes shaped around the finish, not a package.'
  : 'Outdoor spaces that finish the property.'

const heroCopy = isQuoteRoute
  ? 'Send a few photos and rough notes. We price the work around finish level and access, not a generic package.'
  : 'Northline designs patios, front entries, planting, and lighting for homeowners who want the house and yard to feel resolved together.'

const heroCardLabel = isQuoteRoute ? 'Quote review' : 'Selected work'
const heroCardCopy = isQuoteRoute
  ? 'Photos and access notes help us price the finish cleanly before a site visit.'
  : 'A property feels finished when the approach, the gathering space, and the evening read all agree.'

const proofTitle = isQuoteRoute
  ? 'One finished yard should explain the whole quote.'
  : 'One finished yard should explain the whole approach.'

const proofBody = isQuoteRoute
  ? 'The strongest proof is the difference between what the property felt like before and what the finished scope is designed to resolve.'
  : 'The strongest proof is the difference between what the property felt like before and what the home reads like after the work is finished.'

const servicesHeading = isQuoteRoute
  ? {
      label: 'Quote framing',
      title: 'A quote is based on finish, access, and site conditions.',
      body: 'We price the actual scope, not a generic yard package.',
    }
  : {
      label: 'Scope',
      title: 'Built around how the property is actually used.',
      body: 'Outdoor rooms, front entries, planting, and lighting are planned as one composition, not a stack of unrelated trades.',
    }

const contactHeading = isQuoteRoute
  ? {
      label: 'Request a quote',
      title: 'Send the notes and photos.',
      body: 'A few current images are enough to start. We will return the next step once the scope is clear.',
    }
  : {
      label: 'Request a quote',
      title: 'Tell us what feels unfinished, and what finished should look like.',
      body: 'Share a few notes and current photos. Address can follow once we confirm fit and finish expectations.',
    }

const navLinks = isQuoteRoute
  ? [
      { label: 'Scope', href: '#services' },
      { label: 'Proof', href: '#proof' },
      { label: 'Contact', href: '#contact' },
    ]
  : [
      { label: 'Services', href: '#services' },
      { label: 'Proof', href: '#proof' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ]

const services = [
  {
    number: '01',
    title: 'Outdoor rooms and patios',
    copy: 'Dining terraces, lounge zones, and grade transitions planned around how the yard is used every day.',
    detail: 'Circulation and gathering',
  },
  {
    number: '02',
    title: 'Front entries and curb appeal',
    copy: 'Walkways, steps, and planting that make arrival feel cleaner from the street.',
    detail: 'First impression and approach',
  },
  {
    number: '03',
    title: 'Planting, lighting, and finish work',
    copy: 'Layered planting and controlled evening light that keep the property polished after dark.',
    detail: 'Night read and long-term structure',
  },
]

const proofBrief = [
  'Tight site with weak circulation and no clear outdoor room',
  'Flat lawn that did not support dining, gathering, or evening use',
  'Planting and edges that made the yard read unfinished from the house',
]

const proofResults = [
  'Patio, planting, and lighting planned as one sequence',
  'Cleaner movement from the house to the main gathering area',
  'A sharper night read without harsh fixtures or clutter',
]

const systems = [
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
]

const SectionHeading = ({
  label,
  title,
  body,
  align = 'left',
}: {
  label: string
  title: string
  body: string
  align?: 'left' | 'center'
}) => (
  <div className={align === 'center' ? 'mx-auto text-center' : ''}>
    <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.28em] text-grove-300/70">{label}</p>
    <h2
      className={`mt-4 font-serif text-[clamp(2.3rem,4vw,4.15rem)] leading-[0.98] tracking-tight text-white text-balance ${
        align === 'center' ? 'mx-auto max-w-4xl' : 'max-w-3xl'
      }`}
    >
      {title}
    </h2>
    <p className={`mt-6 text-[17px] leading-8 text-stone-300 ${align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-2xl'}`}>
      {body}
    </p>
  </div>
)

const BrandMark = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-grove-500/10 text-grove-300 shadow-inner shadow-black/30">
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17.2 12 5l5 12.2" />
      <path d="M9.1 12.1h5.8" />
    </svg>
  </div>
)

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
            <div className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">Northline Landscaping</div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Toronto &amp; West GTA</div>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-[13px] font-medium text-stone-300 transition-colors hover:bg-white/5 hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        {isQuoteRoute ? (
          <a
            href="tel:+16475550139"
            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-300 transition-colors hover:text-white hover:underline"
          >
            Call +1 (647) 555-0139
          </a>
        ) : (
          <a href="/quote" className={subtleButton}>Request a quote</a>
        )}
      </div>
      <div className="pb-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={subtleButton}>{link.label}</a>
          ))}
        </div>
      </div>
    </div>
  </header>
)

const Hero = () => (
  <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
    <div className="absolute inset-x-0 top-0 h-[760px]">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-grove-500/10 blur-3xl" />
      <div className="absolute right-0 top-16 h-[32rem] w-[32rem] rounded-full bg-grove-400/10 blur-[160px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
    <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
      <div className="relative z-10 max-w-2xl">
        <p className={`${labelClass} animate-rise-in`}>{isQuoteRoute ? 'Quote request' : 'Design-build landscaping'}</p>
        <h1 className="animate-rise-in-delay-1 mt-6 font-serif text-[clamp(3rem,6vw,5.9rem)] leading-[0.95] tracking-tight text-white text-balance">
          {heroTitle}
        </h1>
        <p className="animate-rise-in-delay-2 mt-6 max-w-xl text-[18px] leading-8 text-stone-300 sm:text-[19px]">
          {heroCopy}
        </p>
        <div className="animate-rise-in-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={isQuoteRoute ? '#contact' : '/quote'} className={primaryButton}>{isQuoteRoute ? 'Share your scope' : 'Request a quote'}</a>
          {isQuoteRoute ? (
            <a
              href="#proof"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-2 text-[13px] font-medium uppercase tracking-[0.2em] text-stone-400 transition-colors duration-200 hover:text-white"
            >
              View proof
            </a>
          ) : (
            <a href="#projects" className={secondaryButton}>
              View projects
            </a>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-stone-300">
          {['Toronto and West GTA', 'Photo-led scope reviews', 'Site visits by appointment'].map((point) => (
            <span key={point} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-grove-400" />
              {point}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[14px] text-stone-500">
          {isQuoteRoute
            ? 'We quote to finish level, not a generic package.'
            : 'Quotes are shaped around finish level, not a generic package.'}
        </p>
      </div>
      <div className="relative z-10 animate-rise-in-delay-3 lg:-mr-12 xl:-mr-20">
        <div className="relative overflow-hidden rounded-[32px] bg-surface-card/20 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <img src={imagery.hero} alt="Refined backyard with a finished patio, lawn, and layered planting" className="h-[clamp(420px,58vw,760px)] w-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/12 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 max-w-md">
            <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">{heroCardLabel}</p>
            <p className="mt-2 text-[15px] leading-7 text-white/90">{heroCardCopy}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-y border-white/8 py-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-stone-300">
        {isQuoteRoute ? (
          <>
            <span className="font-medium text-white">Quote review</span>
            <span className="text-stone-600">/</span>
            <span>Photos, access, and finish level</span>
            <span className="text-stone-600">/</span>
            <span>Site visits by appointment</span>
          </>
        ) : (
          <>
            <span className="font-medium text-white">Residential focus</span>
            <span className="text-stone-600">/</span>
            <span>Patios, outdoor rooms, and front-entry upgrades</span>
            <span className="text-stone-600">/</span>
            <span>Planting, low-voltage lighting, and finish work</span>
            <span className="text-stone-600">/</span>
            <span>Site visits by appointment</span>
          </>
        )}
      </div>
    </div>
  </section>
)

const Services = () => (
  <section id="services" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
      <div className="max-w-xl">
        <SectionHeading
          label={servicesHeading.label}
          title={servicesHeading.title}
          body={servicesHeading.body}
        />
        {!isQuoteRoute ? (
          <a href="/quote" className={`${secondaryButton} mt-8`}>Request a quote</a>
        ) : null}
      </div>
      <div className="border-y border-white/8">
        {(isQuoteRoute ? services.slice(0, 2) : services).map((service, index, array) => (
          <article key={service.number} className={`grid gap-4 px-5 py-6 sm:grid-cols-[90px_1fr] sm:gap-6 sm:px-7 sm:py-7 ${index < array.length - 1 ? 'border-b border-white/8' : ''}`}>
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
  </section>
)

const Proof = () => (
  <section id="proof" className="px-4 py-20 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div className="max-w-xl">
        <SectionHeading label="Transformation proof" title={proofTitle} body={proofBody} />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="border-l border-white/10 pl-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">Project brief</p>
            <ul className="mt-4 space-y-3">
              {proofBrief.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l border-white/10 pl-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">Result</p>
            <ul className="mt-4 space-y-3">
              {proofResults.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div className="relative overflow-hidden rounded-[30px] ring-1 ring-white/10">
          <img src={imagery.before} alt="Backyard before landscaping buildout and patio installation" className="h-[clamp(18rem,34vw,31rem)] w-full object-cover object-center grayscale brightness-[0.55] contrast-[0.88] saturate-0" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">Before</p>
              <p className="mt-2 text-[15px] leading-7 text-white/90">Open yard with no clear structure or finish.</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">After</p>
              <p className="mt-2 text-[15px] leading-7 text-white/90">A cleaner outdoor room with more definition and evening presence.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 border-t border-white/8 pt-5 sm:grid-cols-2 xl:grid-cols-4">
          {['Patio + seating zone', 'Bed framing and layered planting', 'Lighting for paths and evening presence', 'Cleaner access across the yard'].map((item) => (
            <div key={item} className="text-[15px] leading-7 text-stone-300">
              <div className="mb-2 h-1.5 w-1.5 rounded-full bg-grove-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

const Projects = () => (
  isQuoteRoute ? null : (
  <section id="projects" className="scroll-mt-28 px-4 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        label="Selected work"
        title="Projects that show the finish level, not just the scope."
        body="Homeowners judge landscaping by how the front of the house reads, how the yard moves, and whether the space still feels finished after dark."
      />
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="group relative overflow-hidden rounded-[34px] bg-surface-card/20 shadow-[0_28px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <img src={imagery.featured} alt="Backyard patio and lounge zone framed by greenery" className="h-full min-h-[34rem] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Featured project</p>
            <h3 className="mt-3 max-w-2xl font-serif text-[clamp(1.9rem,3vw,3rem)] leading-[0.98] tracking-tight text-white text-balance">
              Patio, planting, and circulation designed as one sequence.
            </h3>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-stone-200/90">
              We reshaped the main outdoor area so the house, the entry, and the yard feel connected. The result is quieter, clearer, and easier to use after dark.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Patio plane', 'Entry read', 'Night use'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-surface-base/65 px-3 py-1.5 text-[12px] uppercase tracking-[0.22em] text-stone-200 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
        <div className="grid gap-8">
          {[
            {
              label: 'Curb appeal',
              title: 'A cleaner front approach from the street.',
              copy: 'Sharper planting structure, softer transitions, and a walk that makes the home read cared for.',
              image: imagery.curbAppeal,
              alt: 'Front garden walkway with planting and formal edges',
            },
            {
              label: 'After dark',
              title: 'Lighting that keeps the property legible.',
              copy: 'Low-voltage path lighting and feature moments that read cleanly without glare.',
              image: imagery.afterDark,
              alt: 'Landscape path and planting illuminated at dusk',
            },
          ].map((item) => (
            <figure key={item.title} className="group">
              <div className="overflow-hidden rounded-[26px] ring-1 ring-white/10">
                <img src={item.image} alt={item.alt} className="h-64 w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
              </div>
              <figcaption className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-grove-300/70">{item.label}</p>
                <h4 className="mt-2 text-[20px] font-medium tracking-tight text-white">{item.title}</h4>
                <p className="mt-2 text-[15px] leading-7 text-stone-300">{item.copy}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  </section>
  )
)

const Materials = () => (
  isQuoteRoute ? null : (
  <section className="px-4 py-20 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
      <SectionHeading
        label="Systems and materials"
        title="The finish depends on the systems underneath."
        body="Good landscaping is won in the details: drainage, the paver system, planting structure, and lighting that belongs to the house."
      />
      <div className="border-y border-white/8 py-4 sm:py-6">
        <div className="divide-y divide-white/8">
          {systems.map((material) => (
            <div key={material.title} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-6">
              <h3 className="text-[18px] font-medium tracking-tight text-white">{material.title}</h3>
              <p className="text-[15px] leading-7 text-stone-300">{material.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 border-t border-white/8 pt-6 sm:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Service area</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Toronto', 'Etobicoke', 'North York', 'Mississauga', 'West GTA suburbs'].map((city) => (
                <span key={city} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] uppercase tracking-[0.22em] text-stone-300">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Before we quote</p>
            <div className="mt-3 space-y-2 text-[15px] leading-7 text-stone-300">
              {['How the front of the house reads from the street', 'Where people gather, move, and enter the yard', 'How water behaves after rain and snowmelt'].map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-[14px] leading-7 text-stone-500">Built for Ontario conditions and chosen for durability first.</p>
      </div>
    </div>
  </section>
  )
)

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section id="contact" className="scroll-mt-28 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-grove-500/12 bg-gradient-to-br from-surface-card/95 via-surface-card/80 to-grove-950/20 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-xl">
            <SectionHeading
              label={contactHeading.label}
              title={contactHeading.title}
              body={contactHeading.body}
            />
            <div className="mt-8 space-y-4">
              {(isQuoteRoute
                ? ['Current photos or survey', 'Rough dimensions or sketches', 'Timing and access notes']
                : ['Patios and outdoor rooms', 'Front approaches and curb appeal', 'Planting and lighting details']
              ).map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-7 text-stone-300 sm:text-[16px]">
                  <span className="mt-2 h-2 w-2 rounded-full bg-grove-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="tel:+16475550139" className={secondaryButton}>Call +1 (647) 555-0139</a>
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
                <p className="mt-3 text-[15px] leading-7 text-stone-300">We will review your note and follow up with the next step.</p>
              </div>
            ) : (
              <form className="rounded-[28px] border border-white/8 bg-surface-base/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 lg:p-7" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
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
                  <span className={labelClass}>Project notes</span>
                  <textarea rows={6} required className={`${fieldClass} resize-none`} placeholder="Tell us what you want to change, what the yard needs, and your ideal timing." />
                </label>
                <button type="submit" className={`${primaryButton} mt-6 w-full`}>Request a quote</button>
                <p className="mt-4 text-center text-[14px] text-stone-500">
                  {isQuoteRoute
                    ? 'Photos, rough timing, and access notes help us quote cleanly.'
                    : 'If you know the rough size or timeline, include it.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="border-t border-white/8 px-4 pb-8 pt-14 sm:pt-16">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:gap-12">
        <div>
          <a href="#top" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-white sm:text-[16px]">Northline Landscaping</div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Outdoor living</div>
            </div>
          </a>
          <p className="mt-5 max-w-xl text-[16px] leading-7 text-stone-300">
            Northline designs patios, planting, lighting, and outdoor rooms that feel complete.
          </p>
          {isQuoteRoute ? (
            <div className="mt-6 space-y-3 text-[15px] leading-7 text-stone-300">
              <p>Send the scope and current photos. We will return the next step.</p>
              <a href="tel:+16475550139" className="inline-flex font-medium text-white transition-colors hover:text-grove-300">
                Call +1 (647) 555-0139
              </a>
            </div>
          ) : (
            <a href="/quote" className={`${subtleButton} mt-6`}>Request a quote</a>
          )}
        </div>
        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Navigation</p>
          <div className="mt-5 grid gap-3 text-[15px] text-stone-300">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-grove-300/70">Contact</p>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-stone-300">
            <p>+1 (647) 555-0139</p>
            <p><a href="mailto:quotes@northlinelandscaping.ca" className="transition-colors hover:text-white">quotes@northlinelandscaping.ca</a></p>
            <p>Toronto and West GTA. Outdoor rooms, patios, planting, and lighting.</p>
            <p>Site visits by appointment.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-stone-500">&copy; {new Date().getFullYear()} Northline Landscaping.</p>
        <p className="text-[13px] text-stone-600">Residential landscaping and outdoor living across Toronto and the West GTA.</p>
      </div>
    </div>
  </footer>
)

const App = () => (
  <div className="min-h-screen bg-surface-base text-stone-200">
    <Header />
    <main id="top">
      <Hero />
      <Services />
      <Proof />
      {!isQuoteRoute ? <Projects /> : null}
      {!isQuoteRoute ? <Materials /> : null}
      {isQuoteRoute ? <ContactForm /> : null}
    </main>
    <Footer />
  </div>
)

export default App
