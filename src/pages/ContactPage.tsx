import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
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

type IntakeFormState = {
    name: string;
    email: string;
    business_name: string;
    current_website: string;
    details: string;
};

const INITIAL_FORM: IntakeFormState = {
    name: '',
    email: '',
    business_name: '',
    current_website: '',
    details: ''
};

const PROJECT_PATH = '/start-a-project';

const FALLBACK_SUBMIT_ERROR = 'Something went wrong. Email us directly at contact@getaxiom.ca';
const FIELD_LABEL_CLASS = 'text-[15px] md:text-[11px] font-axiomMono uppercase tracking-[0.16em] text-[#A7B3BC]';
const FIELD_HELPER_CLASS = 'text-[15px] md:text-xs leading-5 text-slate-400';
const FIELD_INPUT_CLASS =
    'w-full rounded-xl border border-white/10 bg-[#0f1524]/70 px-4 py-3 text-[15px] md:text-sm text-[#F2F4F7] outline-none transition-[border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-slate-500';
const PROJECT_FIELD_IDS = {
    name: 'project-full-name',
    email: 'project-email',
    business_name: 'project-business-name',
    current_website: 'project-website-url',
    details: 'project-details',
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

const CONTACT_PHONE_DISPLAY = '(226) 753-1833';
const CONTACT_PHONE_HREF = 'tel:+12267531833';
const CONTACT_EMAIL = 'contact@getaxiom.ca';
const SUCCESS_FADE_OUT_DURATION = 'calc(var(--motion-duration-base) - 20ms)';
const SUCCESS_IN_DURATION = 'calc(var(--motion-duration-base) + 80ms)';
const SUCCESS_IN_DELAY = '200ms';

type CallUsCardProps = {
    className?: string;
    showEmail?: boolean;
    plainPhone?: boolean;
};

const CallUsCard: React.FC<CallUsCardProps> = ({ className = '', showEmail = false, plainPhone = false }) => {
    const shellClass = `
        relative overflow-hidden rounded-[2rem]
        border border-[#d4a48e]/16
        bg-[linear-gradient(180deg,rgba(15,20,25,0.98)_0%,rgba(8,10,14,0.99)_100%)]
        shadow-[0_20px_60px_rgba(0,0,0,0.28)]
        ring-1 ring-inset ring-white/[0.02]
        px-6 py-7 md:px-7 md:py-8 lg:px-8 lg:py-9
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <article className={shellClass}>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4a48e]/65 to-transparent"
            />
            <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#d4a48e]/60 via-[#d4a48e]/15 to-transparent"
            />
            <div className="relative flex flex-col gap-7">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4a48e]/20 bg-[#d4a48e]/10 text-[#d4a48e] shadow-[0_0_0_1px_rgba(212,164,142,0.08)]">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="space-y-2">
                        <p className="section-eyebrow">Call us</p>
                        <div className="h-px w-16 bg-gradient-to-r from-[#d4a48e]/70 to-transparent" aria-hidden="true" />
                    </div>
                </div>

                <div className="space-y-3">
                    <a
                        href={CONTACT_PHONE_HREF}
                        className="inline-flex min-h-11 items-center text-[clamp(1.8rem,3vw,2.55rem)] font-axiomDisplay font-semibold leading-none tracking-tight text-[#F6EBDD] transition-colors hover:text-[#f0d7c6]"
                    >
                        {CONTACT_PHONE_DISPLAY}
                    </a>
                    {showEmail ? (
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="inline-flex min-h-11 items-center text-[15px] md:text-sm leading-6 text-slate-300 transition-colors hover:text-white"
                        >
                            {CONTACT_EMAIL}
                        </a>
                    ) : (
                        <p className="max-w-sm text-[15px] md:text-sm leading-6 text-slate-400">
                            {plainPhone
                                ? 'For quick questions and direct project conversations.'
                                : 'For direct project questions and a quick response.'}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
};

function createInitialIntakeForm(): IntakeFormState {
    return { ...INITIAL_FORM };
}

type SubmissionSuccessStateProps = {
    onReset: () => void;
    className?: string;
};

const SubmissionSuccessState: React.FC<SubmissionSuccessStateProps> = ({ onReset, className = '' }) => (
    <div
        role="status"
        aria-live="polite"
        className={`rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center ${className}`.trim()}
        style={{
            animation: `intake-success-in ${SUCCESS_IN_DURATION} var(--motion-ease-decelerate) ${SUCCESS_IN_DELAY} both`
        }}
    >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/15">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400" aria-hidden="true">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <h2 className="mt-5 text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold text-[#F2F4F7]">Received.</h2>
        <p className="mt-2 text-[15px] md:text-sm leading-7 text-slate-300">
            Received. We’ll review and reply within one business day.
        </p>
        <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex min-h-11 items-center text-[15px] md:text-sm text-slate-300 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white"
        >
            Send another message
        </button>
    </div>
);

const GeneralContactForm: React.FC = () => {
    const [form, setForm] = useState<ContactFormState>(CONTACT_INITIAL_FORM);
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [showSuccessState, setShowSuccessState] = useState(false);
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
        if (status !== 'success') {
            setShowSuccessState(false);
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShowSuccessState(true);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [status]);

    useEffect(() => {
        if (!showSuccessState) return;

        const scrollToSuccess = () => {
            const target = successBoxRef.current;
            if (!target) return;
            const topOffset = 112;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
            window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
        };

        const rafId = window.requestAnimationFrame(scrollToSuccess);
        return () => window.cancelAnimationFrame(rafId);
    }, [showSuccessState]);

    const resetGeneralForm = () => {
        setStatus('');
        setMsg('');
        setErrors({});
        setShowSuccessState(false);
        setForm(CONTACT_INITIAL_FORM);
    };

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
            const res = await fetch('/api/contact', {
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
                setMsg('');
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
                    <p className="section-eyebrow">Contact</p>
                    <h1 data-startup-heading className="text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                        Send a question or a note.
                    </h1>
                </div>
                <p data-startup-copy className="mx-auto mt-4 max-w-2xl text-[15px] md:text-sm text-slate-200/90 md:text-base">
                    Use this form for a quick question or a note about your site.
                </p>
                <p data-startup-meta className="mx-auto mt-3 max-w-2xl text-[15px] md:text-sm text-slate-300">
                    For website work, use{' '}
                    <Link to={PROJECT_PATH} className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                        Start a project
                    </Link>
                    .
                </p>
            </section>

            <section className="mx-auto mt-6 max-w-5xl">
                <CallUsCard plainPhone />
            </section>

            <section className="mx-auto mt-4 max-w-5xl">
                <div className="axiom-bento p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-7" aria-busy={status === 'loading'}>
                        {status === 'error' && (
                            <div role="alert" aria-live="assertive" className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-[15px] md:text-sm text-red-100">
                                {msg}
                            </div>
                        )}

                        {!showSuccessState ? (
                            <div
                                style={{
                                    opacity: status === 'success' ? 0 : 1,
                                    transform: status === 'success' ? 'translateY(-8px)' : 'translateY(0)',
                                    transition: `opacity ${SUCCESS_FADE_OUT_DURATION} var(--motion-ease-decelerate), transform ${SUCCESS_FADE_OUT_DURATION} var(--motion-ease-decelerate)`,
                                    pointerEvents: status === 'success' ? 'none' : 'auto'
                                }}
                            >
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
                                            {errors.name && <p id={`${CONTACT_FIELD_IDS.name}-error`} className="text-[15px] md:text-xs text-red-300">{errors.name}</p>}
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
                                            {errors.email && <p id={`${CONTACT_FIELD_IDS.email}-error`} className="text-[15px] md:text-xs text-red-300">{errors.email}</p>}
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
                                        {errors.message && <p id={`${CONTACT_FIELD_IDS.message}-error`} className="text-[15px] md:text-xs text-red-300">{errors.message}</p>}
                                    </div>

                                    <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                                        {status === 'loading' ? 'Sending...' : 'Send message'}
                                    </button>
                                </fieldset>
                            </div>
                        ) : (
                            <div ref={successBoxRef}>
                                <SubmissionSuccessState onReset={resetGeneralForm} />
                            </div>
                        )}
                    </form>
                </div>
            </section>

            <section className="mx-auto mt-6 max-w-5xl">
                <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <p className="section-eyebrow">Email</p>
                        <div className="mt-3 space-y-2 text-[15px] md:text-sm text-slate-300">
                            <a href={`mailto:${CONTACT_EMAIL}`} className="flex w-fit min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                {CONTACT_EMAIL}
                            </a>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="section-eyebrow">Need website work?</p>
                        <p className="mt-3 text-[15px] md:text-sm leading-relaxed text-slate-300">
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
    const isProjectRoute = location.pathname.startsWith(PROJECT_PATH);

    if (isProjectRoute) {
        return <ProjectIntakeForm />;
    }

    return (
        <Layout>
            <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-6 pb-24 md:px-10 md:pb-28">
                <GeneralContactForm />
            </main>
            <Footer />
        </Layout>
    );
};

const ProjectIntakeForm: React.FC = () => {
    const [form, setForm] = useState<IntakeFormState>(() => createInitialIntakeForm());

    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [showSuccessState, setShowSuccessState] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof IntakeFormState, string>>>({});
    const successBoxRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (status !== 'success') {
            setShowSuccessState(false);
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShowSuccessState(true);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [status]);

    useEffect(() => {
        if (!showSuccessState) return;

        const scrollToSuccess = () => {
            const target = successBoxRef.current;
            if (!target) return;
            const topOffset = 112;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
            window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
        };

        const rafId = window.requestAnimationFrame(scrollToSuccess);
        return () => window.cancelAnimationFrame(rafId);
    }, [showSuccessState]);

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

    const setField = (key: keyof IntakeFormState, value: string) => {
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const focusFirstError = (nextErrors: Partial<Record<keyof IntakeFormState, string>>) => {
        const firstErrorKey = Object.keys(nextErrors)[0] as keyof IntakeFormState | undefined;
        if (!firstErrorKey) return;

        window.requestAnimationFrame(() => {
            document.getElementById(PROJECT_FIELD_IDS[firstErrorKey])?.focus();
        });
    };

    const resetProjectForm = () => {
        setStatus('');
        setMsg('');
        setErrors({});
        setShowSuccessState(false);
        setForm(createInitialIntakeForm());
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        const nextErrors: typeof errors = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please use a valid work email.';
        if (form.business_name.trim().length < 2) nextErrors.business_name = 'Please enter the business name.';
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
                name: form.name.trim(),
                email: form.email.trim(),
                business_name: form.business_name.trim(),
                current_website: form.current_website.trim(),
                details: form.details.trim(),
                primary_goal: 'new_site',
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
                setMsg('');
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
            <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[92rem] px-5 pb-16 md:px-10 md:pb-24">
                <section data-hero-root className="pt-8 md:pt-16">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.72fr)] xl:items-start">
                        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,31,0.96)_0%,rgba(10,13,19,0.99)_100%)] p-6 text-left shadow-[0_18px_52px_rgba(0,0,0,0.2)] md:p-8 lg:p-10">
                            <p className="font-axiomMono text-[15px] md:text-[11px] uppercase tracking-[0.2em] text-axiom-text-mute">
                                Start a project
                            </p>
                            <h1 data-startup-heading className="mt-3 max-w-3xl text-[clamp(2rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] text-[#F2F4F7]">
                                Tell us what the business needs.
                            </h1>
                            <p data-startup-copy className="mt-4 max-w-2xl text-[15px] md:text-sm text-slate-300 md:text-base">
                                Share the basics and we’ll reply within one business day with the next step.
                            </p>
                            <p data-startup-meta className="mt-3 max-w-2xl text-[15px] md:text-sm text-slate-400">
                                Not a project? Use{' '}
                                <Link to="/contact" className="text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                    Contact
                                </Link>
                                .
                            </p>
                        </article>

                        <aside className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1120] shadow-[0_12px_36px_rgba(0,0,0,0.18)] xl:mt-8">
                            <div className="border-b border-white/10 p-5 md:p-6">
                                <div className="rounded-[1.25rem] border border-white/10 bg-[#0f1524]/70 p-4">
                                    <p className="section-eyebrow">Reply within one business day.</p>
                                </div>
                            </div>
                            <div className="flex-1 bg-white/[0.03] p-5 md:p-6">
                                <p className="section-eyebrow">At a glance</p>
                                <div className="mt-5 divide-y divide-white/[0.08]">
                                    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                        <span className="text-[15px] md:text-sm font-medium text-[#F2F4F7]">One short form</span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                        <span className="text-[15px] md:text-sm font-medium text-[#F2F4F7]">Reply within one business day</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section ref={formSectionRef} id="start-project-form" className="mt-7">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.72fr)] xl:items-start">
                        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,31,0.96)_0%,rgba(10,13,19,0.99)_100%)] shadow-[0_20px_56px_rgba(0,0,0,0.24)]">
                            {!showSuccessState ? (
                                <div
                                    style={{
                                        opacity: status === 'success' ? 0 : 1,
                                        transform: status === 'success' ? 'translateY(-8px)' : 'translateY(0)',
                                        transition: `opacity ${SUCCESS_FADE_OUT_DURATION} var(--motion-ease-decelerate), transform ${SUCCESS_FADE_OUT_DURATION} var(--motion-ease-decelerate)`,
                                        pointerEvents: status === 'success' ? 'none' : 'auto'
                                    }}
                                >
                                    <div className="border-b border-white/10 p-6 md:p-7 lg:p-8">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                            <div>
                                                <p className="section-eyebrow">Project intake</p>
                                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F2F4F7]">Let’s get to work.</h2>
                                            </div>
                                            <p className="text-[15px] md:text-sm text-slate-400">Tell us what your business does, what’s broken about your current site, and when you want to move. We’ll reply within one business day.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 md:p-7 lg:p-8" aria-busy={status === 'loading'}>
                                        {status === 'error' && (
                                            <div role="alert" className="rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-[15px] md:text-sm text-red-100">
                                                {msg}
                                            </div>
                                        )}

                                        <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
                                            <section className="grid gap-6">
                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor={PROJECT_FIELD_IDS.name} className={FIELD_LABEL_CLASS}>Full name</label>
                                                        <p id={`${PROJECT_FIELD_IDS.name}-helper`} className={FIELD_HELPER_CLASS}>Who should we address?</p>
                                                        <input type="text" id={PROJECT_FIELD_IDS.name} required minLength={2} autoComplete="name" value={form.name} onChange={(event) => setField('name', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${PROJECT_FIELD_IDS.name}-helper ${PROJECT_FIELD_IDS.name}-error` : `${PROJECT_FIELD_IDS.name}-helper`} />
                                                        {errors.name && <p id={`${PROJECT_FIELD_IDS.name}-error`} className="text-[15px] md:text-xs text-red-300">{errors.name}</p>}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor={PROJECT_FIELD_IDS.email} className={FIELD_LABEL_CLASS}>Email address</label>
                                                        <p id={`${PROJECT_FIELD_IDS.email}-helper`} className={FIELD_HELPER_CLASS}>We'll reply here.</p>
                                                        <input type="email" id={PROJECT_FIELD_IDS.email} required autoComplete="email" value={form.email} onChange={(event) => setField('email', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${PROJECT_FIELD_IDS.email}-helper ${PROJECT_FIELD_IDS.email}-error` : `${PROJECT_FIELD_IDS.email}-helper`} />
                                                        {errors.email && <p id={`${PROJECT_FIELD_IDS.email}-error`} className="text-[15px] md:text-xs text-red-300">{errors.email}</p>}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor={PROJECT_FIELD_IDS.business_name} className={FIELD_LABEL_CLASS}>Business name</label>
                                                        <p id={`${PROJECT_FIELD_IDS.business_name}-helper`} className={FIELD_HELPER_CLASS}>Use the company name people know.</p>
                                                        <input type="text" id={PROJECT_FIELD_IDS.business_name} required minLength={2} autoComplete="organization" value={form.business_name} onChange={(event) => setField('business_name', event.target.value)} className={FIELD_INPUT_CLASS} aria-invalid={!!errors.business_name} aria-describedby={errors.business_name ? `${PROJECT_FIELD_IDS.business_name}-helper ${PROJECT_FIELD_IDS.business_name}-error` : `${PROJECT_FIELD_IDS.business_name}-helper`} />
                                                        {errors.business_name && <p id={`${PROJECT_FIELD_IDS.business_name}-error`} className="text-[15px] md:text-xs text-red-300">{errors.business_name}</p>}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor={PROJECT_FIELD_IDS.current_website} className={FIELD_LABEL_CLASS}>Website URL</label>
                                                        <p id={`${PROJECT_FIELD_IDS.current_website}-helper`} className={FIELD_HELPER_CLASS}>Optional. Add it if there is already a site.</p>
                                                        <input type="url" id={PROJECT_FIELD_IDS.current_website} placeholder="https://example.com" autoComplete="url" value={form.current_website} onChange={(event) => setField('current_website', event.target.value)} className={FIELD_INPUT_CLASS} aria-describedby={`${PROJECT_FIELD_IDS.current_website}-helper`} />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={PROJECT_FIELD_IDS.details} className={FIELD_LABEL_CLASS}>Brief project description</label>
                                                    <p id={`${PROJECT_FIELD_IDS.details}-helper`} className={FIELD_HELPER_CLASS}>Three short lines is enough.</p>
                                                    <textarea rows={3} id={PROJECT_FIELD_IDS.details} required minLength={10} value={form.details} onChange={(event) => setField('details', event.target.value)} placeholder="What does your business do, what’s wrong with your current site, and when do you want to move?" className={`${FIELD_INPUT_CLASS} resize-none`} aria-invalid={!!errors.details} aria-describedby={errors.details ? `${PROJECT_FIELD_IDS.details}-helper ${PROJECT_FIELD_IDS.details}-error` : `${PROJECT_FIELD_IDS.details}-helper`} />
                                                    {errors.details && <p id={`${PROJECT_FIELD_IDS.details}-error`} className="text-[15px] md:text-xs text-red-300">{errors.details}</p>}
                                                </div>
                                            </section>

                                            <div className="flex flex-col gap-3">
                                                <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                                                    {status === 'loading' ? 'Sending...' : 'Send it →'}
                                                </button>
                                                <p className="text-[15px] md:text-sm text-slate-400">We’ll reply within one business day with next steps.</p>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            ) : (
                                <div ref={successBoxRef} className="p-10 md:p-14 lg:p-16">
                                    <SubmissionSuccessState onReset={resetProjectForm} />
                                </div>
                            )}
                        </article>

                        <div className="grid gap-4 self-start xl:sticky xl:top-28">
                            <CallUsCard showEmail />

                            <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                                <p className="section-eyebrow">General questions</p>
                                <p className="mt-3 text-[15px] md:text-sm leading-relaxed text-slate-300">
                                    Use{' '}
                                    <Link to="/contact" className="inline-flex min-h-11 items-center text-slate-100 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white">
                                        Contact
                                    </Link>{' '}
                                    for a quick note or anything that is not a project.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>
                </main>
                <Footer />
            </Layout>
        </>
    );
};

export default ContactPage;
