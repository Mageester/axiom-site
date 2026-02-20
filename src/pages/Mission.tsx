import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const Mission: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    // Reuse the radial light effect for consistency
    const [mousePos, setMousePos] = React.useState({ x: -1000, y: -1000 });
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="pt-32 pb-24">
            {/* HERO */}
            <section
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                className="relative px-6 pb-24 border-b border-subtle overflow-hidden"
            >
                {/* Mouse-reactive soft light over hero content */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 mix-blend-screen"
                    style={{
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.035), transparent 40%)`
                    }}
                />

                <div className="max-w-[800px] w-full mx-auto relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left reveal">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6">Axiom Infrastructure</div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary">
                        Mission Directory
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[650px] leading-relaxed font-light reveal reveal-delay-1">
                        We engineer performance-first web infrastructure and AI-assisted intake systems that convert demand into scheduled work. No noise. No theatrics. Measurable delivery.
                    </p>
                </div>
            </section>

            {/* OPERATING THESIS */}
            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full border-b border-subtle reveal">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-4">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Operating Thesis</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                    </div>
                    <div className="lg:col-span-8">
                        <ul className="flex flex-col gap-8 text-[15px] text-secondary">
                            <li className="flex items-start gap-4">
                                <span className="mt-[2px] font-mono text-accent/60 text-xs shrink-0">01.</span>
                                <div>
                                    <strong className="text-primary/90 font-medium block mb-1">Attention is finite. Speed is a prerequisite.</strong>
                                    Sluggish architecture degrades trust instantly. We deploy entirely static, edge-delivered components that load instantly without sacrificing capability.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-[2px] font-mono text-accent/60 text-xs shrink-0">02.</span>
                                <div>
                                    <strong className="text-primary/90 font-medium block mb-1">Human-in-the-loop automation limits liability.</strong>
                                    AI should route and qualify, not make binding promises. Our conversational systems structure inbound chaos into validated datasets for human operators.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-[2px] font-mono text-accent/60 text-xs shrink-0">03.</span>
                                <div>
                                    <strong className="text-primary/90 font-medium block mb-1">Aesthetics signal competence.</strong>
                                    A restrained, hyper-professional visual language immediately separates an enterprise from its competitors. We enforce strict design invariants to guarantee this outcome.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* WHAT WE BUILD */}
            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full border-b border-subtle reveal">
                <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">What We Build</h2>
                    <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Web Infrastructure", desc: "Performant, static-first web environments built on React. Hardened for speed and SEO optimization." },
                        { title: "Intake Automation", desc: "Always-on conversational agents capturing inbound leads and structuring unformatted data 24/7." },
                        { title: "Smart Routing", desc: "Heuristic-based distribution assigning validated work to operational personnel without delay." },
                        { title: "System Integration", desc: "Bridging the gap between front-end capture portals and deeply-nested legacy CRM or ERP tools." },
                        { title: "Observability", desc: "Real-time telemetry and auditing. Knowing exactly what translates into converted pipeline." }
                    ].map((mod, i) => (
                        <div
                            key={i}
                            className="surface-panel p-6 sm:p-7 relative overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,0.84,0.44,1)] reveal rounded-sm"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <h3 className="text-[15px] font-semibold text-primary/90 mb-3 group-hover:text-primary transition-colors leading-tight relative">{mod.title}</h3>
                            <p className="text-[13px] text-secondary leading-relaxed relative">{mod.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* STANDARDS */}
            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-4">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Deployment Standards</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                    </div>
                    <div className="lg:col-span-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[14px]">
                            {[
                                "Performance-First Configuration",
                                "Secure-by-Default Architecture",
                                "Modular / Headless Systems",
                                "Discreet Delivery",
                                "Immaculate Documentation"
                            ].map((std, i) => (
                                <li key={i} className="flex gap-4 items-start border-b border-subtle pb-6 last:border-0 last:pb-0 sm:[&:nth-last-child(2)]:border-0 sm:[&:nth-last-child(2)]:pb-0">
                                    <span className="text-[10px] font-mono text-accent/70 mt-0.5 tracking-widest bg-[var(--border-subtle)] px-1.5 py-0.5 rounded-sm">0{i + 1}</span>
                                    <span className="text-primary/90 leading-tight font-medium">{std}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 mt-12 mb-12 relative overflow-hidden text-center reveal">
                <div className="max-w-[600px] mx-auto w-full relative z-10">
                    <h2 className="text-[32px] font-semibold mb-4 text-primary tracking-tight">Ready to Deploy?</h2>
                    <p className="text-[15px] text-secondary mx-auto leading-relaxed mb-10">Assess your current infrastructure and let us identify operational friction.</p>

                    <Link to="/#contact" className="inline-block px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Request Infrastructure Audit
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Mission;
