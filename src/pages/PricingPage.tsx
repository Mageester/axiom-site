import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA_PATHS } from '../lib/cta';
import { SEO_ROUTES, PRICING_JSON_LD } from '../lib/seo';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  recommended?: boolean;
};

const pricingTiers: readonly PricingTier[] = [
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
    cta: 'Start a project →',
    href: CTA_PATHS.startProject,
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
    cta: 'Start a project →',
    href: CTA_PATHS.startProject,
    recommended: true,
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
    cta: "Let's talk →",
    href: CTA_PATHS.startProject,
  },
] as const;

const PricingPage: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.pricing} schema={PRICING_JSON_LD} />
      
      <Layout>
        <main id="main-content" tabIndex={-1} className="axiom-container w-full pb-16 md:pb-20">
      {/* SECTION 1: HERO */}
      <section className="mb-16 flex flex-col gap-6 text-center pt-16 sm:mb-24 md:pt-24">
        <p className="section-eyebrow">PRICING</p>
        <div>
          <h1 className="text-[clamp(2.45rem,5.8vw,4rem)] font-axiomSans font-semibold leading-[1.06] tracking-[-0.02em] text-[#F2F4F7]">
            One investment. Full ownership.
          </h1>
          <h2 className="mt-2 text-[clamp(1.45rem,2.8vw,2rem)] font-axiomSans font-medium tracking-tight text-slate-300">
            No monthly fees. No recurring charges. You own everything we build.
          </h2>
        </div>
        <p className="mx-auto max-w-[760px] text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
          No monthly platform fees. No recurring charges for things you should already own. Three tiers based on what your business actually needs.
        </p>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="mb-16 sm:mb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`machined-card flex h-full flex-col gap-8 rounded-[var(--radius-card)] border bg-[#10141c]/40 p-8 sm:p-10 transition-colors ${
                tier.recommended
                  ? 'border-t-2 border-t-axiom-accent border-white/10 shadow-[0_12px_44px_rgba(200,122,87,0.12)]'
                  : 'border-white/10'
              }`}
            >
              <div>
                <h3 className="font-axiomMono text-xs uppercase tracking-wide text-[#A7B3BC]">
                  {tier.name}
                </h3>
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
                    <span className="text-slate-500">·</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={tier.href} className="btn-primary btn-md w-full justify-center">
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 3: GUARANTEE CALLOUT */}
      <section className="mb-20 sm:mb-32">
        <article className="w-full overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96)_0%,rgba(9,11,16,0.99)_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
          <div className="border-l-4 border-[#B05D41] px-6 py-10 md:px-8 md:py-12 lg:px-10">
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

      {/* SECTION 4: CLOSING CTA */}
      <section className="mb-24 rounded-[var(--radius-card)] border border-white/10 bg-[#131821] p-10 sm:mb-32 md:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-axiomSans font-semibold tracking-[-0.02em] text-[#F2F4F7]">
            Not sure which tier fits?
          </h2>
          <p className="mt-4 mb-8 text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
            Start a project and we will tell you exactly what your business needs. One business day response, no pressure.
          </p>
          <Link to={CTA_PATHS.startProject} className="btn-primary btn-lg inline-flex">
            Start a project →
          </Link>
        </div>
      </section>
        </main>
        
        <Footer />
      </Layout>
    </>
  );
};

export default PricingPage;
