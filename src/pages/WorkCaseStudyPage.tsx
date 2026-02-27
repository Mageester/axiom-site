import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { getCaseStudyBySlug } from '../data/caseStudies';

const WorkCaseStudyPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const entry = getCaseStudyBySlug(String(slug || ''));

    if (!entry) return <Navigate to="/work" replace />;

    return (
        <div className="pt-32 pb-24">
            <SEO
                title={`${entry.title} | Axiom Work`}
                description={entry.summary}
            />
            <section className="px-6 pb-16 border-b border-subtle">
                <div className="max-w-[900px] mx-auto w-full reveal">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-1 rounded-sm ${entry.label === 'Sample Case Study' ? 'border-accent/20 text-accent/90 bg-accent/5' : 'border-white/10 text-secondary'}`}>
                            {entry.label}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">{entry.niche}</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary/70">{entry.location}</span>
                    </div>
                    <h1 className="text-[34px] sm:text-[48px] font-semibold tracking-tight text-primary mb-6">{entry.title}</h1>
                    <p className="text-[16px] text-secondary leading-relaxed max-w-[760px]">{entry.summary}</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white hover:bg-white/90 text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 rounded-[2px]">
                            {entry.ctaLabel || 'Request a Consultation'}
                        </Link>
                        <Link to="/work" className="inline-block px-8 py-4 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-300">
                            Back to Work
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 max-w-[1100px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Context</h2>
                            <p className="text-[15px] text-secondary leading-relaxed">{entry.context}</p>
                        </div>

                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Problems</h2>
                            <ul className="space-y-3">
                                {entry.problems.map((item) => (
                                    <li key={item} className="text-[14px] text-secondary leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary/40 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">What We Built</h2>
                            <ul className="space-y-3">
                                {entry.built.map((item) => (
                                    <li key={item} className="text-[14px] text-secondary leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Performance Targets</h2>
                            <ul className="space-y-3">
                                {entry.targets.map((item) => (
                                    <li key={item} className="text-[13px] text-secondary leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-[11px] font-mono text-secondary/70 mt-4 uppercase tracking-widest">
                                Targets shown for planning/demo purposes unless explicitly measured after launch.
                            </p>
                        </div>

                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Deliverables</h2>
                            <ul className="space-y-3">
                                {entry.deliverables.map((item) => (
                                    <li key={item} className="text-[13px] text-secondary leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="surface-panel p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-secondary uppercase tracking-widest mb-4">Concept Visual</h2>
                            <div className="h-[220px] rounded-sm border border-white/10 bg-white/5 flex items-center justify-center">
                                <span className="text-[11px] font-mono text-secondary/50 uppercase tracking-widest">[Concept Layout Frame]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-subtle text-center">
                <div className="max-w-[760px] mx-auto">
                    <h2 className="text-[28px] font-semibold text-primary tracking-tight mb-4">Want a build mapped to your service business?</h2>
                    <p className="text-[15px] text-secondary leading-relaxed mb-8">
                        We can scope a similar architecture for your market, services, and conversion goals without template constraints.
                    </p>
                    <Link to="/contact" className="inline-block px-8 py-4 bg-white hover:bg-white/90 text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 rounded-[2px]">
                        Request a Consultation
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WorkCaseStudyPage;
