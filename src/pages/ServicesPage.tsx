import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const tiers = [
    {
        name: 'Starter',
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
        name: 'Professional',
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
        name: 'Enterprise',
        price: '$7,500+',
        tag: 'Bespoke',
        desc: 'A tailored digital experience designed around your exact sales process and market position.',
        features: [
            'Bespoke architecture built around how your best deals close',
            'Instant page loads from servers in 200+ cities — no delays',
            'A complete funnel: from first click to booked appointment',
            'Dedicated priority support with a named engineer'
        ],
        cta: 'Go Enterprise'
    }
];

const faqs = [
    {
        q: 'How long does a typical build take?',
        a: 'Starter builds ship in 2 weeks. Professional builds take 3–4 weeks. Enterprise builds are 4–6 weeks depending on scope. We work in focused sprints with weekly check-ins — you\'re never left guessing.'
    },
    {
        q: 'Do I need to handle my own hosting?',
        a: 'No. Every Axiom build is deployed to Cloudflare\'s global edge network — the same infrastructure used by Fortune 500 companies. Hosting, SSL, and CDN are included and managed for you.'
    },
    {
        q: 'What if I need changes after launch?',
        a: 'Enterprise builds include 30 days of post-launch adjustments at no extra cost. After that, we offer retainer plans for ongoing optimization. You always own your code — no lock-in.'
    }
];

const ServicesPage: React.FC = () => {
    const [openStep, setOpenStep] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    return (
        <div className="pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
            <SEO
                title="Infrastructure Investments | Axiom"
                description="Explore Starter, Professional, and Enterprise infrastructure investments for local service businesses."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 sm:gap-5 mb-8">
                <p className="eyebrow-center">Infrastructure Investments</p>
                <h1 className="text-[28px] sm:text-[42px] md:text-[50px] font-semibold tracking-tight leading-[1.08]">
                    Structured build tiers for serious local operators.
                </h1>
                <p className="lead text-center mx-auto">
                    Choose the infrastructure level that matches your growth stage and revenue goals.
                </p>
            </section>

            {/* SLA Guarantee Banner */}
            <section className="max-w-[1100px] mx-auto mb-8">
                <div className="panel border-[var(--accent)]/15 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[24px] shrink-0">
                        🛡️
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-tight">Performance Guarantee</h3>
                        <p className="text-[14px] text-[var(--text-body)] leading-[1.75]">
                            If your site isn't loading in under one second, we'll fix it free. <span className="text-[var(--text-heading)] font-medium">99.99% Edge Uptime guaranteed</span> or your month is on us.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="max-w-[1100px] mx-auto flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide relative">
                <div className="hidden md:block absolute inset-0 -m-4 rounded-xl pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(90,114,155,0.4) 39px, rgba(90,114,155,0.4) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(90,114,155,0.4) 39px, rgba(90,114,155,0.4) 40px)' }}></div>
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className={`min-w-[85%] snap-center md:min-w-0 relative panel p-7 sm:p-8 flex flex-col gap-5 transition-colors ${tier.featured
                            ? 'border-[var(--accent)]/25 shadow-[0_0_24px_rgba(90,114,155,0.1)]'
                            : 'hover:border-[#2a2d38]'
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
                            <p className="big-figure-label text-[var(--text-secondary)]">{tier.tag}</p>
                            <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight">{tier.name}</h2>
                            <p className="text-[28px] sm:text-[32px] font-bold tracking-tight font-grotesk">{tier.price}</p>
                        </div>

                        <p className="text-[14px] text-[var(--text-body)] leading-[1.75]">{tier.desc}</p>

                        <ul className="flex flex-col gap-3 py-2 flex-1">
                            {tier.features.map((f) => (
                                <li key={f} className="flex items-start gap-3 text-[14px] text-[var(--text-body)] leading-[1.65]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40 shrink-0 mt-[7px]"></div>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/contact"
                            className={`mt-auto inline-flex items-center justify-center min-h-[48px] px-8 text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] ${tier.featured
                                ? 'bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] shadow-[0_0_16px_rgba(255,255,255,0.06)]'
                                : 'bg-[var(--bg-surface)] border border-[var(--border-panel)] text-white hover:bg-[#1c1f28]'
                                }`}
                        >
                            {tier.cta}
                        </Link>
                    </article>
                ))}
            </section>

            {/* Engineering Roadmap */}
            <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                <div className="panel p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-10">
                        <p className="eyebrow-center mb-4">Our Process</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight">
                            The Path to Professional: Our Engineering Process.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-5">
                        {[
                            { num: '01', title: 'Discovery & Audit', desc: 'We map your local market and identify lead-leakage in your current setup.' },
                            { num: '02', title: 'Infrastructure Engineering', desc: 'We build your bespoke V8 Edge environment and automated intake pipelines.' },
                            { num: '03', title: 'Performance Hardening', desc: 'We run 50+ point security and speed audits to ensure sub-second delivery.' },
                            { num: '04', title: 'Launch & Support', desc: 'Your asset goes live on the global edge with 24/7 uptime monitoring.' },
                        ].map((phase) => (
                            <div key={phase.num} className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md md:p-6 flex flex-col overflow-hidden">
                                {/* Mobile Accordion Header */}
                                <button
                                    onClick={() => setOpenStep(openStep === phase.num ? null : phase.num)}
                                    className="md:hidden w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-[20px] font-bold text-[var(--accent)] font-mono">{phase.num}</span>
                                        <h3 className="text-[15px] font-semibold text-white tracking-tight">{phase.title}</h3>
                                    </div>
                                    <svg className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${openStep === phase.num ? 'rotate-180 text-[var(--accent)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Mobile Accordion Content / Desktop Full View */}
                                <div className={`px-5 pb-5 md:p-0 transition-all duration-300 md:!block ${openStep === phase.num ? 'block' : 'hidden md:block'}`}>
                                    <span className="hidden md:block text-[26px] font-bold text-[var(--accent)]/15 font-grotesk mb-3">{phase.num}</span>
                                    <h3 className="hidden md:block text-[16px] font-semibold tracking-tight mb-3">{phase.title}</h3>
                                    <p className="text-[13px] sm:text-[14px] text-[var(--text-body)] leading-[1.7]">{phase.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROI Math Block */}
            <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                <div className="panel p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-10">
                        <p className="eyebrow-center mb-4" style={{ color: '#ef4444' }}>The Math</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight">
                            The Cost of Doing Nothing.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 mb-8">
                        <div className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-[var(--text-secondary)]">Avg. HVAC Lead Value</p>
                            <p className="text-[24px] sm:text-[28px] font-bold tracking-tight font-grotesk">$1,500 – $15,000</p>
                            <p className="text-[13px] text-[var(--text-body)] leading-[1.7]">Emergency installs, full system replacements, and commercial maintenance contracts.</p>
                        </div>
                        <div className="bg-[var(--bg-inset)] border border-red-500/15 rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-red-400/60">Competitor Site</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-red-400/80 tracking-tight font-grotesk">3.5s Load Time</p>
                            <p className="text-[13px] text-[var(--text-body)] leading-[1.7]">40% bounce rate. Nearly half your potential customers leave before the page finishes loading.</p>
                        </div>
                        <div className="bg-[var(--bg-inset)] border border-emerald-500/15 rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-emerald-400/60">Axiom Site</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-emerald-400 tracking-tight font-grotesk">0.4s Load Time</p>
                            <p className="text-[13px] text-[var(--text-body)] leading-[1.7]">Captures the leads they lose. Every fraction of a second is revenue you're either earning or giving away.</p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md p-5 sm:p-6 text-center">
                        <p className="text-[15px] sm:text-[16px] text-[var(--text-heading)] leading-[1.7] font-medium">
                            A single captured emergency install during peak season pays for your <span className="text-emerald-400">entire year</span> of infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-[1100px] mx-auto mt-10 sm:mt-12">
                <div className="panel p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-8">
                        <p className="eyebrow-center mb-4">Common Questions</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold tracking-tight">
                            Before you apply.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[var(--bg-inset)] border border-[var(--border-panel)] rounded-md overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors gap-4"
                                >
                                    <h3 className="text-[14px] sm:text-[15px] font-semibold tracking-tight">{faq.q}</h3>
                                    <svg className={`w-4 h-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ${openFaq === faq.q ? 'rotate-180 text-[var(--accent)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {openFaq === faq.q && (
                                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[14px] text-[var(--text-body)] leading-[1.75] pt-2 border-t border-white/5">{faq.a}</p>
                                    </div>
                                )}
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
