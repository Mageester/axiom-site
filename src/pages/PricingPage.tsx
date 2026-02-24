import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    return (
        <div className="pt-32 pb-24">
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
            <section className="py-24 px-6 max-w-[1200px] mx-auto w-full reveal">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* TIER 1 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all rounded-sm flex flex-col">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-secondary/30"></div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Foundation</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">Perfect for new businesses needing a professional digital presence fast.</p>
                        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-6">$1,500 – $2,500 CAD <br /><span className="lowercase text-secondary/60">(2-3 weeks)</span></div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>3-5 Page Custom Design</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Mobile-First Responsiveness</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Basic On-Page SEO & Fast Loading</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Contact Form Integration</li>
                        </ul>
                    </div>

                    {/* TIER 2 - ACCENTED */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/10 hover:border-white/20 transition-all rounded-sm flex flex-col scale-[1.02] shadow-2xl z-10 bg-[#121417]">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/80"></div>
                        <div className="absolute top-0 right-0 py-1 px-3 bg-accent/10 border-b border-l border-accent/20 text-[10px] font-mono text-accent uppercase tracking-widest rounded-bl-sm">Recommended</div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Engine</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">For established businesses driving traffic who need higher conversions.</p>
                        <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-6 border-b border-subtle pb-6">$3,500 – $5,500 CAD <br /><span className="lowercase text-secondary/60">(4-6 weeks)</span></div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>5-10 Page Custom Design</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Focused Service Service Pages</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Advanced Local SEO Structure (Schema)</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Google Analytics & Tag Manager</li>
                            <li className="flex items-start gap-3"><span className="text-accent/60 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Speed Guarantees (90+ Lighthouse)</li>
                        </ul>
                    </div>

                    {/* TIER 3 */}
                    <div className="surface-panel p-8 sm:p-10 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all rounded-sm flex flex-col">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-secondary/30"></div>
                        <h3 className="text-[24px] font-semibold text-primary mb-2">The Authority</h3>
                        <p className="text-[13px] text-secondary mb-4 min-h-[40px]">For high-ticket providers needing absolute market dominance.</p>
                        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-6">$7,500+ CAD <br /><span className="lowercase text-secondary/60">(6-8+ weeks)</span></div>
                        <ul className="flex flex-col gap-4 text-[13px] text-secondary flex-1">
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Unlimited Core Pages</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Bespoke Premium Animations</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Strict Performance Invariants</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Custom CRM/Booking API Integrations</li>
                            <li className="flex items-start gap-3"><span className="text-secondary/40 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>Advanced Technical SEO</li>
                        </ul>
                    </div>

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
                        <h3 className="text-[24px] font-semibold text-primary mb-4">The Rebuild Guarantee</h3>
                        <p className="text-[15px] text-secondary leading-relaxed mb-6">
                            If your new custom site doesn't load faster and perform better on mobile than your old one, <strong>you don't pay the final invoice.</strong> We build infrastructure that mathematically out-competes generic site builders, and we stake our revenue on it.
                        </p>
                        <Link to="/contact" className="self-start px-8 py-4 bg-[#121417] border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            Discuss Your Project
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
