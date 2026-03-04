import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Manifesto: React.FC = () => {
    const [showSticky, setShowSticky] = useState(false);
    const [lostCalls, setLostCalls] = useState(2);
    const avgTicket = 5000;
    const annualLeak = lostCalls * avgTicket * 12;
    const [displayAnnualLeak, setDisplayAnnualLeak] = useState(annualLeak);
    const displayMonthlyLeak = Math.round(displayAnnualLeak / 12);
    const infrastructureInvestment = 7500;
    const paybackMonths = displayMonthlyLeak > 0 ? infrastructureInvestment / displayMonthlyLeak : 0;
    const outputTone = displayAnnualLeak >= 0 ? 'text-axiom-accent' : 'text-[#d27474]';

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 350);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const start = displayAnnualLeak;
        const delta = annualLeak - start;
        const startTime = performance.now();
        let raf = 0;
        const animate = (now: number) => {
            const progress = Math.min((now - startTime) / 450, 1);
            setDisplayAnnualLeak(Math.round(start + delta * progress));
            if (progress < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [annualLeak]);

    return (
        <div className="page-shell">
            <SEO
                title="The $100,000 Leak | Axiom Infrastructure"
                description="Why cheap websites fail during peak season and how the math of downtime costs HVAC, roofing, and landscaping firms six figures a year."
            />

            {/* ---- MANIFESTO HEADER ---- */}
            <header className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-5 mb-16 sm:mb-20">
                <p className="eyebrow-center">Infrastructure Whitepaper</p>

                <h1 className="hero-headline hero-fade-in">
                    The $100,000 Leak: Why Cheap Websites Fail During Peak Season.
                </h1>

                <p className="hero-subheading text-center mx-auto">
                    The math your web designer never showed you.
                </p>
            </header>

            {/* ---- ARTICLE BODY ---- */}
            <article className="max-w-[720px] mx-auto flex flex-col gap-0 leading-[1.6]">

                {/* ---- SECTION 1: THE PROBLEM ---- */}
                <section className="mb-6 sm:mb-8">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">INFRASTRUCTURE COMMAND</h2>

                    <div className="prose-editorial !leading-[1.6] max-w-[720px]">
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
                    <div className="axiom-mono-callout">
                        AXIOM // In peak season, speed wins the call before your crew ever picks up the phone.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 2: THE MATH ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">MANDATORY PRECISION</h2>

                    <p className="lead mb-8 sm:mb-10">
                        Adjust the slider below to see the math your web designer never showed you.
                    </p>

                    {/* Calculator axiom-bento */}
                    <div className="axiom-bento relative overflow-hidden p-0 bg-axiom-surface border border-axiom-border">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-30"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />
                        <div className="h-px w-full bg-axiom-accent" />
                        <div className="relative axiom-glass border-0 rounded-none p-5 sm:p-8 md:p-10">
                            <p className="font-axiomMono text-axiom-text-mute text-[11px] uppercase tracking-[0.2em] mb-4">ROI DASHBOARD</p>
                            <h3 className="hero-headline text-[30px] sm:text-[36px] mb-6">The $120k Dashboard</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="lost-calls-slider" className="font-axiomMono text-[12px] uppercase tracking-[0.12em] text-axiom-text-mute">
                                                Lost Emergency Calls / Month
                                            </label>
                                            <button
                                                type="button"
                                                title="Estimated high-intent calls lost from slow load speeds and downtime."
                                                className="font-axiomMono text-[11px] text-axiom-text-mute border border-axiom-border rounded-full w-5 h-5"
                                            >
                                                ?
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-axiomMono text-[12px] text-axiom-text-mute">Current estimate</span>
                                            <span className="font-axiomMono text-[26px] leading-none text-axiom-accent tabular-nums">{lostCalls}</span>
                                        </div>
                                        <input
                                            id="lost-calls-slider"
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={lostCalls}
                                            onChange={(e) => setLostCalls(Number(e.target.value))}
                                            className="w-full h-2 rounded-full cursor-pointer accent-axiom-accent"
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="h-[10px] rounded mt-2 border border-axiom-border/60"
                                            style={{
                                                backgroundImage: 'repeating-linear-gradient(to right, rgba(228,87,46,0.45), rgba(228,87,46,0.45) 1px, transparent 1px, transparent 10%)',
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <label className="space-y-2">
                                            <span className="flex items-center gap-2 font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute">
                                                Avg Ticket
                                                <button
                                                    type="button"
                                                    title="Financial baseline used by the model."
                                                    className="font-axiomMono text-[10px] text-axiom-text-mute border border-axiom-border rounded-full w-4 h-4 leading-none"
                                                >
                                                    ?
                                                </button>
                                            </span>
                                            <input
                                                type="number"
                                                value={avgTicket}
                                                readOnly
                                                className="w-full bg-axiom-base/60 border border-axiom-border rounded-lg px-3 py-2 font-axiomMono text-axiom-text-main focus:outline-none focus:border-axiom-accent/70"
                                            />
                                        </label>
                                        <label className="space-y-2">
                                            <span className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute">Months / Year</span>
                                            <input
                                                type="number"
                                                value={12}
                                                readOnly
                                                className="w-full bg-axiom-base/60 border border-axiom-border rounded-lg px-3 py-2 font-axiomMono text-axiom-text-main focus:outline-none focus:border-axiom-accent/70"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="axiom-bento-card p-4">
                                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute mb-2">Annual ROI Leak</p>
                                        <p className={`font-axiomMono text-[30px] leading-none tabular-nums ${outputTone}`}>
                                            ${displayAnnualLeak.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="axiom-bento-card p-4">
                                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute mb-2">Monthly Recovery Potential</p>
                                        <p className="font-axiomMono text-[24px] leading-none tabular-nums text-axiom-text-main">
                                            ${displayMonthlyLeak.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="axiom-bento-card p-4">
                                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute mb-2">Payback Period</p>
                                        <p className="font-axiomMono text-[24px] leading-none tabular-nums text-axiom-text-main">
                                            {paybackMonths.toFixed(1)} months
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Thesis line — breaks rhythm */}
                    <p className="thesis text-axiom-text-main">
                        That's not a marketing budget. That's a leak in your business.
                    </p>
                    <div className="axiom-mono-callout">
                        AXIOM // Lost calls are not random. They are predictable infrastructure failure expressed as revenue loss.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 3: THE FIX ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">ELIMINATING ROI FRICTION</h2>

                    <div className="prose-editorial !leading-[1.6] max-w-[720px]">
                        <p>
                            Axiom deploys your site on the same global edge network used by Shopify, Discord, and Cloudflare itself. Your pages are served from 300+ data centres worldwide.
                        </p>
                        <p>
                            When that heatwave hits and 500 people search for AC repair at the same time, your site loads in <strong className="text-axiom-accent">0.4 seconds</strong>. Not 3.5. Not "kind of fast." Sub-second, every time, under any load.
                        </p>
                        <p>
                            You capture the calls your competitors' sites are too slow to handle. One emergency install pays for your entire year of infrastructure. Every call after that is pure margin.
                        </p>
                    </div>

                    {/* Stat bar — hard proof, breaks reading rhythm */}
                    <div className="stat-bar grid-cols-3 mt-10">
                        {[
                            { label: 'Edge Load Time', value: '0.4s', color: 'text-axiom-accent' },
                            { label: 'Uptime SLA', value: '99.99%', color: 'text-axiom-accent' },
                            { label: 'Global Edge Nodes', value: '300+', color: 'text-axiom-accent' },
                        ].map((stat) => (
                            <div key={stat.label} className="stat-bar-cell">
                                <p className={`stat-bar-value text-[22px] sm:text-[28px] ${stat.color}`}>{stat.value}</p>
                                <p className="stat-bar-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pull quote — victory statement */}
                    <div className="pull-quote" style={{ borderColor: 'var(--accent)' }}>
                        <p>One emergency install during peak season pays for your entire year of infrastructure.</p>
                    </div>
                    <div className="axiom-mono-callout">
                        AXIOM // Infrastructure that stays online under pressure compounds margin while competitors stall.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 3.5: THE EVIDENCE ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">THE ARCHITECTURE OF GROWTH</h2>

                    <div className="prose-editorial !leading-[1.6] max-w-[720px]">
                        <p>
                            We don't show mockups. Every Axiom concept architecture is a live, measurable deployment on Cloudflare's global edge. Here's what we've built for contractors in HVAC, roofing, and landscaping — purpose-engineered to capture revenue under pressure.
                        </p>
                    </div>

                    {/* Deployment metrics */}
                    <div className="stat-bar grid-cols-3 mt-8">
                        {[
                            { label: 'Avg. Lighthouse', value: '98', color: 'text-axiom-accent' },
                            { label: 'Avg. Load Time', value: '0.38s', color: 'text-axiom-accent' },
                            { label: 'Deployments Live', value: '3', color: 'text-axiom-accent' },
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
                            className="btn-secondary"
                        >
                            View Live Deployments →
                        </Link>
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 4: CTA ---- */}
                <section className="inline-cta mt-10 sm:mt-14">
                    <h2 className="axiom-command-heading mb-5 text-center">MACHINED SCALABILITY</h2>
                    <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                        Plug the leak.
                    </h2>
                    <p className="lead text-center mx-auto">
                        Stop losing six figures a year to a website that wasn't built for peak season. See if Axiom is the right fit for your operation.
                    </p>
                    <Link
                        to="/contact"
                        className="btn-primary btn-lg"
                    >
                        Plug the Leak with Axiom Infrastructure
                    </Link>
                    <p className="text-[12px] text-axiom-text-mute font-grotesk">
                        Custom engagements starting at <span className="text-axiom-text-main font-semibold">$500 CAD</span>. <span className="text-axiom-accent font-semibold">Only 2 of 4 Partner Slots Remaining for This Month.</span>
                    </p>
                </section>
            </article>

            {/* Mobile-only sticky CTA */}
            <div className={`md:hidden fixed z-[45] bottom-4 left-0 w-full px-4 py-2 pointer-events-none transition-all duration-300 ease-in-out ${showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="pointer-events-auto">
                    <Link
                        to="/contact"
                        className="btn-primary btn-lg magnetic-primary w-full"
                    >
                        Plug the Leak
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Manifesto;




