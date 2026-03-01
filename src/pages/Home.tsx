import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const trustBadges = [
    'Sub-Second Load Guarantee',
    'Enterprise Security Headers',
    '100% Edge-First Delivery'
];

const corePillars = [
    {
        title: 'Win Higher-Paying Jobs',
        desc: 'Fast pages and premium positioning help you attract buyers who care about quality, not just price.'
    },
    {
        title: 'Look Better Than Competitors',
        desc: 'Custom design and message clarity make your brand look like the category leader in your area.'
    },
    {
        title: 'Never Miss Peak Demand',
        desc: 'Edge reliability keeps your lead flow alive when weather, seasonality, and ad traffic spike at the same time.'
    }
];

const strategicBlocks = [
    {
        label: 'Speed',
        title: 'Slow sites burn ad budget before the phone ever rings.',
        desc: 'If a page takes too long, buyers leave. We build speed into the core so your traffic converts instead of bouncing.',
        proof: 'Built for instant first impressions on mobile and desktop.'
    },
    {
        label: 'Design',
        title: 'Premium buyers choose the company that looks ready.',
        desc: 'Your website should signal competence in seconds. We structure every section to build trust and drive action.',
        proof: 'Authority layouts crafted to outclass local templates.'
    },
    {
        label: 'Reliability',
        title: 'Risk reversal: no crashes when demand is highest.',
        desc: 'Storms, heatwaves, and seasonal surges should bring leads, not downtime. Your infrastructure is built for those moments.',
        proof: 'Enterprise edge architecture keeps availability high.'
    }
];

const processSteps = [
    'Strategy call: define goals, service mix, and revenue targets.',
    'Infrastructure blueprint: lock in funnel, copy, and offer stack.',
    'Authority build: ship your production-ready high-ticket asset.',
    'Launch and calibration: monitor performance and tighten conversion.'
];

const Home: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <>
            <SEO
                title="Axiom Infrastructure | High-Ticket Contractor Websites"
                description="We build edge-deployed, conversion-focused infrastructure for HVAC, roofing, and landscaping companies that want higher-paying jobs."
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    name: 'Axiom Infrastructure',
                    description: 'Web Infrastructure & Lead Generation for Contractors',
                    url: 'https://getaxiom.ca',
                    areaServed: 'Ontario'
                }}
            />

            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative pt-40 pb-24 lg:pt-52 lg:pb-32 px-6 overflow-hidden border-b border-subtle"
            >
                <video
                    src="/sora.mp4"
                    playsInline
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                ></video>
                <div className="absolute inset-0 bg-black/45 z-0"></div>
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 mix-blend-screen z-10"
                    style={{
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.035), transparent 40%)`
                    }}
                />

                <div className="max-w-[1100px] w-full mx-auto relative z-10 text-center">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6 reveal">
                        Authority Infrastructure for Roofing, HVAC, and Landscaping
                    </p>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-7 leading-[1.02] text-primary reveal max-w-[980px] mx-auto">
                        Built to win better jobs, not just more clicks.
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[760px] mx-auto mb-10 leading-relaxed font-light reveal reveal-delay-1">
                        We engineer high-performance sales infrastructure that helps serious local operators outrank competitors and convert demand at premium price points.
                    </p>

                    <div className="reveal reveal-delay-2">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center min-h-[52px] px-9 py-4 bg-white hover:bg-white/90 text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                        >
                            Apply for Strategy Call
                        </Link>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-secondary/75 mt-4">
                            Limited Onboarding: 4 New Partners Per Month
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[900px] mx-auto reveal reveal-delay-2">
                        {trustBadges.map((badge) => (
                            <div key={badge} className="surface-panel py-3 px-4 rounded-sm text-[11px] font-mono uppercase tracking-widest text-secondary">
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 border-b border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[1000px] mx-auto text-center">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Risk Reversal</p>
                    <h2 className="text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight mb-4">
                        We build on enterprise edge networks so your site never crashes during a storm or heatwave.
                    </h2>
                    <p className="text-[15px] text-secondary max-w-[780px] mx-auto leading-relaxed">
                        You are not buying a fragile template. You are buying resilience that protects revenue when local demand spikes hardest.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-14">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Core Outcomes</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">
                        Three outcomes every Authority build is designed to deliver.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {corePillars.map((pillar) => (
                        <article key={pillar.title} className="surface-panel p-7 rounded-sm">
                            <h3 className="text-[18px] font-semibold text-primary mb-3">{pillar.title}</h3>
                            <p className="text-[14px] text-secondary leading-relaxed">{pillar.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 border-y border-subtle bg-[#0a0c0e]">
                <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
                    {strategicBlocks.map((block, i) => (
                        <article key={block.title} className="grid grid-cols-1 md:grid-cols-12 gap-4 reveal">
                            <div className={`md:col-span-7 surface-panel p-8 rounded-sm ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">{block.label}</p>
                                <h3 className="text-[24px] font-semibold text-primary tracking-tight mb-4">{block.title}</h3>
                                <p className="text-[15px] text-secondary leading-relaxed">{block.desc}</p>
                            </div>
                            <div className={`md:col-span-5 border border-white/10 bg-[#0f1113] p-8 rounded-sm flex items-center ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                                <p className="text-[14px] text-secondary leading-relaxed">{block.proof}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Execution Model</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
                        Clear steps. Zero guesswork.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processSteps.map((step, i) => (
                        <div key={step} className="surface-panel p-6 rounded-sm">
                            <p className="text-[10px] font-mono text-accent/70 uppercase tracking-widest mb-3">Step {i + 1}</p>
                            <p className="text-[14px] text-secondary leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 border-t border-subtle text-center reveal">
                <div className="max-w-[760px] mx-auto">
                    <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Final Step</p>
                    <h2 className="text-[32px] font-semibold text-primary tracking-tight mb-4">
                        If your market is competitive, your website cannot be average.
                    </h2>
                    <p className="text-[15px] text-secondary leading-relaxed mb-8">
                        Apply for a strategy call and we will map exactly how to position your brand for higher-value local demand.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center min-h-[52px] px-9 py-4 bg-white hover:bg-white/90 text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                    >
                        Start Project Application
                    </Link>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-secondary/70 mt-4">
                        Applications reviewed in order received
                    </p>
                </div>
            </section>
        </>
    );
};

export default Home;
