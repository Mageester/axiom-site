import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const tiers = [
    {
        name: 'The Foundation',
        price: '$2,500',
        tag: 'Single Page',
        desc: 'Single-page authority asset for businesses that need a serious digital front door now.',
        features: ['Custom design', 'Mobile-first build', 'SEO foundation', 'Contact form'],
        cta: 'Start Here'
    },
    {
        name: 'The Engine',
        price: '$5,000',
        tag: 'Multi-Page',
        desc: 'Multi-page infrastructure that improves lead quality and creates a repeatable conversion path.',
        features: ['Multi-page site', 'Content strategy', 'Intake pipeline', 'Analytics setup'],
        cta: 'Level Up',
        featured: true
    },
    {
        name: 'The Authority',
        price: '$7,500+',
        tag: 'Bespoke',
        desc: 'Full bespoke infrastructure for market dominance, premium trust, and zero-friction onboarding.',
        features: ['Custom architecture', 'Edge Functions', 'Full funnel design', 'Priority support'],
        cta: 'Go Authority'
    }
];

const ServicesPage: React.FC = () => {
    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="Infrastructure Investments | Axiom"
                description="Explore Foundation, Engine, and Authority infrastructure investments for local service businesses."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-12">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                    <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Infrastructure Investments</p>
                    <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                </div>
                <h1 className="text-[38px] sm:text-[50px] font-semibold text-white tracking-tight leading-[1.06]">
                    Structured build tiers for serious local operators.
                </h1>
                <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
                    Choose the infrastructure level that matches your growth stage and revenue goals.
                </p>
            </section>

            {/* Pricing Grid */}
            <section className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className={`relative bg-[#111214] border rounded-lg p-8 flex flex-col gap-5 transition-colors ${tier.featured
                                ? 'border-[var(--accent)]/30 shadow-[0_0_24px_rgba(90,114,155,0.1)]'
                                : 'border-[#1e2028] hover:border-[#2a2d38]'
                            }`}
                    >
                        {tier.featured && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">{tier.tag}</p>
                            <h2 className="text-[24px] font-semibold text-white tracking-tight">{tier.name}</h2>
                            <p className="text-[32px] font-bold text-white tracking-tight">{tier.price}</p>
                        </div>

                        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{tier.desc}</p>

                        <ul className="flex flex-col gap-3 py-2">
                            {tier.features.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-[14px] text-[var(--text-secondary)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/50 shrink-0"></div>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/contact"
                            className={`mt-auto inline-flex items-center justify-center min-h-[48px] px-8 text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] ${tier.featured
                                    ? 'bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] shadow-[0_0_16px_rgba(255,255,255,0.06)]'
                                    : 'bg-[#161820] border border-[#2a2d35] text-white hover:bg-[#1c1f28]'
                                }`}
                        >
                            {tier.cta}
                        </Link>
                    </article>
                ))}
            </section>

            {/* Authority Callout */}
            <section className="max-w-[1100px] mx-auto mt-10">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                    <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
                        <h2 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-tight">
                            Authority tier is built for total market capture.
                        </h2>
                        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                            Advanced funnel logic, premium UI systems, and edge reliability combine to increase qualified demand and protect revenue during peak season.
                        </p>
                        <div className="flex justify-center pt-2">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                            >
                                Book Strategy Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
