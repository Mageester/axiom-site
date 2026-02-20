import React, { useState, useRef } from 'react';
import { LiveConsole } from '../components/LiveConsole';
import { BrandLockup } from '../components/BrandLockup';

const Home: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLElement>(null);

    // Subtle radial light tracking logic
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
            {/* 2. HERO */}
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden flex flex-col items-center border-b border-subtle"
            >
                {/* Mouse-reactive soft light over hero content */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 mix-blend-screen"
                    style={{
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.035), transparent 40%)`
                    }}
                />

                <div className="max-w-[1100px] w-full mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left max-w-[600px] flex flex-col items-center lg:items-start">
                        <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary reveal">
                            Revenue Infrastructure<br />for Essential Industries.
                        </h1>
                        <p className="text-[17px] text-secondary max-w-[500px] mb-12 leading-relaxed font-light reveal reveal-delay-1">
                            Engineering high-performance web systems and AI-assisted intake automation. Converting inbound demand into captured revenue. Routing workflows with precision.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 reveal reveal-delay-2 w-full sm:w-auto">
                            <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Request Infrastructure Audit
                            </a>
                            <a href="#capabilities" className="w-full sm:w-auto px-8 py-4 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                                View Capabilities
                            </a>
                        </div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[10px] sm:text-[11px] tracking-widest text-secondary/60 uppercase font-mono reveal reveal-delay-3">
                            <span>Ontario-Based</span>
                            <span className="w-1 h-1 bg-subtle rounded-full hidden sm:block opacity-40"></span>
                            <span>Discreet Deployments</span>
                            <span className="w-1 h-1 bg-subtle rounded-full hidden sm:block opacity-40"></span>
                            <span>Performance-First</span>
                        </div>
                    </div>

                    {/* Live Console */}
                    <div className="w-full lg:w-auto flex justify-center lg:justify-end reveal reveal-delay-3">
                        <LiveConsole />
                    </div>
                </div>
            </section>

            {/* 3. SYSTEMS CONSOLE */}
            <section className="relative z-20 -mt-16 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="surface-panel p-6 sm:p-8 relative overflow-hidden group rounded-sm">
                    {/* Soft interior light layer */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-70"></div>

                    {/* Sweep animation simulating system active status */}
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent">
                        <div className="absolute inset-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-sweep"></div>
                    </div>

                    <div className="flex items-center justify-between mb-8 border-b border-subtle pb-4">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-secondary uppercase tracking-widest relative">
                            {/* Subdued, professional pulse */}
                            <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-30"></span>
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-[#34d399] opacity-80"></span>
                            </span>
                            System Targets / Telemetry
                        </div>
                        <div className="text-[10px] font-mono text-secondary/70 tracking-widest border border-subtle px-2 py-0.5 bg-background/50 rounded-sm">SYS_ACTIVE</div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:divide-x divide-subtle">
                        {[
                            { label: "Inbound Capture", value: "Instant" },
                            { label: "Intake Routing", value: "Active" },
                            { label: "Lead Availability", value: "24/7" },
                            { label: "Lighthouse Tgt", value: "95+" },
                            { label: "Architecture", value: "Stable" }
                        ].map((stat, i) => (
                            <div key={i} className={`flex flex-col gap-2 ${i !== 0 ? 'lg:pl-8' : ''}`}>
                                <span className="text-[10px] uppercase tracking-wider text-secondary/80 font-mono">{stat.label}</span>
                                <span className="text-[20px] tracking-tight font-semibold text-primary font-mono drop-shadow-sm">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PROBLEM & 5. MODULES */}
            <section id="capabilities" className="py-28 px-6 max-w-[1100px] mx-auto w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full">

                    {/* Problem */}
                    <div className="lg:col-span-4 reveal">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Operational Friction</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                        <ul className="flex flex-col gap-5 text-[14px] text-secondary">
                            {[
                                "Uncaptured inbound demand",
                                "Manual intake bottlenecks",
                                "Fragmented quoting workflows",
                                "Disconnected operational tools",
                                "Suboptimal web presence degrading trust"
                            ].map((problem, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-[6px] block w-[4px] h-[4px] bg-accent/60 shrink-0"></span>
                                    {problem}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Modules Grid */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight reveal">Infrastructure Modules</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60 reveal"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "High-Performance Web Systems", desc: "Static architectures built for maximum speed and accessibility." },
                                { title: "AI-Assisted Intake Validation", desc: "24/7 conversational capture and structured qualification workflows." },
                                { title: "Workflow & Calendar Integration", desc: "Direct bridging between inbound demand, CRM datasets, and operational calendars." },
                                { title: "Automated Routing Systems", desc: "Smart routing of qualified leads to the correct human operator or system." },
                                { title: "Performance Telemetry", desc: "Baseline analytics tracking intake efficiency and conversion metrics." },
                                { title: "Secure & Stable Deployment", desc: "Modern edge hosting, clean architecture, and performance-safeguarded configurations." }
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
                    </div>

                </div>
            </section>

            {/* 6. ENGAGEMENT MODEL & 7. OPERATING STANDARD */}
            <section id="engagement" className="relative py-28 px-6 border-y border-subtle bg-surface/30 overflow-hidden">

                {/* SECTION WATERMARK */}
                <div className="absolute top-1/2 left-[50%] lg:left-[60%] -translate-y-1/2 -translate-x-1/2 lg:-translate-x-0 pointer-events-none z-0">
                    <BrandLockup
                        showText={false}
                        className="opacity-[0.03]"
                        logoSize="h-[400px] lg:h-[600px] w-auto rotate-[0deg] mix-blend-plus-lighter"
                    />
                </div>

                <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">

                    {/* Engagement */}
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight reveal">Engagement Architecture</h2>
                        <div className="w-8 h-[2px] bg-accent mb-10 opacity-60 reveal"></div>

                        <div className="flex flex-col gap-6">
                            <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,0.84,0.44,1)] reveal rounded-sm">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/20 group-hover:bg-white/50 transition-colors duration-300"></div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 border-b border-subtle pb-5">
                                    <h3 className="text-xl font-semibold text-primary">Phase 1: Foundation Deployment <span className="text-secondary font-normal text-sm ml-2">(30 Days)</span></h3>
                                    <span className="text-[11px] font-mono text-accent/80 mt-2 sm:mt-0 uppercase tracking-widest">$500–$2,500 Deposit</span>
                                </div>
                                <ul className="text-[14px] text-secondary flex flex-col gap-4">
                                    {[
                                        "Deployment of high-performance web presence",
                                        "Integration of primary AI-intake workflow",
                                        "Performance baseline establishment",
                                        "Staged integration with existing tools"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-secondary/30 font-mono mt-0.5 text-xs">+</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,0.84,0.44,1)] reveal reveal-delay-1 rounded-sm">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 group-hover:bg-white/30 transition-colors duration-300"></div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 border-b border-subtle pb-5">
                                    <h3 className="text-xl font-semibold text-primary">Phase 2: Infrastructure Maintenance</h3>
                                    <span className="text-[11px] font-mono text-secondary mt-2 sm:mt-0 uppercase tracking-widest">Infrastructure Retainer (MRR)</span>
                                </div>
                                <ul className="text-[14px] text-secondary flex flex-col gap-4">
                                    {[
                                        "Managed hosting and system governance",
                                        "Ongoing workflow optimization",
                                        "Proactive uptime monitoring and maintenance",
                                        "Iterative intake capability expansion"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-secondary/30 font-mono mt-0.5 text-xs">+</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Operating Standard */}
                    <div id="standards" className="lg:col-span-4 reveal">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Operating Standard</h2>
                        <div className="w-8 h-[2px] bg-accent mb-10 opacity-60"></div>
                        <ul className="flex flex-col gap-6 text-[14px]">
                            {[
                                "Performance-driven web architecture",
                                "Modular and integrated systems",
                                "Secure edge-deployed hosting",
                                "Discreet operational delivery",
                                "Clear documentation and handoff"
                            ].map((std, i) => (
                                <li key={i} className="flex gap-4 items-start border-b border-subtle pb-6 last:border-0 last:pb-0">
                                    <span className="text-[10px] font-mono text-accent/70 mt-0.5 tracking-widest bg-[var(--border-subtle)] px-1.5 py-0.5 rounded-sm">0{i + 1}</span>
                                    <span className="text-primary/90 leading-tight font-medium">{std}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </section>

            {/* 8. CONTACT / AUDIT INTAKE */}
            <section id="contact" className="py-32 px-6 relative overflow-hidden">
                {/* Architectural Base Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

                <div className="max-w-[700px] mx-auto w-full relative z-10 reveal">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] font-semibold mb-4 text-primary tracking-tight">Initiate Deployment</h2>
                        <p className="text-[15px] text-secondary max-w-md mx-auto leading-relaxed">Request an audit to identify friction patterns in your operations.</p>
                    </div>

                    <form
                        action="mailto:contact@axiominfrastructure.com"
                        method="POST"
                        encType="text/plain"
                        className="bg-[#0f1113] border border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] p-8 sm:p-12 flex flex-col gap-8 rounded-[4px] relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label htmlFor="name" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Name</label>
                                <input type="text" id="name" name="name" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label htmlFor="company" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Company</label>
                                <input type="text" id="company" name="company" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label htmlFor="website" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Website URL</label>
                                <input type="url" id="website" name="website" className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label htmlFor="industry" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Industry</label>
                                <input type="text" id="industry" name="industry" className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-2">
                            <label htmlFor="notes" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Operational Friction Notes</label>
                            <textarea id="notes" name="notes" rows={4} required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors resize-none rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"></textarea>
                        </div>

                        <button type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] hover:scale-[1.01] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px]">
                            Submit Request
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Home;
