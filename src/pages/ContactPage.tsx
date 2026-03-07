import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

type SubmitState = '' | 'loading' | 'success' | 'error';
type ApiResult = {
    ok?: boolean;
    error?: string;
    message?: string;
    details?: string;
};

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
    { value: 'foundation', label: 'Foundation Investment ($500 CAD)' },
    { value: 'authority', label: 'Growth Investment ($1,500 CAD)' },
    { value: 'expansion', label: 'Multi-Location / Expansion ($3,000 CAD)' }
];

const PAIN_POINTS_OPTIONS = [
    'Losing leads to slow loading',
    'Looks worse than my competitors',
    'Losing high-paying jobs to stronger brands',
    'Hard for customers to request service quickly',
    'Hard to update and manage'
];

const FALLBACK_SUBMIT_ERROR = 'Submission failed. Please retry or email aidan@getaxiom.ca and riley@getaxiom.ca.';
const FIELD_LABEL_CLASS = 'text-[11px] font-axiomMono uppercase tracking-[0.16em] text-[#A7B3BC]';
const FIELD_INPUT_CLASS =
    'w-full rounded-xl border border-white/10 bg-[#0f1524]/70 px-4 py-3 text-sm text-[#F2F4F7] outline-none transition-all placeholder:text-slate-500 focus:border-[#B05D41]/60 focus:ring-2 focus:ring-[#B05D41]/20';
const SECONDARY_BUTTON_CLASS =
    'inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.06]';

function getApiErrorMessage(payload: ApiResult | null) {
    if (!payload) return FALLBACK_SUBMIT_ERROR;
    if (payload.error && payload.details) return `${payload.error} ${payload.details}`;
    if (payload.error) return payload.error;
    if (payload.message && !payload.ok) return payload.message;
    return FALLBACK_SUBMIT_ERROR;
}

const ContactPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState<IntakeFormState>(() => {
        const packageParam = (searchParams.get('package') || '').toLowerCase();
        const normalizedPackage =
            packageParam === 'starter' ? 'foundation' :
                packageParam === 'professional' ? 'authority' :
                    packageParam === 'enterprise' ? 'expansion' :
                        packageParam;
        return {
            ...INITIAL_FORM,
            project_scale: SCALE_OPTIONS.some(o => o.value === normalizedPackage) ? normalizedPackage : ''
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
        if (status === 'loading') return;
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
        let timeoutId: number | null = null;

        try {
            const controller = new AbortController();
            timeoutId = window.setTimeout(() => controller.abort(), 15000);
            const payload = {
                ...form,
                pain_points: form.pain_points.join(', '),
                source_path: window.location.pathname
            };
            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const result = await res.json().catch(() => null) as ApiResult | null;

            if (res.ok && result?.ok !== false) {
                setStatus('success');
                setMsg(result?.message || 'Application received. Confirmation email sent.');
                return;
            }

            setStatus('error');
            setMsg(getApiErrorMessage(result));
        } catch {
            setStatus('error');
            setMsg(FALLBACK_SUBMIT_ERROR);
        } finally {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        }
    };

    return (
        <>
            <SEO
                title="Apply | Axiom Infrastructure"
                description="Apply for a strategy call and infrastructure audit to identify revenue leaks and conversion gaps."
            />
            <Layout>
                <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
                    <section data-hero-root className="mx-auto max-w-3xl pt-16 text-center md:pt-22">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.2em] text-[#d4a48e]">Project Application</p>
                        <div className="mt-4 overflow-hidden">
                            <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                                Strategy Call + Infrastructure Audit
                            </h1>
                        </div>
                        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                            Step {step} of 2. We use this to scope the right build tier and prepare a focused strategy conversation.
                        </p>
                        <div className="mx-auto mt-5 h-[2px] w-full max-w-[440px] overflow-hidden rounded-full bg-white/10">
                            <div className={`h-full bg-[#B05D41] transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
                        </div>
                    </section>

                    <section className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
                        <article className="axiom-bento p-6">
                            <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">From the Founder</p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                I don't run a volume agency. I partner with a limited number of serious contractors to build infrastructure that dominates local markets.
                            </p>
                            <p className="mt-4 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Aidan - Lead Engineer - Kitchener ON</p>
                        </article>
                        <article className="axiom-bento p-6">
                            <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Guarantee</p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                If our infrastructure doesn't measurably increase qualified lead capture within 90 days, we work for free until it does.
                            </p>
                            <p className="mt-4 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-[#d4a48e]">Selective engagements only</p>
                        </article>
                    </section>

                    <section className="mx-auto mt-6 max-w-5xl">
                        <div className="axiom-bento p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                                <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                                    {status === 'success' && (
                                        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center">
                                            <h2 className="text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">{msg}</h2>
                                            <p className="mt-2 text-sm text-slate-300">A partner will review your submission and reply within one business day.</p>
                                            <button type="button" onClick={() => { setStatus(''); setStep(1); setForm(INITIAL_FORM); }} className={`${SECONDARY_BUTTON_CLASS} mt-5`}>
                                                Submit Another Application
                                            </button>
                                        </div>
                                    )}

                                    {status === 'error' && (
                                        <div className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                                            {msg}
                                        </div>
                                    )}

                                    <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                                        <label htmlFor="company-fax">Company Fax</label>
                                        <input id="company-fax" type="text" name="company_fax" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={(e) => setField('company_fax', e.target.value)} />
                                    </div>

                                    {step === 1 ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label className={FIELD_LABEL_CLASS}>Your Name</label>
                                                    <input type="text" required minLength={2} value={form.name} onChange={(e) => setField('name', e.target.value)} className={FIELD_INPUT_CLASS} />
                                                    {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className={FIELD_LABEL_CLASS}>Best Email</label>
                                                    <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} className={FIELD_INPUT_CLASS} />
                                                    {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className={FIELD_LABEL_CLASS}>Business Name</label>
                                                    <input type="text" required minLength={2} value={form.business_name} onChange={(e) => setField('business_name', e.target.value)} className={FIELD_INPUT_CLASS} />
                                                    {errors.business_name && <p className="text-xs text-red-300">{errors.business_name}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className={FIELD_LABEL_CLASS}>Phone</label>
                                                    <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={FIELD_INPUT_CLASS} />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className={FIELD_LABEL_CLASS}>Current Website</label>
                                                <input type="url" placeholder="https://" value={form.current_website} onChange={(e) => setField('current_website', e.target.value)} className={FIELD_INPUT_CLASS} />
                                            </div>

                                            <button type="button" onClick={handleNextStep} className="btn-primary btn-lg w-full">
                                                See If You Qualify (2-Minute Survey)
                                            </button>
                                            <p className="text-center font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">
                                                Only 2 of 4 partner slots remaining for this month.
                                            </p>

                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">What Happens Next</p>
                                                <div className="mt-4 flex flex-col gap-3">
                                                    {[
                                                        { phase: '01', text: 'Aidan personally reviews your current site and local market competition.' },
                                                        { phase: '02', text: 'We schedule a 15-minute strategy call to assess fit.' },
                                                        { phase: '03', text: "If it's not a fit, we say so directly and point you elsewhere." },
                                                    ].map((entry) => (
                                                        <div key={entry.phase} className="flex items-start gap-3">
                                                            <span className="mt-0.5 font-axiomMono text-xs text-[#d4a48e]">{entry.phase}</span>
                                                            <p className="text-sm text-slate-300">{entry.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className={FIELD_LABEL_CLASS}>Preferred Investment Tier</label>
                                                <select value={form.project_scale} onChange={(e) => setField('project_scale', e.target.value)} className={FIELD_INPUT_CLASS}>
                                                    <option value="" disabled>Select your investment tier...</option>
                                                    {SCALE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                                {errors.project_scale && <p className="text-xs text-red-300">{errors.project_scale}</p>}
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label className={FIELD_LABEL_CLASS}>Current Business Problems</label>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {PAIN_POINTS_OPTIONS.map(point => {
                                                        const selected = form.pain_points.includes(point);
                                                        return (
                                                            <button
                                                                key={point}
                                                                type="button"
                                                                onClick={() => togglePainPoint(point)}
                                                                className={`min-h-[50px] rounded-xl border px-3 py-2 text-left text-sm transition-colors ${selected
                                                                    ? 'border-[#B05D41]/45 bg-[#B05D41]/12 text-[#F2F4F7]'
                                                                    : 'border-white/10 bg-[#0f1524]/45 text-slate-300 hover:border-white/25'}`}
                                                            >
                                                                {point}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className={FIELD_LABEL_CLASS}>Goals and Constraints</label>
                                                <textarea rows={4} required minLength={10} value={form.details} onChange={(e) => setField('details', e.target.value)} placeholder="What outcome are you targeting in the next 6-12 months?" className={`${FIELD_INPUT_CLASS} resize-none`} />
                                                {errors.details && <p className="text-xs text-red-300">{errors.details}</p>}
                                            </div>

                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <button type="button" onClick={() => setStep(1)} className={SECONDARY_BUTTON_CLASS}>
                                                    Back
                                                </button>
                                                <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg flex-1 disabled:cursor-not-allowed disabled:opacity-70">
                                                    {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                                                </button>
                                            </div>
                                            <p className="text-center font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#d4a48e]">
                                                Only 2 of 4 partner slots remaining for this month.
                                            </p>
                                        </div>
                                    )}
                                </fieldset>
                            </form>
                        </div>
                    </section>
                </main>
                <Footer />
            </Layout>
        </>
    );
};

export default ContactPage;
