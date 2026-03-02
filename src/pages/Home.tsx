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
        title: 'Your Phones Ring During the Storm — Not After',
        desc: 'When the first heatwave hits and every homeowner in town is searching for AC repair, your site stays online while your competitors\' sites crash. That\'s the difference between dispatching trucks and losing leads.'
    },
    {
        num: '02',
        title: 'Look Like the Company That Does $500K+ Jobs',
        desc: 'Homeowners judge the quality of your work by the quality of your website. If your site looks like a template, they assume your work is the same. We fix that.'
    },
    {
        num: '03',
        title: 'Only Qualified Calls Hit Your Dispatch Board',
        desc: 'No more wasting your crew\'s time on tire-kickers who want a free quote and then ghost. Our intake funnels pre-qualify leads so you only roll trucks for real jobs.'
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
                        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,103,0,0.12)_0%,transparent_70%)] pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-[var(--accent)]/50"></div>
                                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Professional Tier Infrastructure</p>
                            </div>

                            <h1 className="text-[38px] sm:text-[50px] font-semibold text-white tracking-tight leading-[1.06]">
                                Command your market with a revenue‑generating website.
                            </h1>

                            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-xl">
                                We engineer blazing‑fast, conversion‑focused web infrastructure for service businesses that want to outclass competitors and stay online during storms.
                            </p>

                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex flex-col sm:flex-row gap-3">
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
                                <p className="text-[12px] text-[var(--text-secondary)]/70 font-mono">
                                    Custom engagements starting at <span className="text-white font-semibold">$7,500</span>. Only <span className="text-[var(--accent)]">4 partner slots</span> available per month.
                                </p>
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

                {/* ──── SOCIAL PROOF ──── */}
                <section className="max-w-[1100px] mx-auto mt-5">
                    <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-8 md:p-10">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="text-[40px] leading-none text-[var(--accent)]/20 font-serif shrink-0">"</div>
                            <div className="flex flex-col gap-4 flex-1">
                                <p className="text-[16px] text-white/90 leading-relaxed italic">
                                    Since upgrading our infrastructure, our emergency dispatch rate doubled. No more wasted truck rolls. When the phones light up during a cold snap, every call is a real job.
                                </p>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1d25] border border-[#2a2d35] flex items-center justify-center shrink-0">
                                        <span className="text-[13px] font-bold text-white/50">JR</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                                            ))}
                                        </div>
                                        <p className="text-[12px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">Local HVAC Operator · Southern Ontario</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                When storms hit and demand spikes, your site stays up. Period.
                            </h2>
                            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[680px] mx-auto">
                                Every contractor dreads the moment their site goes down during peak season. We deploy on the same infrastructure used by Fortune 500 companies — not some shared GoDaddy server that buckles under pressure.
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
                                    <p className="text-[12px] font-mono text-[var(--text-secondary)] mt-2 uppercase tracking-widest">Professional Tier</p>
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

                {/* ──── THE AXIOM STORY ──── */}
                <section className="max-w-[1100px] mx-auto mt-10">
                    <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[1px] w-8 bg-[var(--accent)]/50"></div>
                            <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">The Axiom Story</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex-1 flex flex-col gap-5">
                                <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight leading-snug">
                                    This wasn't built in a boardroom.
                                </h2>
                                {/* Mobile View: Truncated */}
                                <div className="md:hidden flex flex-col gap-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                                    <p>
                                        Axiom was built because I saw $10M roofing and HVAC firms losing six figures every year to slow sites and "marketing" agencies that don't understand the pressure of a heatwave.
                                    </p>
                                    <details className="group mt-1">
                                        <summary className="w-full min-h-[48px] border border-[var(--border-subtle)] bg-[var(--bg-main)] text-white hover:border-[var(--accent)]/50 rounded-[4px] text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors list-none outline-none [&::-webkit-details-marker]:hidden">
                                            <span className="group-open:hidden">Read the Full Story</span>
                                            <span className="hidden group-open:block">Hide Story</span>
                                            <svg className="w-4 h-4 transition-transform group-open:-rotate-180 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </summary>
                                        <div className="pt-5 flex flex-col gap-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                                            <p>
                                                These agencies sell logos and colour palettes. They don't understand that when a storm rolls through at 2&nbsp;AM and every homeowner in the county is searching for emergency repair, your site needs to be the one that loads — not the one that crashes.
                                            </p>
                                            <p>
                                                I'm an engineer, not a designer. I build systems that capture revenue under pressure. That's why Axiom exists — to give serious contractors the same calibre of web infrastructure that Fortune 500 companies take for granted.
                                            </p>
                                        </div>
                                    </details>
                                </div>

                                {/* Desktop View: Full Length */}
                                <div className="hidden md:flex flex-col gap-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                                    <p>
                                        Axiom was built because I saw $10M roofing and HVAC firms losing six figures every year to slow sites and "marketing" agencies that don't understand the pressure of a heatwave.
                                    </p>
                                    <p>
                                        These agencies sell logos and colour palettes. They don't understand that when a storm rolls through at 2&nbsp;AM and every homeowner in the county is searching for emergency repair, your site needs to be the one that loads — not the one that crashes.
                                    </p>
                                    <p>
                                        I'm an engineer, not a designer. I build systems that capture revenue under pressure. That's why Axiom exists — to give serious contractors the same calibre of web infrastructure that Fortune 500 companies take for granted.
                                    </p>
                                </div>
                                <p className="text-[12px] font-mono text-[var(--text-secondary)]/60 uppercase tracking-widest mt-2">
                                    — Aidan · Founder, Axiom Infrastructure
                                </p>
                            </div>

                            <div className="lg:w-[320px] shrink-0 flex flex-col gap-4">
                                {[
                                    { label: 'Approach', value: 'Engineering-First' },
                                    { label: 'Clients', value: 'Service Businesses' },
                                    { label: 'Base', value: 'Kitchener, Ontario' },
                                    { label: 'Partners / Month', value: '4 Maximum' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-4 flex flex-col gap-1">
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</p>
                                        <p className="text-[18px] font-semibold text-white tracking-tight">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
