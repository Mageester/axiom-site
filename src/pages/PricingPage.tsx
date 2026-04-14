import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { SEO_ROUTES } from '../lib/seo';

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
    description: 'For businesses that need to look credible and start getting calls.',
    features: [
      '3 pages',
      'Mobile-ready',
      'Contact form',
      'Live in 14 days'
    ],
    cta: 'Start a project →',
    href: '/contact',
  },
  {
    name: 'Growth',
    price: '$2,200',
    description: 'For businesses actively trying to grow locally and convert more traffic.',
    features: [
      '5 pages',
      'SEO foundation',
      'Google Business profile setup',
      'Live in 21 days'
    ],
    cta: 'Start a project →',
    href: '/contact',
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
    href: '/contact',
  },
] as const;

const PricingPage: React.FC = () => {
  return (
    <>
      <SEO {...SEO_ROUTES.pricing} />
      
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-16 md:px-10 md:pb-20">
      {/* SECTION 1: HERO */}
      <section className="mx-auto mb-16 flex max-w-3xl flex-col gap-6 text-center sm:mb-24 pt-10">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">
          PRICING
        </p>
        <div>
          <h1 className="text-[40px] font-axiomSans font-semibold leading-[1.06] tracking-[-0.02em] text-[#F2F4F7] sm:text-[48px] md:text-[60px]">
            Straightforward pricing.
          </h1>
          <h2 className="mt-2 text-[24px] font-axiomSans font-medium tracking-tight text-slate-300 md:text-[32px]">
            You own it outright.
          </h2>
        </div>
        <p className="mx-auto max-w-[760px] text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
          No monthly platform fees. No recurring charges for things you should already own. Three tiers based on what your business actually needs.
        </p>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="mx-auto max-w-[1200px] mb-16 sm:mb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`machined-card flex h-full flex-col gap-8 rounded-2xl border bg-[#10141c]/40 p-8 sm:p-10 transition-colors ${
                tier.recommended
                  ? 'border-[#B05D41]/60'
                  : 'border-white/10'
              }`}
            >
              <div>
                <h3 className="font-axiomMono text-[12px] uppercase tracking-[0.18em] text-[#A7B3BC]">
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
                  <li key={idx} className="flex items-start gap-3 text-[14px] leading-6 text-slate-300">
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

      {/* SECTION 3: GUARANTEE STRIP */}
      <section className="mx-auto max-w-[1200px] mb-20 sm:mb-32">
        <div className="border-y border-white/10 py-10 px-6 text-center">
          <p className="mx-auto max-w-4xl text-[18px] font-medium leading-relaxed tracking-tight text-[#F2F4F7] sm:text-[22px] md:leading-normal">
            If your site loads in over one second, we fix it free. No asterisks. That is the standard we build to.
          </p>
        </div>
      </section>

      {/* SECTION 4: CLOSING CTA */}
      <section className="mx-auto mb-24 max-w-2xl text-center sm:mb-32">
        <h2 className="text-[32px] font-axiomSans font-semibold tracking-[-0.02em] text-[#F2F4F7] sm:text-[40px]">
          Not sure which tier fits?
        </h2>
        <p className="mt-4 mb-8 text-[16px] leading-relaxed text-slate-400 sm:text-[18px]">
          Start a project and we will tell you exactly what your business needs. One business day response, no pressure.
        </p>
        <Link to="/contact" className="btn-primary btn-lg inline-flex">
          Start a project →
        </Link>
      </section>
        </main>
        
        <Footer />
      </Layout>
    </>
  );
};

export default PricingPage;
