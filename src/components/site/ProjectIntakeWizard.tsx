import * as React from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { m } from 'framer-motion';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/Eyebrow';
import { cn } from '../../lib/utils';

type PricingPath = 'monthly' | 'one_time' | 'not_sure';
type FieldKey = 'pricing_path' | 'name' | 'email' | 'business_name' | 'current_website' | 'details';

type FormState = {
  pricing_path: PricingPath | '';
  name: string;
  email: string;
  business_name: string;
  current_website: string;
  details: string;
  company_fax: string;
};

type ValidationResult = {
  errors: Partial<Record<FieldKey, string>>;
  firstInvalidField: FieldKey | null;
};

type ProjectIntakeWizardProps = {
  sourcePath: string;
};

const STEPS = [
  { id: 1, label: 'Path', title: 'Pick the path closest to what you need.' },
  { id: 2, label: 'Contact', title: 'Where should we reply?' },
  { id: 3, label: 'Business', title: 'A few business details.' },
  { id: 4, label: 'Brief', title: 'What should we know?' },
  { id: 5, label: 'Review', title: 'Review before sending.' },
] as const;

const STEP_FIELDS: Record<number, FieldKey[]> = {
  1: ['pricing_path'],
  2: ['name', 'email'],
  3: ['business_name', 'current_website'],
  4: ['details'],
  5: ['pricing_path', 'name', 'email', 'business_name', 'current_website', 'details'],
};

const FIELD_TO_STEP: Record<FieldKey, number> = {
  pricing_path: 1,
  name: 2,
  email: 2,
  business_name: 3,
  current_website: 3,
  details: 4,
};

const PATH_OPTIONS: Array<{
  value: PricingPath;
  label: string;
  description: string;
}> = [
  {
    value: 'monthly',
    label: 'Monthly plan',
    description: 'Lower upfront cost. Ongoing support stays built in.',
  },
  {
    value: 'one_time',
    label: 'One-time project',
    description: 'A single scoped build with ownership from launch.',
  },
  {
    value: 'not_sure',
    label: 'Not sure yet',
    description: 'We can help decide which path fits once we review the brief.',
  },
];

const EMPTY_STATE: FormState = {
  pricing_path: '',
  name: '',
  email: '',
  business_name: '',
  current_website: '',
  details: '',
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

function formatPathLabel(value: PricingPath | '') {
  if (value === 'monthly') return 'Monthly plan';
  if (value === 'one_time') return 'One-time project';
  if (value === 'not_sure') return 'Not sure yet';
  return 'Not selected';
}

function getFieldError(field: FieldKey, state: FormState) {
  switch (field) {
    case 'pricing_path':
      return state.pricing_path ? '' : 'Choose the path that feels closest.';
    case 'name':
      return state.name.trim().length >= 2 ? '' : 'Please enter your name.';
    case 'email': {
      const email = state.email.trim();
      if (!email) return 'Please enter an email address.';
      return isValidEmail(email) ? '' : 'Please enter a valid email address.';
    }
    case 'business_name':
      return state.business_name.trim().length >= 2 ? '' : 'Please enter the business name.';
    case 'current_website':
      return isValidWebsite(state.current_website) ? '' : 'Please enter a valid website URL.';
    case 'details':
      return state.details.trim().length >= 10 ? '' : 'A few short lines is enough.';
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

export function ProjectIntakeWizard({ sourcePath }: ProjectIntakeWizardProps) {
  const [activeStep, setActiveStep] = React.useState(1);
  const [formState, setFormState] = React.useState<FormState>(EMPTY_STATE);
  const [errors, setErrors] = React.useState<Partial<Record<FieldKey, string>>>({});
  const [alertMessage, setAlertMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [stepDirection, setStepDirection] = React.useState<'forward' | 'backward'>('forward');

  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const successHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const inputRefs = React.useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const pendingFocusFieldRef = React.useRef<FieldKey | null>(null);
  const shouldFocusHeadingRef = React.useRef(false);

  const currentStepConfig = STEPS[activeStep - 1];
  const progressWidth = `${(activeStep / STEPS.length) * 100}%`;

  const setFieldRef = React.useCallback(
    (field: FieldKey) => (element: HTMLElement | null) => {
      if (field === 'pricing_path') {
        if (!inputRefs.current.pricing_path) {
          inputRefs.current.pricing_path = element;
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

  const jumpToStep = React.useCallback((step: number) => {
    if (step === activeStep) {
      shouldFocusHeadingRef.current = true;
      window.requestAnimationFrame(() => {
        headingRef.current?.focus();
      });
      return;
    }

    goToStep(step, step > activeStep ? 'forward' : 'backward');
  }, [activeStep, goToStep]);

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
    shouldFocusHeadingRef.current = true;
    setActiveStep(1);
  }, []);

  const handleSubmit = React.useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (activeStep < STEPS.length) {
      handleStepAdvance();
      return;
    }

    const validation = validateFields(formState, STEP_FIELDS[5]);
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
      business_name: formState.business_name.trim(),
      current_website: formState.current_website.trim(),
      pricing_path: formState.pricing_path,
      details: formState.details.trim(),
      primary_goal: 'new_site',
      source_path: sourcePath,
      company_fax: formState.company_fax.trim(),
    };

    try {
      const response = await fetch('/api/intake', {
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
            'We could not send your project brief. Please try again or email contact@getaxiom.ca.'
        );
      }

      setIsSubmitted(true);
    } catch (error) {
      setAlertMessage(
        error instanceof Error && error.message
          ? error.message
          : 'We could not send your project brief. Please try again or email contact@getaxiom.ca.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [activeStep, applyValidation, formState, goToStep, handleStepAdvance, isSubmitting, sourcePath]);

  const progressStyle = { width: progressWidth } as CSSProperties;
  const panelClassName = cn(
    'relative',
    stepDirection === 'forward' ? 'wizard-step-panel-forward' : 'wizard-step-panel-backward'
  );

  if (isSubmitted) {
    return (
      <section className="project-intake-wizard w-full max-w-3xl rounded-[28px] border border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-8 md:p-10">
        <Eyebrow className="text-[var(--accent-solid)]">Received</Eyebrow>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-3 text-[clamp(1.9rem,4vw,2.5rem)] font-[600] leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] outline-none"
        >
          Project brief received.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
          We'll review the brief and reply with the next step. A few strong signals are enough for us to outline the path forward.
        </p>
        <div className="mt-8 flex flex-col gap-3 border-t border-[color:var(--hairline)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={resetWizard}
            className="inline-flex min-h-10 items-center text-[14px] font-medium text-[var(--text-primary)] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)]"
          >
            Send another brief
          </button>
          <a
            href="/work"
            className="inline-flex min-h-10 items-center text-[14px] font-medium text-[var(--text-secondary)] underline decoration-[color:var(--hairline-strong)] underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-[var(--text-primary)]"
          >
            See real builds
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="project-intake-wizard w-full max-w-3xl overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
      <div className="border-b border-[color:var(--hairline)] px-5 py-5 sm:px-7 sm:py-6 md:px-9">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Project Intake</Eyebrow>
              <p className="mt-2 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
                Step {activeStep} of {STEPS.length}
                <span className="mx-2 text-[var(--text-muted)]" aria-hidden="true">
                  /
                </span>
                {currentStepConfig.label}
              </p>
            </div>
            <p className="max-w-md text-[14px] leading-[1.65] text-[var(--text-secondary)]">
              One step at a time. Short answers work.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-px w-full overflow-hidden rounded-full bg-[color:var(--surface-overlay-strong)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(201,163,104,0.82),rgba(201,163,104,0.5))] transition-[width] duration-300 ease-out"
                style={progressStyle}
              />
            </div>

            <ol className="hidden gap-3 md:grid md:grid-cols-5">
              {STEPS.map((step) => {
                const isActive = step.id === activeStep;
                const isComplete = step.id < activeStep;
                return (
                  <li
                    key={step.id}
                    aria-current={isActive ? 'step' : undefined}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => jumpToStep(step.id)}
                      className={cn(
                        'relative min-h-10 w-full text-[12px] font-medium uppercase tracking-[0.16em] transition-colors duration-200',
                        isActive && 'text-[var(--text-primary)]',
                        isComplete && 'text-[var(--accent-solid)]',
                        !isActive && !isComplete && 'text-[var(--text-muted)]'
                      )}
                    >
                      {step.label}
                      {isActive ? (
                        <m.span
                          layoutId="wizard-step-underline"
                          className="absolute inset-x-0 -bottom-2 h-px bg-[color:var(--accent-solid)]"
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-7 sm:py-7 md:px-9 md:py-8" noValidate>
        {alertMessage ? (
          <div
            className="mb-5 rounded-[18px] border border-[color:var(--error-border)] bg-[color:var(--error-surface)] px-4 py-3 text-[14px] leading-[1.6] text-[var(--error-text)]"
            role="alert"
            aria-live="assertive"
          >
            {alertMessage}
          </div>
        ) : null}

        <div
          key={activeStep}
          data-step-panel
          className={panelClassName}
        >
          <div className="max-w-2xl">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-[clamp(1.75rem,4vw,2.45rem)] font-[600] leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] outline-none"
            >
              {currentStepConfig.title}
            </h2>

            {activeStep === 1 ? (
              <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                This helps us frame the reply. If you're unsure, pick the closest one - we'll sort it on the call.
              </p>
            ) : null}

            {activeStep === 2 ? (
              <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                We only need the best name and email for the reply.
              </p>
            ) : null}

            {activeStep === 3 ? (
              <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                If there's already a site, include it. If not, leave it blank.
              </p>
            ) : null}

            {activeStep === 4 ? (
              <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                A few short lines is enough. Tell us what the business does, what feels broken, and when you want to move.
              </p>
            ) : null}

            {activeStep === 5 ? (
              <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--text-secondary)] sm:text-[16px]">
                If this looks right, send it. If not, edit any section before submitting.
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            {activeStep === 1 ? (
              <fieldset aria-describedby={errors.pricing_path ? 'pricing-path-error' : undefined}>
                <legend className="sr-only">Choose a pricing path</legend>
                <div className="grid gap-3 md:grid-cols-3">
                  {PATH_OPTIONS.map((option) => {
                    const checked = formState.pricing_path === option.value;
                    return (
                      <label key={option.value} className="group cursor-pointer">
                        <input
                          ref={setFieldRef('pricing_path') as React.Ref<HTMLInputElement>}
                          type="radio"
                          name="pricing_path"
                          value={option.value}
                          checked={checked}
                          onChange={(event) => handleChange('pricing_path', event.target.value)}
                          onBlur={() => handleBlur('pricing_path')}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            'relative flex min-h-[10.5rem] flex-col justify-between rounded-[22px] border px-4 py-4 transition-[border-color,background-color,transform,box-shadow] duration-200 ease-out sm:px-5 sm:py-5',
                            'border-[color:var(--hairline)] bg-[color:var(--surface-panel)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
                            'group-hover:border-[color:var(--hairline-strong)] group-hover:bg-[color:var(--surface-overlay)]',
                            'group-focus-within:border-[color:var(--accent-border)] group-focus-within:ring-2 group-focus-within:ring-[color:var(--accent-ring)]',
                            checked &&
                              'border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(212,175,55,0.14),rgba(212,175,55,0.06))] shadow-[0_0_0_1px_rgba(212,175,55,0.14)] scale-[1.02]'
                          )}
                        >
                          <span className="space-y-3">
                            <span className="block text-[18px] font-[600] tracking-[-0.02em] text-[var(--text-primary)]">
                              {option.label}
                            </span>
                            <span className="block text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                              {option.description}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-[opacity,transform,border-color,background-color] duration-200',
                              checked
                                ? 'border-[color:var(--accent-border-strong)] bg-[color:var(--accent-solid)] text-[var(--text-on-accent)] opacity-100'
                                : 'border-[color:var(--hairline-strong)] bg-transparent text-transparent opacity-0'
                            )}
                          >
                            <span className="text-[11px] font-bold">&#10003;</span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.pricing_path ? (
                  <p id="pricing-path-error" className="mt-3 text-[14px] leading-[1.6] text-[var(--text-error)]">
                    {errors.pricing_path}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {activeStep === 2 ? (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="project-name" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Name
                  </label>
                  <input
                    ref={setFieldRef('name') as React.Ref<HTMLInputElement>}
                    id="project-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    value={formState.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    onBlur={() => handleBlur('name')}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'project-name-error' : undefined}
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="Your name"
                  />
                  {errors.name ? (
                    <p id="project-name-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="project-email" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Email
                  </label>
                  <input
                    ref={setFieldRef('email') as React.Ref<HTMLInputElement>}
                    id="project-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={formState.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'project-email-error' : undefined}
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="you@business.com"
                  />
                  {errors.email ? (
                    <p id="project-email-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeStep === 3 ? (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="project-business" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Business name
                  </label>
                  <input
                    ref={setFieldRef('business_name') as React.Ref<HTMLInputElement>}
                    id="project-business"
                    name="business_name"
                    type="text"
                    autoComplete="organization"
                    enterKeyHint="next"
                    value={formState.business_name}
                    onChange={(event) => handleChange('business_name', event.target.value)}
                    onBlur={() => handleBlur('business_name')}
                    aria-invalid={errors.business_name ? 'true' : undefined}
                    aria-describedby={errors.business_name ? 'project-business-error' : undefined}
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="Business name"
                  />
                  {errors.business_name ? (
                    <p id="project-business-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.business_name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="project-website" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Website URL
                  </label>
                  <input
                    ref={setFieldRef('current_website') as React.Ref<HTMLInputElement>}
                    id="project-website"
                    name="current_website"
                    type="url"
                    autoComplete="url"
                    enterKeyHint="next"
                    value={formState.current_website}
                    onChange={(event) => handleChange('current_website', event.target.value)}
                    onBlur={() => handleBlur('current_website')}
                    aria-invalid={errors.current_website ? 'true' : undefined}
                    aria-describedby="project-website-helper project-website-error"
                    className="w-full rounded-[18px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                    placeholder="https://example.com"
                  />
                  <p id="project-website-helper" className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                    Optional. Include it if there&apos;s already a site.
                  </p>
                  {errors.current_website ? (
                    <p id="project-website-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                      {errors.current_website}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeStep === 4 ? (
              <div className="space-y-2">
                <label htmlFor="project-details" className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Project brief
                </label>
                <textarea
                  ref={setFieldRef('details') as React.Ref<HTMLTextAreaElement>}
                  id="project-details"
                  name="details"
                  rows={6}
                  enterKeyHint="send"
                  value={formState.details}
                  onChange={(event) => handleChange('details', event.target.value)}
                  onBlur={() => handleBlur('details')}
                  aria-invalid={errors.details ? 'true' : undefined}
                  aria-describedby="project-details-helper project-details-error"
                  className="min-h-[13rem] w-full rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface-input)] px-4 py-4 text-[16px] leading-[1.7] text-[var(--text-primary)] shadow-[var(--shadow-field-base)] transition-[border-color,background-color,box-shadow] duration-200 ease-out placeholder:text-[var(--text-placeholder)] hover:border-[color:var(--hairline-strong)] hover:bg-[color:var(--surface-input-hover)] focus-visible:border-[color:var(--accent-border)] focus-visible:bg-[color:var(--surface-input-focus)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-field-focus),var(--shadow-field-base)]"
                  placeholder="What the business does, what feels broken, and when you want to move."
                />
                <p id="project-details-helper" className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                  This does not need to be polished. A few direct notes is enough for us to reply usefully.
                </p>
                {errors.details ? (
                  <p id="project-details-error" className="text-[14px] leading-[1.6] text-[var(--text-error)]">
                    {errors.details}
                  </p>
                ) : null}
              </div>
            ) : null}

            {activeStep === 5 ? (
              <div className="space-y-4">
                <div className="rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface-panel)]">
                  {[
                    {
                      label: 'Path',
                      value: formatPathLabel(formState.pricing_path),
                      step: 1,
                    },
                    {
                      label: 'Contact',
                      value: `${formState.name.trim() || 'Not provided'}${formState.email.trim() ? `\n${formState.email.trim()}` : ''}`,
                      step: 2,
                    },
                    {
                      label: 'Business',
                      value: `${formState.business_name.trim() || 'Not provided'}${
                        formState.current_website.trim() ? `\n${formState.current_website.trim()}` : '\nNo website included'
                      }`,
                      step: 3,
                    },
                    {
                      label: 'Brief',
                      value: formState.details.trim() || 'Not provided',
                      step: 4,
                    },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className={cn(
                        'grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] sm:items-start sm:px-5',
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
          <label htmlFor="company-fax">Company Fax</label>
          <input
            id="company-fax"
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
                Takes about 2 minutes.
              </p>
            )}
          </div>

          <div className="order-1 sm:order-2">
            <Button
              type="submit"
              size="lg"
              className="group w-full rounded-full transition-transform duration-150 active:scale-[0.98] sm:w-auto"
              disabled={isSubmitting}
            >
              {activeStep === STEPS.length ? (
                isSubmitting ? 'Sending...' : 'Submit project brief'
              ) : (
                <span className="inline-flex items-center gap-2">
                  Continue
                  <span className="transition-transform duration-200 motion-safe:group-hover:translate-x-1">→</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProjectIntakeWizard;
