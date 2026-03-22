import React, { useState } from 'react';
import { z } from 'zod';
import useReveal from '../hooks/useReveal';

type IntakeAction = 'consultation' | 'details' | 'email' | null;
type SubmitState = 'idle' | 'success' | 'error';

type IntakeFormState = {
  name: string;
  email: string;
  details: string;
  company_fax: string;
};
type IntakeFormErrors = Partial<Record<keyof IntakeFormState, string>>;

const baseCardClass =
  'rounded-2xl border border-white/10 border-t border-t-white/10 bg-white/[0.04] backdrop-blur-md p-6 machined-card transition-all duration-300 text-left';

const inputClass =
  'w-full rounded-xl px-5 py-4 text-[#F5F7FA] placeholder-[#A7B3BC] bg-white/[0.03] border border-white/10 border-t border-t-white/10 outline-none transition-all duration-300 focus:ring-2 focus:ring-[#B05D41]/40';

const INITIAL_FORM: IntakeFormState = {
  name: '',
  email: '',
  details: '',
  company_fax: '',
};

const IntakeValidationSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80, 'Name is too long.'),
  email: z.string().trim().email('Please enter a valid email address.').max(160, 'Email is too long.'),
  details: z.string().trim().min(10, 'Please share a few project details.').max(4000, 'Details are too long.'),
  company_fax: z.string().trim().max(120).optional(),
});

const IntakeTerminal: React.FC = () => {
  const [activeAction, setActiveAction] = useState<IntakeAction>(null);
  const [form, setForm] = useState<IntakeFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<IntakeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const statusReveal = useReveal<HTMLDivElement>();
  const consultationReveal = useReveal<HTMLDivElement>();
  const detailsReveal = useReveal<HTMLDivElement>();
  const emailReveal = useReveal<HTMLDivElement>();

  const setField = (key: keyof IntakeFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = IntakeValidationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: IntakeFormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !fieldErrors[field as keyof IntakeFormState]) {
          fieldErrors[field as keyof IntakeFormState] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setSubmitState('idle');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitState('idle');
    let timeoutId: number | null = null;

    try {
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          details: form.details,
          company_fax: form.company_fax,
          source_path: window.location.pathname,
        }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null) as { ok?: boolean } | null;

      if (!response.ok || result?.ok === false) {
        throw new Error('Failed to transmit intake payload.');
      }

      setSubmitState('success');
      setForm(INITIAL_FORM);
    } catch {
      setSubmitState('error');
    } finally {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <section id="intake" className="w-full max-w-6xl mx-auto px-6 py-28">
      <div
        ref={statusReveal.ref}
        className={`mb-10 flex w-fit items-center gap-3 rounded-full border border-white/10 border-t border-t-white/10 bg-[#111827]/70 px-4 py-2 machined-card transition-all duration-700 ease-out ${
          statusReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22c55e] animate-pulse" aria-hidden />
        <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A7B3BC]">Studio Availability : Open</p>
      </div>

      <div className="mb-8 space-y-3">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F4F7]">Start Your Project</h2>
        <p className="text-slate-300 max-w-2xl">Choose your preferred path. If you send details, the intake form unlocks below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          ref={consultationReveal.ref}
          className={`transition-all duration-700 ease-out ${consultationReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0ms' }}
        >
          <button
            type="button"
            onClick={() => setActiveAction('consultation')}
            className={`${baseCardClass} w-full ${activeAction === 'consultation' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
          >
            <p className="font-semibold text-[#F2F4F7] text-lg">Book a Consultation</p>
            <p className="mt-2 text-sm text-slate-300">Schedule a strategic session and map your goals with our team.</p>
          </button>
        </div>

        <div
          ref={detailsReveal.ref}
          className={`transition-all duration-700 ease-out ${detailsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <button
            type="button"
            onClick={() => setActiveAction('details')}
            className={`${baseCardClass} w-full ${activeAction === 'details' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
          >
            <p className="font-semibold text-[#F2F4F7] text-lg">Send Project Details</p>
            <p className="mt-2 text-sm text-slate-300">Open the guided form and submit project scope, timing, and budget.</p>
          </button>
        </div>

        <div
          ref={emailReveal.ref}
          className={`transition-all duration-700 ease-out ${emailReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <a
            href="mailto:aidan@getaxiom.ca"
            onClick={() => setActiveAction('email')}
            className={`${baseCardClass} block ${activeAction === 'email' ? 'border-[#B05D41]/70' : 'hover:border-[#B05D41]/50'}`}
          >
            <p className="font-semibold text-[#F2F4F7] text-lg">Email Directly</p>
            <p className="mt-2 text-sm text-slate-300">Reach us instantly at aidan@getaxiom.ca for direct communication.</p>
          </a>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-6">
        <a
          href="mailto:aidan@getaxiom.ca"
          className="w-fit text-[#B05D41] transition-all duration-300 hover:text-[#d7a189] hover:drop-shadow-[0_0_12px_rgba(176,93,65,0.45)]"
        >
          aidan@getaxiom.ca
        </a>
        <a
          href="tel:+12267531833"
          className="w-fit text-[#B05D41] transition-all duration-300 hover:text-[#d7a189] hover:drop-shadow-[0_0_12px_rgba(176,93,65,0.45)]"
        >
          226-753-1833
        </a>
      </div>

      {activeAction === 'details' && (
        <div className="mt-8 rounded-2xl border border-white/10 border-t border-t-white/10 bg-[#10141c]/70 p-6 md:p-8 machined-card">
          {submitState === 'success' ? (
            <div className="rounded-2xl border border-white/10 border-t border-t-white/10 bg-white/[0.04] backdrop-blur-md p-8 text-center">
              <p className="text-xl md:text-2xl font-semibold tracking-tight text-[#F2F4F7]">
                Transmission Received. The Architects will review your parameters and establish contact.
              </p>
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm text-[#A7B3BC]">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={(event) => setField('name', event.target.value)}
                  placeholder="Full name"
                  className={inputClass}
                />
                {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
              </label>

              <label className="space-y-2">
                <span className="text-sm text-[#A7B3BC]">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
                {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-[#A7B3BC]">Project Details</span>
                <textarea
                  name="details"
                  rows={6}
                  required
                  value={form.details}
                  onChange={(event) => setField('details', event.target.value)}
                  placeholder="Share scope, goals, and timeline."
                  className={inputClass}
                />
                {errors.details && <p className="text-xs text-red-300">{errors.details}</p>}
              </label>

              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="terminal-company-fax">Company Fax</label>
                <input
                  id="terminal-company-fax"
                  type="text"
                  name="company_fax"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company_fax}
                  onChange={(event) => setField('company_fax', event.target.value)}
                />
              </div>

              {submitState === 'error' && (
                <p className="md:col-span-2 text-sm text-red-300">
                  Transmission failed. Please retry or email aidan@getaxiom.ca and riley@getaxiom.ca.
                </p>
              )}

              <div className="md:col-span-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Transmitting...' : 'Send Project Details'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};

export default IntakeTerminal;
