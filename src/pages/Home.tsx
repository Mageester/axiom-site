import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

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
            {/* HERO */}
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden flex flex-col items-center border-b border-subtle"
            >
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 mix-blend-screen"
                    style={{
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.035), transparent 40%)`
                    }}
                />

                <div className="max-w-[1100px] w-full mx-auto relative z-10 flex flex-col items-center text-center">
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary reveal max-w-[900px]">
                        Stop Losing Customers<br />to a Slow Website.
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[650px] mb-12 leading-relaxed font-light reveal reveal-delay-1">
                        We build high-performance, custom-coded websites for professional service businesses. No cheap templates. No sluggish loading times. Just premium digital infrastructure designed to convert.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 reveal reveal-delay-2 w-full sm:w-auto justify-center">
                        <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Request a Consultation
                        </Link>
                        <Link to="/work" className="w-full sm:w-auto px-8 py-4 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            View Our Work
                        </Link>
                    </div>
                </div>
            </section>

            {/* PROBLEM / SOLUTION & APPROACH */}
            <section className="py-28 px-6 max-w-[1100px] mx-auto w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full">

                    {/* Problem */}
                    <div className="lg:col-span-4 reveal">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">The Cost of Bad Architecture</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                        <p className="text-[15px] text-secondary leading-relaxed mb-6">
                            A slow website doesn't just annoy visitors—it kills trust. If your site takes longer than 3 seconds to load, or looks broken on a smartphone, your ideal clients are already calling your competitor.
                        </p>

                        <h3 className="text-[18px] font-semibold text-primary/90 mt-10 mb-4">Engineered for Performance</h3>
                        <p className="text-[15px] text-secondary leading-relaxed">
                            We don't use bloated website builders. We write clean, semantic code deployed on global edge networks. The result? Instant load times, uncompromising security, and a digital presence that signals absolute competence.
                        </p>
                    </div>

                    {/* Approach Grid */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight reveal">Our Approach</h2>
                        <div className="w-8 h-[2px] bg-accent mb-8 opacity-60 reveal"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "1. Discovery", desc: "We map your business goals, target audience, and primary conversion metrics." },
                                { title: "2. Architecture & Design", desc: "We draft the blueprints—structural layout, typography, and visual assets tailored to your brand invariant." },
                                { title: "3. Development", desc: "We write the code. No templates, no bloat. Pure performance and semantic SEO." },
                                { title: "4. Deployment", desc: "We launch your site on enterprise-grade global edge networks for sub-second loading." },
                                { title: "5. Governance", desc: "Ongoing monitoring, strict security patching, and structural maintenance." }
                            ].map((mod, i) => (
                                <div
                                    key={i}
                                    className="surface-panel p-6 sm:p-7 relative overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,0.84,0.44,1)] reveal rounded-sm"
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    <h3 className="text-[15px] font-semibold text-primary/90 mb-3 group-hover:text-primary transition-colors leading-tight relative">{mod.title}</h3>
                                    <p className="text-[13px] text-secondary leading-relaxed relative">{mod.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIAL PREVIEW */}
            <section className="py-24 px-6 border-y border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[800px] mx-auto text-center">
                    <div className="text-accent/60 text-4xl font-serif leading-none mb-6">"</div>
                    <p className="text-xl md:text-2xl text-primary font-light leading-relaxed mb-8">
                        Axiom tore down our outdated site and built something that actually reflects the quality of our work. Our mobile conversion rate doubled in the first month.
                    </p>
                    <div className="text-[12px] uppercase tracking-widest font-mono text-secondary">
                        — Client Placeholder <span className="text-secondary/50 mx-2">|</span> Service Industry
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-28 px-6 max-w-[800px] mx-auto w-full reveal">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Frequently Asked Questions</h2>
                    <div className="w-8 h-[2px] bg-accent mx-auto opacity-60"></div>
                </div>

                <div className="flex flex-col gap-8">
                    {[
                        {
                            q: "Do you use WordPress or Squarespace?",
                            a: "No. We build custom coded websites (React/Static architecture) because it guarantees better security, infinitely faster load times, and customizability that builders can't legitimately match."
                        },
                        {
                            q: "Do you provide hosting?",
                            a: "Yes. We deploy your site on premium edge networks (Cloudflare) with 99.99% uptime guarantees, included entirely within our monthly infrastructure retainer."
                        },
                        {
                            q: "What about SEO?",
                            a: "Every site we build includes foundational technical SEO automatically: proper semantic HTML, screaming-fast load times, mobile-optimization, and correct meta structures."
                        }
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-subtle pb-8 last:border-0">
                            <h3 className="text-lg font-semibold text-primary mb-3">{faq.q}</h3>
                            <p className="text-[15px] text-secondary leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 border-t border-subtle relative overflow-hidden text-center reveal">
                <div className="max-w-[600px] mx-auto w-full relative z-10">
                    <h2 className="text-[32px] font-semibold mb-4 text-primary tracking-tight">Ready to rebuild?</h2>
                    <p className="text-[15px] text-secondary mx-auto leading-relaxed mb-10">Stop losing customers to outdated design and slow loading speeds.</p>

                    <Link to="/contact" className="inline-block px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Request a Consultation
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Home;
