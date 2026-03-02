import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

type SubmitState = '' | 'loading' | 'success' | 'error';

type IntakeFormState = {
    name: string;
    email: string;
    business_name: string;
    phone: string;
    current_website: string;
    project_scale: string;
    pain_points: string[];
    details: string;
    company_fax: string;
};

const INITIAL_FORM: IntakeFormState = {
    name: '',
    email: '',
    business_name: '',
    phone: '',
    current_website: '',
    project_scale: '',
    pain_points: [],
    details: '',
    company_fax: ''
};

const SCALE_OPTIONS = [
    { value: 'starter', label: 'Starter Investment ($2,500)' },
    { value: 'professional', label: 'Professional Investment ($5,000)' },
    { value: 'enterprise', label: 'Enterprise Investment ($7,500+)' }
];

const PAIN_POINTS_OPTIONS = [
    'Losing leads to slow loading',
    'Looks worse than my competitors',
    'Losing high-paying jobs to stronger brands',
    'Hard for customers to request service quickly',
    'Hard to update and manage'
];

const ContactPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState<IntakeFormState>(() => {
        const packageParam = (searchParams.get('package') || '').toLowerCase();
        return {
            ...INITIAL_FORM,
            project_scale: SCALE_OPTIONS.some(o => o.value === packageParam) ? packageParam : ''
        };
    });

    const [step, setStep] = useState<1 | 2>(1);
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof IntakeFormState, string>>>({});

    const setField = (key: keyof IntakeFormState, value: string | string[]) => {
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const togglePainPoint = (point: string) => {
        setForm(prev => {
            const current = prev.pain_points;
            const updated = current.includes(point)
                ? current.filter(p => p !== point)
                : [...current, point];
            return { ...prev, pain_points: updated };
        });
    };

    const validateStep1 = () => {
        const nextErrors: typeof errors = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Name is required.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required.';
        if (form.business_name.trim().length < 2) nextErrors.business_name = 'Business name required.';
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.company_fax) return;

        const nextErrors: typeof errors = {};
        if (!form.project_scale) nextErrors.project_scale = 'Please select an investment tier.';
        if (form.details.trim().length < 10) nextErrors.details = 'Please share details (min 10 chars).';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setStatus('loading');
        setMsg('');

        try {
            const payload = {
                ...form,
                pain_points: form.pain_points.join(', '),
                source_path: window.location.pathname
            };
            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus('success');
                setMsg('Application Received.');
                return;
            }

            setStatus('error');
            setMsg('Application link failed. Please email aidan@getaxiom.ca directly while we recalibrate.');
        } catch {
            setStatus('error');
            setMsg('Application link failed. Please email aidan@getaxiom.ca directly while we recalibrate.');
        }
    };

    return (
        <div className="pt-36 pb-24 px-6">
            <SEO
                title="Apply | Axiom Infrastructure"
                description="Apply for a strategy call and infrastructure audit to identify revenue leaks and conversion gaps."
            />

            <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 mb-8">
                <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest">Project Application</p>
                <h1 className="text-[38px] sm:text-[48px] font-semibold text-primary tracking-tight leading-[1.06]">
                    Strategy Call + Infrastructure Audit
                </h1>
                <p className="text-[16px] text-secondary leading-relaxed">
                    Step {step} of 2. We use this to scope the right build tier and prepare a focused strategy conversation.
                </p>
            </section>

            {/* Founder's Note */}
            <section className="max-w-4xl mx-auto mb-6">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-6 md:p-8 flex gap-5 items-start">
                    <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-[#1a1d25] border border-[#2a2d35] flex items-center justify-center text-[18px] font-bold text-white/60 uppercase tracking-wide">A</div>
                        <p className="text-[9px] font-mono text-[var(--text-secondary)]/40 uppercase tracking-widest text-center leading-tight max-w-[70px]">Aidan<br />Lead Engineer<br />Kitchener ON</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[13px] font-mono text-[var(--accent)] uppercase tracking-widest">From the Operator</p>
                        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                            I don't run a volume agency. I partner with a handful of serious contractors to build infrastructure that dominates local markets. Fill out the survey, and I will personally review your current setup.
                        </p>
                        <p className="text-[12px] font-mono text-[var(--text-secondary)]/60 uppercase tracking-widest mt-1">— Aidan · Axiom Infrastructure</p>
                    </div>
                </div>
            </section>

            {/* Performance Guarantee */}
            <section className="max-w-4xl mx-auto mb-6">
                <div className="bg-[#111214] border border-[#1e2028] rounded-lg p-6 text-center">
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                        <span className="font-bold text-white uppercase tracking-widest text-[12px] mr-2">The Axiom Guarantee:</span>
                        If our infrastructure doesn't measurably increase your qualified lead capture within 90 days, we work for free until it does.
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto bg-[#111214] border border-[#1e2028] p-8 md:p-10 rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {status === 'success' && (
                        <div className="surface-panel bg-zinc-900/70 border-zinc-700 p-8 text-center rounded-sm">
                            <h2 className="text-[28px] font-semibold text-primary mb-3">{msg}</h2>
                            <p className="text-[14px] text-secondary mb-6">Our strategy team will reply within 24 hours.</p>
                            <button onClick={() => { setStatus(''); setStep(1); setForm(INITIAL_FORM); }} className="min-h-[48px] px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-[12px] font-bold uppercase tracking-widest text-primary transition-colors">
                                Submit Another Application
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-[#0e0d0c] border border-[#2a2218] text-[#a89070] p-5 rounded-[2px] text-[13px] font-mono leading-relaxed">
                            {msg}
                        </div>
                    )}

                    <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="company-fax">Company Fax</label>
                        <input id="company-fax" type="text" name="company_fax" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={(e) => setField('company_fax', e.target.value)} />
                    </div>

                    {step === 1 ? (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Operator Name</label>
                                    <input type="text" required minLength={2} value={form.name} onChange={(e) => setField('name', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30" />
                                    {errors.name && <p className="text-[12px] text-red-400">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Best Email</label>
                                    <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30" />
                                    {errors.email && <p className="text-[12px] text-red-400">{errors.email}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Business Name</label>
                                    <input type="text" required minLength={2} value={form.business_name} onChange={(e) => setField('business_name', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30" />
                                    {errors.business_name && <p className="text-[12px] text-red-400">{errors.business_name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Phone</label>
                                    <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Current Website</label>
                                <input type="url" placeholder="https://" value={form.current_website} onChange={(e) => setField('current_website', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30" />
                            </div>
                            <button type="button" onClick={handleNextStep} className="min-h-[52px] w-full bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest rounded-[4px]">
                                See If You Qualify (2‑Minute Survey)
                            </button>
                            <p className="text-[11px] font-mono text-center text-[var(--accent)] uppercase tracking-widest">Only 2 of 4 Partner Slots Remaining for This Month.</p>

                            {/* What Happens Next */}
                            <div className="bg-[#0e0f12] border border-[#1a1d25] rounded-md p-5 flex flex-col gap-4">
                                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-widest">What Happens Next</p>
                                {[
                                    { phase: '01', text: 'Aidan personally reviews your current site and local market competition.' },
                                    { phase: '02', text: 'We schedule a 15-minute Strategy Call to see if our infrastructure fits your sales flow.' },
                                    { phase: '03', text: "We either move to a formal Audit, or point you to someone else if we aren't a fit. No pressure." },
                                ].map((step) => (
                                    <div key={step.phase} className="flex gap-3 items-start">
                                        <span className="text-[14px] font-bold text-[var(--accent)]/20 font-mono shrink-0 mt-0.5">{step.phase}</span>
                                        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Preferred Investment Tier</label>
                                <select value={form.project_scale} onChange={(e) => setField('project_scale', e.target.value)} className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none focus-visible:border-white/30">
                                    <option value="" disabled>Select your investment tier...</option>
                                    {SCALE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                {errors.project_scale && <p className="text-[12px] text-red-400">{errors.project_scale}</p>}
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Current Business Problems</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PAIN_POINTS_OPTIONS.map(point => {
                                        const selected = form.pain_points.includes(point);
                                        return (
                                            <button key={point} type="button" onClick={() => togglePainPoint(point)} className={`min-h-[48px] p-3 text-left text-[14px] border rounded-sm ${selected ? 'bg-white/10 border-white/30 text-primary' : 'bg-[#0b0b0c] border-zinc-700 text-secondary hover:border-zinc-500'}`}>
                                                {point}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-mono text-secondary uppercase tracking-widest">Goals and Constraints</label>
                                <textarea rows={4} required minLength={10} value={form.details} onChange={(e) => setField('details', e.target.value)} placeholder="What outcome are you targeting in the next 6-12 months?" className="bg-[#0b0b0c] border border-zinc-700 text-primary text-[15px] p-4 min-h-[48px] rounded-sm outline-none resize-none focus-visible:border-white/30"></textarea>
                                {errors.details && <p className="text-[12px] text-red-400">{errors.details}</p>}
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(1)} className="min-h-[52px] px-6 border border-zinc-700 hover:border-zinc-500 text-[12px] font-bold uppercase tracking-widest text-primary">
                                    Back
                                </button>
                                <button type="submit" disabled={status === 'loading'} className="min-h-[52px] flex-1 bg-white text-black hover:bg-[#e2e2e2] text-[12px] font-bold uppercase tracking-widest disabled:opacity-50">
                                    {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                            <p className="text-[11px] font-mono text-center text-[var(--accent)] uppercase tracking-widest mt-2">Only 2 of 4 Partner Slots Remaining for This Month.</p>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default ContactPage;
