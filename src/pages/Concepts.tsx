import React from 'react';
import { SEO } from '../components/SEO';

const demos = [
    {
        title: 'HVAC Authority Demo',
        desc: 'Built for emergency-driven demand with fast dispatch flows and trust-first conversion structure.',
        roi: 'Increase urgent-service lead capture during peak weather events.',
        url: 'https://hvac.getaxiom.ca'
    },
    {
        title: 'Roofing Authority Demo',
        desc: 'Storm-response positioning with premium visual hierarchy and high-intent inquiry pathways.',
        roi: 'Convert insurance and replacement traffic into higher-ticket project calls.',
        url: 'https://roofing.getaxiom.ca'
    },
    {
        title: 'Landscaping Authority Demo',
        desc: 'Seasonal service positioning with polished brand presentation and clear offer segmentation.',
        roi: 'Win premium design/maintenance clients with stronger first impressions.',
        url: 'https://landscaping.getaxiom.ca'
    }
];

const ConceptsPage: React.FC = () => {
    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="Concepts | Axiom Infrastructure"
                description="Explore Axiom Authority demo concepts for HVAC, roofing, and landscaping businesses."
            />

            <section className="max-w-3xl mx-auto text-center mb-12">
                <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Authority Concepts</p>
                <h1 className="text-[40px] sm:text-[52px] font-semibold text-primary tracking-tight mb-4">
                    Industry-specific demos engineered for conversion.
                </h1>
                <p className="text-[16px] text-secondary leading-relaxed">
                    Each concept reflects our Authority tier standards: premium design, structured funnel flow, and edge-ready performance.
                </p>
            </section>

            <section className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                    <article key={demo.title} className="surface-panel bg-zinc-900/50 border-zinc-800 p-8 rounded-sm flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[24px] font-semibold text-primary tracking-tight">{demo.title}</h2>
                            <p className="text-[14px] text-secondary leading-relaxed">{demo.desc}</p>
                            <p className="text-[13px] text-secondary/90 leading-relaxed border-l-2 border-white/20 pl-4">
                                ROI Focus: {demo.roi}
                            </p>
                        </div>
                        <a
                            href={demo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-white text-black hover:bg-[#e2e2e2] text-[11px] font-bold uppercase tracking-widest transition-colors"
                        >
                            View Demo
                        </a>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default ConceptsPage;
