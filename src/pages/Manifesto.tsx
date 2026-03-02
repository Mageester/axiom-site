import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Manifesto: React.FC = () => {
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero section (roughly 350px down)
            setShowSticky(window.scrollY > 350);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="The $100,000 Leak | Axiom Infrastructure"
                description="Why cheap websites fail during peak season and how the math of downtime costs HVAC, roofing, and landscaping firms six figures a year."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-14">
                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                <p className="text-[11px] font-mono text-[var(--accent)]/70 uppercase tracking-[0.2em]">Infrastructure Whitepaper</p>
                <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                <h1 className="text-[34px] sm:text-[48px] font-semibold text-white tracking-tight leading-[1.06]">
                    The $100,000 Leak: Why Cheap Websites Fail During Peak Season.
                </h1>
                <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                    The math your web designer never showed you.
                </p>
            </section>

            {/* The Problem */}
            <article className="max-w-3xl mx-auto flex flex-col gap-10">
                <section className="bg-[#111214] border border-[#1e2028] rounded-lg p-8 md:p-12 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[var(--accent)]/50"></div>
                        <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">The Problem</p>
                    </div>

                    <div className="flex flex-col gap-5 text-[16px] text-[var(--text-secondary)] leading-[1.7]">
                        <p>
                            Every contractor knows the feeling. It's July. The first real heatwave hits. Every phone in town is ringing. Homeowners are searching "AC repair near me" at 2 AM.
                        </p>
                        <p>
                            Your $200/month marketing agency built your site on a shared hosting plan. It handles 50 visitors fine. But when 500 people hit it at once? It chokes. It slows. It crashes.
                        </p>
                        <p>
                            Those emergency calls — each worth $3,000 to $15,000 — go to whoever loads first. That's not you. That's the guy down the road with the faster site.
                        </p>
                    </div>
                </section>

                {/* The Math */}
                <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 md:p-12 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                        <p className="text-[11px] font-mono text-[var(--accent)]/80 uppercase tracking-[0.2em]">The Math of Downtime</p>
                    </div>

                    <p className="hidden md:block text-[16px] text-[var(--text-secondary)] leading-[1.7]">
                        Let's do the math that your web designer never showed you.
                    </p>

                    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Average HVAC Emergency Ticket', value: '$5,000', color: 'text-white' },
                            { label: 'Competitor Avg. Load Time', value: '3.5 seconds', color: 'text-[var(--accent)]/80' },
                            { label: 'Bounce Rate at 3.5s', value: '40%', color: 'text-[var(--accent)]/80' },
                            { label: 'Emergency Calls Lost / Month', value: '2 minimum', color: 'text-[var(--accent)]/80' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-md p-5 flex flex-col gap-1">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</p>
                                <p className={`text-[24px] font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block bg-[var(--bg-main)] border border-[var(--accent)]/20 rounded-md p-6 text-center">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]/80 mb-2">Annual Revenue Leak</p>
                        <p className="text-[36px] sm:text-[44px] font-bold text-[var(--accent)] tracking-tight">$120,000 / year</p>
                        <p className="text-[14px] text-[var(--text-secondary)] mt-2">
                            2 lost emergency calls × $5,000 avg. ticket × 12 months = revenue you're giving to competitors.
                        </p>
                    </div>

                    {/* Mobile-only condensed stats */}
                    <div className="md:hidden flex items-center justify-between bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-md p-4 mt-2">
                        <div className="flex flex-col gap-1 text-center flex-1 border-r border-[var(--border-subtle)]">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Ticket</span>
                            <span className="text-[16px] font-bold text-white">$5K</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center flex-1 border-r border-[var(--border-subtle)]">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]">Bounce</span>
                            <span className="text-[16px] font-bold text-[var(--accent)]">40%</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center flex-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]">Leak</span>
                            <span className="text-[16px] font-bold text-[var(--accent)]">$120K</span>
                        </div>
                    </div>
                </section>

                {/* The Fix */}
                <section className="bg-[#111214] border border-[#1e2028] rounded-lg p-8 md:p-12 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-emerald-500/40"></div>
                        <p className="text-[11px] font-mono text-emerald-400/70 uppercase tracking-[0.2em]">The Axiom Fix</p>
                    </div>

                    <div className="flex flex-col gap-5 text-[16px] text-[var(--text-secondary)] leading-[1.7]">
                        <p>
                            Axiom deploys your site on the same global edge network used by Shopify, Discord, and Cloudflare itself. Your pages are served from 300+ data centres worldwide.
                        </p>
                        <p>
                            When that heatwave hits and 500 people search for AC repair at the same time, your site loads in <span className="text-emerald-400 font-semibold">0.4 seconds</span>. Not 3.5. Not "kind of fast." Sub-second, every time, under any load.
                        </p>
                        <p>
                            You capture the calls your competitors' sites are too slow to handle. One emergency install pays for your entire year of infrastructure. Every call after that is pure margin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Edge Load Time', value: '0.4s', color: 'text-emerald-400' },
                            { label: 'Uptime SLA', value: '99.99%', color: 'text-emerald-400' },
                            { label: 'Global Edge Nodes', value: '300+', color: 'text-emerald-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-[#0e0f12] border border-emerald-500/15 rounded-md p-5 flex flex-col gap-1 text-center">
                                <p className={`text-[28px] font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-[#111214] border border-[var(--accent)]/20 rounded-lg p-10 md:p-14 text-center flex flex-col items-center gap-5">
                    <h2 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-tight">
                        Plug the leak.
                    </h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-lg">
                        Stop losing six figures a year to a website that wasn't built for peak season. See if Axiom is the right fit for your operation.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    >
                        Plug the Leak with Axiom Infrastructure
                    </Link>
                    <p className="text-[12px] text-[var(--text-secondary)]/70 font-mono">
                        Custom engagements starting at <span className="text-white font-semibold">$7,500</span>. Only <span className="text-[var(--accent)]">4 partner slots</span> available per month.
                    </p>
                </section>
            </article>

            {/* Mobile-only sticky CTA (Shows on scroll, sits above mobile nav) */}
            <div className={`md:hidden fixed z-[45] bottom-[72px] left-0 w-full px-4 py-2 pointer-events-none transition-all duration-300 ease-in-out ${showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="pointer-events-auto">
                    <Link
                        to="/contact"
                        className="flex items-center justify-center w-full min-h-[52px] bg-[var(--accent)] text-white text-[13px] font-bold uppercase tracking-widest rounded-md shadow-[0_8px_25px_rgba(255,103,0,0.35)] hover:bg-[#ff7a1f] active:scale-[0.98] transition-all"
                    >
                        Plug the Leak
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Manifesto;
