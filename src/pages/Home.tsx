import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const authorityPillars = [
    {
        title: 'Performance Engineering',
        desc: 'Performance-first builds engineered for fast loading, edge delivery, and 90+ Lighthouse target benchmarks on production-ready pages.'
    },
    {
        title: 'Conversion Architecture',
        desc: 'Page structure, messaging, and CTA hierarchy designed to turn service traffic into quote requests and booked calls.'
    },
    {
        title: 'Local SEO Foundation',
        desc: 'Service-area page structure, clean semantic markup, and schema basics built in from day one for indexing readiness.'
    }
];

const processSteps = [
    {
        title: 'Discovery',
        desc: 'We map your services, target geography, offer positioning, and what a qualified lead looks like.'
    },
    {
        title: 'Blueprint',
        desc: 'We define the page structure, conversion path, messaging hierarchy, and performance requirements before build starts.'
    },
    {
        title: 'Build',
        desc: 'Custom-coded implementation with mobile-first QA, speed optimization, and clean deployment workflows.'
    },
    {
        title: 'Launch & Optimize',
        desc: 'Production launch, analytics setup, and post-launch refinements focused on speed, clarity, and conversion readiness.'
    }
];

const comparisons = [
    {
        label: 'Performance control',
        builders: 'Template theme + app/plugin weight can limit speed optimization.',
        axiom: 'Custom code and tighter payload control designed for performance benchmarks.'
    },
    {
        label: 'Technical SEO control',
        builders: 'Usable for basics, but harder to enforce clean structure at scale.',
        axiom: 'Semantic structure and service-area architecture planned from the blueprint stage.'
    },
    {
        label: 'Maintainability',
        builders: 'Builder changes/apps can introduce regressions.',
        axiom: 'Lean codebase with controlled updates and infrastructure management options.'
    },
    {
        label: 'Ownership & scalability',
        builders: 'Good for fast starts, but can become restrictive as needs grow.',
        axiom: 'Built for long-term control, custom integrations, and future expansion.'
    }
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
                title="High-performance web design | Axiom Infrastructure"
                description="Contractor lead generation and high-performance web design in Kitchener. We build custom infrastructure that drives Better results than templates."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": "Axiom Infrastructure",
                    "description": "Web Infrastructure & Lead Generation for Contractors",
                    "url": "https://axiom-site.onrender.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Kitchener",
                        "addressRegion": "Ontario",
                        "addressCountry": "CA"
                    },
                    "areaServed": "Kitchener"
                }}
            />

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
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6 reveal">
                        Performance-First Websites for Contractors & Service Businesses
                    </div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary reveal max-w-[980px]">
                        Premium websites engineered to help local service businesses win better clients.
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[720px] mb-5 leading-relaxed font-light reveal reveal-delay-1">
                        Axiom Infrastructure builds conversion-focused, custom-coded marketing sites for operators who care about performance, clarity, and long-term control.
                    </p>
                    <p className="text-[12px] text-secondary/70 font-mono uppercase tracking-widest mb-12 reveal reveal-delay-1">
                        Performance-first builds, engineered for 90+ Lighthouse target benchmarks.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 reveal reveal-delay-2 w-full sm:w-auto justify-center">
                        <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Request a Consultation
                        </Link>
                        <Link to="/work" className="w-full sm:w-auto px-8 py-4 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            View Concepts
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-28 px-6 max-w-[1100px] mx-auto w-full overflow-hidden">
                <div className="text-center mb-14 reveal">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Authority</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">Built for operators who expect results.</h2>
                    <p className="text-[15px] text-secondary max-w-[700px] mx-auto leading-relaxed">
                        We focus on the fundamentals that drive trust and conversion: speed, structure, and technical control.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {authorityPillars.map((pillar, i) => (
                        <div
                            key={pillar.title}
                            className="surface-panel p-6 sm:p-7 rounded-sm reveal hover:border-white/20 transition-all"
                            style={{ transitionDelay: `${i * 60}ms` }}
                        >
                            <h3 className="text-[15px] font-semibold text-primary mb-3">{pillar.title}</h3>
                            <p className="text-[13px] text-secondary leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 border-y border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[1100px] mx-auto">
                    <div className="mb-10">
                        <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Differentiation</div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">Why not Wix or Squarespace?</h2>
                        <p className="text-[15px] text-secondary max-w-[760px] leading-relaxed">
                            Template builders can be fine for simple websites. Axiom is built for businesses that want tighter performance control, cleaner technical execution, and a site that can scale without template constraints.
                        </p>
                    </div>

                    <div className="surface-panel overflow-hidden rounded-sm border border-subtle">
                        <div className="grid grid-cols-12 border-b border-subtle bg-black/40 text-[10px] font-mono uppercase tracking-wider text-secondary">
                            <div className="col-span-4 p-4">Decision Area</div>
                            <div className="col-span-4 p-4">Template Builders</div>
                            <div className="col-span-4 p-4">Axiom</div>
                        </div>
                        {comparisons.map((row) => (
                            <div key={row.label} className="grid grid-cols-12 border-b last:border-b-0 border-subtle text-[13px]">
                                <div className="col-span-12 md:col-span-4 p-4 text-primary font-medium">{row.label}</div>
                                <div className="col-span-12 md:col-span-4 p-4 text-secondary leading-relaxed">{row.builders}</div>
                                <div className="col-span-12 md:col-span-4 p-4 text-secondary leading-relaxed">{row.axiom}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-28 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-14">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Process</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">A clear build process from strategy to launch.</h2>
                    <p className="text-[15px] text-secondary max-w-[680px] mx-auto leading-relaxed">
                        Short, decisive phases designed to keep momentum high and reduce revision churn.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processSteps.map((step, i) => (
                        <div key={step.title} className="surface-panel p-6 rounded-sm relative reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                            <div className="text-[10px] font-mono text-accent/70 uppercase tracking-widest mb-3">Step {i + 1}</div>
                            <h3 className="text-[18px] font-semibold text-primary mb-3">{step.title}</h3>
                            <p className="text-[13px] text-secondary leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 border-y border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[820px] mx-auto text-center">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6">Proof in Progress</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">
                        Results will be published here as projects launch.
                    </h2>
                    <p className="text-[15px] text-secondary leading-relaxed mb-8">
                        We do not publish placeholder testimonials or fabricated client outcomes. If you want to evaluate fit before launch case studies are available, ask for a sample or concept build walkthrough.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                        {[
                            'What operators usually ask first: speed, mobile usability, and conversion structure',
                            'Early access builds are available for review during planning',
                            'Performance targets and deliverables are scoped before build begins'
                        ].map((item) => (
                            <div key={item} className="surface-panel p-4 rounded-sm">
                                <p className="text-[12px] text-secondary leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 border-t border-subtle bg-[#0a0c0e] reveal">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7">
                        <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">About Axiom</div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">
                            Axiom Infrastructure builds performance-first websites for local service businesses.
                        </h2>
                        <p className="text-[15px] text-secondary leading-relaxed mb-4">
                            We focus on practical digital infrastructure: fast sites, clear conversion pathways, and technical foundations that support growth without template bloat.
                        </p>
                        <p className="text-[15px] text-secondary leading-relaxed">
                            The goal is simple: give serious operators a website that looks premium, loads fast, and supports the way they actually sell.
                        </p>
                    </div>
                    <div className="lg:col-span-5 surface-panel p-6 rounded-sm">
                        <h3 className="text-[12px] font-mono text-secondary uppercase tracking-widest mb-5">Trust Anchors</h3>
                        <ul className="flex flex-col gap-3 text-[14px] text-secondary">
                            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>Ontario-focused service business positioning</li>
                            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>Performance benchmark targets built into project planning</li>
                            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>Transparent pricing structure and scoped deliverables</li>
                            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>No template bloat, no plugin-heavy stacks by default</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-28 px-6 max-w-[800px] mx-auto w-full reveal">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Frequently Asked Questions</h2>
                    <div className="w-8 h-[2px] bg-accent mx-auto opacity-60"></div>
                </div>

                <div className="flex flex-col gap-8">
                    {[
                        {
                            q: 'Do you use WordPress or Squarespace?',
                            a: "No. We build custom coded websites (React/static architecture) because it gives tighter performance, security, and technical control than builder-first stacks."
                        },
                        {
                            q: 'Do you provide hosting?',
                            a: 'Yes. We deploy on Cloudflare edge infrastructure and can manage hosting, SSL, and uptime as an ongoing service.'
                        },
                        {
                            q: 'What about SEO?',
                            a: 'Every build includes technical SEO fundamentals: semantic markup, performance optimization, mobile-first structure, and metadata foundations.'
                        }
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-subtle pb-8 last:border-0">
                            <h3 className="text-lg font-semibold text-primary mb-3">{faq.q}</h3>
                            <p className="text-[15px] text-secondary leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 border-t border-subtle relative overflow-hidden text-center reveal">
                <div className="max-w-[720px] mx-auto w-full relative z-10">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-5">Next Step</div>
                    <h2 className="text-[32px] font-semibold mb-4 text-primary tracking-tight">Ready to plan your rebuild?</h2>
                    <p className="text-[15px] text-secondary mx-auto leading-relaxed mb-8">
                        Start with a consultation, or review project investment ranges before you reach out.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Request a Consultation
                        </Link>
                        <Link to="/pricing" className="inline-block px-8 py-4 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
