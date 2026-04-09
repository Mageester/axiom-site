import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { createStartProjectHref } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

type PricingTier = {
  name: string;
  price: string;
  packageParam: string;
  featured?: boolean;
  bestFor: string;
  outcome: string;
  technical: string;
  includes: string[];
  boundary: string;
  cta: string;
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Foundation',
    price: '$500 CAD',
    packageParam: 'foundation',
    bestFor: 'Good for one-person or small teams with one main service area.',
    outcome: 'A clean site that replaces whatever you have now. Clear pages, fast on phones, easy to contact.',
    technical: '3–5 pages // fast hosting // contact tracking',
    includes: [
      'Clear service pages that show what you do upfront',
      'Call and quote buttons that work well on phones',
      'Speed and analytics set up at launch',
    ],
    boundary: 'Does not include multi-location pages or custom tool connections.',
    cta: 'Start a project',
  },
  {
    name: 'Growth',
    price: '$1,500 CAD',
    packageParam: 'authority',
    featured: true,
    bestFor: 'Good for growing teams that want better leads, not just more traffic.',
    outcome: 'Stronger pages, real proof, and a site that attracts the right jobs instead of the cheapest ones.',
    technical: '7–10 pages // lead tracking // reviews and proof',
    includes: [
      'Pages built to attract higher-ticket work',
      'Service and market pages that position you clearly',
      'Priority support through your first month live',
      'Lead tracking so you can see what\'s working',
    ],
    boundary: 'Does not include custom back-office integrations.',
    cta: 'Start a project',
  },
  {
    name: 'Multi-Location / Expansion',
    price: '$3,000 CAD',
    packageParam: 'expansion',
    bestFor: 'Good for multi-crew teams expanding into new areas.',
    outcome: 'One site that covers multiple locations, crews, and service areas without falling apart.',
    technical: 'custom build // tool connections // reporting',
    includes: [
      'Pages and routing for each location and service area',
      'Phased launch plan so nothing breaks',
      'CRM or scheduling tool connections',
      'Quarterly check-ins to keep the site working',
    ],
    boundary: 'Scope is set after an initial review, not before.',
    cta: 'Start a project',
  },
];

const trustSignals = [
  {
    label: 'Performance Guarantee',
    detail: 'If your site isn\'t loading in under one second on phones, we keep working on it at no extra cost.',
  },
  {
    label: 'Outcome Proof',
    detail: '"We closed two replacement jobs in week one from leads that used to bounce." - Ontario HVAC Owner',
  },
  {
    label: 'Partner Capacity',
    detail: 'We take on four projects a month to keep the quality up.',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="page-shell">
      <SEO
        {...SEO_ROUTES.pricing}
      />

      <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-12 sm:mb-14">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Pricing</p>
        <h1 className="text-[32px] sm:text-[44px] md:text-[54px] font-axiomSans font-semibold tracking-[-0.02em] leading-[1.06] text-axiom-text-main">
          Clear pricing. No surprises.
        </h1>
        <p className="text-[16px] sm:text-[18px] text-axiom-text-main/85 leading-relaxed max-w-[760px] mx-auto">
          Three levels depending on what your business needs. Hosting, speed, and ownership included in all of them.
        </p>
      </section>

      <section className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`axiom-bento bg-axiom-surface border border-axiom-border p-6 sm:p-8 flex flex-col gap-5 ${tier.featured ? 'border-t-2 border-t-axiom-accent' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-axiomSans text-[22px] md:text-[24px] font-semibold tracking-tight text-axiom-text-main">{tier.name}</h2>
                {tier.featured && (
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.1em] text-axiom-accent border border-axiom-accent/50 px-2 py-1 rounded">
                    Most picked
                  </span>
                )}
              </div>

              <p className="font-axiomSans text-[32px] font-bold leading-none text-axiom-text-main">{tier.price}</p>
              <p className="font-axiomSans text-[14px] leading-relaxed text-axiom-text-main/90">{tier.outcome}</p>

              <div className="space-y-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-axiom-text-mute">{tier.technical}</p>
                <p className="font-axiomSans text-[12px] text-axiom-text-mute">{tier.bestFor}</p>
              </div>

              <ul className="space-y-3 flex-1">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-axiom-text-main/90">
                    <span className="mt-[2px] text-axiom-accent">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="font-axiomSans text-[12px] text-axiom-text-mute/90 border-t border-axiom-border pt-3">{tier.boundary}</p>

              <Link
                to={createStartProjectHref(tier.packageParam)}
                className="btn-primary btn-md magnetic-primary w-full"
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {trustSignals.map((signal) => (
            <div key={signal.label} className="axiom-bento bg-axiom-surface border border-axiom-border p-4 sm:p-5">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.1em] text-axiom-text-mute">{signal.label}</p>
              <p className="font-axiomSans text-[14px] text-axiom-text-main/90 leading-relaxed mt-2">{signal.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto mt-12">
        <div className="axiom-bento bg-axiom-surface p-8 sm:p-10 text-center">
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-axiom-text-mute mb-4">Guarantee</p>
          <h2 className="text-[24px] sm:text-[30px] font-axiomSans font-semibold tracking-tight text-axiom-text-main mb-3">
            If the site doesn't bring in better leads, we keep working.
          </h2>
          <p className="text-[15px] text-axiom-text-mute max-w-[760px] mx-auto leading-relaxed">
            We scope tightly, track everything, and keep improving until the site does its job. This is a working tool, not a brochure.
          </p>
          <Link to="/start-a-project" className="btn-primary mt-6">
            Start a project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;


