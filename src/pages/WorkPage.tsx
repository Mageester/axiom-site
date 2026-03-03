import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { caseStudies } from '../data/caseStudies';

const WorkPage: React.FC = () => {
    return (
        <div className="pt-32 pb-24">
            <SEO
                title="Our Work & Architectures | Axiom"
                description="Explore our high-performance website architectures and industry demonstrations custom-built for contractors."
            />
            <section className="px-6 pb-24 border-b border-axiom-border">
                <div className="max-w-[800px] w-full mx-auto text-center reveal">
                    <div className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6">Concept Architectures</div>
                    <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] mb-8 leading-[1.02] text-axiom-text-main">
                        Industry Demonstrations
                    </h1>
                    <p className="text-[17px] text-axiom-text-mute max-w-[700px] mx-auto leading-relaxed font-light reveal reveal-delay-1">
                        Explore our blueprint demonstrations. We custom-build these structural frameworks for specific industries to show you exactly how performance and conversion architecture should work before you hire us.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-[1100px] mx-auto w-full reveal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <a
                        href="https://hvac.getaxiom.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="axiom-bento p-8 md:p-10 relative overflow-hidden group hover:-translate-y-1 hover:border-axiom-border transition-all duration-500 flex flex-col"
                    >
                        <div className="absolute inset-0 bg-axiom-text-main/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="h-48 md:h-56 w-full bg-axiom-surface border-b border-axiom-border mb-6 flex items-center justify-center rounded-sm relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-500">
                            <img
                                src="/hvac-demo.png"
                                alt="Demonstration"
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-axiom-base/40 group-hover:bg-axiom-base/20 transition-colors duration-300 pointer-events-none z-10"></div>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[12px] font-mono uppercase tracking-widest border px-2 py-1 rounded-sm border-accent/20 text-accent/90 bg-accent/5">
                                Active Deployment
                            </span>
                            <span className="text-[12px] font-mono uppercase tracking-widest text-axiom-text-mute/70">Edge Isolated</span>
                        </div>
                        <h3 className="text-[20px] font-semibold text-axiom-text-main/90 mb-2 transition-colors group-hover:text-axiom-text-main">HVAC & Climate Dispatch</h3>
                        <div className="text-[12px] text-axiom-text-mute/60 uppercase font-mono tracking-widest mb-4">Industrial Control Demo</div>
                        <p className="text-[16px] text-axiom-text-mute leading-relaxed mb-6">
                            Sub-second, edge-deployed dispatch architecture designed for industrial climate control and emergency HVAC services.
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute">Initialize Demo</span>
                            <span className="text-accent/80 text-lg leading-none">-&gt;</span>
                        </div>
                    </a>
                    {caseStudies.map((project, i) => {
                        const isActiveDemo = project.label === 'Active Deployment';
                        const Wrapper: any = isActiveDemo ? 'a' : Link;
                        const wrapperProps = isActiveDemo ? {
                            href: project.slug.includes('landscaping') ? 'https://landscaping.getaxiom.ca' : 'https://roofing.getaxiom.ca',
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        } : {
                            to: `/work/${project.slug}`
                        };

                        return (
                            <Wrapper
                                key={project.slug}
                                {...wrapperProps}
                                className="axiom-bento p-8 md:p-10 relative overflow-hidden group hover:-translate-y-1 hover:border-axiom-border transition-all duration-500 flex flex-col"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                <div className="absolute inset-0 bg-axiom-text-main/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="h-48 md:h-56 w-full bg-axiom-surface border-b border-axiom-border mb-6 flex items-center justify-center rounded-sm relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-500">
                                    <img
                                        src={
                                            project.slug.includes('hvac')
                                                ? "/hvac-case-study.webp"
                                                : project.slug.includes('landscaping')
                                                    ? "/landscaping-concept.webp"
                                                    : project.slug.includes('roofing')
                                                        ? "/roofing-concept.webp"
                                                        : "https://images.unsplash.com/photo-1581094288338-2314dddb7ec3?auto=format&fit=crop&q=80&w=800"
                                        }
                                        alt={project.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-axiom-base/40 group-hover:bg-axiom-base/20 transition-colors duration-300 pointer-events-none z-10"></div>
                                </div>
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className={`text-[12px] font-mono uppercase tracking-widest border px-2 py-1 rounded-sm ${isActiveDemo ? 'border-accent/20 text-accent/90 bg-accent/5' : project.label === 'Sample Case Study' ? 'border-accent/20 text-accent/90 bg-accent/5' : 'border-axiom-border text-axiom-text-mute'}`}>
                                        {project.label}
                                    </span>
                                    <span className="text-[12px] font-mono uppercase tracking-widest text-axiom-text-mute/70">{project.location}</span>
                                </div>
                                <h3 className="text-[20px] font-semibold text-axiom-text-main/90 mb-2 transition-colors group-hover:text-axiom-text-main">{project.title}</h3>
                                <div className="text-[12px] text-axiom-text-mute/60 uppercase font-mono tracking-widest mb-4">{project.niche}</div>
                                <p className="text-[16px] text-axiom-text-mute leading-relaxed mb-6">
                                    {project.summary}
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute">{project.ctaLabel || 'Open Blueprint'}</span>
                                    <span className="text-accent/80 text-lg leading-none">{isActiveDemo ? '->' : '->'}</span>
                                </div>
                            </Wrapper>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default WorkPage;



