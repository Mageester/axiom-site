import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const investmentTiers = [
    {
        title: 'The Foundation',
        price: '$2,500',
        fit: 'For operators who need a clean, fast digital front door now.',
        outcome: 'Launch a conversion-ready single-page asset that immediately upgrades market perception.'
    },
    {
        title: 'The Engine',
        price: '$5,000',
        fit: 'For teams ready to scale lead flow and sales consistency.',
        outcome: 'Deploy a multi-page system that qualifies traffic, builds trust, and improves close quality.'
    },
    {
        title: 'The Authority',
        price: '$7,500+',
        fit: 'For companies focused on local category leadership.',
        outcome: 'Capture market share with enterprise infrastructure, zero-friction onboarding, and premium positioning.'
    }
];

const authorityRoi = [
    {
        title: 'Total Market Capture',
        desc: 'Own the premium position in your service area with a brand experience built to outperform templates.'
    },
    {
        title: 'Automated Lead Qualification',
        desc: 'Filter low-intent traffic and route high-intent buyers into your pipeline with less manual triage.'
    },
    {
        title: 'Zero-Friction Customer Onboarding',
        desc: 'Make it easy for serious buyers to request service, submit details, and move to booked conversations.'
    },
    {
        title: 'Storm-Ready Reliability',
        desc: 'Enterprise edge architecture protects uptime during seasonal spikes when your best jobs typically appear.'
    }
];

const ServicesPage: React.FC = () => {
    return (
        <div className="pt-36 pb-24">
            <SEO
                title="Infrastructure Investments | Axiom"
                description="Foundation, Engine, and Authority investment tiers for service businesses that need speed, trust, and higher-paying job flow."
            />

            <section className="px-6 pb-20 border-b border-subtle">
                <div className="max-w-[900px] mx-auto text-center reveal">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Infrastructure Investments</p>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-semibold tracking-[-0.02em] mb-7 leading-[1.04] text-primary">
                        This is a revenue asset, not a web design package.
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[700px] mx-auto leading-relaxed font-light mb-8">
                        Each tier is engineered to increase lead quality, strengthen trust, and help you win higher-value jobs in competitive local markets.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-9 py-4 bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300"
                    >
                        Apply for Strategy Call
                    </Link>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-secondary/70 mt-4">
                        We onboard 4 new partners per month
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-14">
                    <h2 className="text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight mb-4">Choose your growth stage.</h2>
                    <p className="text-[15px] text-secondary max-w-[760px] mx-auto leading-relaxed">
                        Start where you are, then move up as demand and operating maturity increase.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {investmentTiers.map((tier) => (
                        <article key={tier.title} className="surface-panel p-8 rounded-sm">
                            <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-3">{tier.price}</p>
                            <h3 className="text-[22px] font-semibold text-primary mb-4">{tier.title}</h3>
                            <p className="text-[14px] text-secondary leading-relaxed mb-4">{tier.fit}</p>
                            <p className="text-[14px] text-secondary leading-relaxed">{tier.outcome}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 border-y border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[1000px] mx-auto text-center">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Risk Reversal</p>
                    <h2 className="text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight mb-4">
                        Built on enterprise edge networks so your site does not fail when calls surge.
                    </h2>
                    <p className="text-[15px] text-secondary max-w-[780px] mx-auto leading-relaxed">
                        Weather-driven demand is when your website matters most. Authority infrastructure is engineered for that exact pressure.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-14">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Authority ROI</p>
                    <h2 className="text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight">
                        What $7,500+ actually does for your bottom line.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {authorityRoi.map((item) => (
                        <article key={item.title} className="surface-panel p-8 rounded-sm">
                            <h3 className="text-[20px] font-semibold text-primary mb-3">{item.title}</h3>
                            <p className="text-[14px] text-secondary leading-relaxed">{item.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 border-t border-subtle reveal">
                <div className="max-w-[820px] mx-auto text-center">
                    <h2 className="text-[30px] font-semibold text-primary tracking-tight mb-4">Ready to apply for your infrastructure audit?</h2>
                    <p className="text-[15px] text-secondary leading-relaxed mb-8">
                        We will identify where your current site leaks revenue and recommend the best investment tier for your growth stage.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-9 py-4 bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300"
                    >
                        Start Project Application
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
