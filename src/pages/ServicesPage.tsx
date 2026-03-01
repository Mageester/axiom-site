import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const tiers = [
    {
        name: 'The Foundation',
        price: '$2,500',
        desc: 'Single-page authority asset for businesses that need a serious digital front door now.'
    },
    {
        name: 'The Engine',
        price: '$5,000',
        desc: 'Multi-page infrastructure that improves lead quality and creates a repeatable conversion path.'
    },
    {
        name: 'The Authority',
        price: '$7,500+',
        desc: 'Full bespoke infrastructure for market dominance, premium trust, and zero-friction onboarding.'
    }
];

const ServicesPage: React.FC = () => {
    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="Infrastructure Investments | Axiom"
                description="Explore Foundation, Engine, and Authority infrastructure investments for local service businesses."
            />

            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 mb-10">
                <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest">Infrastructure Investments</p>
                <h1 className="text-[40px] sm:text-[52px] font-semibold text-primary tracking-tight leading-[1.06]">
                    Structured build tiers for serious local operators.
                </h1>
                <p className="text-[16px] text-secondary leading-relaxed">
                    Choose the infrastructure level that matches your growth stage and revenue goals.
                </p>
            </section>

            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                {tiers.map((tier) => (
                    <article key={tier.name} className="surface-panel bg-zinc-900/50 border-zinc-800 p-8 rounded-sm flex flex-col gap-4">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-secondary">{tier.price}</p>
                        <h2 className="text-[24px] font-semibold text-primary tracking-tight">{tier.name}</h2>
                        <p className="text-[14px] text-secondary leading-relaxed">{tier.desc}</p>
                    </article>
                ))}
            </section>

            <section className="max-w-6xl mx-auto mt-8 surface-panel bg-zinc-900/50 border-zinc-800 p-8 md:p-10 rounded-sm">
                <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
                    <h2 className="text-[30px] sm:text-[38px] font-semibold text-primary tracking-tight">
                        Authority tier is built for total market capture.
                    </h2>
                    <p className="text-[15px] text-secondary leading-relaxed">
                        Advanced funnel logic, premium UI systems, and edge reliability combine to increase qualified demand and protect revenue during peak season.
                    </p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mt-10 text-center flex flex-col gap-4">
                <h3 className="text-[30px] font-semibold text-primary tracking-tight">Ready to apply?</h3>
                <p className="text-[15px] text-secondary leading-relaxed">
                    Submit your application and we will recommend the right infrastructure tier for your growth targets.
                </p>
                <div className="flex justify-center">
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest transition-colors"
                    >
                        Book Strategy Call
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
