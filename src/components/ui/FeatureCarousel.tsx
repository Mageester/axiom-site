"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import clsx from "clsx";
import { cn } from "../../lib/utils";

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>;
  "--y": MotionValue<string>;
};

export interface FeatureStep {
  id: string;
  name: string;
  title: string;
  description: string;
}

export interface FeatureCarouselImageSet {
  step1light1: string;
  step1light2: string;
  step2light1: string;
  step2light2: string;
  step3light: string;
  step4light: string;
  alt: string;
}

export interface FeatureCarouselProps {
  steps: readonly FeatureStep[];
  image: FeatureCarouselImageSet;
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  step4imgClass?: string;
  bgClass?: string;
  intervalMs?: number;
}

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
} as const;

type AnimationPreset = keyof typeof ANIMATION_PRESETS;

interface StepImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

interface AnimatedStepImageProps extends StepImageProps {
  preset?: AnimationPreset;
  delay?: number;
  onAnimationComplete?: () => void;
}

function useCycler(totalSteps: number, intervalMs: number, paused: boolean) {
  const [current, setCurrent] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = React.useCallback(() => {
    clearTimer();
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % totalSteps);
    }, intervalMs);
  }, [clearTimer, intervalMs, paused, totalSteps]);

  React.useEffect(() => {
    schedule();
    return clearTimer;
  }, [schedule, current, clearTimer]);

  const goTo = React.useCallback(
    (idx: number) => {
      const next = ((idx % totalSteps) + totalSteps) % totalSteps;
      setCurrent(next);
    },
    [totalSteps],
  );

  const increment = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  return { current, goTo, increment };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  );
}


const AnimatedStepImage = ({
  preset = "fadeInScale",
  delay = 0,
  onAnimationComplete,
  src,
  alt,
  className,
  style,
  width = 1200,
  height = 630,
}: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset];
  return (
    <motion.img
      alt={alt}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
      style={{
        position: "absolute",
        userSelect: "none",
        maxWidth: "unset",
        ...style,
      }}
      {...presetConfig}
      transition={{ ...presetConfig.transition, delay }}
      onAnimationComplete={onAnimationComplete}
    />
  );
};

function FeatureCard({
  bgClass,
  stepsSlot,
  imageSlot,
  overlaySlot,
  step,
  steps,
}: {
  bgClass?: string;
  stepsSlot: React.ReactNode;
  imageSlot: React.ReactNode;
  overlaySlot: React.ReactNode;
  step: number;
  steps: readonly FeatureStep[];
}) {
  const [mounted, setMounted] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="axiom-feature-card relative w-full rounded-[20px]"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          "group relative w-full overflow-hidden rounded-[20px] border border-[color:var(--hairline)] bg-[var(--surface-1)] transition duration-300",
          "md:hover:border-[color:var(--hairline-strong)]",
          bgClass,
        )}
      >
        <div className="relative flex min-h-[560px] w-full flex-col p-6 sm:min-h-[600px] sm:p-8 md:min-h-[640px] md:p-10">
          <div className="relative z-30 mb-5 sm:mb-6">{stepsSlot}</div>
          <motion.div
            key={`text-${step}`}
            className="relative z-10 flex w-full flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <h3 className="text-balance text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-[26px]">
              {steps[step].title}
            </h3>
            <p className="max-w-[42rem] text-balance text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              {steps[step].description}
            </p>
          </motion.div>
          <div className="relative mt-6 min-h-[280px] flex-1 sm:min-h-[320px] md:min-h-[360px]">
            {mounted ? imageSlot : null}
          </div>
          {overlaySlot}
        </div>
      </div>
    </motion.div>
  );
}

function Steps({
  steps,
  current,
  onChange,
}: {
  steps: readonly FeatureStep[];
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol
        className="flex w-full flex-wrap items-center gap-2"
        role="list"
      >
        {steps.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <motion.li
              key={`${step.name}-${stepIdx}`}
              initial={false}
              animate={{ scale: isCurrent ? 1 : 0.92, opacity: isCurrent ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative z-50 rounded-full px-3 py-1 md:flex",
                isCompleted
                  ? "bg-[color:var(--accent-surface)]"
                  : "bg-[color:var(--surface-overlay)]",
              )}
            >
              <button
                type="button"
                onClick={() => onChange(stepIdx)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Go to ${step.name}: ${step.title}`}
                className="group flex w-full cursor-pointer items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] rounded-full"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: isCurrent ? 1.2 : 1 }}
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full duration-300",
                    isCompleted && "bg-[color:var(--accent-solid)] text-[color:var(--text-on-accent)]",
                    isCurrent && "bg-[color:var(--accent-surface-strong)] text-[color:var(--accent-solid)]",
                    isFuture && "bg-[color:var(--surface-overlay-press)]",
                  )}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <IconCheck className="h-3 w-3 stroke-[3]" />
                    </motion.span>
                  ) : (
                    <span className="text-[10px] font-semibold">{stepIdx + 1}</span>
                  )}
                </motion.span>
                <span
                  className={cn(
                    "text-[12px] font-medium uppercase tracking-[0.14em]",
                    isCompleted && "text-[var(--text-muted)]",
                    isCurrent && "text-[var(--accent-solid)]",
                    isFuture && "text-[var(--text-muted)]",
                  )}
                >
                  {step.name}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

const defaultClasses = {
  step1img1:
    "pointer-events-none w-[50%] border border-[color:var(--hairline)] rounded-2xl transition-all duration-500",
  step1img2:
    "pointer-events-none w-[60%] border border-[color:var(--hairline)] rounded-2xl overflow-hidden transition-all duration-500",
  step2img1:
    "pointer-events-none w-[50%] border border-[color:var(--hairline)] rounded-2xl overflow-hidden transition-all duration-500",
  step2img2:
    "pointer-events-none w-[40%] border border-[color:var(--hairline)] rounded-2xl overflow-hidden transition-all duration-500",
  step3img:
    "pointer-events-none w-[90%] border border-[color:var(--hairline)] rounded-2xl overflow-hidden transition-all duration-500",
  step4img:
    "pointer-events-none w-[90%] border border-[color:var(--hairline)] rounded-2xl overflow-hidden transition-all duration-500",
} as const;

export function FeatureCarousel({
  steps,
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  bgClass,
  intervalMs = 4200,
}: FeatureCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = React.useState(false);
  const paused = hovered || reduceMotion;
  const { current: step, goTo, increment } = useCycler(steps.length, intervalMs, paused);

  const handleAdvance = () => increment();

  const renderStepContent = () => {
    const content = () => {
      switch (step) {
        case 0:
          return (
            <>
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step1img1Class)}
                src={image.step1light1}
                preset="slideInLeft"
              />
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step1img2Class)}
                src={image.step1light2}
                preset="slideInRight"
                delay={0.1}
              />
            </>
          );
        case 1:
          return (
            <>
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step2img1Class)}
                src={image.step2light1}
                preset="fadeInScale"
              />
              <AnimatedStepImage
                alt={image.alt}
                className={clsx(step2img2Class)}
                src={image.step2light2}
                preset="fadeInScale"
                delay={0.1}
              />
            </>
          );
        case 2:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step3imgClass)}
              src={image.step3light}
              preset="fadeInScale"
            />
          );
        case 3:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step4imgClass)}
              src={image.step4light}
              preset="fadeInScale"
            />
          );
        default:
          return null;
      }
    };

    return (
      <div key={`img-${step}`} className="absolute inset-0 h-full w-full">
        {content()}
      </div>
    );
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <FeatureCard
        bgClass={bgClass}
        step={step}
        steps={steps}
        stepsSlot={<Steps current={step} onChange={goTo} steps={steps} />}
        imageSlot={renderStepContent()}
        overlaySlot={
          <button
            type="button"
            aria-label="Advance to next step"
            className="absolute inset-0 z-[5] h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-inset rounded-[20px]"
            onClick={handleAdvance}
          />
        }
      />
    </div>
  );
}

export default FeatureCarousel;
