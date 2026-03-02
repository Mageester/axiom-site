import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Manifesto: React.FC = () => {
    const [showSticky, setShowSticky] = useState(false);
    const [lostCalls, setLostCalls] = useState(2);
    const avgTicket = 5000;
    const annualLeak = lostCalls * avgTicket * 12;

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 350);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
            <SEO
                title="The $100,000 Leak | Axiom Infrastructure"
                description="Why cheap websites fail during peak season and how the math of downtime costs HVAC, roofing, and landscaping firms six figures a year."
            />

            {/* ──── MANIFESTO HEADER ──── */}
            <header className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5 mb-16 sm:mb-20">
                <p className="eyebrow-center">Infrastructure Whitepaper</p>

                <h1 className="text-[28px] sm:text-[42px] md:text-[48px] font-semibold tracking-tight leading-[1.08]">
                    The $100,000 Leak: Why Cheap Websites Fail During Peak Season.
                </h1>

                <p className="lead text-center mx-auto">
                    The math your web designer never showed you.
                </p>
            </header>

            {/* ──── ARTICLE BODY ──── */}
            <article className="max-w-2xl mx-auto flex flex-col gap-0">

                {/* ── SECTION 1: THE PROBLEM ── */}
                <section className="mb-6 sm:mb-8">
                    <p className="eyebrow mb-5 sm:mb-6">The Problem</p>

                    <div className="prose-editorial">
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

                    {/* Pull quote — breaks reading rhythm */}
                    <div className="pull-quote">
                        <p>The calls don't wait. They go to whoever loads first.</p>
                    </div>
                </section>

                <div className="section-rule"></div>

                {/* ── SECTION 2: THE MATH ── */}
                <section className="my-10 sm:my-14">
                    <p className="eyebrow mb-5 sm:mb-6" style={{ color: 'var(--accent)' }}>The Math of Downtime</p>

                    <p className="lead mb-8 sm:mb-10">
                        Adjust the slider below to see the math your web designer never showed you.
                    </p>

                    {/* Calculator Panel */}
                    <div className="panel p-5 sm:p-8 md:p-10 flex flex-col gap-8">
                        {/* Slider */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end">
                                <label htmlFor="lost-calls-slider" className="text-[14px] sm:text-[15px] font-semibold text-[var(--text-heading)] tracking-tight">
                                    Lost Emergency Calls per Month
                                </label>
                                <span className="text-[24px] sm:text-[28px] font-bold text-[var(--accent)] font-grotesk tabular-nums">{lostCalls}</span>
                            </div>
                            <input
                                id="lost-calls-slider"
                                type="range"
                                min="1"
                                max="10"
                                value={lostCalls}
                                onChange={(e) => setLostCalls(Number(e.target.value))}
                                className="w-full h-2 bg-[#1a1d25] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
                            />
                            <p className="text-[12px] text-[var(--text-secondary)]">Due to downtime or slow competitor load speeds.</p>
                        </div>

                        {/* Calculation breakdown */}
                        <div className="flex flex-col gap-3 py-6 border-y border-[var(--border-subtle)]">
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-[var(--text-secondary)]">Average HVAC Ticket</span>
                                <span className="text-[15px] sm:text-[16px] font-grotesk font-medium text-[var(--text-heading)] tabular-nums">${avgTicket.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-[var(--text-secondary)]">Months per Year</span>
                                <span className="text-[15px] sm:text-[16px] font-grotesk font-medium text-[var(--text-heading)] tabular-nums">12</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[14px] font-medium text-[var(--text-secondary)]">Calculation</span>
                                <span className="text-[14px] font-grotesk font-medium text-[var(--text-secondary)] tabular-nums">
                                    {lostCalls} × ${avgTicket.toLocaleString()} × 12
                                </span>
                            </div>
                        </div>

                        {/* Big figure — dramatic emphasis */}
                        <div className="flex flex-col items-center text-center gap-3 pt-2">
                            <p className="big-figure-label text-[#ef4444]">Total Annual Revenue Leak</p>
                            <p className="big-figure text-[36px] sm:text-[48px] md:text-[56px] text-[#ef4444] tabular-nums">
                                ${annualLeak.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Thesis line — breaks rhythm */}
                    <p className="thesis text-[#ef4444]/90">
                        That's not a marketing budget. That's a leak in your business.
                    </p>
                </section>

                <div className="section-rule"></div>

                {/* ── SECTION 3: THE FIX ── */}
                <section className="my-10 sm:my-14">
                    <p className="eyebrow mb-5 sm:mb-6" style={{ color: '#34d399' }}>The Axiom Fix</p>

                    <div className="prose-editorial">
                        <p>
                            Axiom deploys your site on the same global edge network used by Shopify, Discord, and Cloudflare itself. Your pages are served from 300+ data centres worldwide.
                        </p>
                        <p>
                            When that heatwave hits and 500 people search for AC repair at the same time, your site loads in <strong className="text-emerald-400">0.4 seconds</strong>. Not 3.5. Not "kind of fast." Sub-second, every time, under any load.
                        </p>
                        <p>
                            You capture the calls your competitors' sites are too slow to handle. One emergency install pays for your entire year of infrastructure. Every call after that is pure margin.
                        </p>
                    </div>

                    {/* Stat bar — hard proof, breaks reading rhythm */}
                    <div className="stat-bar grid-cols-3 mt-10">
                        {[
                            { label: 'Edge Load Time', value: '0.4s', color: 'text-emerald-400' },
                            { label: 'Uptime SLA', value: '99.99%', color: 'text-emerald-400' },
                            { label: 'Global Edge Nodes', value: '300+', color: 'text-emerald-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="stat-bar-cell">
                                <p className={`stat-bar-value text-[22px] sm:text-[28px] ${stat.color}`}>{stat.value}</p>
                                <p className="stat-bar-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pull quote — victory statement */}
                    <div className="pull-quote" style={{ borderColor: '#34d399' }}>
                        <p>One emergency install during peak season pays for your entire year of infrastructure.</p>
                    </div>
                </section>

                <div className="section-rule"></div>

                {/* ── SECTION 3.5: THE EVIDENCE ── */}
                <section className="my-10 sm:my-14">
                    <p className="eyebrow mb-5 sm:mb-6">The Evidence</p>

                    <div className="prose-editorial">
                        <p>
                            We don't show mockups. Every Axiom concept architecture is a live, measurable deployment on Cloudflare's global edge. Here's what we've built for contractors in HVAC, roofing, and landscaping — purpose-engineered to capture revenue under pressure.
                        </p>
                    </div>

                    {/* Deployment metrics */}
                    <div className="stat-bar grid-cols-3 mt-8">
                        {[
                            { label: 'Avg. Lighthouse', value: '98', color: 'text-emerald-400' },
                            { label: 'Avg. Load Time', value: '0.38s', color: 'text-emerald-400' },
                            { label: 'Deployments Live', value: '3', color: 'text-[var(--accent)]' },
                        ].map((stat) => (
                            <div key={stat.label} className="stat-bar-cell">
                                <p className={`stat-bar-value text-[22px] sm:text-[28px] ${stat.color}`}>{stat.value}</p>
                                <p className="stat-bar-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Competitive risk — tighten the screw */}
                    <div className="pull-quote" style={{ borderColor: 'var(--accent)' }}>
                        <p>While you're reading this, the contractor down the road might be deploying with us. We take 4 partners per month. That's it.</p>
                    </div>

                    <div className="text-center mt-6">
                        <Link
                            to="/concepts"
                            className="inline-flex items-center justify-center min-h-[44px] px-6 border border-[var(--border-panel)] bg-[var(--bg-surface)] text-white hover:bg-[#1c1f28] text-[11px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                        >
                            View Live Deployments →
                        </Link>
                    </div>
                </section>

                <div className="section-rule"></div>

                {/* ── SECTION 4: CTA ── */}
                <section className="inline-cta mt-10 sm:mt-14">
                    <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                        Plug the leak.
                    </h2>
                    <p className="lead text-center mx-auto">
                        Stop losing six figures a year to a website that wasn't built for peak season. See if Axiom is the right fit for your operation.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    >
                        Plug the Leak with Axiom Infrastructure
                    </Link>
                    <p className="text-[12px] text-[var(--text-secondary)] font-grotesk">
                        Custom engagements starting at <span className="text-[var(--text-heading)] font-semibold">$7,500</span>. <span className="text-[var(--accent)] font-semibold">Only 2 of 4 Partner Slots Remaining for This Month.</span>
                    </p>
                </section>
            </article>

            {/* Mobile-only sticky CTA */}
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
