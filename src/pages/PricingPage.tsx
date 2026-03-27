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
  scope: string;
  includes: string[];
  boundary: string;
  cta: string;
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Foundation',
    price: '$500 CAD',
    packageParam: 'foundation',
    bestFor: 'Best for businesses that need a professional website and a clear inquiry path.',
    outcome: 'A focused custom website built to create a clearer, more credible first impression.',
    scope: 'What affects scope: 3-5 pages // standard contact flow // light content support',
    includes: [
      'strategy and page structure',
      'custom design direction',
      'responsive development',
      'contact or inquiry setup',
      'launch support',
    ],
    boundary: 'Scope changes if the site needs more pages, more content support, or extra integrations.',
    cta: 'Start Foundation Scope',
  },
  {
    name: 'Growth',
    price: '$1,500 CAD',
    packageParam: 'authority',
    featured: true,
    bestFor: 'Best for businesses that need more structure, more trust, and a broader service presentation.',
    outcome: 'A fuller website that gives the business a clearer message and a stronger path to inquiry.',
    scope: 'What affects scope: 7-10 pages // more service depth // stronger trust sections',
    includes: [
      'strategy and page structure',
      'custom design direction',
      'responsive development',
      'contact or inquiry setup',
      'launch support',
      'expanded service pages and trust blocks',
    ],
    boundary: 'Scope changes if more service areas, more pages, or extra planning are needed.',
    cta: 'Start Growth Scope',
  },
  {
    name: 'Multi-Location / Expansion',
    price: '$3,000 CAD',
    packageParam: 'expansion',
    bestFor: 'Best for multi-location teams or businesses planning a broader launch.',
    outcome: 'A larger custom site structure that can support more complex service and location needs.',
    scope: 'What affects scope: custom page count // multi-location routing // workflow planning',
    includes: [
      'strategy and page structure',
      'custom design direction',
      'responsive development',
      'contact or inquiry setup',
      'launch support',
      'multi-location routing and workflow planning',
    ],
    boundary: 'Scope is confirmed after discovery because location routing and integration needs vary more.',
    cta: 'Request Expansion Scope',
  },
];

const pricingNotes = [
  {
    label: "What's typically included",
    detail: 'strategy and page structure, custom design direction, responsive development, contact or inquiry setup, and launch support.',
  },
  {
    label: 'What affects scope',
    detail: 'Page count, content support, integrations, revision depth, and whether the site needs one location or several.',
  },
  {
    label: 'Best fit for',
    detail: 'Best fit for businesses that need a professional website, not a quick template refresh.',
  },
  {
    label: 'Next step',
    detail: 'Choose the tier that matches your scope, then start the application so the project can be confirmed before work begins.',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="page-shell">
      <SEO
        title="Pricing | Axiom"
        description="Clear pricing for custom website projects. Every project is scoped to the business, but the goal is always the same: a stronger, more credible online presence."
      />

      <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-10 sm:mb-12">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Pricing</p>
        <h1 className="text-[32px] sm:text-[44px] md:text-[54px] font-axiomSans font-semibold tracking-[-0.02em] leading-[1.06] text-axiom-text-main">
          Clear pricing for custom website projects
        </h1>
        <p className="text-[16px] sm:text-[18px] text-axiom-text-main/85 leading-relaxed max-w-[760px] mx-auto">
          Every project is scoped to the business, but the goal is always the same: a stronger, more credible online presence.
        </p>
        <p className="text-[14px] sm:text-[15px] text-axiom-text-mute leading-relaxed max-w-[680px] mx-auto">
          Best fit for businesses that need a professional website, not a quick template refresh.
        </p>
      </section>

      <section className="max-w-[1200px] mx-auto mb-8 sm:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {pricingNotes.map((item) => (
            <article key={item.label} className="axiom-bento bg-axiom-surface border border-axiom-border p-5 sm:p-6">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.12em] text-axiom-text-mute">{item.label}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-axiom-text-main/90">{item.detail}</p>
            </article>
          ))}
        </div>
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
                    Featured
                  </span>
                )}
              </div>

              <p className="font-axiomSans text-[32px] font-bold leading-none text-axiom-text-main">{tier.price}</p>
              <p className="font-axiomSans text-[14px] leading-relaxed text-axiom-text-main/90">{tier.outcome}</p>

              <div className="space-y-2">
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-axiom-text-mute">{tier.scope}</p>
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
                to={`/apply?package=${tier.packageParam}`}
                className="btn-primary btn-md magnetic-primary w-full"
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

      </section>

      <section className="max-w-[1200px] mx-auto mt-12">
        <div className="axiom-bento bg-axiom-surface p-8 sm:p-10 text-center">
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-axiom-text-mute mb-4">Next Step</p>
          <h2 className="text-[24px] sm:text-[30px] font-axiomSans font-semibold tracking-tight text-axiom-text-main mb-3">
            Choose the tier that matches your scope.
          </h2>
          <p className="text-[15px] text-axiom-text-mute max-w-[760px] mx-auto leading-relaxed">
            Start the application and we'll confirm what is included before work begins.
          </p>
          <Link to="/apply" className="btn-primary mt-6">
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;





