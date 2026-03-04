import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

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
    bestFor: 'Best for owner-led teams operating in one core service territory.',
    outcome: 'Ship a high-authority web asset that replaces fragile agency templates and captures urgent calls faster.',
    technical: '3-5 pages // edge deployment // conversion instrumentation',
    includes: [
      'Offer architecture and service hierarchy built for premium positioning',
      'Mobile-first intake flow optimized for speed-to-call actions',
      'Analytics baseline with lead source visibility at launch',
    ],
    boundary: 'Not included: multi-location rollout or custom workflow integrations.',
    cta: 'Apply for Foundation',
  },
  {
    name: 'Authority',
    price: '$1,500 CAD',
    packageParam: 'authority',
    featured: true,
    bestFor: 'Best for growth-stage operators scaling volume while protecting ticket quality.',
    outcome: 'Deploy a conversion system that filters weak inquiries and increases close-ready opportunities.',
    technical: '7-10 pages // ROI terminal // trust proof architecture',
    includes: [
      'Qualification-first funnels tuned to reduce low-margin jobs',
      'Expanded service and market positioning across key revenue pages',
      'Priority implementation support through first campaign cycle',
      'ROI dashboard layer for operator-level decision visibility',
    ],
    boundary: 'Not included: enterprise back-office custom integrations.',
    cta: 'Apply for Authority',
  },
  {
    name: 'Multi-Location / Expansion',
    price: '$3,000 CAD',
    packageParam: 'expansion',
    bestFor: 'Best for multi-crew operators expanding territories or integrating acquisitions.',
    outcome: 'Engineer a scalable infrastructure platform that standardizes performance across regions and crews.',
    technical: 'custom architecture // workflow mapping // executive reporting',
    includes: [
      'Multi-location information architecture and conversion routing',
      'Custom implementation roadmap with phased launch sequencing',
      'CRM or dispatch integration planning for operational fit',
      'Quarterly instrumentation reviews for sustained growth control',
    ],
    boundary: 'Not included: fixed scope before discovery and technical mapping.',
    cta: 'Request Expansion Scope',
  },
];

const trustSignals = [
  {
    label: 'Performance Guarantee',
    detail: 'If your production build is not sub-second on modern mobile, we keep optimizing at no charge.',
  },
  {
    label: 'Outcome Proof',
    detail: '"We closed two replacement jobs in week one from leads that used to bounce." - Ontario HVAC Owner',
  },
  {
    label: 'Partner Capacity',
    detail: 'We accept four active production partners per month to protect implementation quality.',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="page-shell">
      <SEO
        title="Infrastructure Investment | Axiom Infrastructure"
        description="High-ticket web infrastructure packages built for contractors who need measurable conversion and performance authority."
      />

      <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-12 sm:mb-14">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Infrastructure Investment</p>
        <h1 className="text-[32px] sm:text-[44px] md:text-[54px] font-axiomSans font-semibold tracking-[-0.02em] leading-[1.06] text-axiom-text-main">
          Pricing Built for Serious Operators.
        </h1>
        <p className="text-[16px] sm:text-[18px] text-axiom-text-main/85 leading-relaxed max-w-[760px] mx-auto">
          Clear value ladder, explicit outcomes, and engineered delivery standards. No hidden fees. No commodity agency fluff.
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
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-axiom-accent border border-axiom-accent/50 px-2 py-1 rounded">
                    Contractor&apos;s Choice
                  </span>
                )}
              </div>

              <p className="font-axiomSans text-[32px] font-bold leading-none text-axiom-text-main">{tier.price}</p>
              <p className="font-axiomSans text-[14px] leading-relaxed text-axiom-text-main/90">{tier.outcome}</p>

              <div className="space-y-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.14em] text-axiom-text-mute">{tier.technical}</p>
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
                to={`/contact?package=${tier.packageParam}`}
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
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-axiom-text-mute">{signal.label}</p>
              <p className="font-axiomSans text-[14px] text-axiom-text-main/90 leading-relaxed mt-2">{signal.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto mt-12">
        <div className="axiom-bento bg-axiom-surface p-8 sm:p-10 text-center">
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-axiom-text-mute mb-4">Execution Guarantee</p>
          <h2 className="text-[24px] sm:text-[30px] font-axiomSans font-semibold tracking-tight text-axiom-text-main mb-3">
            If it does not improve qualified lead flow, we keep working.
          </h2>
          <p className="text-[15px] text-axiom-text-mute max-w-[760px] mx-auto leading-relaxed">
            We scope tightly, instrument everything, and optimize until the conversion system performs. This is infrastructure, not a brochure website.
          </p>
          <Link to="/contact" className="btn-primary mt-6">
            Apply for Strategy Call
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
