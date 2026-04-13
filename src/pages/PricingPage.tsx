import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { createStartProjectHref } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

type PricingTier = {
  name: string;
  price: string;
  details: string;
  cta: string;
  href: string;
  featured?: boolean;
};

const pricingTiers: readonly PricingTier[] = [
  {
    name: 'Starter',
    price: '$2,500',
    details: '3 pages · mobile-ready · contact form · delivered in 14 days',
    cta: 'Start a project',
    href: createStartProjectHref('starter'),
  },
  {
    name: 'Standard',
    price: '$4,000',
    details: '5 pages · SEO basics · Google Business setup · delivered in 21 days',
    cta: 'Start a project',
    href: createStartProjectHref('standard'),
    featured: true,
  },
  {
    name: 'Custom',
    price: "Let's talk",
    details: 'Multi-page · integrations · ongoing support',
    cta: "Let's talk",
    href: '/contact',
  },
] as const;

const includedCopy =
  'Every project includes: scope document, mobile-first build, speed optimization, 30 days of post-launch support.';

const PricingPage: React.FC = () => {
  return (
    <div className="page-shell">
      <SEO {...SEO_ROUTES.pricing} />

      <section className="mx-auto mb-12 flex max-w-3xl flex-col gap-5 text-center sm:mb-14">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Pricing</p>
        <h1 className="text-[32px] font-axiomSans font-semibold leading-[1.06] tracking-[-0.02em] text-axiom-text-main sm:text-[44px] md:text-[54px]">
          Clear pricing. No surprises.
        </h1>
        <p className="mx-auto max-w-[760px] text-[16px] leading-relaxed text-axiom-text-main/85 sm:text-[18px]">
          Three options for service businesses that want a site to work hard from day one.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`machined-card flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-[var(--axiom-elevated)] p-6 sm:p-8 ${
                tier.featured
                  ? 'border-[#d4a48e]/55 shadow-[0_0_0_1px_rgba(212,164,142,0.12),0_20px_40px_rgba(0,0,0,0.28)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.18em] text-axiom-text-mute">
                    {tier.featured ? 'Recommended' : 'Tier'}
                  </p>
                  <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-axiom-text-main md:text-[24px]">
                    {tier.name}
                  </h2>
                </div>
                {tier.featured ? (
                  <span className="rounded-full border border-[#d4a48e]/45 px-2.5 py-1 font-axiomMono text-[10px] uppercase tracking-[0.12em] text-[#d4a48e]">
                    Highlighted
                  </span>
                ) : null}
              </div>

              <p className="font-axiomDisplay text-[clamp(3rem,5vw,4.75rem)] leading-none tracking-[-0.06em] text-[#d4a48e]">
                {tier.price}
              </p>

              <p className="text-[14px] leading-6 text-axiom-text-main/90 md:text-[0.98rem]">{tier.details}</p>

              <Link to={tier.href} className="btn-primary btn-md mt-auto w-full">
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--axiom-elevated)] px-5 py-4 text-center text-sm leading-6 text-axiom-text-main/90">
          {includedCopy}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
