import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const PricingPage: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const pricingRef = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!pricingRef.current) return;
        const rect = pricingRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="pt-32 pb-24">
            <SEO
                title="Website Pricing & Packages | Axiom Infrastructure"
                description="Honest, transparent pricing for high-performance contractor web design. View our website packages from $1,500 CAD."
            />
            <section className="px-6 pb-24 border-b border-subtle">
                <div className="max-w-[800px] w-full mx-auto text-center reveal">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6">Investment Structure</div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary">
                        Simple, Honest Pricing.
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[650px] mx-auto leading-relaxed font-light reveal reveal-delay-1">
                        Professional web architecture designed to convert your local traffic into booked revenue. No hidden fees.
                    </p>
                </div>
            </section>

            {/* THREE TIERS */}
            <section
                ref={pricingRef}
                onMouseMove={handleMouseMove}
                className="py-24 px-6 max-w-[1200px] mx-auto w-full reveal relative overflow-hidden"
            >
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 mix-blend-screen z-0"
                    style={{
                        background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.02), transparent 40%)`
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                    {/* TIER 1 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all rounded-sm flex flex-col">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-secondary/30"></div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Foundation</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">Perfect for new businesses needing a professional digital presence fast.</p>
                        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-6">
                            $1,500 – $2,500 CAD <br />
                            <span className="text-[10px] text-secondary/70 normal-case mt-2 block leading-relaxed">50% Deposit to commence engineering,<br />50% Due upon final deployment.</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>3-5 Page Custom Design</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Mobile-First Responsiveness</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Basic On-Page SEO & Fast Loading</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Contact Form Integration</li>
                            <li className="flex items-start gap-3 group/tooltip relative">
                                <span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>
                                <span className="border-b border-dashed border-secondary/40 cursor-help">$150/mo Edge Infrastructure Retainer</span>
                                <div className="absolute left-0 bottom-full mb-2 w-[240px] p-3 bg-[#1a1d21] border border-white/10 text-[11px] text-secondary/90 rounded-sm opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                    Covers Cloudflare Enterprise-grade routing, Render engine hosting, and monthly SEO schema maintenance.
                                </div>
                            </li>
                        </ul>
                        <Link to="/contact?package=foundation&goal=new_site" className="mt-8 inline-flex items-center justify-center px-5 py-3 bg-white/10 border border-white/20 hover:bg-white hover:text-black text-primary text-[11px] font-semibold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Request a Consultation
                        </Link>
                    </div>

                    {/* TIER 2 - ACCENTED */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/20 hover:border-accent/40 transition-all rounded-sm flex flex-col scale-[1.02] shadow-2xl z-20 bg-[#121417]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-accent"></div>
                        <div className="absolute top-0 right-0 py-1 px-3 bg-accent/15 border-b border-l border-accent/30 text-[10px] font-mono text-accent uppercase tracking-widest rounded-bl-sm z-10">Recommended</div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Engine</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">For established businesses driving traffic who need higher conversions.</p>
                        <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-6 border-b border-subtle pb-6">
                            $3,500 – $5,500 CAD <br />
                            <span className="text-[10px] text-secondary/70 normal-case mt-2 block leading-relaxed">50% Deposit to commence engineering,<br />50% Due upon final deployment.</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>5-10 Page Custom Design</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Focused Service Pages</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Advanced Local SEO Structure (Schema)</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Google Analytics & Tag Manager</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Speed Guarantees (90+ Lighthouse)</li>
                            <li className="flex items-start gap-3 group/tooltip relative">
                                <span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>
                                <span className="border-b border-dashed border-secondary/40 cursor-help text-primary/90 font-medium">$150/mo Edge Infrastructure Retainer</span>
                                <div className="absolute left-0 bottom-full mb-2 w-[240px] p-3 bg-[#1a1d21] border border-white/10 text-[11px] text-secondary/90 rounded-sm opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl font-normal">
                                    Covers Cloudflare Enterprise-grade routing, Render engine hosting, and monthly SEO schema maintenance.
                                </div>
                            </li>
                        </ul>
                        <Link to="/contact?package=engine&goal=rebuild" className="mt-8 inline-flex items-center justify-center px-5 py-3 bg-white text-black hover:bg-[#e2e2e2] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Request a Consultation
                        </Link>
                    </div>

                    {/* TIER 3 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all rounded-sm flex flex-col">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-secondary/30"></div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Authority</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">For high-ticket providers needing absolute market dominance.</p>
                        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-6">
                            $7,500+ CAD <br />
                            <span className="text-[10px] text-secondary/70 normal-case mt-2 block leading-relaxed">50% Deposit to commence engineering,<br />50% Due upon final deployment.</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Unlimited Core Pages</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Bespoke Premium Animations</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Strict Performance Invariants</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Custom CRM/Booking API Integrations</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Advanced Technical SEO</li>
                            <li className="flex items-start gap-3 group/tooltip relative">
                                <span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>
                                <span className="border-b border-dashed border-secondary/40 cursor-help">$150/mo Edge Infrastructure Retainer</span>
                                <div className="absolute left-0 bottom-full mb-2 w-[240px] p-3 bg-[#1a1d21] border border-white/10 text-[11px] text-secondary/90 rounded-sm opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                    Covers Cloudflare Enterprise-grade routing, Render engine hosting, and monthly SEO schema maintenance.
                                </div>
                            </li>
                        </ul>
                        <Link to="/contact?package=authority&goal=rebuild" className="mt-8 inline-flex items-center justify-center px-5 py-3 bg-white/10 border border-white/20 hover:bg-white hover:text-black text-primary text-[11px] font-semibold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Request a Consultation
                        </Link>
                    </div>

                </div>
                <div className="mt-8 surface-panel p-5 sm:p-6 rounded-sm border border-accent/20 bg-accent/5">
                    <div className="text-[10px] font-mono text-accent/90 uppercase tracking-widest mb-3">Risk Reversal</div>
                    <p className="text-[14px] text-secondary leading-relaxed">
                        Performance and mobile improvement commitments can be included in written scopes for eligible rebuild projects. We define benchmarks up front so expectations are clear before development starts.
                    </p>
                </div>
            </section>

            {/* MAINTENANCE & PORTFOLIO CTA */}
            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    <div className="surface-panel p-10 sm:p-14 relative overflow-hidden group border-white/5 transition-all rounded-sm">
                        <h3 className="text-[24px] font-semibold text-primary mb-2">Infrastructure Management</h3>
                        <div className="text-[12px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-6">$150 / Month</div>
                        <ul className="flex flex-col gap-4 text-[14px] text-secondary mb-8">
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Premium Cloudflare Edge Hosting</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>SSL Certificates & Security Patching</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Uptime Monitoring (24/7)</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Minor Text & Image Revisions Included</li>
                        </ul>
                        <p className="text-[13px] text-secondary/60 leading-relaxed">
                            We manage the servers, updates, and uptime so you never have to worry about your site crashing or handling technical debt.
                        </p>
                    </div>

                    <div className="flex flex-col justify-center p-8">
                        <h3 className="text-[24px] font-semibold text-primary mb-4">Performance Commitments</h3>
                        <p className="text-[15px] text-secondary leading-relaxed mb-6">
                            For qualifying rebuilds, we can define written performance and mobile improvement benchmarks in scope before work begins. The goal is a clear technical standard, not vague promises.
                        </p>
                        <Link to="/contact" className="self-start px-8 py-4 bg-[#121417] border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            Request a Consultation
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
