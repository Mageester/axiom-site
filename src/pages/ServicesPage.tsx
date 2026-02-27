import React from 'react';
import { SEO } from '../components/SEO';

const ServicesPage: React.FC = () => {
    return (
        <div className="pt-32 pb-24">
            <SEO
                title="Web Infrastructure Services | Axiom"
                description="We design, build, and maintain high-performance websites for service-based businesses in Kitchener. Custom builds, rebuilds, and landing pages."
            />
            <section className="px-6 pb-24 border-b border-subtle">
                <div className="max-w-[800px] w-full mx-auto text-center reveal">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6">Capabilities</div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-primary">
                        Professional Website Building
                    </h1>
                    <p className="text-[17px] text-secondary max-w-[650px] mx-auto leading-relaxed font-light reveal reveal-delay-1">
                        We design, build, and maintain high-performance websites for service-based businesses. Modern architecture, responsive design, and local SEO basics baked in.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">Our Core Services</h2>
                    <div className="w-8 h-[2px] bg-accent mb-8 opacity-60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "New Website Builds", desc: "Starting from scratch? We build beautiful, fast-loading, mobile-friendly websites that give you an instant professional edge." },
                        { title: "Website Rebuilds", desc: "Outdated design or slow speeds? We modernize your existing site onto a rigid, lightning-fast architecture." },
                        { title: "Landing Pages", desc: "Need to drive traffic to a specific offer? We design high-converting, single-page sites built specifically for ad campaigns." },
                        { title: "Maintenance & Hosting", desc: "We manage the servers, updates, and uptime so you never have to worry about your site crashing." }
                    ].map((srv, i) => (
                        <div
                            key={i}
                            className="surface-panel p-8 sm:p-10 relative overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,0.84,0.44,1)] reveal rounded-sm"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <h3 className="text-[18px] font-semibold text-primary/90 mb-4 group-hover:text-primary transition-colors leading-tight relative">{srv.title}</h3>
                            <p className="text-[14px] text-secondary leading-relaxed relative">{srv.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
