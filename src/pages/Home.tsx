import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const trustMetrics = [
    { label: 'Load Performance', value: 'Sub-Second' },
    { label: 'Infrastructure', value: 'Edge Deployed' },
    { label: 'Security Profile', value: 'Enterprise Grade' }
];

const riskCards = [
    {
        title: 'No More Lost Leads During Peak Demand',
        desc: 'Storm alerts and heatwaves should generate revenue, not downtime. We build infrastructure designed to stay online under pressure.'
    },
    {
        title: 'Premium Positioning That Wins Better Jobs',
        desc: 'Your website should make your largest local competitor look outdated and unprepared.'
    },
    {
        title: 'Structured Funnels That Convert',
        desc: 'Clear hierarchy, clear offers, and clear CTAs turn high-intent visitors into qualified calls.'
    }
];

const Home: React.FC = () => {
    return (
        <>
            <SEO
                title="Axiom Infrastructure | Premium Contractor Web Infrastructure"
                description="Edge-deployed web infrastructure for HVAC, roofing, and landscaping businesses that need premium design and stronger lead quality."
            />

            <div className="pt-36 pb-24 px-6">
                <section className="max-w-6xl mx-auto surface-panel bg-zinc-900/50 border-zinc-800 p-10 md:p-14 rounded-sm">
                    <div className="max-w-3xl flex flex-col gap-6">
                        <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest">Authority Tier Infrastructure</p>
                        <h1 className="text-[40px] sm:text-[54px] font-semibold text-primary tracking-tight leading-[1.05]">
                            The website system serious contractors use to win higher-paying jobs.
                        </h1>
                        <p className="text-[16px] text-secondary leading-relaxed">
                            We build premium, conversion-focused infrastructure for local service businesses that need stronger trust, better lead quality, and reliable uptime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/concepts"
                                className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 border border-zinc-700 bg-zinc-900/60 text-primary hover:border-zinc-500 text-[12px] font-semibold uppercase tracking-widest transition-colors"
                            >
                                View Concepts
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest transition-colors"
                            >
                                Book Strategy Call
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trustMetrics.map((metric) => (
                        <div key={metric.label} className="surface-panel bg-zinc-900/50 border-zinc-800 p-6 rounded-sm flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-secondary">{metric.label}</p>
                            <p className="text-[24px] font-semibold text-primary">{metric.value}</p>
                        </div>
                    ))}
                </section>

                <section className="max-w-6xl mx-auto mt-10 surface-panel bg-zinc-900/50 border-zinc-800 p-8 md:p-10 rounded-sm">
                    <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
                        <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest">Risk Reversal</p>
                        <h2 className="text-[30px] sm:text-[38px] font-semibold text-primary tracking-tight">
                            Built on enterprise edge networks so your site does not crash when demand spikes.
                        </h2>
                        <p className="text-[15px] text-secondary leading-relaxed">
                            Your growth moments are too valuable for fragile templates. Axiom infrastructure is engineered for reliability under real local market pressure.
                        </p>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {riskCards.map((card) => (
                        <article key={card.title} className="surface-panel bg-zinc-900/50 border-zinc-800 p-7 rounded-sm flex flex-col gap-4">
                            <h3 className="text-[22px] font-semibold text-primary tracking-tight">{card.title}</h3>
                            <p className="text-[14px] text-secondary leading-relaxed">{card.desc}</p>
                        </article>
                    ))}
                </section>
            </div>
        </>
    );
};

export default Home;
