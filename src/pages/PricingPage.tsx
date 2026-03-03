import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const pricingTiers = [
  {
    name: 'Foundation',
    price: '$7,500',
    currency: 'CAD',
    packageParam: 'starter',
    summary: 'Launch-grade infrastructure for contractors replacing slow, template-heavy agency builds.',
    qualifier: 'Best for owner-led teams in one service territory.',
    technical: '3-5 pages // edge deployment // conversion instrumentation',
    outcomes: [
      'Offer architecture that clarifies premium positioning',
      'Mobile-first intake flow tuned for urgent calls',
      'Hardened performance baseline with handoff documentation',
    ],
    boundary: 'Boundary: single territory scope, no multi-location rollout.',
  },
  {
    name: "Contractor's Choice",
    price: '$12,500',
    currency: 'CAD',
    packageParam: 'professional',
    featured: true,
    summary: 'The default package for growth operators scaling lead volume without sacrificing job quality.',
    qualifier: 'Best for teams of 10+ targeting higher-ticket service work.',
    technical: '7-10 pages // ROI terminal // trust proof system',
    outcomes: [
      'Qualification-first funnels that reduce low-margin leads',
      'Authority messaging across core services and locations',
      'Priority launch support through initial campaign ramp',
    ],
    boundary: 'Boundary: excludes custom back-office integrations.',
  },
  {
    name: 'Authority',
    price: '$18,500+',
    currency: 'CAD',
    packageParam: 'enterprise',
    summary: 'Bespoke infrastructure for companies running multiple crews, territories, or acquisitions.',
    qualifier: 'Best for established operations with multi-market expansion goals.',
    technical: 'custom architecture // workflow integrations // executive reporting',
    outcomes: [
      'Sales-process mapping from first click to signed work',
      'Dispatch and CRM integration planning at launch',
      'Quarterly instrumentation reviews for sustained ROI control',
    ],
    boundary: 'Boundary: custom statement of work required before production.',
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
          Transparent pricing, explicit outcomes, and engineered delivery standards. No hidden fees. No commodity agency fluff.
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
                <h2 className="font-axiomSans text-[24px] font-semibold tracking-tight text-axiom-text-main">{tier.name}</h2>
                {tier.featured && (
                  <span className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-axiom-accent border border-axiom-accent/50 px-2 py-1 rounded">
                    Contractor's Choice
                  </span>
                )}
              </div>

              <p className="font-axiomSans text-[14px] leading-relaxed text-axiom-text-main/90">{tier.summary}</p>

              <p className="font-axiomSans text-[32px] font-bold leading-none text-axiom-text-main">
                {tier.price}
                <span className="font-axiomMono text-[12px] text-axiom-text-mute ml-2 align-middle">{tier.currency}</span>
              </p>

              <p className="font-axiomMono text-[11px] uppercase tracking-[0.14em] text-axiom-text-mute">{tier.technical}</p>

              <ul className="space-y-3 flex-1">
                {tier.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-axiom-text-main/90">
                    <span className="mt-[2px] text-axiom-accent">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <p className="font-axiomSans text-[12px] text-axiom-text-mute">{tier.qualifier}</p>
              <p className="font-axiomSans text-[12px] text-axiom-text-mute/90 border-t border-axiom-border pt-3">{tier.boundary}</p>

              <Link
                to={`/contact?package=${tier.packageParam}`}
                className="magnetic-primary inline-flex items-center justify-center min-h-[48px] px-6 bg-axiom-accent text-axiom-text-main text-[12px] font-bold uppercase tracking-widest"
              >
                Apply for {tier.name}
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
