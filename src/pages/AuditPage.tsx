import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

type SubmitState = '' | 'loading' | 'success' | 'error';
type ApiResult = { ok?: boolean; error?: string; message?: string; details?: string };
type AuditFieldKey = 'name' | 'email' | 'website';

type AuditFormState = {
    name: string;
    email: string;
    website: string;
    company_fax: string;
};

const INITIAL_FORM: AuditFormState = {
    name: '',
    email: '',
    website: '',
    company_fax: ''
};

const AUDIT_FIELD_IDS = {
    name: 'audit-name',
    email: 'audit-email',
    website: 'audit-website',
    company_fax: 'audit-company-fax'
} as const;

const AuditPage: React.FC = () => {
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState<AuditFormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<AuditFieldKey, string>>>({});
    const resetForm = () => {
        setStatus('');
        setMsg('');
        setErrors({});
        setForm(INITIAL_FORM);
    };

    const focusFirstError = (nextErrors: Partial<Record<AuditFieldKey, string>>) => {
        const firstErrorKey = Object.keys(nextErrors)[0] as AuditFieldKey | undefined;
        if (!firstErrorKey) return;

        window.requestAnimationFrame(() => {
            document.getElementById(AUDIT_FIELD_IDS[firstErrorKey])?.focus();
        });
    };

    const setField = (key: keyof AuditFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (key !== 'company_fax' && errors[key as AuditFieldKey]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key as AuditFieldKey];
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;
        const nextErrors: Partial<Record<AuditFieldKey, string>> = {};
        if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
        if (!form.website || !/^https?:\/\/.+/i.test(form.website.trim())) nextErrors.website = 'Please add the full website URL.';
        if (Object.keys(nextErrors).length > 0) {
            setStatus('error');
            setMsg('Please correct the highlighted fields.');
            setErrors(nextErrors);
            focusFirstError(nextErrors);
            return;
        }

        const companyFax = form.company_fax;

        if (companyFax.trim()) {
            setStatus('success');
            setMsg('Review requested.');
            setErrors({});
            return;
        }

        setStatus('loading');
        setMsg('');
        let timeoutId: number | null = null;

        try {
            const controller = new AbortController();
            timeoutId = window.setTimeout(() => controller.abort(), 15000);
            const payload = {
                name: form.name,
                email: form.email,
                current_website: form.website,
                primary_goal: 'audit_request',
                details: 'Automated request for a complimentary engineering audit.',
                source_path: window.location.pathname,
                company_fax: companyFax
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
                setMsg(result?.message || 'Review requested.');
                setErrors({});
                setForm(INITIAL_FORM);
                return;
            }

            setStatus('error');
            setMsg(result?.error || 'Submission failed. Please reach out to contact@getaxiom.ca directly.');
        } catch {
            setStatus('error');
            setMsg('Submission failed. Please reach out to contact@getaxiom.ca directly.');
        } finally {
            if (timeoutId !== null) window.clearTimeout(timeoutId);
        }
    };

    return (
        <div className="page-shell min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
            <SEO
                {...SEO_ROUTES.audit}
            />
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

            <div className="max-w-[600px] mx-auto w-full relative z-10 px-6 reveal">
                <div className="text-center mb-12">
                    <h1 className="text-[40px] md:text-[56px] font-semibold mb-6 text-axiom-text-main tracking-tight leading-[1.05]">Is your site<br />costing you money?</h1>
                    <p className="text-[16px] text-axiom-text-mute max-w-lg mx-auto leading-relaxed">
                        Most local business sites lose leads because they're slow, confusing, or hard to contact through. Start a project and we’ll review it.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="axiom-glass p-8 md:p-10 flex flex-col gap-6 rounded-sm relative overflow-hidden" aria-busy={status === 'loading'}>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                        <label htmlFor={AUDIT_FIELD_IDS.company_fax}>Company Fax</label>
                        <input
                            id={AUDIT_FIELD_IDS.company_fax}
                            type="text"
                            name="company_fax"
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.company_fax}
                            onChange={(event) => setField('company_fax', event.target.value)}
                        />
                    </div>

                    {status === 'success' && (
                        <div role="status" aria-live="polite" className="absolute inset-0 bg-axiom-elevated z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-accent mb-6 w-12 h-12 flex items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-[24px] font-semibold text-axiom-text-main mb-3">Review requested.</h2>
                            <p className="text-[14px] text-axiom-text-mute leading-relaxed max-w-sm">
                                We'll look at your site and get back to you within 24 hours.
                            </p>
                            <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                                <button type="button" onClick={resetForm} className="btn-secondary w-full sm:w-auto">
                                    Start another review
                                </button>
                                <Link to={CTA.work.to} className="btn-primary btn-lg w-full sm:w-auto">
                                    {CTA.work.label}
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div role="alert" aria-live="assertive" className="bg-axiom-elevated border border-axiom-border text-axiom-text-mute p-5 rounded-[2px] text-[13px] font-mono leading-relaxed mb-2 flex items-start gap-4 animate-in fade-in duration-300">
                            <div className="w-2 h-2 mt-1.5 bg-axiom-accent/70 rounded-sm shrink-0"></div>
                            <p>{msg}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <label htmlFor={AUDIT_FIELD_IDS.name} className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Name</label>
                        <p id={`${AUDIT_FIELD_IDS.name}-helper`} className="text-[12px] text-axiom-text-mute/70 pl-1">Who should we address?</p>
                        <input
                            id={AUDIT_FIELD_IDS.name}
                            type="text"
                            name="name"
                            required
                            minLength={2}
                            autoComplete="name"
                            value={form.name}
                            onChange={(event) => setField('name', event.target.value)}
                            className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? `${AUDIT_FIELD_IDS.name}-helper ${AUDIT_FIELD_IDS.name}-error` : `${AUDIT_FIELD_IDS.name}-helper`}
                        />
                        {errors.name && <p id={`${AUDIT_FIELD_IDS.name}-error`} className="text-sm text-red-300">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor={AUDIT_FIELD_IDS.email} className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Email</label>
                        <p id={`${AUDIT_FIELD_IDS.email}-helper`} className="text-[12px] text-axiom-text-mute/70 pl-1">Where should we reply?</p>
                        <input
                            id={AUDIT_FIELD_IDS.email}
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={(event) => setField('email', event.target.value)}
                            className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? `${AUDIT_FIELD_IDS.email}-helper ${AUDIT_FIELD_IDS.email}-error` : `${AUDIT_FIELD_IDS.email}-helper`}
                        />
                        {errors.email && <p id={`${AUDIT_FIELD_IDS.email}-error`} className="text-sm text-red-300">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor={AUDIT_FIELD_IDS.website} className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Website URL</label>
                        <p id={`${AUDIT_FIELD_IDS.website}-helper`} className="text-[12px] text-axiom-text-mute/70 pl-1">Use the public URL if you have one.</p>
                        <input
                            id={AUDIT_FIELD_IDS.website}
                            type="url"
                            name="website"
                            required
                            placeholder="https://"
                            autoComplete="url"
                            value={form.website}
                            onChange={(event) => setField('website', event.target.value)}
                            className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"
                            aria-invalid={!!errors.website}
                            aria-describedby={errors.website ? `${AUDIT_FIELD_IDS.website}-helper ${AUDIT_FIELD_IDS.website}-error` : `${AUDIT_FIELD_IDS.website}-helper`}
                        />
                        {errors.website && <p id={`${AUDIT_FIELD_IDS.website}-error`} className="text-sm text-red-300">{errors.website}</p>}
                    </div>

                    <button disabled={status === 'loading' || status === 'success'} type="submit" className="btn-primary btn-lg w-full mt-4 disabled:opacity-50">
                        {status === 'loading' ? 'Sending...' : 'Request review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuditPage;
