import React from 'react';
import { SEO } from '../components/SEO';

const demos = [
    {
        title: 'HVAC Authority',
        subtitle: 'Apex Climate Systems',
        desc: 'Built for emergency-driven demand with fast dispatch flows and trust-first conversion structure.',
        roi: 'Increase urgent-service lead capture during peak weather events.',
        url: 'https://hvac.getaxiom.ca',
        accent: '#38bdf8',
        features: ['24/7 Dispatch Banner', 'Maintenance Matrix', 'Split-Screen Hero', 'System Diagnostics Grid'],
    },
    {
        title: 'Roofing Authority',
        subtitle: 'Summit Roofing Co.',
        desc: 'Storm-response positioning with premium visual hierarchy and high-intent inquiry pathways.',
        roi: 'Convert insurance and replacement traffic into higher-ticket project calls.',
        url: 'https://roofing.getaxiom.ca',
        accent: '#ea580c',
        features: ['Material Selection Tabs', 'Storm Response Protocol', 'Drone Inspection CTA', 'Impact Rating Cards'],
    },
    {
        title: 'Landscaping Authority',
        subtitle: 'Verdant Landscapes',
        desc: 'Seasonal service positioning with polished brand presentation and clear offer segmentation.',
        roi: 'Win premium design/maintenance clients with stronger first impressions.',
        url: 'https://landscaping.getaxiom.ca',
        accent: '#22c55e',
        features: ['Before/After Slider', 'Seasonal Timeline', 'Masonry Gallery', 'Design Consultation Flow'],
    }
];

const ConceptsPage: React.FC = () => {
    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="Concepts | Axiom Infrastructure"
                description="Explore Axiom Authority demo concepts for HVAC, roofing, and landscaping businesses."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-5 mb-14">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                    <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-[0.2em]">Authority Concepts</p>
                    <div className="h-[1px] w-8 bg-[var(--accent)]/40"></div>
                </div>
                <h1 className="text-[38px] sm:text-[50px] font-semibold text-white tracking-tight leading-[1.06]">
                    Industry-specific demos engineered for conversion.
                </h1>
                <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                    Each concept reflects our Authority tier standards: bespoke layout, structured funnel flow, and edge-deployed performance. No two sites share the same template.
                </p>
            </section>

            {/* Demo Cards */}
            <section className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
                {demos.map((demo) => (
                    <article
                        key={demo.title}
                        className="bg-[#111214] border border-[#1e2028] rounded-lg flex flex-col overflow-hidden group hover:border-[#2a2d38] transition-all"
                    >
                        {/* Accent top bar */}
                        <div className="h-1 w-full" style={{ backgroundColor: demo.accent }}></div>

                        <div className="p-8 flex flex-col gap-5 flex-1">
                            {/* Title block */}
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: demo.accent }}>
                                    {demo.subtitle}
                                </p>
                                <h2 className="text-[24px] font-semibold text-white tracking-tight">{demo.title}</h2>
                            </div>

                            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{demo.desc}</p>

                            {/* ROI callout */}
                            <div className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-4 flex gap-3 items-start">
                                <div className="w-1 h-full min-h-[20px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: demo.accent, opacity: 0.4 }}></div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-1">ROI Focus</p>
                                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{demo.roi}</p>
                                </div>
                            </div>

                            {/* Feature bullets */}
                            <div className="grid grid-cols-2 gap-2">
                                {demo.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: demo.accent }}></div>
                                        <span className="text-[12px] text-[var(--text-secondary)]">{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <a
                                href={demo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto inline-flex items-center justify-center min-h-[48px] px-6 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[11px] font-bold uppercase tracking-widest transition-all rounded-[4px]"
                            >
                                View Live Demo →
                            </a>
                        </div>
                    </article>
                ))}
            </section>

            {/* Bottom CTA */}
            <section className="max-w-[1100px] mx-auto mt-12">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-10 md:p-12 text-center">
                    <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight mb-4">
                        Want this built for your industry?
                    </h2>
                    <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto mb-6">
                        Every Authority build is engineered from scratch for your specific market. No templates. No shared layouts.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-10 bg-white text-[#0B0B0C] hover:bg-[#f0f0f0] text-[12px] font-bold uppercase tracking-widest transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    >
                        Book Strategy Call
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ConceptsPage;
