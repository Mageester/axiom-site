import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const tiers = [
    {
        name: 'The Foundation',
        price: '$2,500',
        tag: 'Single Page',
        desc: 'A premium single-page site that makes you the obvious choice when homeowners search your area.',
        features: [
            'A stunning custom design that outclasses your local competitors',
            'Loads instantly on any phone, even on a job site with weak signal',
            'Built-in SEO so you show up when customers are searching',
            'A clear contact form that turns visitors into phone calls'
        ],
        cta: 'Start Here'
    },
    {
        name: 'The Engine',
        price: '$5,000',
        tag: 'Multi-Page',
        desc: 'A multi-page system that pre-qualifies leads and books calls on autopilot so you can focus on jobs.',
        features: [
            'Multiple pages that address every service you offer',
            'Content structured to answer customer objections before they call',
            'Automated lead-qualification and call scheduling',
            'Built-in analytics so you know exactly what\'s working'
        ],
        cta: 'Level Up',
        featured: true
    },
    {
        name: 'The Authority',
        price: '$7,500+',
        tag: 'Bespoke',
        desc: 'A tailored digital experience designed around your exact sales process and market position.',
        features: [
            'Bespoke architecture built around how your best deals close',
            'Instant page loads from servers in 200+ cities — no delays',
            'A complete funnel: from first click to booked appointment',
            'Dedicated priority support with a named engineer'
        ],
        cta: 'Go Authority'
    }
];

const faqs = [
    {
        q: 'How long does a typical build take?',
        a: 'Foundation builds ship in 2 weeks. Engine builds take 3–4 weeks. Authority builds are 4–6 weeks depending on scope. We work in focused sprints with weekly check-ins — you\'re never left guessing.'
    },
    {
        q: 'Do I need to handle my own hosting?',
        a: 'No. Every Axiom build is deployed to Cloudflare\'s global edge network — the same infrastructure used by Fortune 500 companies. Hosting, SSL, and CDN are included and managed for you.'
    },
    {
        q: 'What if I need changes after launch?',
        a: 'Authority builds include 30 days of post-launch adjustments at no extra cost. After that, we offer retainer plans for ongoing optimization. You always own your code — no lock-in.'
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
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-8">
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

            {/* SLA Guarantee Banner */}
            <section className="max-w-[1100px] mx-auto mb-8">
                <div className="bg-[#0d1117] border border-[var(--accent)]/20 rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[24px] shrink-0">
                        🛡️
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[18px] font-semibold text-white tracking-tight">Performance Guarantee</h3>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                            If your site isn't loading in under one second, we'll fix it free. <span className="text-white font-medium">99.99% Edge Uptime guaranteed</span> or your month is on us.
                        </p>
                    </div>
                </div>
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

                        <ul className="flex flex-col gap-3 py-2 flex-1">
                            {tier.features.map((f) => (
                                <li key={f} className="flex items-start gap-3 text-[14px] text-[var(--text-secondary)] leading-snug">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/50 shrink-0 mt-[7px]"></div>
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

            {/* Engineering Roadmap */}
            <section className="max-w-[1100px] mx-auto mt-10">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                            <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Our Process</p>
                            <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                        </div>
                        <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">
                            The Path to Authority: Our Engineering Process.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { num: '01', title: 'Discovery & Audit', desc: 'We map your local market and identify lead-leakage in your current setup.' },
                            { num: '02', title: 'Infrastructure Engineering', desc: 'We build your bespoke V8 Edge environment and automated intake pipelines.' },
                            { num: '03', title: 'Performance Hardening', desc: 'We run 50+ point security and speed audits to ensure sub-second delivery.' },
                            { num: '04', title: 'Launch & Support', desc: 'Your asset goes live on the global edge with 24/7 uptime monitoring.' },
                        ].map((phase) => (
                            <div key={phase.num} className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-6 flex flex-col gap-3">
                                <span className="text-[26px] font-bold text-[var(--accent)]/20 font-mono">{phase.num}</span>
                                <h3 className="text-[16px] font-semibold text-white tracking-tight">{phase.title}</h3>
                                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{phase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROI Math Block */}
            <section className="max-w-[1100px] mx-auto mt-10">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-red-500/30"></div>
                            <p className="text-[11px] font-mono text-red-400/70 uppercase tracking-[0.2em]">The Math</p>
                            <div className="h-[1px] w-8 bg-red-500/30"></div>
                        </div>
                        <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">
                            The Cost of Doing Nothing.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-6 flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Avg. HVAC Lead Value</p>
                            <p className="text-[28px] font-bold text-white tracking-tight">$1,500 – $15,000</p>
                            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Emergency installs, full system replacements, and commercial maintenance contracts.</p>
                        </div>
                        <div className="bg-[#0e0f12] border border-red-500/15 rounded-md p-6 flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/60">Competitor Site</p>
                            <p className="text-[28px] font-bold text-red-400/80 tracking-tight">3.5s Load Time</p>
                            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">40% bounce rate. Nearly half your potential customers leave before the page finishes loading.</p>
                        </div>
                        <div className="bg-[#0e0f12] border border-emerald-500/15 rounded-md p-6 flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/60">Axiom Site</p>
                            <p className="text-[28px] font-bold text-emerald-400 tracking-tight">0.4s Load Time</p>
                            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Captures the leads they lose. Every fraction of a second is revenue you're either earning or giving away.</p>
                        </div>
                    </div>

                    <div className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-6 text-center">
                        <p className="text-[16px] text-white leading-relaxed font-medium">
                            A single captured emergency install during peak season pays for your <span className="text-emerald-400">entire year</span> of infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-[1100px] mx-auto mt-10">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                            <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Common Questions</p>
                            <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                        </div>
                        <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">
                            Before you apply.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="flex flex-col gap-3">
                                <h3 className="text-[16px] font-semibold text-white tracking-tight">{faq.q}</h3>
                                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                        >
                            Book Strategy Call
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
