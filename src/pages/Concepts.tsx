import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const demos = [
    {
        title: 'HVAC Authority',
        subtitle: 'Apex Climate Systems',
        desc: 'When the first heatwave hits and your phones blow up, this system filters the tire-kickers so your techs only roll trucks for high-ticket emergency installs.',
        roi: 'Double your emergency dispatch rate during peak weather events.',
        problem: 'Unqualified calls burning dispatch hours â€” your techs are rolling trucks for $89 tune-ups instead of $4,000 compressor replacements.',
        solution: 'An intake system that asks the right questions upfront, filters out the tire-kickers, and routes real emergency calls straight to dispatch.',
        url: 'https://hvac.getaxiom.ca',
        accent: '#38bdf8',
        features: ['Emergency Dispatch Banner', 'Service Plan Builder', 'Split-Screen Hero', 'Emergency Dispatch Filter'],
        blueprint: [
            { label: 'Objective', text: "Capture emergency 'No-AC' calls during 35Â°C+ heatwaves in Southern Ontario." },
            { label: 'Result', text: '0.3s load time achieved on 3G networks in rural Ontario field testing.' },
            { label: 'Outcome', text: '22% increase in high-ticket emergency installs in Month 1 post-launch.' },
        ],
    },
    {
        title: 'Roofing Authority',
        subtitle: 'Summit Roofing Co.',
        desc: "When hail storms hit and every roof in town leaks, your site loads instantly while your competitors' sites crash. You get the calls. They get voicemail.",
        roi: "Capture storm-season leads while competitors' sites go down.",
        problem: 'Every time a big storm rolls through, your site grinds to a halt from the traffic spike â€” and those leads go to whoever loads first.',
        solution: 'Edge-deployed infrastructure that handles traffic spikes without flinching. Your site loads in under a second, even when half the county is searching for roof repair.',
        url: 'https://roofing.getaxiom.ca',
        accent: '#ea580c',
        features: ['Material Comparison Tool', 'Storm Damage Checklist', 'Insurance Claim Helper', 'Before/After Gallery'],
    },
    {
        title: 'Landscaping Authority',
        subtitle: 'Verdant Landscapes',
        desc: "You're bidding on $50K hardscape projects against companies with $200 websites. This fixes the gap between the quality of your work and the quality of your online presence.",
        roi: 'Win premium design contracts with a portfolio that matches your craft.',
        problem: 'Competing for $50K+ design projects with a website that looks like a $500 template.',
        solution: 'A portfolio-grade digital experience that positions you as the premium choice before the first phone call.',
        url: 'https://landscaping.getaxiom.ca',
        accent: '#22c55e',
        features: ['Before/After Slider', 'Seasonal Project Timeline', 'Full-Screen Gallery', 'Design Consultation Booking'],
    }
];

const ConceptsPage: React.FC = () => {
    return (
        <div className="pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
            <SEO
                title="Concepts | Axiom Infrastructure"
                description="Explore Axiom Professional demo concepts for HVAC, roofing, and landscaping businesses."
            />

            {/* Header */}
            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 sm:gap-5 mb-16 sm:mb-20">
                <p className="eyebrow-center">Professional Concepts</p>
                <h1 className="text-[28px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight leading-[1.08]">
                    Real sites built for real contractors. Not templates.
                </h1>
                <p className="lead text-center mx-auto">
                    Each concept is engineered from scratch for a specific industry. Different layouts, different funnels, different conversion strategies.
                </p>
            </section>

            {/* Demo Cards */}
            <section className="max-w-[1200px] mx-auto flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible scrollbar-hide">
                {demos.map((demo) => (
                    <article
                        key={demo.title}
                        className="min-w-[85%] snap-center lg:min-w-0 axiom-bento flex flex-col overflow-hidden group hover:border-[#2a2a2a] transition-colors"
                    >
                        {/* Accent top bar */}
                        <div className="h-[3px] w-full" style={{ backgroundColor: demo.accent }}></div>

                        <div className="p-6 sm:p-8 flex flex-col gap-5 flex-1">
                            {/* Title block */}
                            <div className="flex flex-col gap-2">
                                <p className="big-figure-label" style={{ color: demo.accent }}>
                                    {demo.subtitle}
                                </p>
                                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight">{demo.title}</h2>
                            </div>

                            <p className="text-[14px] text-axiom-text-mute leading-[1.75]">{demo.desc}</p>

                            {/* Problem â†’ Solution */}
                            <div className="axiom-bento-card overflow-hidden">
                                <div className="p-4 flex gap-3 items-start border-b border-axiom-border">
                                    <div className="w-1 self-stretch rounded-full shrink-0 bg-red-500/30"></div>
                                    <div>
                                        <p className="big-figure-label text-red-400/70 mb-1">Problem</p>
                                        <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.problem}</p>
                                    </div>
                                </div>
                                <div className="p-4 flex gap-3 items-start">
                                    <div className="w-1 self-stretch rounded-full shrink-0 bg-emerald-500/40"></div>
                                    <div>
                                        <p className="big-figure-label text-emerald-400/70 mb-1">Solution</p>
                                        <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.solution}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature bullets */}
                            <div className="grid grid-cols-2 gap-2">
                                {demo.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: demo.accent }}></div>
                                        <span className="text-[12px] text-axiom-text-mute">{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Blueprint Deep-Dive (HVAC only) */}
                            {(demo as any).blueprint && (
                                <div className="axiom-bento-card p-5 flex flex-col gap-3">
                                    <p className="big-figure-label" style={{ color: demo.accent }}>Project Deep-Dive</p>
                                    {(demo as any).blueprint.map((item: { label: string; text: string }) => (
                                        <div key={item.label} className="flex gap-3 items-start">
                                            <span className="big-figure-label text-axiom-text-mute shrink-0 w-16 mt-0.5">{item.label}</span>
                                            <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA */}
                            <a
                                href={demo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary mt-auto"
                            >
                                View Live Demo {'->'}
                            </a>
                        </div>
                    </article>
                ))}
            </section>

            {/* Bottom CTA */}
            <section className="max-w-[1100px] mx-auto mt-16 sm:mt-24">
                <div className="inline-cta !m-0">
                    <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold tracking-tight">
                        Want this built for your trade?
                    </h2>
                    <p className="lead text-center mx-auto">
                        Every build is engineered from scratch for your specific market. No templates. No shared layouts. No recycled designs from another contractor down the road.
                    </p>
                    <Link to="/contact" className="btn-primary">
                        Book Strategy Call
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ConceptsPage;

