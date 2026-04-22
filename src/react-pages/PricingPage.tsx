import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA_PATHS } from '../lib/cta';
import { SEO_ROUTES, PRICING_JSON_LD } from '../lib/seo';
import { 
  Zap, 
  TrendingUp, 
  Cpu, 
  FileText, 
  RotateCcw, 
  Clock, 
  Search, 
  MapPin, 
  Server, 
  Layout as LayoutIcon, 
  MessageSquare, 
  UserCheck, 
  CreditCard 
} from 'lucide-react';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  label?: string;
  supportNote?: string;
  recommended?: boolean;
};

const pricingTiers: readonly (PricingTier & { icon: React.ElementType })[] = [
  {
    name: 'MONTHLY',
    label: 'MOST ACCESSIBLE',
    price: 'From $150/mo',
    description: '$0 down. No lock-in after 6 months. Hosting included.',
    supportNote: 'Most clients recover the monthly cost within the first booked call the site generates.',
    features: [
      'Up to 5 pages',
      'Hosting included',
      'Unlimited edits',
      '6-month minimum',
      'Full ownership after 12 months'
    ],
    cta: 'Start a project',
    href: CTA_PATHS.startProject,
    icon: CreditCard,
  },
  {
    name: 'Starter',
    price: '$1,200',
    description: 'For local businesses that need a site that actually converts visitors into calls.',
    features: [
      '3 pages',
      'Mobile-ready',
      'Contact form',
      'Live in 14 days'
    ],
    cta: 'Start a project',
    href: CTA_PATHS.startProject,
    icon: Zap,
  },
  {
    name: 'Growth',
    price: '$2,200',
    description: 'For businesses ready to dominate local search and stop losing jobs to competitors.',
    features: [
      '5 pages',
      'SEO foundation',
      'Google Business profile setup',
      'Live in 21 days'
    ],
    cta: 'Start a project',
    href: CTA_PATHS.startProject,
    recommended: true,
    icon: TrendingUp,
  },
  {
    name: 'Custom',
    price: 'From $3,500',
    description: 'Larger scope, deeper build. Scoped per project.',
    features: [
      'Unlimited pages',
      'Integrations & automations',
      'Ongoing support available',
      'Timeline scoped on intake'
    ],
    cta: "Let's talk",
    href: CTA_PATHS.startProject,
    icon: Cpu,
  },
] as const;

const comparisonRows = [
  {
    label: 'Pages included',
    icon: FileText,
    starter: '3 pages',
    growth: '5 pages',
    custom: 'Scoped to build',
  },
  {
    label: 'Revisions',
    icon: RotateCcw,
    starter: '2 rounds',
    growth: '3 rounds',
    custom: 'Scoped in proposal',
  },
  {
    label: 'Turnaround',
    icon: Clock,
    starter: '14 days',
    growth: '21 days',
    custom: 'Project scope',
  },
  {
    label: 'SEO setup',
    icon: Search,
    starter: 'Basic on-page',
    growth: 'Local SEO foundation',
    custom: 'Custom strategy',
  },
  {
    label: 'Google Business profile',
    icon: MapPin,
    starter: 'Guidance only',
    growth: 'Setup + optimization',
    custom: 'Included if needed',
  },
  {
    label: 'Hosting guidance',
    icon: Server,
    starter: 'Included',
    growth: 'Included',
    custom: 'Included',
  },
  {
    label: 'CMS / editing capability',
    icon: LayoutIcon,
    starter: 'Light updates',
    growth: 'Editable workflow',
    custom: 'Custom setup',
  },
  {
    label: 'Post-launch support',
    icon: MessageSquare,
    starter: 'Launch support',
    growth: 'Post-launch support',
    custom: 'Scoped support',
  },
  {
    label: 'Ownership',
    icon: UserCheck,
    starter: 'Full ownership',
    growth: 'Full ownership',
    custom: 'Full ownership',
  },
  {
    label: 'Recurring fees',
    icon: CreditCard,
    starter: 'None',
    growth: 'None',
    custom: 'None',
  },
];

const PricingPage: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.pricing} schema={PRICING_JSON_LD} />
      
      <Layout>
        <main id="main-content" tabIndex={-1} className="axiom-container w-full pb-16 md:pb-20">
      {/* SECTION 1: HERO */}
      <section className="mb-12 flex flex-col gap-6 text-center pt-12 sm:mb-24 sm:pt-16 md:pt-24">
        <p className="section-eyebrow">PRICING</p>
        <div>
          <h1 className="text-[clamp(2.45rem,5.8vw,4rem)] font-axiomSans font-semibold leading-[1.06] tracking-[-0.02em] text-[#F2F4F7]">
            Flexible structure. Full ownership.
          </h1>
          <h2 className="mt-2 text-[clamp(1.45rem,2.8vw,2rem)] font-axiomSans font-medium tracking-tight text-slate-300">
            Choose a monthly starting point or a one-time project scope. You still own everything we build.
          </h2>
        </div>
        <p className="mx-auto max-w-[760px] text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
          Four options based on how you want to start: a lower-friction monthly plan or a scoped build with full ownership.
        </p>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="mb-12 sm:mb-24">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 md:gap-6">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className="flex h-full flex-col">
            <article
              className={`machined-card flex h-full flex-col gap-6 rounded-[var(--radius-card)] border bg-[#10141c]/40 p-6 sm:p-8 transition-colors ${
                tier.recommended
                  ? 'border-t-2 border-t-axiom-accent border-white/10 shadow-[0_12px_44px_rgba(200,122,87,0.12)]'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-axiomMono text-xs uppercase tracking-wide ${tier.recommended ? 'text-axiom-accent' : 'text-[#A7B3BC]'}`}>
                      {tier.label ?? tier.name}
                    </p>
                    {tier.label ? (
                      <h3 className="mt-2 font-axiomMono text-xs uppercase tracking-[0.08em] text-[#A7B3BC]">
                        {tier.name}
                      </h3>
                    ) : null}
                  </div>
                  <tier.icon className={`h-5 w-5 ${tier.recommended ? 'text-axiom-accent' : 'text-slate-500/50'}`} strokeWidth={1.5} />
                </div>
                <p className="mt-6 font-axiomDisplay text-[40px] leading-none tracking-[-0.04em] text-[#F2F4F7]">
                  {tier.price}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
                  {tier.description}
                </p>
              </div>

              <ul className="mb-2 mt-auto flex flex-col gap-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed text-slate-300">
                    <span className="text-slate-500">Ã‚·</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={tier.href} className="btn-primary btn-md w-full justify-center">
                {tier.cta}
              </Link>
            </article>
            {tier.supportNote ? (
              <p className="mt-3 px-3 text-center text-[13px] font-normal leading-[1.6] text-[rgba(255,255,255,0.45)]">
                {tier.supportNote}
              </p>
            ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: COMPARISON TABLE */}
      <section className="mb-12 sm:mb-24">
        <article className="machined-card overflow-hidden rounded-[var(--radius-card)] p-6 sm:p-8 md:p-10">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Compare the tiers</p>
            <h2 className="mt-3 text-[32px] font-axiomSans font-semibold tracking-[-0.02em] text-[#F2F4F7] sm:text-[40px]">
              What each package includes.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
              Detailed breakdown of features, support, and ownership across every Axiom build.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:hidden">
            {comparisonRows.map((row) => (
              <article
                key={row.label}
                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
              >
                <div className="flex items-start gap-3">
                  <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500/70" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#F2F4F7]">{row.label}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-[#0A0D13] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Starter</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-200">{row.starter}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-[#0A0D13] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Growth</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-200">{row.growth}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-[#0A0D13] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Custom</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-200">{row.custom}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 hidden overflow-x-auto md:block">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="pb-4 pr-6 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Feature
                  </th>
                  <th scope="col" className="pb-4 pr-6 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Starter
                  </th>
                  <th scope="col" className="pb-4 pr-6 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Growth
                  </th>
                  <th scope="col" className="pb-4 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Custom
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.06] align-top last:border-b-0">
                    <th scope="row" className="py-4 pr-6 text-[14px] font-medium text-[#F2F4F7] sm:text-[15px]">
                      <div className="flex items-center gap-2.5">
                        <row.icon className="h-3.5 w-3.5 shrink-0 text-slate-500/70" strokeWidth={1.5} />
                        <span>{row.label}</span>
                      </div>
                    </th>
                    <td className="py-4 pr-6 text-[14px] leading-relaxed text-slate-300 sm:text-[15px]">
                      {row.starter}
                    </td>
                    <td className="py-4 pr-6 text-[14px] leading-relaxed text-slate-300 sm:text-[15px]">
                      {row.growth}
                    </td>
                    <td className="py-4 text-[14px] leading-relaxed text-slate-300 sm:text-[15px]">
                      {row.custom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* SECTION 4: GUARANTEE CALLOUT */}
      <section className="mb-16 sm:mb-32">
        <article className="w-full overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
          <div className="border-l-4 border-[#B05D41] px-5 py-8 md:px-8 md:py-12 lg:px-10">
            <div className="max-w-4xl">
              <h2 className="text-[clamp(2rem,4vw,3.35rem)] font-bold tracking-[-0.04em] text-[#F2F4F7]">
                If your site loads in over one second, we fix it free.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
                No asterisks. That is the standard we build to.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* SECTION 5: CLOSING CTA */}
      <section className="mb-20 rounded-[var(--radius-card)] border border-white/10 bg-[#131821] p-6 sm:mb-32 sm:p-10 md:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-axiomSans font-semibold tracking-[-0.02em] text-[#F2F4F7]">
            Not sure which tier fits?
          </h2>
          <p className="mt-4 mb-8 text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
            Start a project and we will tell you exactly what your business needs. One business day response, no pressure.
          </p>
          <Link to={CTA_PATHS.startProject} className="btn-primary btn-lg inline-flex">
            Start a project</Link>
        </div>
      </section>
        </main>
        
        <Footer />
      </Layout>
    </>
  );
};

export default PricingPage;
