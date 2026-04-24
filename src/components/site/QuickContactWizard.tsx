import * as React from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/Eyebrow';
import { cn } from '../../lib/utils';

type ContactReason = 'quick_question' | 'follow_up' | 'something_else';
type FieldKey = 'contact_reason' | 'name' | 'email' | 'message' | 'current_website';

type FormState = {
  contact_reason: ContactReason | '';
  name: string;
  email: string;
  message: string;
  current_website: string;
  company_fax: string;
};

type ValidationResult = {
  errors: Partial<Record<FieldKey, string>>;
  firstInvalidField: FieldKey | null;
};

type QuickContactWizardProps = {
  sourcePath: string;
};

const STEPS = [
  { id: 1, label: 'Reason', title: 'What is this about?' },
  { id: 2, label: 'Contact', title: 'Where should we reply?' },
  { id: 3, label: 'Message', title: 'Leave the note.' },
  { id: 4, label: 'Send', title: 'Ready to send?' },
] as const;

const STEP_FIELDS: Record<number, FieldKey[]> = {
  1: ['contact_reason'],
  2: ['name', 'email'],
  3: ['message', 'current_website'],
  4: ['contact_reason', 'name', 'email', 'message', 'current_website'],
};

const FIELD_TO_STEP: Record<FieldKey, number> = {
  contact_reason: 1,
  name: 2,
  email: 2,
  message: 3,
  current_website: 3,
};

const REASON_OPTIONS: Array<{
  value: ContactReason;
  label: string;
  description: string;
}> = [
  {
    value: 'quick_question',
    label: 'Quick question',
    description: 'A simple question or short check-in.',
  },
  {
    value: 'follow_up',
    label: 'Follow-up',
    description: 'Continue a conversation already in motion.',
  },
  {
    value: 'something_else',
    label: 'Something else',
    description: 'A short note that does not fit the other two.',
  },
] as const;

const EMPTY_STATE: FormState = {
  contact_reason: '',
  name: '',
  email: '',
  message: '',
  current_website: '',
  company_fax: '',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatReasonLabel(value: ContactReason | '') {
  if (value === 'quick_question') return 'Quick question';
  if (value === 'follow_up') return 'Follow-up';
  if (value === 'something_else') return 'Something else';
  return 'Not selected';
}

function getMessagePlaceholder(reason: ContactReason | '') {
  if (reason === 'follow_up') return 'What should we pick up from here?';
  if (reason === 'quick_question') return 'What would you like to ask?';
  return 'A few direct lines is enough.';
}

function getFieldError(field: FieldKey, state: FormState) {
  switch (field) {
    case 'contact_reason':
      return state.contact_reason ? '' : 'Choose the reason that fits best.';
    case 'name':
      return state.name.trim().length >= 2 ? '' : 'Please enter your name.';
    case 'email': {
      const email = state.email.trim();
      if (!email) return 'Please enter an email address.';
      return isValidEmail(email) ? '' : 'Please enter a valid email address.';
    }
    case 'message':
      return state.message.trim().length >= 10 ? '' : 'A few short lines is enough.';
    case 'current_website':
      return isValidWebsite(state.current_website) ? '' : 'Please enter a valid website URL.';
    default:
      return '';
  }
}

function validateFields(state: FormState, fields: FieldKey[]): ValidationResult {
  const errors: Partial<Record<FieldKey, string>> = {};
  let firstInvalidField: FieldKey | null = null;

  fields.forEach((field) => {
    const error = getFieldError(field, state);
    if (error) {
      errors[field] = error;
      if (!firstInvalidField) firstInvalidField = field;
    }
  });

  return { errors, firstInvalidField };
}

export function QuickContactWizard({ sourcePath }: QuickContactWizardProps) {
  const [activeStep, setActiveStep] = React.useState(1);
  const [formState, setFormState] = React.useState<FormState>(EMPTY_STATE);
  const [errors, setErrors] = React.useState<Partial<Record<FieldKey, string>>>({});
  const [alertMessage, setAlertMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [stepDirection, setStepDirection] = React.useState<'forward' | 'backward'>('forward');
  const [websiteVisible, setWebsiteVisible] = React.useState(false);

  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const successHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const inputRefs = React.useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const pendingFocusFieldRef = React.useRef<FieldKey | null>(null);
  const shouldFocusHeadingRef = React.useRef(false);

  const currentStepConfig = STEPS[activeStep - 1];
  const showWebsiteField =
    formState.contact_reason === 'follow_up' ||
    websiteVisible ||
    formState.current_website.trim().length > 0;

  const setFieldRef = React.useCallback(
    (field: FieldKey) => (element: HTMLElement | null) => {
      if (field === 'contact_reason') {
        if (!inputRefs.current.contact_reason) {
          inputRefs.current.contact_reason = element;
        }
        return;
      }

      inputRefs.current[field] = element;
    },
    []
  );

  React.useEffect(() => {
    if (isSubmitted) {
      window.requestAnimationFrame(() => {
        successHeadingRef.current?.focus();
      });
      return;
    }

    const pendingField = pendingFocusFieldRef.current;
    if (pendingField) {
      pendingFocusFieldRef.current = null;
      window.requestAnimationFrame(() => {
        inputRefs.current[pendingField]?.focus();
      });
      return;
    }

    if (!shouldFocusHeadingRef.current) return;
    shouldFocusHeadingRef.current = false;

    window.requestAnimationFrame(() => {
      headingRef.current?.focus();
    });
  }, [activeStep, isSubmitted]);

  const updateField = React.useCallback((field: keyof FormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const validateStep = React.useCallback(
    (step: number) => validateFields(formState, STEP_FIELDS[step]),
    [formState]
  );

  const applyValidation = React.useCallback((result: ValidationResult) => {
    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(Object.keys(current).map((key) => [key, ''])),
      ...result.errors,
    }));
  }, []);

  const focusInvalidField = React.useCallback((field: FieldKey | null) => {
    if (!field) return;

    if (field === 'current_website') {
      setWebsiteVisible(true);
    }

    pendingFocusFieldRef.current = field;
    window.requestAnimationFrame(() => {
      inputRefs.current[field]?.focus();
    });
  }, []);

  const goToStep = React.useCallback((nextStep: number, direction: 'forward' | 'backward') => {
    setStepDirection(direction);
    setAlertMessage('');
    shouldFocusHeadingRef.current = true;
    setActiveStep(nextStep);
  }, []);

  const jumpToStep = React.useCallback(
    (step: number) => {
      if (step === activeStep) {
        shouldFocusHeadingRef.current = true;
        window.requestAnimationFrame(() => {
          headingRef.current?.focus();
        });
        return;
      }

      goToStep(step, step > activeStep ? 'forward' : 'backward');
    },
    [activeStep, goToStep]
  );

  const handleBlur = React.useCallback(
    (field: FieldKey) => {
      const error = getFieldError(field, formState);
      setErrors((current) => ({
        ...current,
        [field]: error,
      }));
    },
    [formState]
  );

  const handleChange = React.useCallback(
    (field: keyof FormState, value: string) => {
      updateField(field, value);
      if (field === 'company_fax') return;
      if (field === 'contact_reason' && value === 'follow_up') {
        setWebsiteVisible(true);
      }
      if (field in errors && errors[field as FieldKey]) {
        const nextState = {
          ...formState,
          [field]: value,
        };
        setErrors((current) => ({
          ...current,
          [field]: getFieldError(field as FieldKey, nextState),
        }));
      }
      if (alertMessage) {
        setAlertMessage('');
      }
    },
    [alertMessage, errors, formState, updateField]
  );

  const handleStepAdvance = React.useCallback(() => {
    const result = validateStep(activeStep);
    applyValidation(result);

    if (result.firstInvalidField) {
      setAlertMessage('Please review this step.');
      focusInvalidField(result.firstInvalidField);
      return false;
    }

    goToStep(Math.min(activeStep + 1, STEPS.length), 'forward');
    return true;
  }, [activeStep, applyValidation, focusInvalidField, goToStep, validateStep]);

  const resetWizard = React.useCallback(() => {
    setFormState(EMPTY_STATE);
    setErrors({});
    setAlertMessage('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    setWebsiteVisible(false);
    shouldFocusHeadingRef.current = true;
    setActiveStep(1);
  }, []);

  const revealWebsiteField = React.useCallback(() => {
    setWebsiteVisible(true);
    window.requestAnimationFrame(() => {
      inputRefs.current.current_website?.focus();
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      if (activeStep < STEPS.length) {
        handleStepAdvance();
        return;
      }

      const validation = validateFields(formState, STEP_FIELDS[4]);
      applyValidation(validation);

      if (validation.firstInvalidField) {
        const invalidStep = FIELD_TO_STEP[validation.firstInvalidField];
        setAlertMessage('Please review the highlighted fields.');
        pendingFocusFieldRef.current = validation.firstInvalidField;
        goToStep(invalidStep, 'backward');
        return;
      }

      setAlertMessage('');
      setIsSubmitting(true);

      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        message: formState.message.trim(),
        current_website: formState.current_website.trim(),
        contact_reason: formState.contact_reason,
        primary_goal: 'not_sure',
        source_path: sourcePath,
        company_fax: formState.company_fax.trim(),
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok) {
          throw new Error(
            result?.details ||
              result?.error ||
              'We could not send your note. Please try again or email contact@getaxiom.ca.'
          );
        }

        setIsSubmitted(true);
      } catch (error) {
        setAlertMessage(
          error instanceof Error && error.message
            ? error.message
            : 'We could not send your note. Please try again or email contact@getaxiom.ca.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [activeStep, applyValidation, formState, goToStep, handleStepAdvance, isSubmitting, sourcePath]
  );

  const panelClassName = cn(
    'relative',
    stepDirection === 'forward' ? 'quick-contact-step-panel-forward' : 'quick-contact-step-panel-backward'
  );

  if (isSubmitted) {
    return (
      <section className="quick-contact-wizard w-full max-w-2xl rounded-[26px] border border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.015))] p-6 shadow-[0_22px_72px_rgba(0,0,0,0.32)] sm:p-8">
        <Eyebrow className="text-[var(--accent-solid)]">Received</Eyebrow>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-3 text-[clamp(1.8rem,4vw,2.3rem)] font-[600] leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] outline-none"
        >
          Note received.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
          We&apos;ll review it and reply with the next step.
        </p>
        <div className="mt-7 flex flex-col gap-3 border-t border-[color:var(--hairline)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={resetWizard}
            className="inline-flex min-h-10 items-center text-[14px] font-medium text-[var(--text-primary)] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
          >
            Send another note
          </button>
          <a
            href="/start-a-project"
            className="inline-flex min-h-10 items-center text-[14px] font-medium text-[var(--text-secondary)] underline decoration-[color:var(--hairline-strong)] underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-[var(--text-primary)]"
          >
            Need project work instead?
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="quick-contact-wizard w-full max-w-2xl overflow-hidden rounded-[26px] border border-[color:var(--hairline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.026),rgba(255,255,255,0.01))] shadow-[0_22px_72px_rgba(0,0,0,0.32)]">
      <div className="border-b border-[color:var(--hairline)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col gap-4">
          <div>
            <div>
              <Eyebrow>Quick Contact</Eyebrow>
              <p className="mt-2 text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                Step {activeStep} of {STEPS.length}
                <span className="mx-2 text-[var(--text-muted)]" aria-hidden="true">
                  /
                </span>
                {currentStepConfig.label}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2" aria-hidden="true">
              {STEPS.map((step) => {
                const isActive = step.id === activeStep;
                const isComplete = step.id < activeStep;
                return (
                  <span
                    key={step.id}
                    className={cn(
                      'h-[3px] rounded-full transition-[background-color,opacity] duration-200',
                      isActive && 'bg-[color:var(--accent-solid)] opacity-100',
                      isComplete && 'bg-[color:var(--accent-solid)] opacity-65',
                      !isActive && !isComplete && 'bg-[color:var(--surface-overlay-strong)] opacity-100'
                    )}
                  />
                );
              })}
            </div>

            <ol className="hidden gap-3 sm:grid sm:grid-cols-4">
              {STEPS.map((step) => {
                const isActive = step.id === activeStep;
                const isComplete = step.id < activeStep;
                return (
                  <li
                    key={step.id}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200',
                      isActive && 'text-[var(--text-primary)]',
                      isComplete && 'text-[var(--accent-solid)]',
                      !isActive && !isComplete && 'text-[var(--text-muted)]'
                    )}
                  >
                    {step.label}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-7 sm:py-7" noValidate>
        {alertMessage ? (
          <div
            className="mb-5 rounded-[18px] border border-[color:var(--error-border)] bg-[color:var(--error-surface)] px-4 py-3 text-[14px] leading-[1.6] text-[var(--error-text)]"
            role="alert"
            aria-live="assertive"
          >
            {alertMessage}
          </div>
        ) : null}

        <div key={activeStep} data-step-panel className={panelClassName}>
          <div className="max-w-xl">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-[clamp(1.7rem,4vw,2.2rem)] font-[600] leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] outline-none"
            >
              {currentStepConfig.title}
            </h2>

            {activeStep === 1 ? (
              <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                Choose the closest fit. This keeps the reply focused without making the form feel heavier than it needs to.
              </p>
            ) : null}

            {activeStep === 2 ? (
              <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                Just the essentials. We only need the best name and email for the reply.
              </p>
            ) : null}

            {activeStep === 3 ? (
              <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                Keep it direct. A few short lines is enough.
              </p>
            ) : null}

            {activeStep === 4 ? (
              <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                This page is for quick questions and follow-ups. If you need scoped project work, use the project intake.
              </p>
            ) : null}
          </div>

          <div className="mt-7">
            {activeStep === 1 ? (
              <fieldset aria-describedby={errors.contact_reason ? 'contact-reason-error' : undefined}>
                <legend className="sr-only">Choose a reason for contact</legend>
                <div className="grid gap-3 md:grid-cols-3">
                  {REASON_OPTIONS.map((option) => {
                    const checked = formState.contact_reason === option.value;
                    return (
                      <label key={option.value} className="group cursor-pointer">
                        <input
                          ref={setFieldRef('contact_reason') as React.Ref<HTMLInputElement>}
                          type="radio"
                          name="contact_reason"
                          value={option.value}
                          checked={checked}
                          onChange={(event) => handleChange('contact_reason', event.target.value)}
                          onBlur={() => handleBlur('contact_reason')}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            'flex min-h-[8.6rem] flex-col justify-between rounded-[22px] border px-4 py-4 transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out sm:px-5',
                            'border-[color:var(--hairline)] bg-[color:var(--surface-panel)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
                            'group-hover:border-[color:var(--hairline-strong)] group-hover:bg-[color:var(--surface-overlay)]',
                            'group-focus-within:border-[color:var(--accent-border)] group-focus-within:ring-2 group-focus-within:ring-[color:var(--accent-ring)]',
                            checked &&
                              'border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(201,163,104,0.12),rgba(201,163,104,0.04))] shadow-[0_0_0_1px_rgba(201,163,104,0.12)]'
                          )}
                        >
                          <span className="space-y-3">
                            <span className="block text-[17px] font-[600] tracking-[-0.02em] text-[var(--text-primary)]">
                              {option.label}
                            </span>
                            <span className="block text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                              {option.description}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'mt-4 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-200',
                              checked
                                ? 'border-[color:var(--accent-border-strong)] bg-[color:var(--accent-solid)] text-[var(--text-on-accent)]'
                                : 'border-[color:var(--hairline-strong)] bg-transparent text-transparent'
                            )}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.contact_reason ? (
                  <p id="contact-reason-error" className="mt-3 text-[14px] leading-[1.6] text-[var(--text-error)]">
                    {errors.contact_reason}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {activeStep === 2 ? (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Name
                  </label>
                  <input
                    ref={setFieldRef('name') as React.Ref<HTMLInputElement>}
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    value={formState.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    onBlur={() => handleBlur('name')}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="Your name"
                  />
                  {errors.name ? (
                    <p id="contact-name-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Email
                  </label>
                  <input
                    ref={setFieldRef('email') as React.Ref<HTMLInputElement>}
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={formState.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="you@business.com"
                  />
                  {errors.email ? (
                    <p id="contact-email-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeStep === 3 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Message
                  </label>
                  <textarea
                    ref={setFieldRef('message') as React.Ref<HTMLTextAreaElement>}
                    id="contact-message"
                    name="message"
                    rows={6}
                    enterKeyHint="send"
                    value={formState.message}
                    onChange={(event) => handleChange('message', event.target.value)}
                    onBlur={() => handleBlur('message')}
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby="contact-message-helper contact-message-error"
                    className="min-h-[12.5rem] w-full rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] leading-[1.7] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder={getMessagePlaceholder(formState.contact_reason)}
                  />
                  <p id="contact-message-helper" className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                    A question, a follow-up, or a few direct notes is enough.
                  </p>
                  {errors.message ? (
                    <p id="contact-message-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {!showWebsiteField ? (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={revealWebsiteField}
                      className="inline-flex min-h-10 items-center text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-[var(--text-primary)] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
                    >
                      Add website (optional)
                    </button>
                  </div>
                ) : null}

                {showWebsiteField ? (
                  <div className="max-w-lg space-y-2">
                    <label htmlFor="contact-website" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Website URL
                    </label>
                    <input
                      ref={setFieldRef('current_website') as React.Ref<HTMLInputElement>}
                      id="contact-website"
                      name="current_website"
                      type="url"
                      autoComplete="url"
                      enterKeyHint="done"
                      value={formState.current_website}
                      onChange={(event) => handleChange('current_website', event.target.value)}
                      onBlur={() => handleBlur('current_website')}
                      aria-invalid={errors.current_website ? 'true' : undefined}
                      aria-describedby="contact-website-helper contact-website-error"
                      className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                      placeholder="https://example.com"
                    />
                    <p id="contact-website-helper" className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                      Optional. Useful if this relates to an existing page or site.
                    </p>
                    {errors.current_website ? (
                      <p id="contact-website-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                        {errors.current_website}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeStep === 4 ? (
              <div className="space-y-4">
                <div className="rounded-[20px] border border-[color:var(--hairline)] bg-[color:var(--surface-panel)]">
                  {[
                    {
                      label: 'Reason',
                      value: formatReasonLabel(formState.contact_reason),
                      step: 1,
                    },
                    {
                      label: 'Contact',
                      value: `${formState.name.trim() || 'Not provided'}${formState.email.trim() ? `\n${formState.email.trim()}` : ''}`,
                      step: 2,
                    },
                    {
                      label: 'Message',
                      value: formState.message.trim() || 'Not provided',
                      step: 3,
                    },
                    ...(formState.current_website.trim()
                      ? [
                          {
                            label: 'Website',
                            value: formState.current_website.trim(),
                            step: 3,
                          },
                        ]
                      : []),
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className={cn(
                        'grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_auto] sm:items-start sm:px-5',
                        index !== 0 && 'border-t border-[color:var(--hairline)]'
                      )}
                    >
                      <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {item.label}
                      </p>
                      <p className="whitespace-pre-line text-[15px] leading-[1.75] text-[var(--text-secondary)]">
                        {item.value}
                      </p>
                      <button
                        type="button"
                        onClick={() => jumpToStep(item.step)}
                        className="inline-flex min-h-10 items-center justify-start text-[14px] font-medium text-[var(--text-primary)] underline decoration-transparent underline-offset-4 transition-[text-decoration-color,color] duration-200 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] sm:justify-end"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <input type="hidden" name="source_path" value={sourcePath} />

        <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-company-fax">Company Fax</label>
          <input
            id="contact-company-fax"
            name="company_fax"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formState.company_fax}
            onChange={(event) => handleChange('company_fax', event.target.value)}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[color:var(--hairline)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="order-2 flex flex-col gap-3 sm:order-1 sm:flex-row sm:items-center">
            {activeStep > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => goToStep(activeStep - 1, 'backward')}
                className="w-full rounded-full sm:w-auto"
              >
                Back
              </Button>
            ) : (
              <p className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                Takes under a minute.
              </p>
            )}
          </div>

          <div className="order-1 sm:order-2">
            <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto" disabled={isSubmitting}>
              {activeStep === STEPS.length ? (isSubmitting ? 'Sending...' : 'Send note') : 'Continue'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default QuickContactWizard;
