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
    company_fax: string; // Honeypot
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
    { value: 'foundation', label: 'The Foundation ($1,450+)' },
    { value: 'engine', label: 'The Engine ($3,250+)' },
    { value: 'authority', label: 'The Authority ($7,500+)' }
];

const PAIN_POINTS_OPTIONS = [
    'Slow Speeds',
    'Poor Mobile UX',
    'Low Lead Volume',
    'Outdated Design'
];

const ContactPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState<IntakeFormState>(() => {
        // Pre-fill package if it came from URL
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

    const setField = (key: keyof IntakeFormState, value: any) => {
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

        if (form.company_fax) return; // Honeypot check

        // Step 2 Validation
        const nextErrors: typeof errors = {};
        if (!form.project_scale) nextErrors.project_scale = 'Please select a project scale.';
        if (form.details.trim().length < 10) nextErrors.details = 'Please provide some project details (min 10 chars).';

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
            console.log('[AXIOM] Sending Payload:', payload);

            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            const res = await fetch(`${backendUrl}/api/intake`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus('success');
                setMsg('Axiom Blueprint Requested.');
                return;
            }

            setStatus('error');
            setMsg('Engineering Link Failed. Please reach out to aidan@getaxiom.ca directly while we recalibrate.');
        } catch {
            setStatus('error');
            setMsg('Engineering Link Failed. Please reach out to aidan@getaxiom.ca directly while we recalibrate.');
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
            <SEO
                title="Project Intake | Axiom Infrastructure"
                description="Start your web infrastructure project today. Fill out our intake form to discuss custom builds or rebuilds for your service business."
            />
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

            <div className="max-w-[700px] mx-auto w-full relative z-10 px-6 reveal">
                <div className="text-center mb-12">
                    <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 text-primary tracking-tight leading-[1.05]">
                        Infrastructure Qualification
                    </h1>
                    <p className="text-[16px] text-secondary max-w-md mx-auto leading-relaxed">
                        Step {step} of 2. Tell us about your current capabilities and goals.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0f1113] border border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] p-8 md:p-12 flex flex-col gap-8 rounded-sm relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
                        <div className="h-full bg-accent/60 transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                    </div>

                    {status === 'success' && (
                        <div className="absolute inset-0 bg-[#0f1113] z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-accent mb-6 w-12 h-12 flex items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-[24px] font-semibold text-primary mb-3">Axiom Blueprint Requested.</h2>
                            <p className="text-[14px] text-secondary leading-relaxed max-w-sm mb-8">
                                Our engineering team will review your infrastructure and respond within 24 hours.
                            </p>
                            <button onClick={() => { setStatus(''); setStep(1); setForm(INITIAL_FORM); }} className="px-6 py-3 border border-white/10 hover:border-white/30 text-[12px] font-bold uppercase tracking-widest text-primary transition-colors">
                                Return to Forms
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-[#0e0d0c] border border-[#2a2218] text-[#a89070] p-5 rounded-[2px] text-[13px] font-mono leading-relaxed mb-2 flex items-start gap-4 animate-in fade-in duration-300">
                            <div className="w-2 h-2 mt-1.5 bg-[#6b4c2a] rounded-sm shrink-0"></div>
                            <p>{msg}</p>
                        </div>
                    )}

                    {/* Honeypot */}
                    <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="company-fax">Company Fax</label>
                        <input id="company-fax" type="text" name="company_fax" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={(e) => setField('company_fax', e.target.value)} />
                    </div>

                    {step === 1 ? (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Your Name</label>
                                    <input type="text" name="name" required minLength={2} value={form.name} onChange={(e) => setField('name', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                                    {errors.name && <p className="text-[12px] text-red-400">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Email Address</label>
                                    <input type="email" name="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                                    {errors.email && <p className="text-[12px] text-red-400">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Business Name</label>
                                    <input type="text" name="business_name" required minLength={2} value={form.business_name} onChange={(e) => setField('business_name', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                                    {errors.business_name && <p className="text-[12px] text-red-400">{errors.business_name}</p>}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Phone (Optional)</label>
                                    <input type="tel" name="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Current Website (if any)</label>
                                <input type="url" name="current_website" placeholder="https://" value={form.current_website} onChange={(e) => setField('current_website', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                            </div>

                            <button type="button" onClick={handleNextStep} className="w-full py-4 mt-4 bg-white text-black hover:bg-[#e2e2e2] hover:scale-[1.01] active:scale-[0.99] min-h-[50px] text-[14px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px]">
                                Continue to Project Details →
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">

                            <div className="flex flex-col gap-3">
                                <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Project Scale</label>
                                <select required value={form.project_scale} onChange={(e) => setField('project_scale', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none appearance-none cursor-pointer">
                                    <option value="" disabled>Select your infrastructure tier...</option>
                                    {SCALE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.project_scale && <p className="text-[12px] text-red-400">{errors.project_scale}</p>}
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Primary Pain Points</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PAIN_POINTS_OPTIONS.map(point => {
                                        const isSelected = form.pain_points.includes(point);
                                        return (
                                            <button
                                                key={point}
                                                type="button"
                                                onClick={() => togglePainPoint(point)}
                                                className={`min-h-[48px] p-3 text-[14px] rounded-[2px] transition-all duration-300 border text-left flex items-center gap-3 ${isSelected
                                                    ? 'bg-accent/10 border-accent/40 text-primary'
                                                    : 'bg-[#070708] border-white/10 text-secondary hover:border-white/30'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${isSelected ? 'border-accent bg-accent/20' : 'border-white/20'}`}>
                                                    {isSelected && <div className="w-2 h-2 bg-accent rounded-sm"></div>}
                                                </div>
                                                {point}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mb-2">
                                <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Project Details & Objectives</label>
                                <textarea name="details" rows={4} required minLength={10} value={form.details} onChange={(e) => setField('details', e.target.value)} placeholder="Tell us exactly what you need built..." className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors resize-none rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"></textarea>
                                {errors.details && <p className="text-[12px] text-red-400">{errors.details}</p>}
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <button type="button" onClick={() => setStep(1)} className="py-4 px-6 bg-transparent border border-white/10 text-secondary hover:text-primary hover:border-white/30 min-h-[50px] text-[14px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px]">
                                    Back
                                </button>
                                <button disabled={status === 'loading' || status === 'success'} type="submit" className="flex-1 py-4 bg-white text-black hover:bg-[#e2e2e2] hover:scale-[1.01] active:scale-[0.99] min-h-[50px] text-[14px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                                    {status === 'loading' ? 'Submitting...' : 'Submit Infrastructure Request'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
