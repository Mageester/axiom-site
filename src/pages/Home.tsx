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

const infraSpec = [
    { label: 'Runtime', value: 'Cloudflare Workers (V8 Isolates)' },
    { label: 'Edge Network', value: '300+ cities, sub-50ms TTFB' },
    { label: 'TLS', value: 'HSTS Preloaded, TLS 1.3, A+ Rating' },
    { label: 'DNS', value: 'Anycast, <1ms resolution' },
    { label: 'Framework', value: 'React 18 + Vite, code-split at route level' },
    { label: 'Uptime SLA', value: '99.99% with automated failover' },
];

const Home: React.FC = () => {
    return (
        <>
            <SEO
                title="Axiom Infrastructure | Premium Contractor Web Infrastructure"
                description="Edge-deployed web infrastructure for HVAC, roofing, and landscaping businesses that need premium design and stronger lead quality."
            />

            <div className="pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
                {/* ──── HERO ──── */}
                <section className="max-w-[1100px] mx-auto">
                    <div className="panel p-8 sm:p-10 md:p-16 relative overflow-hidden">
                        {/* Subtle gradient glow */}
                        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,103,0,0.10)_0%,transparent_70%)] pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl flex flex-col gap-5 sm:gap-6">
                            <p className="eyebrow">Professional Tier Infrastructure</p>

                            <h1 className="text-[28px] sm:text-[42px] md:text-[50px] font-semibold tracking-tight leading-[1.08]">
                                Command your market with a revenue‑generating website.
                            </h1>

                            <p className="lead">
                                We engineer blazing‑fast, conversion‑focused web infrastructure for service businesses that want to outclass competitors and stay online during storms.
                            </p>

                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to="/manifesto"
                                        className="inline-flex items-center justify-center min-h-[52px] px-8 border border-[var(--border-panel)] bg-[var(--bg-surface)] text-white hover:bg-[#1c1f28] hover:border-[#3a3d45] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                                    >
                                        Read the $100K Leak Report
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center justify-center min-h-[52px] px-8 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                                    >
                                        Book Strategy Call
                                    </Link>
                                </div>
                                <p className="text-[12px] text-[var(--text-secondary)] font-grotesk">
                                    Custom engagements starting at <span className="text-[var(--text-heading)] font-semibold">$7,500</span>. <span className="text-[var(--accent)] font-semibold">Only 2 of 4 Partner Slots Remaining for This Month.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── PERFORMANCE GUARANTEE ──── */}
                <section className="max-w-[1100px] mx-auto mt-5 sm:mt-6">
                    <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-4 sm:p-6 text-center">
                        <p className="text-[13px] sm:text-[14px] text-[var(--text-body)] leading-relaxed">
                            <span className="font-bold text-[var(--text-heading)] uppercase tracking-widest text-[10.5px] sm:text-[11px] mr-2">The Axiom Guarantee:</span>
                            If our infrastructure doesn't measurably increase your qualified lead capture within 90 days, we work for free until it does.
                        </p>
                    </div>
                </section>

                {/* ──── TRUST METRICS ROW ──── */}
                <section className="max-w-[1100px] mx-auto mt-4 sm:mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {trustMetrics.map((metric) => (
                        <div key={metric.label} className="panel p-5 sm:p-6 flex items-center gap-5">
                            <div className="w-10 h-10 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/15 flex items-center justify-center text-[18px] shrink-0">
                                {metric.icon}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="big-figure-label text-[var(--text-secondary)]">{metric.label}</p>
                                <p className="text-[17px] sm:text-[19px] font-semibold text-[var(--text-heading)] font-grotesk tracking-tight leading-none">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ──── SOCIAL PROOF ──── */}
                <section className="max-w-[1100px] mx-auto mt-4 sm:mt-5">
                    <div className="panel p-6 sm:p-8 md:p-10">
                        <div className="flex flex-col md:flex-row gap-5 sm:gap-6 items-start">
                            <div className="text-[40px] leading-none text-[var(--accent)]/15 font-serif shrink-0 select-none">"</div>
                            <div className="flex flex-col gap-4 flex-1">
                                <p className="text-[15px] sm:text-[16px] text-[var(--text-body)] leading-[1.75] italic">
                                    Since upgrading our infrastructure, our emergency dispatch rate doubled. No more wasted truck rolls. When the phones light up during a cold snap, every call is a real job.
                                </p>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-inset)] border border-[var(--border-panel)] flex items-center justify-center shrink-0">
                                        <span className="text-[13px] font-bold text-[var(--text-secondary)]">JR</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                                            ))}
                                        </div>
                                        <p className="big-figure-label text-[var(--text-secondary)]">Local HVAC Operator · Southern Ontario</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── RISK REVERSAL BANNER ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel p-8 sm:p-10 md:p-12">
                        <div className="max-w-2xl mx-auto text-center flex flex-col gap-5">
                            <p className="eyebrow-center">Risk Reversal</p>
                            <h2 className="text-[22px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                                When storms hit and demand spikes, your site stays up. Period.
                            </h2>
                            <p className="lead text-center mx-auto">
                                Every contractor dreads the moment their site goes down during peak season. We deploy on the same infrastructure used by Fortune 500 companies — not some shared GoDaddy server that buckles under pressure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ──── VALUE PROPOSITION CARDS ──── */}
                <section className="max-w-[1100px] mx-auto mt-4 sm:mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {valueProps.map((card) => (
                        <article key={card.title} className="panel p-6 sm:p-8 flex flex-col gap-4 group hover:border-[#2a2d38] transition-colors">
                            <span className="text-[24px] sm:text-[28px] font-bold text-[var(--accent)]/15 font-grotesk">{card.num}</span>
                            <h3 className="text-[17px] sm:text-[19px] font-semibold text-[var(--text-heading)] tracking-tight leading-snug">{card.title}</h3>
                            <p className="text-[14px] sm:text-[15px] text-[var(--text-body)] leading-[1.75]">{card.desc}</p>
                        </article>
                    ))}
                </section>

                {/* ──── DEPLOYMENT PROOF ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel p-7 sm:p-10 md:p-12">
                        <p className="eyebrow mb-3" style={{ color: '#34d399' }}>Field Operations</p>
                        <h2 className="text-[22px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight mb-3">
                            Built. Deployed. Measured.
                        </h2>
                        <p className="lead mb-10 sm:mb-12">
                            Every Axiom concept architecture is a live, auditable asset — not a mockup. Here's what $7,500 of engineering actually looks like.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                            {[
                                {
                                    industry: 'HVAC',
                                    name: 'Climate Control Systems',
                                    region: 'Southern Ontario',
                                    color: '#38bdf8',
                                    lighthouseScore: 98,
                                    loadTime: '0.38s',
                                    stack: 'React 18 · Vite · CF Workers',
                                    features: ['Emergency dispatch intake', 'Service area qualification', 'Live equipment diagnostics']
                                },
                                {
                                    industry: 'Roofing',
                                    name: 'Summit Roofing Co.',
                                    region: 'Kitchener-Waterloo',
                                    color: '#ea580c',
                                    lighthouseScore: 97,
                                    loadTime: '0.41s',
                                    stack: 'React 18 · Vite · CF Workers',
                                    features: ['Storm damage triage form', 'Material-specific intake', 'GAF certification proof']
                                },
                                {
                                    industry: 'Landscaping',
                                    name: 'Ironwood Landscapes',
                                    region: 'Greater Toronto Area',
                                    color: '#22c55e',
                                    lighthouseScore: 99,
                                    loadTime: '0.35s',
                                    stack: 'React 18 · Vite · CF Workers',
                                    features: ['Season-aware intake funnel', 'Property size qualification', 'Portfolio showcase system']
                                }
                            ].map((deploy) => (
                                <div key={deploy.name} className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md p-5 sm:p-6 flex flex-col gap-4">
                                    {/* Industry indicator */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: deploy.color, boxShadow: `0 0 10px ${deploy.color}40` }}></div>
                                        <p className="big-figure-label" style={{ color: deploy.color }}>{deploy.industry}</p>
                                    </div>

                                    {/* Name + Region */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[16px] sm:text-[17px] font-semibold text-[var(--text-heading)] tracking-tight">{deploy.name}</h3>
                                        <p className="text-[12px] text-[var(--text-secondary)]">{deploy.region}</p>
                                    </div>

                                    {/* Performance metrics */}
                                    <div className="grid grid-cols-2 gap-[1px] bg-[var(--border-subtle)] rounded overflow-hidden">
                                        <div className="bg-[var(--bg-surface)] p-3 flex flex-col gap-0.5">
                                            <p className="big-figure-label text-emerald-400/60">Lighthouse</p>
                                            <p className="text-[20px] font-bold text-emerald-400 font-grotesk tracking-tight">{deploy.lighthouseScore}</p>
                                        </div>
                                        <div className="bg-[var(--bg-surface)] p-3 flex flex-col gap-0.5">
                                            <p className="big-figure-label text-emerald-400/60">Load Time</p>
                                            <p className="text-[20px] font-bold text-emerald-400 font-grotesk tracking-tight">{deploy.loadTime}</p>
                                        </div>
                                    </div>

                                    {/* Stack */}
                                    <p className="text-[11px] font-grotesk text-[var(--text-tertiary)] tracking-wide">{deploy.stack}</p>

                                    {/* Features */}
                                    <ul className="flex flex-col gap-2 mt-auto">
                                        {deploy.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--text-body)] leading-snug">
                                                <span className="text-emerald-400/40 mt-0.5 shrink-0">›</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 sm:mt-8 text-center">
                            <Link
                                to="/concepts"
                                className="inline-flex items-center justify-center min-h-[48px] px-8 border border-[var(--border-panel)] bg-[var(--bg-surface)] text-white hover:bg-[#1c1f28] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                            >
                                View All Concept Architectures →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ──── BEFORE / AFTER ECONOMICS ──── */}
                <section className="max-w-[1100px] mx-auto mt-5 sm:mt-6">
                    <div className="panel p-7 sm:p-10 md:p-12">
                        <p className="eyebrow mb-3">The Real Comparison</p>
                        <h2 className="text-[22px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight mb-10 sm:mb-12">
                            What your money actually buys.
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border-subtle)] rounded-md overflow-hidden">
                            {/* BEFORE column */}
                            <div className="bg-[var(--bg-inset)] p-6 sm:p-8 flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <p className="big-figure-label text-red-400/70">Typical Agency</p>
                                    <p className="text-[24px] sm:text-[28px] font-bold text-red-400/80 font-grotesk tracking-tight">$200/mo</p>
                                </div>
                                <ul className="flex flex-col gap-3">
                                    {[
                                        'Shared GoDaddy / Bluehost server',
                                        'WordPress + Elementor template',
                                        '3.5s average load time',
                                        'SSL certificate expires silently',
                                        'Crashes during traffic spikes',
                                        'Looks like every other contractor',
                                        'No conversion tracking',
                                        '"Call us!" — no intake qualification',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[var(--text-body)] leading-snug">
                                            <span className="text-red-400/50 font-bold shrink-0 mt-px">✕</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-4 border-t border-red-500/10">
                                    <p className="text-[13px] text-red-400/60 leading-relaxed">
                                        Annual cost: <span className="font-semibold text-red-400/80">$2,400</span> + your time fixing it. Revenue lost to downtime: <span className="font-semibold text-red-400/80">$60,000–$120,000</span>.
                                    </p>
                                </div>
                            </div>

                            {/* AFTER column */}
                            <div className="bg-[var(--bg-inset)] p-6 sm:p-8 flex flex-col gap-5 border-l-0 md:border-l border-emerald-500/10">
                                <div className="flex flex-col gap-2">
                                    <p className="big-figure-label text-emerald-400/70">Axiom Infrastructure</p>
                                    <p className="text-[24px] sm:text-[28px] font-bold text-emerald-400 font-grotesk tracking-tight">$7,500</p>
                                    <p className="text-[11px] text-[var(--text-secondary)]">One-time. You own the asset.</p>
                                </div>
                                <ul className="flex flex-col gap-3">
                                    {[
                                        'Cloudflare Workers — 300+ edge cities',
                                        'Custom React architecture, code-split',
                                        '0.4s load time under any traffic',
                                        'HSTS Preloaded, TLS 1.3, A+ SSL',
                                        '99.99% uptime with automated failover',
                                        'Designed to outclass your local market',
                                        'Full analytics + conversion tracking',
                                        'Pre-qualifying intake funnel built in',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[var(--text-body)] leading-snug">
                                            <span className="text-emerald-400/60 font-bold shrink-0 mt-px">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-4 border-t border-emerald-500/10">
                                    <p className="text-[13px] text-emerald-400/70 leading-relaxed">
                                        One captured emergency call during peak season: <span className="font-semibold text-emerald-400">$5,000–$15,000</span>. Pays for itself before month two.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="thesis mt-8 sm:mt-10 !text-[var(--text-heading)]">
                            The question isn't whether you can afford Axiom. It's how much longer you can afford not to have it.
                        </p>
                    </div>
                </section>

                {/* ──── MANIFESTO BRIDGE CTA ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel border-[var(--accent)]/12 p-7 sm:p-10 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="flex-1 flex flex-col gap-3">
                            <p className="eyebrow">The Whitepaper</p>
                            <h2 className="text-[20px] sm:text-[26px] md:text-[28px] font-semibold tracking-tight leading-snug">
                                The $100,000 Leak: Why cheap websites fail during peak season.
                            </h2>
                            <p className="text-[14px] sm:text-[15px] text-[var(--text-body)] leading-[1.75]">
                                The math your web designer never showed you. See exactly how downtime during your busiest week costs more than most contractors spend on marketing all year.
                            </p>
                        </div>
                        <Link
                            to="/manifesto"
                            className="shrink-0 inline-flex items-center justify-center min-h-[52px] px-8 border border-[var(--border-panel)] bg-[var(--bg-surface)] text-white hover:bg-[#1c1f28] hover:border-[#3a3d45] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px] w-full md:w-auto"
                        >
                            Read the Full Report →
                        </Link>
                    </div>
                </section>

                {/* ──── INFRASTRUCTURE SPECIFICATION ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel p-7 sm:p-10 md:p-12">
                        <p className="eyebrow mb-8" style={{ color: '#34d399' }}>Infrastructure Specification</p>

                        <div className="stat-bar grid-cols-1 sm:grid-cols-2">
                            {infraSpec.map((spec) => (
                                <div key={spec.label} className="stat-bar-cell !text-left !items-start">
                                    <p className="stat-bar-label !text-emerald-400/50">{spec.label}</p>
                                    <p className="text-[14px] sm:text-[15px] font-medium text-[var(--text-heading)]/90 tracking-tight">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        <p className="big-figure-label text-[var(--text-tertiary)] mt-5 text-center">
                            Every Axiom deployment. No exceptions.
                        </p>
                    </div>
                </section>

                {/* ──── INDUSTRIES SERVED ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel p-7 sm:p-10 md:p-12">
                        <div className="text-center flex flex-col gap-4 sm:gap-5 mb-10">
                            <p className="eyebrow-center">Industries</p>
                            <h2 className="text-[22px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                                Engineered for service-based industries.
                            </h2>
                        </div>

                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
                            {industries.map((ind) => (
                                <div key={ind.name} className="min-w-[85%] snap-center md:min-w-0 bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md p-6 text-center">
                                    <div className="w-3 h-3 rounded-full mx-auto mb-4" style={{ backgroundColor: ind.accent, boxShadow: `0 0 12px ${ind.accent}40` }}></div>
                                    <p className="text-[16px] font-semibold text-[var(--text-heading)] font-grotesk">{ind.name}</p>
                                    <p className="big-figure-label text-[var(--text-secondary)] mt-2">Professional Tier</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                to="/concepts"
                                className="inline-flex items-center justify-center min-h-[48px] px-8 border border-[var(--border-panel)] bg-[var(--bg-surface)] text-white hover:bg-[#1c1f28] text-[12px] font-semibold uppercase tracking-widest transition-all rounded-[4px]"
                            >
                                View Industry Concepts →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ──── THE AXIOM STORY ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="panel p-7 sm:p-10 md:p-14">
                        <p className="eyebrow mb-6 sm:mb-8">The Axiom Story</p>

                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                            <div className="flex-1 flex flex-col gap-5">
                                <h2 className="text-[22px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight leading-snug">
                                    This wasn't built in a boardroom.
                                </h2>
                                <div className="prose-editorial">
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
                                <p className="big-figure-label text-[var(--text-tertiary)] mt-2">
                                    — Aidan · Founder, Axiom Infrastructure
                                </p>
                            </div>

                            <div className="lg:w-[300px] shrink-0 flex flex-col gap-3">
                                {[
                                    { label: 'Approach', value: 'Engineering-First' },
                                    { label: 'Clients', value: 'Service Businesses' },
                                    { label: 'Base', value: 'Kitchener, Ontario' },
                                    { label: 'Partners / Month', value: '4 Maximum' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md p-4 flex flex-col gap-1">
                                        <p className="big-figure-label text-[var(--text-secondary)]">{stat.label}</p>
                                        <p className="text-[16px] sm:text-[18px] font-semibold text-[var(--text-heading)] font-grotesk tracking-tight">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ──── FINAL CTA ──── */}
                <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                    <div className="inline-cta !m-0">
                        <h2 className="text-[22px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight">
                            Ready to stop losing revenue to your website?
                        </h2>
                        <p className="lead text-center mx-auto">
                            Book a 15-minute strategy call. We'll audit your current setup, show you where the leaks are, and tell you exactly what it'll take to fix them.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                        >
                            Book Strategy Call
                        </Link>
                        <p className="big-figure-label text-[var(--accent)]">
                            Only 2 of 4 Partner Slots Remaining for This Month.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
