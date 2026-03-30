import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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

type InquiryFormState = {
  name: string;
  email: string;
  business_name: string;
  current_website: string;
  details: string;
};

const INITIAL_FORM: InquiryFormState = {
  name: '',
  email: '',
  business_name: '',
  current_website: '',
  details: '',
};

const FALLBACK_SUBMIT_ERROR = 'Submission failed. Please try again or email contact@getaxiom.ca.';
const FIELD_LABEL_CLASS = 'text-[11px] font-axiomMono uppercase tracking-[0.16em] text-[#A7B3BC]';
const FIELD_INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-[#0f1524]/70 px-4 py-3 text-sm text-[#F2F4F7] outline-none transition-all placeholder:text-slate-500 focus:border-[#B05D41]/60 focus:ring-2 focus:ring-[#B05D41]/20';

function getApiErrorMessage(payload: ApiResult | null) {
  if (!payload) return FALLBACK_SUBMIT_ERROR;
  if (payload.error && payload.details) return `${payload.error} ${payload.details}`;
  if (payload.error) return payload.error;
  if (payload.message && !payload.ok) return payload.message;
  return FALLBACK_SUBMIT_ERROR;
}

const SimpleApplyForm: React.FC = () => {
  const [form, setForm] = useState<InquiryFormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitState>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormState, string>>>({});
  const successBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== 'success') return;

    const target = successBoxRef.current;
    if (!target) return;

    const rafId = window.requestAnimationFrame(() => {
      const topOffset = 112;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [status]);

  const setField = (key: keyof InquiryFormState, value: string) => {
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

    const nextErrors: Partial<Record<keyof InquiryFormState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Name is required.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required.';
    if (form.business_name.trim().length < 2) nextErrors.business_name = 'Business name is required.';
    if (form.details.trim().length < 20) nextErrors.details = 'Please share a bit more detail.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('loading');
    setMessage('');
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
        source_path: window.location.pathname,
      };

      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => null)) as ApiResult | null;

      if (response.ok && result?.ok !== false) {
        setStatus('success');
        setMessage('Thanks. We will reply within one business day.');
        return;
      }

      setStatus('error');
      setMessage(getApiErrorMessage(result));
    } catch {
      setStatus('error');
      setMessage(FALLBACK_SUBMIT_ERROR);
    } finally {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    }
  };

  return (
    <section className="pt-12 md:pt-20">
      <div className="max-w-4xl">
        <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Apply</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
          Tell us what you need.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
          Send a short note. We will review it and reply within one business day.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          If you want to email us directly, use{' '}
          <a href="mailto:contact@getaxiom.ca" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
            contact@getaxiom.ca
          </a>
          .
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <fieldset disabled={status === 'loading'} className="contents disabled:cursor-not-allowed disabled:opacity-80">
              {status === 'success' && (
                <div ref={successBoxRef} className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
                  <h2 className="text-2xl font-semibold text-[#F2F4F7]">{message}</h2>
                  <p className="mt-2 text-sm text-slate-300">If you want to send more detail, just reply by email.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {message}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>Your name</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    className={FIELD_INPUT_CLASS}
                  />
                  {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                    className={FIELD_INPUT_CLASS}
                  />
                  {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>Business name</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={form.business_name}
                    onChange={(event) => setField('business_name', event.target.value)}
                    className={FIELD_INPUT_CLASS}
                  />
                  {errors.business_name && <p className="text-xs text-red-300">{errors.business_name}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>Website</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={form.current_website}
                    onChange={(event) => setField('current_website', event.target.value)}
                    className={FIELD_INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={FIELD_LABEL_CLASS}>What do you need?</label>
                <textarea
                  rows={6}
                  required
                  minLength={20}
                  value={form.details}
                  onChange={(event) => setField('details', event.target.value)}
                  placeholder="Tell us what the site should do and what feels wrong right now."
                  className={`${FIELD_INPUT_CLASS} resize-none`}
                />
                {errors.details && <p className="text-xs text-red-300">{errors.details}</p>}
              </div>

              <button type="submit" disabled={status === 'loading'} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>
            </fieldset>
          </form>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">What happens next</p>
            <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
              We read every inquiry ourselves. If it is a fit, we will reply with the simplest next step.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Direct contact</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300 md:text-base">
              <a href="mailto:contact@getaxiom.ca" className="block transition-colors hover:text-white">
                contact@getaxiom.ca
              </a>
              <a href="tel:+12267531833" className="block transition-colors hover:text-white">
                226-753-1833
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Looking for a faster answer?</p>
            <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
              Include your timeline, current site, and the main thing you want fixed. That helps us move faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Apply | Axiom"
        description="Tell us about your business and what you need. We will review fit before we talk scope."
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <SimpleApplyForm />
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default ContactPage;
