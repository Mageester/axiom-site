import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { getCaseStudyBySlug } from '../data/caseStudies';

const getConceptImage = (slug: string) => {
    if (slug.includes('hvac')) return 'https://images.unsplash.com/photo-1581094288338-2314dddb7ec3?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('landscaping') || slug.includes('lawn')) return 'https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('roofing')) return 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1504307651254-35680f356db4?auto=format&fit=crop&q=80&w=800'; // fallback
};

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
            <section className="px-6 pb-16 border-b border-axiom-border">
                <div className="max-w-[900px] mx-auto w-full reveal">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-1 rounded-sm ${entry.label === 'Sample Case Study' ? 'border-accent/20 text-accent/90 bg-accent/5' : 'border-axiom-border text-axiom-text-mute'}`}>
                            {entry.label}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute">{entry.niche}</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute/70">{entry.location}</span>
                    </div>
                    <h1 className="text-[34px] sm:text-[48px] font-semibold tracking-tight text-axiom-text-main mb-6">{entry.title}</h1>
                    <p className="text-[16px] text-axiom-text-mute leading-relaxed max-w-[760px]">{entry.summary}</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link to="/contact" className="btn-primary inline-flex items-center justify-center">
                            {entry.ctaLabel || 'Request a Consultation'}
                        </Link>
                        <Link to="/work" className="btn-secondary inline-flex items-center justify-center">
                            Back to Work
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 max-w-[1100px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Context</h2>
                            <p className="text-[15px] text-axiom-text-mute leading-relaxed">{entry.context}</p>
                        </div>

                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Problems</h2>
                            <ul className="space-y-3">
                                {entry.problems.map((item) => (
                                    <li key={item} className="text-[14px] text-axiom-text-mute leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-axiom-border shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">What We Built</h2>
                            <ul className="space-y-3">
                                {entry.built.map((item) => (
                                    <li key={item} className="text-[14px] text-axiom-text-mute leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Performance Targets</h2>
                            <ul className="space-y-3">
                                {entry.targets.map((item) => (
                                    <li key={item} className="text-[13px] text-axiom-text-mute leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-[11px] font-mono text-axiom-text-mute/70 mt-4 uppercase tracking-widest">
                                Targets shown for planning/demo purposes unless explicitly measured after launch.
                            </p>
                        </div>

                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-accent/80 uppercase tracking-widest mb-4">Deliverables</h2>
                            <ul className="space-y-3">
                                {entry.deliverables.map((item) => (
                                    <li key={item} className="text-[13px] text-axiom-text-mute leading-relaxed flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-axiom-border shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="axiom-bento p-6 rounded-sm">
                            <h2 className="text-[12px] font-mono text-axiom-text-mute uppercase tracking-widest mb-4">Concept Visual</h2>
                            <div className="h-[220px] rounded-sm border border-axiom-border relative overflow-hidden group">
                                <img
                                    src={getConceptImage(slug || '')}
                                    alt="Concept Visual"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-axiom-base/40 pointer-events-none transition-opacity duration-500 group-hover:bg-axiom-base/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 border-t border-axiom-border text-center">
                <div className="max-w-[760px] mx-auto">
                    <h2 className="text-[28px] font-semibold text-axiom-text-main tracking-tight mb-4">Want a build mapped to your service business?</h2>
                    <p className="text-[15px] text-axiom-text-mute leading-relaxed mb-8">
                        We can scope a similar architecture for your market, services, and conversion goals without template constraints.
                    </p>
                    <Link to="/contact" className="btn-primary inline-flex items-center justify-center">
                        Request a Consultation
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WorkCaseStudyPage;



