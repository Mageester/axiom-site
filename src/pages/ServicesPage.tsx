import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const tiers = [
    {
        name: 'Foundation',
        price: '$500 CAD',
        tag: 'Foundation Scope',
        desc: 'A focused build for a business that needs a clear home page, service pages, and a stronger contact path.',
        qualifier: 'Best for owner-led teams with one primary service area.',
        technical: '3 to 5 pages, core messaging, and contact capture',
        features: [
            'Homepage, service pages, and contact page structured around one primary offer',
            'Direct call and form inquiry paths',
            'Launch review, QA pass, and handoff',
        ],
        cta: 'Request Foundation Scope',
        packageParam: 'foundation',
    },
    {
        name: 'Growth',
        price: '$1,500 CAD',
        tag: 'Growth Scope',
        desc: 'A broader build for teams that need more service depth, clearer trust content, and a stronger qualification path.',
        qualifier: 'Best for businesses with several service lines and more content to organize.',
        technical: '7 to 10 pages, deeper service detail, and stronger trust sections',
        features: [
            'Expanded service architecture across the pages that matter most',
            'More room for proof, FAQs, and inquiry qualification',
            'Launch review, QA pass, and support during handoff',
        ],
        cta: 'Request Growth Scope',
        packageParam: 'authority',
        featured: true,
    },
    {
        name: 'Multi-Location / Expansion',
        price: '$3,000 CAD',
        tag: 'Expansion Scope',
        desc: 'A scoped build for multi-location businesses, new markets, or more complex routing needs.',
        qualifier: 'Best for teams managing multiple territories or connected internal workflows.',
        technical: 'Custom page count, location routing, and launch coordination',
        features: [
            'Multi-location information architecture and routing plan',
            'Location pages, CRM, dispatch, or reporting needs reviewed during scoping',
            'Phased rollout support when the project calls for it',
        ],
        cta: 'Request Expansion Scope',
        packageParam: 'expansion',
    }
];

const faqs = [
    {
        q: 'How long does a typical build take?',
        a: 'Foundation builds typically run about 2 weeks. Growth builds usually take 3 to 4 weeks. Expansion work is scoped separately once integrations and rollout requirements are clear.'
    },
    {
        q: 'Do I need to handle my own hosting?',
        a: 'If hosting, SSL, or deployment are part of the agreed scope, we handle that setup as part of the build.'
    },
    {
        q: 'What if I need changes after launch?',
        a: 'Each package includes a defined post-launch support window. Larger follow-up work can be scoped once the site is live and the next priorities are clearer.'
    }
];

const ServicesPage: React.FC = () => {
    const [openStep, setOpenStep] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    return (
        <div className="page-shell">
            <SEO
                title="Website Packages | Axiom"
                description="Website packages with clear scope, deliverables, and launch support."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 sm:gap-5 mb-12 sm:mb-16">
                <p className="eyebrow-center">Website Builds</p>
                <h1 className="text-[28px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight leading-[1.08]">
                    Website packages built around scope, deliverables, and a clear next step.
                </h1>
                <p className="lead text-center mx-auto">
                    Built for local service businesses that need a clearer site, a more credible first impression, and a defined scope.
                </p>
            </section>

            {/* Included Banner */}
            <section className="max-w-[1100px] mx-auto mb-10 sm:mb-12">
                <div className="axiom-bento border-[var(--accent)]/15 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[24px] shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-tight">Core delivery in every build</h3>
                        <p className="text-[14px] text-axiom-text-mute leading-[1.75]">
                            Every build includes page structure, deployment planning, and a launch checklist.
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
                            to={`/apply?package=${tier.packageParam}`}
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
                        label: 'Launch Support Window',
                        text: 'Each package includes a short support window for fixes and handoff questions after launch.',
                    },
                    {
                        label: 'Clear Scope',
                        text: 'You know what is included, what is pending, and what still needs input from your side before launch.',
                    },
                    {
                        label: 'Defined Boundaries',
                        text: 'Anything outside the agreed scope is discussed separately before work moves forward.',
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
                        <p className="eyebrow-center mb-4">Delivery Process</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold tracking-tight">
                            How delivery is handled.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-5">
                        {[
                            { num: '01', title: 'Discovery', desc: 'We review the business, current site, and the pages the new site needs to support.' },
                            { num: '02', title: 'Build', desc: 'We turn the approved scope into the site structure, layouts, and inquiry flow.' },
                            { num: '03', title: 'Testing', desc: 'We check forms, responsive behavior, and the key pages before launch.' },
                            { num: '04', title: 'Launch & Support', desc: 'We launch the site and hand it over with the agreed support window.' },
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

            {/* Positioning Block */}
            <section className="max-w-[1100px] mx-auto mt-12 sm:mt-16">
                <div className="axiom-bento p-8 sm:p-10 md:p-12">
                    <div className="text-center mb-10">
                        <p className="eyebrow-center mb-4">What the project solves</p>
                        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold tracking-tight">
                            The core problems the build should address.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 mb-8">
                        <div className="axiom-bento p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Outdated Presentation</p>
                            <p className="text-[24px] sm:text-[28px] font-bold tracking-tight font-grotesk">Pages that do not reflect the business</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">If the site does not explain the business clearly, better traffic still underperforms.</p>
                        </div>
                        <div className="bg-axiom-elevated border border-axiom-border rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Unclear Next Step</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-axiom-text-mute tracking-tight font-grotesk">The inquiry path is buried</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">If the next step is hidden, visitors delay or leave before they contact you.</p>
                        </div>
                        <div className="bg-axiom-elevated border border-axiom-border rounded-md p-5 sm:p-6 flex flex-col gap-2">
                            <p className="big-figure-label text-axiom-text-mute">Hard to Maintain</p>
                            <p className="text-[24px] sm:text-[28px] font-bold text-axiom-text-mute tracking-tight font-grotesk">A site the team can keep using</p>
                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">A clean rebuild gives you a site your team can keep using after launch instead of working around it.</p>
                        </div>
                    </div>

                    <div className="axiom-bento p-5 sm:p-6 text-center">
                        <p className="text-[15px] sm:text-[16px] text-axiom-text-main leading-[1.7] font-medium">
                            The goal is not a prettier homepage. It is a site that explains the business clearly and turns existing demand into better inquiries.
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
                            Before you start.
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
                            to="/apply"
                            className="btn-primary"
                        >
                            Request a Scope Review
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
