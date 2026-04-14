import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { createStartProjectHref } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

const tiers = [
    {
        name: 'Foundation',
        price: '$500 CAD',
        tag: 'Starter',
        desc: 'A clean site that replaces whatever you have now. Clear pages, fast on phones, easy to contact.',
        qualifier: 'Good for one-person or small teams with one main service area.',
        technical: '3–5 pages // fast hosting // contact tracking',
        features: [
            'Clear service pages that show what you do upfront',
            'Call and quote buttons that work well on phones',
            'Speed and uptime handled for you',
        ],
        cta: 'Start a project',
        packageParam: 'foundation',
    },
    {
        name: 'Growth',
        price: '$1,500 CAD',
        tag: 'Most popular',
        desc: 'For businesses that want better clients, not just more traffic. Stronger pages, real proof, and a clearer offer.',
        qualifier: 'Good for teams of 10+ ready to move up-market.',
        technical: '7–10 pages // lead tracking // reviews and proof',
        features: [
            'Pages built to attract the right jobs, not the cheapest ones',
            'Service pages that position you for higher-ticket work',
            'Priority support through your first month live',
        ],
        cta: 'Start a project',
        packageParam: 'authority',
        featured: true,
    },
    {
        name: 'Multi-Location / Expansion',
        price: '$3,000 CAD',
        tag: 'Full build',
        desc: 'For businesses with multiple crews, locations, or service areas that need one site to cover it all.',
        qualifier: 'Good for established teams expanding into new areas.',
        technical: 'custom build // tool connections // reporting',
        features: [
            'Full path from first click to a signed client',
            'CRM and scheduling tool connections',
            'Quarterly check-ins to make sure the site keeps working',
        ],
        cta: 'Start a project',
        packageParam: 'expansion',
    }
];

const faqs = [
    {
        q: 'How long does a typical build take?',
        a: 'Starter builds ship in 2 weeks. Growth builds take 3–4 weeks. Multi-location builds are scoped in phases over 4–8 weeks depending on complexity. We work in focused sprints with weekly check-ins.'
    },
    {
        q: 'Do I need to handle my own hosting?',
        a: 'No. Every build goes on Cloudflare\'s network — the same one used by Fortune 500 companies. Hosting, SSL, and speed are included and handled for you.'
    },
    {
        q: 'What if I need changes after launch?',
        a: 'Growth and multi-location builds include 30 days of post-launch changes at no extra cost. After that, we offer ongoing support. You always own your code — no lock-in.'
    }
];

const ServicesPage: React.FC = () => {
    const [openStep, setOpenStep] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    return (
        <div className="page-shell">
            <SEO
                {...SEO_ROUTES.services}
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 sm:gap-5 mb-12 sm:mb-16">
                <p className="eyebrow-center">Pricing</p>
                <h1 className="text-[28px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight leading-[1.08]">
                    Three ways to work with us.
                </h1>
                <p className="lead text-center mx-auto">
                    Every package includes hosting, speed optimization, and full ownership. No recurring fees for things you should already own.
                </p>
            </section>

            {/* SLA Guarantee Banner */}
            <section className="max-w-[1100px] mx-auto mb-10 sm:mb-12">
                <div className="axiom-bento border-[var(--accent)]/15 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[24px] shrink-0">
                        •
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-tight">Performance Guarantee</h3>
                        <p className="text-[14px] text-axiom-text-mute leading-[1.75]">
                            If your site loads slow, we fix it. Free. No asterisks. That&apos;s the standard we build to.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className={`axiom-bento bg-axiom-surface border border-axiom-border p-6 sm:p-8 flex flex-col gap-5 ${tier.featured ? 'border-t-2 border-t-axiom-accent' : ''}`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="font-axiomSans text-[24px] font-semibold tracking-tight text-axiom-text-main">{tier.name}</h2>
                            {tier.featured && (
                                <span className="font-axiomMono text-[10px] uppercase tracking-[0.1em] text-axiom-accent border border-axiom-accent/40 px-2 py-1 rounded">
                                    Most picked
                                </span>
                            )}
                        </div>

                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.1em] text-axiom-text-mute">{tier.tag}</p>
                        <p className="font-axiomSans text-[32px] font-bold leading-none text-axiom-text-main">{tier.price}</p>
                        <p className="font-axiomSans text-[14px] text-axiom-text-main/90 leading-relaxed">{tier.desc}</p>
                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.1em] text-axiom-text-mute">{tier.technical}</p>

                        <ul className="space-y-3 flex-1">
                            {tier.features.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-axiom-text-main/90">
                                    <span className="mt-[2px] text-axiom-accent">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="font-axiomSans text-[12px] text-axiom-text-mute">{tier.qualifier}</p>

                        <Link
                            to={createStartProjectHref(tier.packageParam)}
                            className="btn-primary btn-md magnetic-primary w-full"
                        >
                            {tier.cta}
                        </Link>
                    </article>
                ))}
            </section>

            <section className="max-w-[1100px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                    {
                        label: 'Performance Guarantee',
                        text: "If your site loads slow, we fix it. Free. No asterisks. That's the standard we build to.",
                    },
                    {
                        label: 'Outcome Proof',
                        text: '"We signed two new clients in week one from leads that used to bounce." - Business Owner',
                    },
                    {
                        label: 'Partner Capacity',
                        text: 'We take on four projects a month to keep the quality up.',
                    },
                ].map((item) => (
                    <div key={item.label} className="axiom-bento bg-axiom-surface border border-axiom-border p-4 sm:p-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.1em] text-axiom-text-mute">{item.label}</p>
                        <p className="font-axiomSans text-[14px] text-axiom-text-main/90 leading-relaxed mt-2">{item.text}</p>
                    </div>
                ))}
            </section>

            {/* Engineering Roadmap */}
            <section className="max-w-[1100px] mx-auto mt-14 sm:mt-20">
                <div className="axiom-bento p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-10">
                        <p className="eyebrow-center mb-4">Our Process</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold tracking-tight">
                            How the work runs.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-5">
                        {[
                            { num: '01', title: 'Review', desc: 'We look at your current site, your market, and what\'s not working.' },
                            { num: '02', title: 'Build', desc: 'We write, design, and build the site with fast hosting and working forms.' },
                            { num: '03', title: 'Test', desc: 'We check speed, forms, and every page on phones and desktop.' },
                            { num: '04', title: 'Launch', desc: 'Your site goes live with monitoring to make sure everything stays up.' },
                        ].map((phase) => (
                            <div key={phase.num} className="axiom-bento md:p-6 flex flex-col overflow-hidden">
                                {/* Mobile Accordion Header */}
                                <button
                                    onClick={() => setOpenStep(openStep === phase.num ? null : phase.num)}
                                    className="md:hidden w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-[20px] font-bold text-[var(--accent)] font-axiomMono">{phase.num}</span>
                                        <h3 className="text-[15px] font-semibold text-axiom-text-main tracking-tight">{phase.title}</h3>
                                    </div>
                                    <svg className={`w-4 h-4 text-axiom-text-mute transition-transform duration-300 ${openStep === phase.num ? 'rotate-180 text-[var(--accent)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Mobile Accordion Content / Desktop Full View */}
                                <div className={`px-5 pb-5 md:p-0 transition-all duration-300 md:!block ${openStep === phase.num ? 'block' : 'hidden md:block'}`}>
                                    <span className="hidden md:block text-[26px] font-bold text-[var(--accent)]/15 font-grotesk mb-3">{phase.num}</span>
                                    <h3 className="hidden md:block text-[16px] font-semibold tracking-tight mb-3">{phase.title}</h3>
                                    <p className="text-[13px] sm:text-[14px] text-axiom-text-mute leading-[1.7]">{phase.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Break */}
            <div className="max-w-[1100px] mx-auto mt-14 sm:mt-20"><div className="section-rule"></div></div>

            {/* ROI Math Block */}
            <section className="max-w-[1100px] mx-auto mt-12 sm:mt-16">
                <div className="axiom-bento p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-10">
                        <p className="eyebrow-center mb-4">The Math</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold tracking-tight">
                            Every month with a weak website is a month your competitor is winning the job.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 mb-8">
                        <div className="axiom-bento p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Typical Deal Value</p>
                            <p className="text-[24px] sm:text-[28px] font-bold tracking-tight font-grotesk">$1,500 – $15,000</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">New projects, retainers, and long-term client relationships.</p>
                        </div>
                        <div className="bg-axiom-elevated border border-axiom-border rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Competitor Site</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-axiom-text-mute tracking-tight font-grotesk">3.5s Load Time</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">40% bounce rate. Nearly half your potential customers leave before the page finishes loading.</p>
                        </div>
                        <div className="bg-axiom-elevated border border-axiom-border rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Axiom site</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-axiom-text-mute tracking-tight font-grotesk">0.4s Load Time</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">Captures the leads they lose. Every fraction of a second is revenue you're either earning or giving away.</p>
                        </div>
                    </div>

                    <div className="axiom-bento p-5 sm:p-6 text-center">
                        <p className="text-[15px] sm:text-[16px] text-axiom-text-main leading-[1.7] font-medium">
                            A bad site doesn&apos;t just fail to convert — it actively sends people to whoever looks more credible. We fix that.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-[1100px] mx-auto mt-14 sm:mt-20">
                <div className="axiom-bento p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-8">
                        <p className="eyebrow-center mb-4">Common Questions</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold tracking-tight">
                            Before you start a project.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                        {faqs.map((faq, i) => (
                            <div key={i} className="axiom-bento overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors gap-4"
                                >
                                    <h3 className="text-[14px] sm:text-[15px] font-semibold tracking-tight">{faq.q}</h3>
                                    <svg className={`w-4 h-4 shrink-0 text-axiom-text-mute transition-transform duration-300 ${openFaq === faq.q ? 'rotate-180 text-[var(--accent)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {openFaq === faq.q && (
                                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[14px] text-axiom-text-mute leading-[1.75] pt-2 border-t border-axiom-border">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/start-a-project"
                            className="btn-primary"
                        >
                            Start a project
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;




