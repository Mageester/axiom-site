import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { SEO_ROUTES } from '../lib/seo';

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

const PROJECT_PATH = '/start-a-project';
const LEGACY_PROJECT_PATH = '/apply';

const SCALE_OPTIONS = [
    { value: 'foundation', label: 'New site or rebuild' },
    { value: 'authority', label: 'Existing site, rebuilt' },
    { value: 'expansion', label: 'Multi-location or larger site' }
];

const PAIN_POINTS_OPTIONS = [
    'Site is slow to load',
    'It is not clear what you do',
    'Proof is buried',
    'Calls or quote requests are hard to find',
    'Updating content is awkward'
];

const FIT_QUESTIONS: ReadonlyArray<{ key: keyof Pick<IntakeFormState, 'fit_active_demand' | 'fit_trust_conversion_need' | 'fit_decision_owner_ready' | 'fit_defined_scope_ready'>; label: string }> = [
    {
        key: 'fit_active_demand',
        label: 'Are you taking on new work?'
    },
    {
        key: 'fit_trust_conversion_need',
        label: 'Should the site help with calls, quotes, or bookings?'
    },
    {
        key: 'fit_decision_owner_ready',
        label: 'Who will review the direction?'
    },
    {
        key: 'fit_defined_scope_ready',
        label: 'When are you hoping to start?'
    }
];

const FALLBACK_SUBMIT_ERROR = 'Submission failed. Please retry or email contact@getaxiom.ca.';
const FIELD_LABEL_CLASS = 'text-[11px] font-axiomMono uppercase tracking-[0.16em] text-[#A7B3BC]';
const FIELD_HELPER_CLASS = 'text-xs leading-5 text-slate-400';
const FIELD_INPUT_CLASS =
    'w-full rounded-xl border border-white/10 bg-[#0f1524]/70 px-4 py-3 text-sm text-[#F2F4F7] outline-none transition-[border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-slate-500 focus:border-[#B05D41]/60 focus:ring-2 focus:ring-[#B05D41]/20';
const SECONDARY_BUTTON_CLASS =
    'inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.06]';
const PROJECT_FIELD_IDS = {
    name: 'project-name',
    email: 'project-email',
    business_name: 'project-business-name',
    phone: 'project-phone',
    current_website: 'project-current-website',
    project_scale: 'project-type',
    details: 'project-details',
    fit_active_demand: 'project-fit-active-demand',
    fit_trust_conversion_need: 'project-fit-trust-conversion-need',
    fit_decision_owner_ready: 'project-fit-decision-owner-ready',
    fit_defined_scope_ready: 'project-fit-defined-scope-ready'
} as const;

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

const CONTACT_FIELD_IDS = {
    name: 'contact-name',
    email: 'contact-email',
    business_name: 'contact-business-name',
    message: 'contact-message'
} as const;

type ContactFieldKey = keyof ContactFormState;

const GeneralContactForm: React.FC = () => {
    const [form, setForm] = useState<ContactFormState>(CONTACT_INITIAL_FORM);
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
    const successBoxRef = useRef<HTMLDivElement>(null);

    const focusFirstError = (nextErrors: Partial<Record<ContactFieldKey, string>>) => {
        const firstErrorKey = Object.keys(nextErrors)[0] as ContactFieldKey | undefined;
        if (!firstErrorKey) return;

        window.requestAnimationFrame(() => {
            document.getElementById(CONTACT_FIELD_IDS[firstErrorKey])?.focus();
        });
    };

    useEffect(() => {
        if (status !== 'success') return;

        const scrollToSuccess = () => {
            const target = successBoxRef.current;
            if (!target) return;
            const topOffset = 112;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
            window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
        };

        const rafId = window.requestAnimationFrame(scrollToSuccess);
        return () => window.cancelAnimationFrame(rafId);
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === 'loading') return;

        const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Name is required.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required.';
        if (form.message.trim().length < 10) nextErrors.message = 'Please share a little more detail.';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStatus('error');
            setMsg('Please correct the highlighted fields.');
            focusFirstError(nextErrors);
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
                {...SEO_ROUTES.contact}
            />
            <section data-hero-root className="mx-auto max-w-3xl pt-8 text-center md:pt-16">
                <div className="overflow-hidden">
                    <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">Contact</p>
                    <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                        Send a question or a note.
                    </h1>
                </div>
                <p data-startup-copy className="mx-auto mt-4 max-w-2xl text-sm text-slate-200/90 md:text-base">
                    Use this form for a quick question or a note about your site.
                </p>
                <p data-startup-meta className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
                    For website work, use{' '}
                    <Link to={PROJECT_PATH} className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                        Start a project
                    </Link>
                    .
                </p>
            </section>

            <section className="mx-auto mt-4 max-w-5xl">
                <div className="axiom-bento p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-7" aria-busy={status === 'loading'}>
                        {status === 'error' && (
                            <div role="alert" aria-live="assertive" className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                                {msg}
                            </div>
                        )}

                        {status === 'success' ? (
                            <div ref={successBoxRef} role="status" aria-live="polite" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center">
                                <h2 className="text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">{msg}</h2>
                                <p className="mt-2 text-sm text-slate-300">We&apos;ll reply within one business day.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatus('');
                                        setMsg('');
                                        setErrors({});
                                        setForm(CONTACT_INITIAL_FORM);
                                    }}
                                    className={`${SECONDARY_BUTTON_CLASS} mt-5`}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor={CONTACT_FIELD_IDS.name} className={FIELD_LABEL_CLASS}>Name</label>
                                        <p id={`${CONTACT_FIELD_IDS.name}-helper`} className={FIELD_HELPER_CLASS}>Who should we address?</p>
                                        <input
                                            id={CONTACT_FIELD_IDS.name}
                                            type="text"
                                            required
                                            minLength={2}
                                            autoComplete="name"
                                            value={form.name}
                                            onChange={(event) => setField('name', event.target.value)}
                                            className={FIELD_INPUT_CLASS}
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? `${CONTACT_FIELD_IDS.name}-helper ${CONTACT_FIELD_IDS.name}-error` : `${CONTACT_FIELD_IDS.name}-helper`}
                                        />
                                        {errors.name && <p id={`${CONTACT_FIELD_IDS.name}-error`} className="text-xs text-red-300">{errors.name}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor={CONTACT_FIELD_IDS.email} className={FIELD_LABEL_CLASS}>Email</label>
                                        <p id={`${CONTACT_FIELD_IDS.email}-helper`} className={FIELD_HELPER_CLASS}>Where should we reply?</p>
                                        <input
                                            id={CONTACT_FIELD_IDS.email}
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={(event) => setField('email', event.target.value)}
                                            className={FIELD_INPUT_CLASS}
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? `${CONTACT_FIELD_IDS.email}-helper ${CONTACT_FIELD_IDS.email}-error` : `${CONTACT_FIELD_IDS.email}-helper`}
                                        />
                                        {errors.email && <p id={`${CONTACT_FIELD_IDS.email}-error`} className="text-xs text-red-300">{errors.email}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor={CONTACT_FIELD_IDS.business_name} className={FIELD_LABEL_CLASS}>Business name</label>
                                        <p id={`${CONTACT_FIELD_IDS.business_name}-helper`} className={FIELD_HELPER_CLASS}>Optional, if the reply should use a company name.</p>
                                        <input
                                            id={CONTACT_FIELD_IDS.business_name}
                                            type="text"
                                            autoComplete="organization"
                                            value={form.business_name}
                                            onChange={(event) => setField('business_name', event.target.value)}
                                            className={FIELD_INPUT_CLASS}
                                            aria-describedby={`${CONTACT_FIELD_IDS.business_name}-helper`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor={CONTACT_FIELD_IDS.message} className={FIELD_LABEL_CLASS}>Message</label>
                                    <p id={`${CONTACT_FIELD_IDS.message}-helper`} className={FIELD_HELPER_CLASS}>A few short sentences are enough.</p>
                                    <textarea
                                        id={CONTACT_FIELD_IDS.message}
                                        rows={5}
                                        required
                                        minLength={10}
                                        value={form.message}
                                        onChange={(event) => setField('message', event.target.value)}
                                        placeholder="Tell us what you need help with."
                                        className={`${FIELD_INPUT_CLASS} resize-none`}
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? `${CONTACT_FIELD_IDS.message}-helper ${CONTACT_FIELD_IDS.message}-error` : `${CONTACT_FIELD_IDS.message}-helper`}
                                    />
                                    {errors.message && <p id={`${CONTACT_FIELD_IDS.message}-error`} className="text-xs text-red-300">{errors.message}</p>}
                                </div>

                                <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                                    {status === 'loading' ? 'Sending...' : 'Send message'}
                                </button>
                            </fieldset>
                        )}
                    </form>
                </div>
            </section>

            <section className="mx-auto mt-6 max-w-5xl">
                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Direct Contact</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <a href="mailto:contact@getaxiom.ca" className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                contact@getaxiom.ca
                            </a>
                            <a href="tel:+12267531833" className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                226-753-1833
                            </a>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">Need website work?</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            Use{' '}
                            <Link to={PROJECT_PATH} className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                Start a project
                            </Link>{' '}
                            for website work.
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
};

const ContactPage: React.FC = () => {
    const location = useLocation();
    const isProjectRoute = location.pathname.startsWith(LEGACY_PROJECT_PATH) || location.pathname.startsWith(PROJECT_PATH);

    if (isProjectRoute) {
        return <ProjectIntakeForm />;
    }

    return (
        <Layout>
            <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
                <GeneralContactForm />
            </main>
            <Footer />
        </Layout>
    );
};

const ProjectIntakeForm: React.FC = () => {
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

    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof IntakeFormState, string>>>({});
    const successBoxRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (status !== 'success') return;

        const scrollToSuccess = () => {
            const target = successBoxRef.current;
            if (!target) return;
            const topOffset = 112;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
            window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
        };

        const rafId = window.requestAnimationFrame(scrollToSuccess);
        return () => window.cancelAnimationFrame(rafId);
    }, [status]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.location.hash !== '#start-project-form' && window.location.hash !== '#project-application-form') return;

        const target = formSectionRef.current;
        if (!target) return;

        const rafId = window.requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        return () => window.cancelAnimationFrame(rafId);
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

    const togglePainPoint = (point: string) => {
        setForm(prev => {
            const current = prev.pain_points;
            const updated = current.includes(point)
                ? current.filter(p => p !== point)
                : [...current, point];
            return { ...prev, pain_points: updated };
        });
    };

    const focusFirstError = (nextErrors: Partial<Record<keyof IntakeFormState, string>>) => {
        const firstErrorKey = Object.keys(nextErrors)[0] as keyof IntakeFormState | undefined;
        if (!firstErrorKey) return;

        window.requestAnimationFrame(() => {
            document.getElementById(PROJECT_FIELD_IDS[firstErrorKey])?.focus();
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        const nextErrors: typeof errors = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please use a valid work email.';
        if (form.business_name.trim().length < 2) nextErrors.business_name = 'Please enter the business name.';
        if (!form.project_scale) nextErrors.project_scale = 'Choose the closest project type.';
        if (form.details.trim().length < 10) nextErrors.details = 'Please share a little more detail.';
        if (Object.keys(nextErrors).length > 0) {
            setStatus('');
            setMsg('');
            setErrors(nextErrors);
            focusFirstError(nextErrors);
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
                setMsg('Request received.');
                setErrors({});
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
                {...SEO_ROUTES.startProject}
            />
            <Layout>
            <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28">
                <section data-hero-root className="mx-auto max-w-3xl pt-8 text-center md:pt-16">
                    <div className="mt-4 overflow-hidden">
                        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">
                            Start a project
                        </p>
                        <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                            Tell us what the business needs.
                        </h1>
                    </div>
                    <p data-startup-copy className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                        Share the business name, current site, and what needs to change. We&apos;ll reply within one business day with next steps.
                    </p>
                    <p data-startup-meta className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
                        Not a project? Use{' '}
                        <Link to="/contact" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                            Contact
                        </Link>
                        .
                    </p>
                    <div data-startup-actions className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-axiomMono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        <span>One short form</span>
                        <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" aria-hidden="true" />
                        <span>Reply within one business day</span>
                        <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" aria-hidden="true" />
                        <span>Clear next steps</span>
                    </div>
                    </section>

                    <section ref={formSectionRef} id="start-project-form" className="mx-auto mt-3 max-w-5xl">
                        <div className="axiom-bento p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-busy={status === 'loading'}>
                                {status === 'error' && (
                                    <div role="alert" className="rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                                        {msg}
                                    </div>
                                )}

                                {status === 'success' ? (
                                    <div ref={successBoxRef} role="status" aria-live="polite" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center">
                                        <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-emerald-100/80">Request received</p>
                                        <h2 className="mt-3 text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">{msg || 'Request received.'}</h2>
                                        <p className="mt-2 text-sm text-slate-300">We&apos;ll review the details and reply within one business day with next steps.</p>
                                        <button type="button" onClick={() => { setStatus(''); setMsg(''); setErrors({}); setForm(INITIAL_FORM); }} className={`${SECONDARY_BUTTON_CLASS} mt-5`}>
                                            Start another project
                                        </button>
                                    </div>
                                ) : (
                                    <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                                        <section className="grid gap-6">
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.name} className={FIELD_LABEL_CLASS}>Your name</label>
                                                    <p id={`${PROJECT_FIELD_IDS.name}-helper`} className={FIELD_HELPER_CLASS}>Who should we address?</p>
                                                    <input type="text" id={PROJECT_FIELD_IDS.name} required minLength={2} autoComplete="name" value={form.name} onChange={(event) => setField('name', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${PROJECT_FIELD_IDS.name}-helper ${PROJECT_FIELD_IDS.name}-error` : `${PROJECT_FIELD_IDS.name}-helper`} />
                                                    {errors.name && <p id={`${PROJECT_FIELD_IDS.name}-error`} className="text-xs text-red-300">{errors.name}</p>}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.email} className={FIELD_LABEL_CLASS}>Work email</label>
                                                    <p id={`${PROJECT_FIELD_IDS.email}-helper`} className={FIELD_HELPER_CLASS}>We'll reply here.</p>
                                                    <input type="email" id={PROJECT_FIELD_IDS.email} required autoComplete="email" value={form.email} onChange={(event) => setField('email', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${PROJECT_FIELD_IDS.email}-helper ${PROJECT_FIELD_IDS.email}-error` : `${PROJECT_FIELD_IDS.email}-helper`} />
                                                    {errors.email && <p id={`${PROJECT_FIELD_IDS.email}-error`} className="text-xs text-red-300">{errors.email}</p>}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.business_name} className={FIELD_LABEL_CLASS}>Business name</label>
                                                    <p id={`${PROJECT_FIELD_IDS.business_name}-helper`} className={FIELD_HELPER_CLASS}>Use the company name people know.</p>
                                                    <input type="text" id={PROJECT_FIELD_IDS.business_name} required minLength={2} autoComplete="organization" value={form.business_name} onChange={(event) => setField('business_name', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.business_name} aria-describedby={errors.business_name ? `${PROJECT_FIELD_IDS.business_name}-helper ${PROJECT_FIELD_IDS.business_name}-error` : `${PROJECT_FIELD_IDS.business_name}-helper`} />
                                                    {errors.business_name && <p id={`${PROJECT_FIELD_IDS.business_name}-error`} className="text-xs text-red-300">{errors.business_name}</p>}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.phone} className={FIELD_LABEL_CLASS}>Phone (optional)</label>
                                                    <p id={`${PROJECT_FIELD_IDS.phone}-helper`} className={FIELD_HELPER_CLASS}>Only if a call is easier.</p>
                                                    <input type="tel" id={PROJECT_FIELD_IDS.phone} autoComplete="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} className={FIELD_INPUT_CLASS} aria-describedby={`${PROJECT_FIELD_IDS.phone}-helper`} />
                                                </div>
                                            </div>

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.current_website} className={FIELD_LABEL_CLASS}>Current website (optional)</label>
                                                    <p id={`${PROJECT_FIELD_IDS.current_website}-helper`} className={FIELD_HELPER_CLASS}>Add it if there is already a site.</p>
                                                    <input type="url" id={PROJECT_FIELD_IDS.current_website} placeholder="https://example.com" autoComplete="url" value={form.current_website} onChange={(event) => setField('current_website', event.target.value)} className={FIELD_INPUT_CLASS} aria-describedby={`${PROJECT_FIELD_IDS.current_website}-helper`} />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.project_scale} className={FIELD_LABEL_CLASS}>Project type</label>
                                                    <p id={`${PROJECT_FIELD_IDS.project_scale}-helper`} className={FIELD_HELPER_CLASS}>Choose the closest option. We&apos;ll refine scope after review.</p>
                                                    <select id={PROJECT_FIELD_IDS.project_scale} value={form.project_scale} onChange={(event) => setField('project_scale', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.project_scale} aria-describedby={errors.project_scale ? `${PROJECT_FIELD_IDS.project_scale}-helper ${PROJECT_FIELD_IDS.project_scale}-error` : `${PROJECT_FIELD_IDS.project_scale}-helper`}>
                                                        <option value="" disabled>Choose a project type...</option>
                                                        {SCALE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                    </select>
                                                    {errors.project_scale && <p id={`${PROJECT_FIELD_IDS.project_scale}-error`} className="text-xs text-red-300">{errors.project_scale}</p>}
                                                </div>
                                            </div>
                                        </section>

                                        <section className="grid gap-5">
                                            <fieldset className="flex min-w-0 flex-col gap-3 border-0 p-0">
                                                <legend className={FIELD_LABEL_CLASS}>What needs the most attention?</legend>
                                                <p id="project-pain-points-helper" className={FIELD_HELPER_CLASS}>Select any that apply.</p>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {PAIN_POINTS_OPTIONS.map((point) => {
                                                        const selected = form.pain_points.includes(point);
                                                        return (
                                                            <button
                                                                key={point}
                                                                type="button"
                                                                onClick={() => togglePainPoint(point)}
                                                                aria-pressed={selected}
                                                                aria-describedby="project-pain-points-helper"
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

                                            <details className="group rounded-2xl border border-white/10 bg-[#0f1524]/45 p-4 md:p-5">
                                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                                                    <span className="min-w-0">
                                                        <span className={FIELD_LABEL_CLASS}>Optional project questions</span>
                                                        <span className="mt-1 block text-sm leading-relaxed text-slate-300">Use this only if you want a few extra questions before a call.</span>
                                                    </span>
                                                    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" fill="none" aria-hidden="true">
                                                        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </summary>
                                                <div className="mt-4 grid grid-cols-1 gap-3">
                                                    {FIT_QUESTIONS.map((question) => (
                                                        <article key={question.key} className="rounded-xl border border-white/10 bg-[#0f1524]/45 p-4">
                                                            <p className="text-sm leading-relaxed text-slate-200">{question.label}</p>
                                                            <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-[220px]">
                                                                {(['yes', 'no'] as const).map((option) => {
                                                                    const isSelected = form[question.key] === option;
                                                                    return (
                                                                        <button
                                                                            key={option}
                                                                            type="button"
                                                                            onClick={() => setField(question.key, option)}
                                                                            aria-pressed={isSelected}
                                                                            className={`min-h-11 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${isSelected
                                                                                ? 'border-[#B05D41]/45 bg-[#B05D41]/12 text-[#F2F4F7]'
                                                                                : 'border-white/10 bg-[#0f1524]/70 text-slate-300 hover:border-white/25'
                                                                                }`}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            </details>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={PROJECT_FIELD_IDS.details} className={FIELD_LABEL_CLASS}>What should the site do better?</label>
                                                <p id={`${PROJECT_FIELD_IDS.details}-helper`} className={FIELD_HELPER_CLASS}>A few short sentences are enough.</p>
                                                <textarea rows={4} id={PROJECT_FIELD_IDS.details} required minLength={10} value={form.details} onChange={(event) => setField('details', event.target.value)} placeholder="Example: make the service clearer, show proof earlier, and make quotes easier to request." className={`${FIELD_INPUT_CLASS} resize-none`} aria-invalid={!!errors.details} aria-describedby={errors.details ? `${PROJECT_FIELD_IDS.details}-helper ${PROJECT_FIELD_IDS.details}-error` : `${PROJECT_FIELD_IDS.details}-helper`} />
                                                {errors.details && <p id={`${PROJECT_FIELD_IDS.details}-error`} className="text-xs text-red-300">{errors.details}</p>}
                                            </div>
                                        </section>

                                        <div className="flex flex-col gap-3">
                                            <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                                                {status === 'loading' ? 'Sending...' : 'Send details'}
                                            </button>
                                            <p className="text-sm text-slate-400">We&apos;ll reply within one business day with next steps.</p>
                                        </div>
                                    </fieldset>
                                )}
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
