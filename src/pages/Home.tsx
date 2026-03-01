import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const trustMetrics = [
    { label: 'Load Performance', value: 'Sub-Second', icon: '⚡' },
    { label: 'Infrastructure', value: 'Edge Deployed', icon: '🌐' },
    { label: 'Security Profile', value: 'Enterprise Grade', icon: '🔒' }
];

const valueProps = [
    {
        num: '01',
        title: 'No More Lost Leads During Peak Demand',
        desc: 'Storm alerts and heatwaves should generate revenue, not downtime. We build infrastructure designed to stay online under pressure.'
    },
    {
        num: '02',
        title: 'Premium Positioning That Wins Better Jobs',
        desc: 'Your website should make your largest local competitor look outdated and unprepared.'
    },
    {
        num: '03',
        title: 'Structured Funnels That Convert',
        desc: 'Clear hierarchy, clear offers, and clear CTAs turn high-intent visitors into qualified calls.'
    }
];

const industries = [
    { name: 'HVAC', accent: '#38bdf8' },
    { name: 'Roofing', accent: '#ea580c' },
    { name: 'Landscaping', accent: '#22c55e' },
];

const Home: React.FC = () => {
    return (
        <>
            <SEO
                title="Axiom Infrastructure | Premium Contractor Web Infrastructure"
                description="Edge-deployed web infrastructure for HVAC, roofing, and landscaping businesses that need premium design and stronger lead quality."
            />

            <div className="pt-36 pb-24 px-6">
                {/* ──── HERO ──── */}
                <section className="max-w-[1100px] mx-auto">
                    <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-16 relative overflow-hidden">
                        {/* Subtle gradient glow behind hero */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(90,114,155,0.12)_0%,transparent_70%)] pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-[var(--accent)]/50"></div>
                                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Authority Tier Infrastructure</p>
                            </div>

                            <h1 className="text-[38px] sm:text-[50px] font-semibold text-white tracking-tight leading-[1.06]">
                                The website system serious contractors use to win higher‑paying jobs.
                            </h1>

                            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-xl">
                                We build premium, conversion-focused infrastructure for local service businesses that need stronger trust, better lead quality, and reliable uptime.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link
                                    to="/concepts"
                                    className="inline-flex items-center justify-center min-h-[52px] px-8 border border-[#2a2d35] bg-[#161820] text-white hover:bg-[#1c1f28] hover:border-[#3a3d45] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                                >
                                    View Concepts
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center min-h-[52px] px-8 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                                >
                                    Book Strategy Call
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── TRUST METRICS ROW ──── */}
                <section className="max-w-[1100px] mx-auto mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trustMetrics.map((metric) => (
                        <div key={metric.label} className="bg-[#111214] border border-[#1e2028] rounded-lg p-6 flex items-center gap-5">
                            <div className="w-10 h-10 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/15 flex items-center justify-center text-[18px] shrink-0">
                                {metric.icon}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">{metric.label}</p>
                                <p className="text-[20px] font-semibold text-white tracking-tight leading-none">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ──── RISK REVERSAL BANNER ──── */}
                <section className="max-w-[1100px] mx-auto mt-10">
                    <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                        <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Risk Reversal</p>
                                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                            </div>
                            <h2 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-tight">
                                Built on enterprise edge networks so your site does not crash when demand spikes.
                            </h2>
                            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[680px] mx-auto">
                                Your growth moments are too valuable for fragile templates. Axiom infrastructure is engineered for reliability under real local market pressure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ──── VALUE PROPOSITION CARDS ──── */}
                <section className="max-w-[1100px] mx-auto mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {valueProps.map((card) => (
                        <article key={card.title} className="bg-[#111214] border border-[#1e2028] rounded-lg p-8 flex flex-col gap-4 group hover:border-[#2a2d38] transition-colors">
                            <span className="text-[28px] font-bold text-[var(--accent)]/20 font-mono">{card.num}</span>
                            <h3 className="text-[20px] font-semibold text-white tracking-tight leading-snug">{card.title}</h3>
                            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
                        </article>
                    ))}
                </section>

                {/* ──── INDUSTRIES SERVED ──── */}
                <section className="max-w-[1100px] mx-auto mt-10">
                    <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                        <div className="text-center flex flex-col gap-5 mb-10">
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Industries</p>
                                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                            </div>
                            <h2 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-tight">
                                Engineered for service-based industries.
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {industries.map((ind) => (
                                <div key={ind.name} className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-6 text-center">
                                    <div className="w-3 h-3 rounded-full mx-auto mb-4" style={{ backgroundColor: ind.accent, boxShadow: `0 0 12px ${ind.accent}40` }}></div>
                                    <p className="text-[16px] font-semibold text-white">{ind.name}</p>
                                    <p className="text-[12px] font-mono text-[var(--text-secondary)] mt-2 uppercase tracking-widest">Authority Tier</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                to="/concepts"
                                className="inline-flex items-center justify-center min-h-[48px] px-8 border border-[#2a2d35] bg-[#161820] text-white hover:bg-[#1c1f28] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                            >
                                View Industry Concepts →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
