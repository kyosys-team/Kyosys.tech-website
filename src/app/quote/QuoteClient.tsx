"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  quoteSchema,
  quotableServices,
  serviceNames,
  type QuoteFormData,
} from "@/lib/validations";
import {
  pricing,
  computeEstimate,
  formatRange,
  timelineMultipliers,
  type Timeline,
} from "@/config/pricing";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Reveal } from "@/components/marketing/Reveal";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const STEP_LABELS = ["Service", "Features", "Timeline & contact"] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-danger">
      {message}
    </p>
  );
}

function QuoteWizard() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("service");
  const initialService = quotableServices.includes(
    (preselect ?? "") as (typeof quotableServices)[number]
  )
    ? (preselect as (typeof quotableServices)[number])
    : quotableServices[0];

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    control,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: initialService,
      scale: pricing[initialService].scales[0].key,
      features: [],
      timeline: "standard",
      consent: false,
    },
  });

  const service = watch("service");
  const scale = watch("scale");
  const features = watch("features");
  const timeline = watch("timeline");
  const watchedName = watch("name");

  const svc = pricing[service];

  const preview = useMemo(
    () => computeEstimate(service, scale, features, timeline),
    [service, scale, features, timeline]
  );

  const selectService = (s: (typeof quotableServices)[number]) => {
    setValue("service", s, { shouldValidate: true });
    // Reset scale/features to the first scale and empty features of the new service.
    setValue("scale", pricing[s].scales[0].key);
    setValue("features", []);
  };

  const toggleFeature = (key: string) => {
    const cur = features ?? [];
    setValue("features", cur.includes(key) ? cur.filter((f) => f !== key) : [...cur, key]);
  };

  const goNext = async () => {
    const fields: (keyof QuoteFormData)[][] = [
      ["service", "scale"],
      [],
      ["timeline", "name", "email", "phone", "consent"],
    ];
    const ok = await trigger(fields[step]);
    if (ok) {
      setStep((s) => Math.min(s + 1, 2));
      setApiError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields && typeof json.fields === "object") {
          for (const [field, message] of Object.entries(json.fields)) {
            if (field === "_") continue;
            setError(field as keyof QuoteFormData, {
              type: "server",
              message: String(message),
            });
          }
        }
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setResult({ min: json.estimateMin, max: json.estimateMax });
      toast.success("Estimate ready!");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ──────────────────────────────────────────────────────
  if (result) {
    const contactHref = `/contact?service=${encodeURIComponent(service)}&name=${encodeURIComponent(watchedName)}`;
    return (
      <div className="rounded-2xl border border-brand-900/10 bg-white p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-12 text-brand-500" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-brand-950">
          Your rough estimate
        </h2>
        <p className="mt-3 font-display text-4xl font-extrabold text-brand-900 sm:text-5xl">
          {formatRange(result.min, result.max)}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          <Info className="mr-1 inline size-4 align-[-2px]" aria-hidden="true" />
          Rough estimate — exact quote after a free 30-min discovery call.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          We&apos;ve saved your request{watchedName ? `, ${watchedName.split(" ")[0]}` : ""}.
          We&apos;ll follow up by email within 24 hours.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={contactHref} className={buttonVariants({ variant: "primary", size: "lg" })}>
            Request exact quote
          </Link>
          <Link href="/services" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  const stepIds = ["quote-service", "quote-scale", "quote-timeline", "quote-name", "quote-email", "quote-phone"] as const;

  return (
    <div className="rounded-2xl border border-brand-900/10 bg-white p-6 sm:p-8">
      {/* Progress indicator */}
      <ol
        className="mb-8 flex items-center gap-2 sm:gap-3"
        aria-label="Quote wizard progress"
      >
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    i < step
                      ? "bg-brand-500 text-white"
                      : i === step
                        ? "bg-brand-950 text-white"
                        : "bg-mist text-ink-soft"
                  )}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold sm:text-sm",
                    i === step ? "text-brand-950" : "text-ink-soft"
                  )}
                  aria-current={i === step ? "step" : undefined}
                >
                  {label}
                </span>
              </div>
              <div
                className={cn(
                  "h-1 rounded-full",
                  i < step ? "bg-brand-500" : i === step ? "bg-brand-950" : "bg-mist"
                )}
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ol>

      {apiError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
        >
          {apiError} Your answers are still here — you can retry.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── STEP 1: service + sub-type ── */}
        {step === 0 && (
          <div role="group" aria-labelledby="step1-heading">
            <h3 id="step1-heading" className="font-display text-xl font-extrabold text-brand-950">
              What do you want to build?
            </h3>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {quotableServices.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => selectService(s)}
                  aria-pressed={service === s}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    service === s
                      ? "border-brand-700 bg-brand-950 text-paper"
                      : "border-ink/15 bg-white text-ink hover:border-brand-500"
                  )}
                >
                  <span className="block font-semibold">{serviceNames[s]}</span>
                </button>
              ))}
            </div>
            <FieldError id="quote-service-error" message={errors.service?.message} />

            <h4 className="mt-7 font-display text-lg font-extrabold text-brand-950">
              Project size
            </h4>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Project size">
              {svc.scales.map((sc) => (
                <label
                  key={sc.key}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-colors",
                    scale === sc.key
                      ? "border-brand-700 bg-sun-400/20"
                      : "border-ink/15 bg-white hover:border-brand-500"
                  )}
                >
                  <input
                    type="radio"
                    name="scale"
                    value={sc.key}
                    className="sr-only"
                    checked={scale === sc.key}
                    onChange={() => setValue("scale", sc.key, { shouldValidate: true })}
                  />
                  <span className="block font-semibold text-ink">{sc.label}</span>
                  {sc.blurb && <span className="mt-0.5 block text-sm text-ink-soft">{sc.blurb}</span>}
                </label>
              ))}
            </div>
            <FieldError id="quote-scale-error" message={errors.scale?.message} />
          </div>
        )}

        {/* ── STEP 2: features ── */}
        {step === 1 && (
          <div role="group" aria-labelledby="step2-heading">
            <h3 id="step2-heading" className="font-display text-xl font-extrabold text-brand-950">
              Any extras? <span className="font-sans text-base font-normal text-ink-soft">(optional)</span>
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {serviceNames[service]} — tap everything you might want.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {svc.features.map((f) => {
                const active = (features ?? []).includes(f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleFeature(f.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      active
                        ? "border-brand-700 bg-brand-950 text-paper"
                        : "border-ink/15 bg-white text-ink hover:border-brand-500"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2",
                        active ? "border-sun-400 bg-sun-400 text-brand-950" : "border-ink/25"
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                    </span>
                    <span>
                      <span className="block font-semibold">{f.label}</span>
                      <span className={cn("block text-sm", active ? "text-paper/70" : "text-ink-soft")}>
                        +₹{f.band[0].toLocaleString("en-IN")}–{f.band[1].toLocaleString("en-IN")}
                        {f.recurring ? "/mo" : ""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: timeline + contact ── */}
        {step === 2 && (
          <div role="group" aria-labelledby="step3-heading">
            <h3 id="step3-heading" className="font-display text-xl font-extrabold text-brand-950">
              How fast, and where do we send it?
            </h3>
            <h4 className="mt-5 text-sm font-semibold text-ink">Timeline</h4>
            <div className="mt-2 grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Timeline">
              {(Object.keys(timelineMultipliers) as Timeline[]).map((t) => (
                <label
                  key={t}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-colors",
                    timeline === t
                      ? "border-brand-700 bg-sun-400/20"
                      : "border-ink/15 bg-white hover:border-brand-500"
                  )}
                >
                  <input
                    type="radio"
                    name="timeline"
                    value={t}
                    className="sr-only"
                    checked={timeline === t}
                    onChange={() => setValue("timeline", t, { shouldValidate: true })}
                  />
                  <span className="block font-semibold capitalize text-ink">{t}</span>
                  <span className="block text-sm text-ink-soft">
                    {t === "standard" ? "Normal pace" : t === "fast" ? "+25% — priority" : "+50% — rush"}
                  </span>
                </label>
              ))}
            </div>
            <FieldError id="quote-timeline-error" message={errors.timeline?.message} />

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={stepIds[3]} className="mb-1.5 block text-sm font-semibold text-ink">
                  Your name <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <Input
                  id={stepIds[3]}
                  autoComplete="name"
                  placeholder="Priya Sharma"
                  aria-describedby={`${stepIds[3]}-error`}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError id={`${stepIds[3]}-error`} message={errors.name?.message} />
              </div>
              <div>
                <label htmlFor={stepIds[4]} className="mb-1.5 block text-sm font-semibold text-ink">
                  Email <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <Input
                  id={stepIds[4]}
                  type="email"
                  autoComplete="email"
                  placeholder="priya@company.com"
                  aria-describedby={`${stepIds[4]}-error`}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError id={`${stepIds[4]}-error`} message={errors.email?.message} />
              </div>
              <div>
                <label htmlFor={stepIds[5]} className="mb-1.5 block text-sm font-semibold text-ink">
                  Phone <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <Input
                  id={stepIds[5]}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  aria-describedby={`${stepIds[5]}-error`}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                <FieldError id={`${stepIds[5]}-error`} message={errors.phone?.message} />
              </div>
            </div>

            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <ConsentCheckbox
                  id="quote-consent"
                  checked={field.value === true}
                  onChange={field.onChange}
                  error={errors.consent?.message}
                />
              )}
            />
          </div>
        )}

        {/* Live range preview — always a range, never a single price */}
        <div className="mt-8 flex flex-col gap-3 rounded-xl bg-brand-950 px-5 py-4 text-paper sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-paper/80">
            <Info className="mr-1.5 inline size-4 align-[-2px] text-sun-400" aria-hidden="true" />
            Rough estimate — exact quote after a free 30-min discovery call.
          </p>
          <p
            className="shrink-0 font-display text-2xl font-extrabold text-sun-400"
            aria-live="polite"
          >
            {formatRange(preview.min, preview.max)}
          </p>
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0 || submitting}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
          {step < 2 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Continue <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                "Get my estimate"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function QuoteClient() {
  return (
    <>
      <noscript>
        <div className="border-b border-sun-500/40 bg-sun-400/15 px-4 py-3 text-center text-sm font-medium text-ink">
          The quote wizard needs JavaScript. Please email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>{" "}
          with your project details for a rough estimate.
        </div>
      </noscript>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <EditorialHeader
              index="01"
              eyebrow="Instant quote"
              title={
                <>
                  What will it <em className="font-serif font-medium italic">cost?</em>
                </>
              }
              description="Three steps, under a minute. Get an honest price range — no email spam, no sales call required."
            />
          </Reveal>
          <div className="mx-auto mt-10 max-w-4xl">
            <Reveal>
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-brand-900/10 bg-white p-8 text-ink-soft">
                    Loading wizard…
                  </div>
                }
              >
                <QuoteWizard />
              </Suspense>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
