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
        <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen text-[#a1a1a1] font-sans selection:bg-white/20">
            <SEO
                title="Website Pricing & Packages | Axiom Infrastructure"
                description="Honest, transparent pricing for high-performance contractor web design. View our website packages starting at $1,450 CAD."
            />
            <section className="px-6 pb-24 border-b border-white/5">
                <div className="max-w-[800px] w-full mx-auto text-center reveal">
                    <div className="text-[11px] font-mono text-white/70 uppercase tracking-widest mb-6">Investment Structure</div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-[#ffffff]">
                        Simple, Honest Pricing.
                    </h1>
                    <p className="text-[17px] text-[#a1a1a1] max-w-[650px] mx-auto leading-relaxed font-light reveal reveal-delay-1">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 w-full text-left">

                    {/* TIER 1 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-300 rounded-sm flex flex-col bg-black/40">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#a1a1a1]/30"></div>
                        <h3 className="text-[24px] font-semibold text-[#ffffff] mb-2 tracking-tight">Foundation</h3>
                        <p className="text-[13px] text-axiom-text-mute mb-6 min-h-[40px] leading-relaxed">Essential digital infrastructure for local professionals.</p>
                        <div className="text-[32px] font-semibold text-[#ffffff] mb-8 border-b border-white/5 pb-6">
                            $7,500+ <span className="text-[12px] font-normal text-axiom-text-mute uppercase tracking-widest ml-1">CAD</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-[#a1a1a1] flex-1">
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>3-Page Core Architecture</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Cloudflare Edge Deployment</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Field-Optimized Mobile UX</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>SSL & Global CDN Security</li>
                        </ul>
                        <Link to="/contact?package=foundation" className="mt-10 inline-flex items-center justify-center px-5 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:scale-[1.05] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Select Foundation
                        </Link>
                    </div>

                    {/* TIER 2 - FEATURED */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/20 hover:border-white/40 transition-all duration-500 rounded-sm flex flex-col scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.06)] z-20 bg-[#0c0c0c] border-t-2 border-t-axiom-accent">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-[#ffffff]"></div>
                        <div className="absolute top-0 right-0 py-1.5 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-bl-sm z-10 shadow-lg">Contractor's Choice</div>
                        <h3 className="text-[24px] font-semibold text-[#ffffff] mb-2 tracking-tight">Contractor's Choice</h3>
                        <p className="text-[13px] text-axiom-text-mute mb-6 min-h-[40px] leading-relaxed">A high-speed lead generation machine for growth-stage teams.</p>
                        <div className="text-[32px] font-semibold text-[#ffffff] mb-8 border-b border-white/10 pb-6 relative z-10">
                            $7,500+ <span className="text-[12px] font-normal text-axiom-text-mute uppercase tracking-widest ml-1">CAD</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-white/90 font-medium flex-1 relative z-10">
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>7-10 High-Conversion Pages</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>90+ Lighthouse Speed Performance</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Local SEO Schema Architecture</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Advanced Lead Capture Systems</li>
                        </ul>
                        <Link to="/contact?package=engine" className="mt-10 relative z-10 inline-flex items-center justify-center px-5 py-4 bg-white text-black border border-transparent hover:bg-[#e2e2e2] hover:scale-[1.05] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Select Engine
                        </Link>
                    </div>

                    {/* TIER 3 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-300 rounded-sm flex flex-col bg-black/40">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#a1a1a1]/30"></div>
                        <h3 className="text-[24px] font-semibold text-[#ffffff] mb-2 tracking-tight">Authority</h3>
                        <p className="text-[13px] text-axiom-text-mute mb-6 min-h-[40px] leading-relaxed">Custom-engineered systems for market leaders.</p>
                        <div className="text-[32px] font-semibold text-[#ffffff] mb-8 border-b border-white/5 pb-6">
                            $7,500+ <span className="text-[12px] font-normal text-axiom-text-mute uppercase tracking-widest ml-1">CAD</span>
                        </div>
                        <ul className="flex flex-col gap-4 text-[13px] text-[#a1a1a1] flex-1">
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Bespoke Digital Ecosystems</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Custom CRM & Booking Integration</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Enterprise-Grade Security Protocols</li>
                            <li className="flex items-center gap-3"><span className="text-axiom-accent shrink-0">✓</span>Priority Engineering Support</li>
                        </ul>
                        <Link to="/contact?package=authority" className="mt-10 inline-flex items-center justify-center px-5 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:scale-[1.05] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300">
                            Select Enterprise
                        </Link>
                    </div>

                </div>

                <div className="mt-20 pt-10 border-t border-white/5 text-center reveal w-full flex align-center justify-center">
                    <p className="text-[12px] font-mono text-[#a1a1a1] tracking-widest uppercase">
                        Managed Infrastructure starting at <span className="text-white font-bold ml-1">$95/mo.</span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
