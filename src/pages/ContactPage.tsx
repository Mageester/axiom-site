import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
type YesNoAnswer = '' | 'yes' | 'no';

type IntakeFormState = {
    name: string;
    email: string;
    business_name: string;
    phone: string;
    current_website: string;
    project_scale: string;
    pain_points: string[];
    details: string;
    fit_active_demand: YesNoAnswer;
    fit_trust_conversion_need: YesNoAnswer;
    fit_decision_owner_ready: YesNoAnswer;
    fit_defined_scope_ready: YesNoAnswer;
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
    fit_active_demand: '',
    fit_trust_conversion_need: '',
    fit_decision_owner_ready: '',
    fit_defined_scope_ready: ''
};

const SCALE_OPTIONS = [
    { value: 'foundation', label: 'Foundation Build ($500 CAD)' },
    { value: 'authority', label: 'Growth Build ($1,500 CAD)' },
    { value: 'expansion', label: 'Custom or Multi-location Build ($3,000 CAD)' }
];

const PAIN_POINTS_OPTIONS = [
    'Losing leads to slow loading',
    'Looks worse than my competitors',
    'Losing high-paying jobs to stronger brands',
    'Hard for customers to request service quickly',
    'Hard to update and manage'
];

const FIT_QUESTIONS: ReadonlyArray<{ key: keyof Pick<IntakeFormState, 'fit_active_demand' | 'fit_trust_conversion_need' | 'fit_decision_owner_ready' | 'fit_defined_scope_ready'>; label: string }> = [
    {
        key: 'fit_active_demand',
        label: 'Are you currently taking on new clients or customers?'
    },
    {
        key: 'fit_trust_conversion_need',
        label: 'Are you looking for a professional, custom website rather than a cheap template?'
    },
    {
        key: 'fit_decision_owner_ready',
        label: 'Will you (or a single decision-maker) be available to review the project during the build?'
    },
    {
        key: 'fit_defined_scope_ready',
        label: 'Are you ready to start this project within the next few weeks?'
    }
];
type FitQuestionKey = (typeof FIT_QUESTIONS)[number]['key'];

const FALLBACK_SUBMIT_ERROR = 'Submission failed. Please retry or email contact@getaxiom.ca.';
const FIELD_LABEL_CLASS = 'text-[11px] font-axiomMono uppercase tracking-[0.16em] text-[#A7B3BC]';
const FIELD_INPUT_CLASS =
    'w-full rounded-xl border border-white/10 bg-[#0f1524]/70 px-4 py-3 text-sm text-[#F2F4F7] outline-none transition-all placeholder:text-slate-500 focus:border-[#B05D41]/60 focus:ring-2 focus:ring-[#B05D41]/20';
const SECONDARY_BUTTON_CLASS =
    'inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.06]';

function getPreferredScrollBehavior(): ScrollBehavior {
    if (typeof window === 'undefined') return 'auto';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function getApiErrorMessage(payload: ApiResult | null) {
    if (!payload) return FALLBACK_SUBMIT_ERROR;
    if (payload.error && payload.details) return `${payload.error} ${payload.details}`;
    if (payload.error) return payload.error;
    if (payload.message && !payload.ok) return payload.message;
    return FALLBACK_SUBMIT_ERROR;
}

type ContactFormState = {
    name: string;
    email: string;
    business_name: string;
    message: string;
};

const CONTACT_INITIAL_FORM: ContactFormState = {
    name: '',
    email: '',
    business_name: '',
    message: '',
};

const GeneralContactForm: React.FC = () => {
    const [form, setForm] = useState<ContactFormState>(CONTACT_INITIAL_FORM);
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
    const successBoxRef = useRef<HTMLDivElement>(null);
    const errorBoxRef = useRef<HTMLDivElement>(null);
    const fieldRefs = useRef<Partial<Record<keyof ContactFormState, HTMLElement | null>>>({});

    useEffect(() => {
        if (status !== 'success') return;
        successBoxRef.current?.scrollIntoView({ behavior: getPreferredScrollBehavior(), block: 'center' });
        successBoxRef.current?.focus({ preventScroll: true });
    }, [status]);

    useEffect(() => {
        if (status !== 'error') return;
        errorBoxRef.current?.scrollIntoView({ behavior: getPreferredScrollBehavior(), block: 'start' });
        errorBoxRef.current?.focus({ preventScroll: true });
    }, [status]);

    const setField = (key: keyof ContactFormState, value: string) => {
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const focusField = (key: keyof ContactFormState) => {
        fieldRefs.current[key]?.focus({ preventScroll: true });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === 'loading') return;

        const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Name is required.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required.';
        if (form.message.trim().length < 10) nextErrors.message = 'Please share a little more detail.';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            const firstInvalid = (['name', 'email', 'message'] as const).find((key) => nextErrors[key]);
            if (firstInvalid) focusField(firstInvalid);
            return;
        }

        setStatus('loading');
        setMsg('');
        let timeoutId: number | null = null;

        try {
            const controller = new AbortController();
            timeoutId = window.setTimeout(() => controller.abort(), 15000);
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                business_name: form.business_name.trim(),
                details: form.message.trim(),
                primary_goal: 'General inquiry',
                source_path: window.location.pathname,
            };
            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            const result = await res.json().catch(() => null) as ApiResult | null;

            if (res.ok && result?.ok !== false) {
                setStatus('success');
                setMsg('Thanks. We will reply within one business day.');
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
                title="Contact | Axiom"
                description="General questions, introductions, and follow-ups for Axiom."
                canonicalPath="/contact"
            />
            <section data-hero-root className="mx-auto max-w-3xl pt-10 text-center md:pt-16">
                <div className="overflow-hidden">
                    <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">General Contact</p>
                    <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                        Quick questions, intro notes, or a follow-up for the team.
                    </h1>
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                    Use this form for general contact. If you already have a scoped website project, use{' '}
                    <Link to="/apply" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                        Apply
                    </Link>
                    .
                </p>
            </section>

            <section className="mx-auto mt-5 max-w-5xl">
                <div className="axiom-bento p-6 md:p-8">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
                        <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                            {status === 'success' && (
                                <div ref={successBoxRef} tabIndex={-1} role="status" aria-live="polite" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center outline-none">
                                    <h2 className="text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">{msg}</h2>
                                    <p className="mt-2 text-sm text-slate-300">We will get back to you within one business day.</p>
                                    <button type="button" onClick={() => { setStatus(''); setForm(CONTACT_INITIAL_FORM); setErrors({}); }} className={`${SECONDARY_BUTTON_CLASS} mt-5`}>
                                        Send Another Message
                                    </button>
                                </div>
                            )}

                            {status === 'error' && (
                                <div ref={errorBoxRef} tabIndex={-1} role="alert" aria-live="assertive" className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100 outline-none">
                                    {msg}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-name" className={FIELD_LABEL_CLASS}>Your Name</label>
                                    <input
                                        ref={(node) => { fieldRefs.current.name = node; }}
                                        id="contact-name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        minLength={2}
                                        value={form.name}
                                        onChange={(event) => setField('name', event.target.value)}
                                        aria-invalid={Boolean(errors.name)}
                                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                        className={FIELD_INPUT_CLASS}
                                    />
                                    {errors.name && <p id="contact-name-error" className="text-xs text-red-300">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-email" className={FIELD_LABEL_CLASS}>Email</label>
                                    <input
                                        ref={(node) => { fieldRefs.current.email = node; }}
                                        id="contact-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={form.email}
                                        onChange={(event) => setField('email', event.target.value)}
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                                        className={FIELD_INPUT_CLASS}
                                    />
                                    {errors.email && <p id="contact-email-error" className="text-xs text-red-300">{errors.email}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-business-name" className={FIELD_LABEL_CLASS}>Business Name</label>
                                    <input
                                        ref={(node) => { fieldRefs.current.business_name = node; }}
                                        id="contact-business-name"
                                        type="text"
                                        autoComplete="organization"
                                        value={form.business_name}
                                        onChange={(event) => setField('business_name', event.target.value)}
                                        className={FIELD_INPUT_CLASS}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-message" className={FIELD_LABEL_CLASS}>Message</label>
                                <textarea
                                    ref={(node) => { fieldRefs.current.message = node; }}
                                    id="contact-message"
                                    rows={5}
                                    required
                                    minLength={10}
                                    value={form.message}
                                    onChange={(event) => setField('message', event.target.value)}
                                    placeholder="Tell us what you need help with."
                                    aria-invalid={Boolean(errors.message)}
                                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                    className={`${FIELD_INPUT_CLASS} resize-none`}
                                />
                                {errors.message && <p id="contact-message-error" className="text-xs text-red-300">{errors.message}</p>}
                            </div>

                            <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>
                        </fieldset>
                    </form>
                </div>
            </section>

            <section className="mx-auto mt-6 max-w-5xl">
                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Direct Contact</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <a href="mailto:contact@getaxiom.ca" className="block text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                contact@getaxiom.ca
                            </a>
                            <a href="tel:+12267531833" className="block text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                226-753-1833
                            </a>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Need a scoped project?</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            Use{' '}
                            <Link to="/apply" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                Apply
                            </Link>{' '}
                            for serious website work.
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
};

const ContactPage: React.FC = () => {
    const location = useLocation();
    const isApplyRoute = location.pathname.startsWith('/apply');

    if (isApplyRoute) {
        return <ProjectApplicationForm />;
    }

    return (
        <Layout>
            <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
                <GeneralContactForm />
            </main>
            <Footer />
        </Layout>
    );
};

const ProjectApplicationForm: React.FC = () => {
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
    const successBoxRef = useRef<HTMLDivElement>(null);
    const errorBoxRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLElement>(null);
    const fieldRefs = useRef<Partial<Record<keyof IntakeFormState, HTMLElement | null>>>({});
    const fitQuestionRefs = useRef<Partial<Record<FitQuestionKey, HTMLElement | null>>>({});

    useEffect(() => {
        if (status !== 'success') return;
        successBoxRef.current?.scrollIntoView({ behavior: getPreferredScrollBehavior(), block: 'center' });
        successBoxRef.current?.focus({ preventScroll: true });
    }, [status]);

    useEffect(() => {
        if (status !== 'error') return;
        errorBoxRef.current?.scrollIntoView({ behavior: getPreferredScrollBehavior(), block: 'start' });
        errorBoxRef.current?.focus({ preventScroll: true });
    }, [status]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.location.hash !== '#project-application-form') return;

        formSectionRef.current?.scrollIntoView({ behavior: getPreferredScrollBehavior(), block: 'start' });
    }, []);

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

    const focusField = (key: keyof IntakeFormState) => {
        fieldRefs.current[key]?.focus({ preventScroll: true });
    };

    const focusFitQuestion = (key: FitQuestionKey) => {
        fitQuestionRefs.current[key]?.focus({ preventScroll: true });
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
        const firstInvalid = (['name', 'email', 'business_name'] as const).find((key) => nextErrors[key]);
        if (firstInvalid) focusField(firstInvalid);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: getPreferredScrollBehavior() });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        const nextErrors: typeof errors = {};
        if (!form.project_scale) nextErrors.project_scale = 'Please select an investment tier.';
        if (form.details.trim().length < 10) nextErrors.details = 'Please share details (min 10 chars).';
        FIT_QUESTIONS.forEach((question) => {
            if (!form[question.key]) {
                nextErrors[question.key] = 'Please choose yes or no.';
            }
        });
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            const orderedKeys: Array<keyof IntakeFormState> = [
                'project_scale',
                'details',
                'fit_active_demand',
                'fit_trust_conversion_need',
                'fit_decision_owner_ready',
                'fit_defined_scope_ready',
            ];
            const firstInvalid = orderedKeys.find((key) => nextErrors[key]);
            if (firstInvalid === 'fit_active_demand' || firstInvalid === 'fit_trust_conversion_need' || firstInvalid === 'fit_decision_owner_ready' || firstInvalid === 'fit_defined_scope_ready') {
                focusFitQuestion(firstInvalid);
            } else if (firstInvalid) {
                focusField(firstInvalid);
            }
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
                setMsg('Thanks for applying. One of our partners will review your submission within one business day.');
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
                title="Apply | Axiom"
                description="Tell us about the project, the scope, and the fit. This is the best route for serious website work."
                canonicalPath="/apply"
            />
            <Layout>
                <main className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
                    <section data-hero-root className="mx-auto max-w-3xl pt-10 text-center md:pt-16">
                        <div className="overflow-hidden">
                            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Project Intake</p>
                            <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                                Apply for a project and tell us what needs to happen.
                            </h1>
                        </div>
                        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                            Tell us what you&apos;re building, what it needs to do, and how far along things are. We&apos;ll review fit and reply within one business day.
                        </p>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
                            For general questions or introductions, use{' '}
                            <Link to="/contact" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                Contact
                            </Link>
                            .
                        </p>
                        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                            Intake {step} of 2. This helps us understand scope, timing, and fit.
                        </p>
                        <div className="mx-auto mt-5 h-[2px] w-full max-w-[440px] overflow-hidden rounded-full bg-white/10">
                            <div className={`h-full bg-[#B05D41] transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
                        </div>
                    </section>

                    <section ref={formSectionRef} id="project-application-form" className="mx-auto mt-5 max-w-5xl scroll-mt-28 md:scroll-mt-32">
                        <div className="axiom-bento p-6 md:p-8">
                            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
                                <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                                    {status === 'success' && (
                                        <div ref={successBoxRef} tabIndex={-1} role="status" aria-live="polite" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center outline-none">
                                            <h2 className="text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">{msg}</h2>
                                            <p className="mt-2 text-sm text-slate-300">A partner will review your submission and reply within one business day.</p>
                                            <button type="button" onClick={() => { setStatus(''); setStep(1); setForm(INITIAL_FORM); setErrors({}); }} className={`${SECONDARY_BUTTON_CLASS} mt-5`}>
                                                Submit Another Application
                                            </button>
                                        </div>
                                    )}

                                    {status === 'error' && (
                                        <div ref={errorBoxRef} tabIndex={-1} role="alert" aria-live="assertive" className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100 outline-none">
                                            {msg}
                                        </div>
                                    )}

                                    {step === 1 ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="apply-name" className={FIELD_LABEL_CLASS}>Your Name</label>
                                                    <input
                                                        ref={(node) => { fieldRefs.current.name = node; }}
                                                        id="apply-name"
                                                        type="text"
                                                        autoComplete="name"
                                                        required
                                                        minLength={2}
                                                        value={form.name}
                                                        onChange={(e) => setField('name', e.target.value)}
                                                        aria-invalid={Boolean(errors.name)}
                                                        aria-describedby={errors.name ? 'apply-name-error' : undefined}
                                                        className={FIELD_INPUT_CLASS}
                                                    />
                                                    {errors.name && <p id="apply-name-error" className="text-xs text-red-300">{errors.name}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="apply-email" className={FIELD_LABEL_CLASS}>Email</label>
                                                    <input
                                                        ref={(node) => { fieldRefs.current.email = node; }}
                                                        id="apply-email"
                                                        type="email"
                                                        autoComplete="email"
                                                        required
                                                        value={form.email}
                                                        onChange={(e) => setField('email', e.target.value)}
                                                        aria-invalid={Boolean(errors.email)}
                                                        aria-describedby={errors.email ? 'apply-email-error' : undefined}
                                                        className={FIELD_INPUT_CLASS}
                                                    />
                                                    {errors.email && <p id="apply-email-error" className="text-xs text-red-300">{errors.email}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="apply-business-name" className={FIELD_LABEL_CLASS}>Business Name</label>
                                                    <input
                                                        ref={(node) => { fieldRefs.current.business_name = node; }}
                                                        id="apply-business-name"
                                                        type="text"
                                                        autoComplete="organization"
                                                        required
                                                        minLength={2}
                                                        value={form.business_name}
                                                        onChange={(e) => setField('business_name', e.target.value)}
                                                        aria-invalid={Boolean(errors.business_name)}
                                                        aria-describedby={errors.business_name ? 'apply-business-name-error' : undefined}
                                                        className={FIELD_INPUT_CLASS}
                                                    />
                                                    {errors.business_name && <p id="apply-business-name-error" className="text-xs text-red-300">{errors.business_name}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="apply-phone" className={FIELD_LABEL_CLASS}>Phone</label>
                                                    <input
                                                        ref={(node) => { fieldRefs.current.phone = node; }}
                                                        id="apply-phone"
                                                        type="tel"
                                                        autoComplete="tel"
                                                        value={form.phone}
                                                        onChange={(e) => setField('phone', e.target.value)}
                                                        className={FIELD_INPUT_CLASS}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="apply-current-website" className={FIELD_LABEL_CLASS}>Current Website</label>
                                                <input
                                                    ref={(node) => { fieldRefs.current.current_website = node; }}
                                                    id="apply-current-website"
                                                    type="url"
                                                    autoComplete="url"
                                                    placeholder="https://"
                                                    value={form.current_website}
                                                    onChange={(e) => setField('current_website', e.target.value)}
                                                    className={FIELD_INPUT_CLASS}
                                                />
                                            </div>

                                            <button type="button" onClick={handleNextStep} className="btn-primary btn-lg w-full">
                                                Continue to Scope
                                            </button>

                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                                <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">After You Apply</p>
                                                <p className="mt-3 text-sm text-slate-300">
                                                    Once your request is submitted, we&apos;ll review the scope and next steps within 1 business day.
                                                </p>
                                                <p className="mt-3 text-sm text-slate-300">
                                                    If you only have a general question, use{' '}
                                                    <Link to="/contact" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                                        Contact
                                                    </Link>
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="apply-project-scope" className={FIELD_LABEL_CLASS}>Project Scope</label>
                                                <select
                                                    ref={(node) => { fieldRefs.current.project_scale = node; }}
                                                    id="apply-project-scope"
                                                    value={form.project_scale}
                                                    onChange={(e) => setField('project_scale', e.target.value)}
                                                    aria-invalid={Boolean(errors.project_scale)}
                                                    aria-describedby={errors.project_scale ? 'apply-project-scope-error' : undefined}
                                                    className={FIELD_INPUT_CLASS}
                                                >
                                                    <option value="" disabled>Select your scope...</option>
                                                    {SCALE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                                {errors.project_scale && <p id="apply-project-scope-error" className="text-xs text-red-300">{errors.project_scale}</p>}
                                            </div>

                                            <fieldset className="flex flex-col gap-3">
                                                <legend className={FIELD_LABEL_CLASS}>Current Website Problems</legend>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {PAIN_POINTS_OPTIONS.map(point => {
                                                        const selected = form.pain_points.includes(point);
                                                        return (
                                                            <button
                                                                key={point}
                                                                type="button"
                                                                onClick={() => togglePainPoint(point)}
                                                                aria-pressed={selected}
                                                                className={`min-h-[50px] rounded-xl border px-3 py-2 text-left text-sm transition-colors ${selected
                                                                    ? 'border-[#B05D41]/45 bg-[#B05D41]/12 text-[#F2F4F7]'
                                                                    : 'border-white/10 bg-[#0f1524]/45 text-slate-300 hover:border-white/25'}`}
                                                            >
                                                                {point}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </fieldset>

                                            <fieldset className="flex flex-col gap-3">
                                                <legend className={FIELD_LABEL_CLASS}>Fit Questions (Yes/No)</legend>
                                                <p className="text-sm text-slate-300">These answers help us confirm that the project is a strong fit before we scope details.</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {FIT_QUESTIONS.map((question) => {
                                                        const questionLabelId = `apply-${question.key}-label`;
                                                        const questionErrorId = `apply-${question.key}-error`;

                                                        return (
                                                        <article
                                                            key={question.key}
                                                            ref={(node) => { fitQuestionRefs.current[question.key] = node; }}
                                                            tabIndex={-1}
                                                            role="group"
                                                            aria-labelledby={questionLabelId}
                                                            aria-describedby={errors[question.key] ? questionErrorId : undefined}
                                                            className="rounded-xl border border-white/10 bg-[#0f1524]/45 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[#B05D41]/35"
                                                        >
                                                            <p id={questionLabelId} className="text-sm leading-relaxed text-slate-200">{question.label}</p>
                                                            <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-[220px]">
                                                                {(['yes', 'no'] as const).map((option) => {
                                                                    const isSelected = form[question.key] === option;
                                                                    return (
                                                                        <button
                                                                            key={option}
                                                                            type="button"
                                                                            onClick={() => setField(question.key, option)}
                                                                            className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${isSelected
                                                                                ? 'border-[#B05D41]/45 bg-[#B05D41]/12 text-[#F2F4F7]'
                                                                                : 'border-white/10 bg-[#0f1524]/70 text-slate-300 hover:border-white/25'
                                                                                }`}
                                                                            aria-pressed={isSelected}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            {errors[question.key] && <p id={questionErrorId} className="mt-2 text-xs text-red-300">{errors[question.key]}</p>}
                                                        </article>
                                                    );})}
                                                </div>
                                            </fieldset>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="apply-details" className={FIELD_LABEL_CLASS}>Project Details</label>
                                                <textarea
                                                    ref={(node) => { fieldRefs.current.details = node; }}
                                                    id="apply-details"
                                                    rows={4}
                                                    required
                                                    minLength={10}
                                                    value={form.details}
                                                    onChange={(e) => setField('details', e.target.value)}
                                                    placeholder="What do you need the site to do?"
                                                    aria-invalid={Boolean(errors.details)}
                                                    aria-describedby={errors.details ? 'apply-details-error' : undefined}
                                                    className={`${FIELD_INPUT_CLASS} resize-none`}
                                                />
                                                {errors.details && <p id="apply-details-error" className="text-xs text-red-300">{errors.details}</p>}
                                            </div>

                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <button type="button" onClick={() => setStep(1)} className={SECONDARY_BUTTON_CLASS}>
                                                    Back
                                                </button>
                                                <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg flex-1 disabled:cursor-not-allowed disabled:opacity-70">
                                                    {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                                                </button>
                                            </div>
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
