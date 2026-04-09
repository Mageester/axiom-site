import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { shouldDisableHeavyMotion } from '../lib/motionPreferences';
import { SEO_ROUTES } from '../lib/seo';

const Manifesto: React.FC = () => {
    const [lostCalls, setLostCalls] = useState(2);
    const avgTicket = 5000;
    const annualLeak = lostCalls * avgTicket * 12;
    const [displayAnnualLeak, setDisplayAnnualLeak] = useState(annualLeak);
    const disableHeavyMotion = shouldDisableHeavyMotion();
    const displayMonthlyLeak = Math.round(displayAnnualLeak / 12);
    const infrastructureInvestment = 7500;
    const paybackMonths = displayMonthlyLeak > 0 ? infrastructureInvestment / displayMonthlyLeak : 0;
    const outputTone = displayAnnualLeak >= 0 ? 'text-axiom-accent' : 'text-[#d27474]';

    useEffect(() => {
        if (disableHeavyMotion) {
            setDisplayAnnualLeak(annualLeak);
            return;
        }

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
    }, [annualLeak, disableHeavyMotion]);

    return (
        <div className="page-shell">
            <SEO
                {...SEO_ROUTES.manifesto}
            />

            {/* ---- MANIFESTO HEADER ---- */}
            <header className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-5 mb-16 sm:mb-20">
                <p className="eyebrow-center">The real cost</p>

                <h1 className="hero-headline hero-fade-in">
                    Why weak sites cost money.
                </h1>

                <p className="hero-subheading text-center mx-auto">
                    The math behind a slow or unclear site.
                </p>
            </header>

            {/* ---- ARTICLE BODY ---- */}
            <article className="max-w-[720px] mx-auto flex flex-col gap-0 leading-[1.6]">

                {/* ---- SECTION 1: THE PROBLEM ---- */}
                <section className="mb-6 sm:mb-8">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">THE PROBLEM</h2>

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
                        When it's busy, the fastest site gets the call. That's it.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 2: THE MATH ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">THE MATH</h2>

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
                            <p className="font-axiomMono text-axiom-text-mute text-[11px] uppercase tracking-[0.2em] mb-4">COST CALCULATOR</p>
                            <h3 className="hero-headline text-[30px] sm:text-[36px] mb-6">What a slow site really costs</h3>
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
                                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute mb-2">Lost per year</p>
                                        <p className={`font-axiomMono text-[30px] leading-none tabular-nums ${outputTone}`}>
                                            ${displayAnnualLeak.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="axiom-bento-card p-4">
                                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.12em] text-axiom-text-mute mb-2">Lost per month</p>
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
                        You're not losing calls randomly. Your site is too slow to catch them.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 3: THE FIX ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">THE FIX</h2>

                    <div className="prose-editorial !leading-[1.6] max-w-[720px]">
                        <p>
                            We put your site on the same network used by Shopify and Cloudflare. Your pages load from 300+ locations worldwide.
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
                            { label: 'Load time', value: '0.4s', color: 'text-axiom-accent' },
                            { label: 'Uptime', value: '99.99%', color: 'text-axiom-accent' },
                            { label: 'Server locations', value: '300+', color: 'text-axiom-accent' },
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
                        A site that stays fast under pressure keeps making money while the other guy's site is still loading.
                    </div>
                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 3.5: THE EVIDENCE ---- */}
                <section className="my-10 sm:my-14">
                    <h2 className="axiom-command-heading mb-5 sm:mb-6">THE PROOF</h2>

                    <div className="prose-editorial !leading-[1.6] max-w-[720px]">
                        <p>
                            We don't show mockups. Every site we build is live, fast, and measurable. Here's what we've built for contractors in HVAC, roofing, and landscaping.
                        </p>
                    </div>

                    {/* Deployment metrics */}
                    <div className="stat-bar grid-cols-3 mt-8">
                        {[
                            { label: 'Avg. Lighthouse', value: '98', color: 'text-axiom-accent' },
                            { label: 'Avg. Load Time', value: '0.38s', color: 'text-axiom-accent' },
                            { label: 'Sites Live', value: '3', color: 'text-axiom-accent' },
                        ].map((stat) => (
                            <div key={stat.label} className="stat-bar-cell">
                                <p className={`stat-bar-value text-[22px] sm:text-[28px] ${stat.color}`}>{stat.value}</p>
                                <p className="stat-bar-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Competitive risk — tighten the screw */}
                    <div className="pull-quote" style={{ borderColor: 'var(--accent)' }}>
                        <p>We take on 4 projects a month. That's it.</p>
                    </div>

                </section>

                <div className="axiom-chapter-divider"></div>

                {/* ---- SECTION 4: CTA ---- */}
                <section className="inline-cta mt-10 sm:mt-14">
                    <h2 className="axiom-command-heading mb-5 text-center">NEXT STEP</h2>
                    <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                        Plug the leak.
                    </h2>
                    <p className="lead text-center mx-auto">
                        Stop losing money to a site that can't keep up when it matters.
                    </p>
                    <Link
                        to="/start-a-project"
                        className="btn-primary btn-lg"
                    >
                        Start a project
                    </Link>
                    <Link
                        to={CTA.work.to}
                        className="btn-secondary mt-4"
                    >
                        {CTA.work.label}
                    </Link>
                    <p className="text-[12px] text-axiom-text-mute font-grotesk">
                        Starting at <span className="text-axiom-text-main font-semibold">$500 CAD</span>. <span className="text-axiom-accent font-semibold">2 spots left this month.</span>
                    </p>
                </section>
            </article>

        </div>
    );
};

export default Manifesto;
