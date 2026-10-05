"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import {
  contactSchema,
  serviceSlugs,
  serviceNames,
  budgetBands,
  type ContactFormData,
} from "@/lib/validations";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Reveal } from "@/components/marketing/Reveal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-danger">
      {message}
    </p>
  );
}

function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    // Validate on blur (not on load, not on every keystroke): errors appear
    // once the user has interacted with a field, never on a pristine form.
    // Matches the quote wizard's behavior.
    mode: "onBlur",
    defaultValues: {
      name: searchParams.get("name") ?? "",
      email: "",
      phone: "",
      company: "",
      service: (serviceSlugs.includes(
        (searchParams.get("service") ?? "") as (typeof serviceSlugs)[number]
      )
        ? searchParams.get("service")
        : "other") as ContactFormData["service"],
      budget: "Not sure yet",
      message: "",
      consent: false,
      website: "",
    },
  });

  // Support ?service= preselect on client navigation.
  useEffect(() => {
    const svc = searchParams.get("service");
    if (svc && serviceSlugs.includes(svc as (typeof serviceSlugs)[number])) {
      reset((prev) => ({ ...prev, service: svc as ContactFormData["service"] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = async (data: ContactFormData) => {
    setStatus("sending");
    setApiError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields && typeof json.fields === "object") {
          for (const [field, message] of Object.entries(json.fields)) {
            if (field === "_") continue;
            setError(field as keyof ContactFormData, {
              type: "server",
              message: String(message),
            });
          }
        }
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      toast.success("Message sent — we'll reply within 24 hours.");
    } catch (err) {
      setStatus("error");
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
      // Input is preserved — react-hook-form keeps all values.
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-900/10 bg-white p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-12 text-brand-500" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-brand-950">
          Message received.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Thanks for reaching out — <strong>we&apos;ll reply within 24 hours</strong>.
          If it&apos;s urgent, WhatsApp us and we&apos;ll respond even faster.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const fieldIds = {
    name: "contact-name",
    email: "contact-email",
    phone: "contact-phone",
    company: "contact-company",
    service: "contact-service",
    budget: "contact-budget",
    message: "contact-message",
  } as const;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-brand-900/10 bg-white p-6 sm:p-8"
    >
      {apiError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
        >
          {apiError} Your message is still here — you can retry below.
        </div>
      )}

      {/* Honeypot — invisible to humans, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldIds.name} className="mb-1.5 block text-sm font-semibold text-ink">
            Your name <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <Input
            id={fieldIds.name}
            autoComplete="name"
            placeholder="Priya Sharma"
            aria-describedby={`${fieldIds.name}-error`}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError id={`${fieldIds.name}-error`} message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor={fieldIds.email} className="mb-1.5 block text-sm font-semibold text-ink">
            Email <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <Input
            id={fieldIds.email}
            type="email"
            autoComplete="email"
            placeholder="priya@company.com"
            aria-describedby={`${fieldIds.email}-error`}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError id={`${fieldIds.email}-error`} message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor={fieldIds.phone} className="mb-1.5 block text-sm font-semibold text-ink">
            Phone <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <Input
            id={fieldIds.phone}
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            aria-describedby={`${fieldIds.phone}-error`}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError id={`${fieldIds.phone}-error`} message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor={fieldIds.company} className="mb-1.5 block text-sm font-semibold text-ink">
            Company <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <Input
            id={fieldIds.company}
            autoComplete="organization"
            placeholder="Sharma Textiles"
            aria-describedby={`${fieldIds.company}-error`}
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldError id={`${fieldIds.company}-error`} message={errors.company?.message} />
        </div>
        <div>
          <label htmlFor={fieldIds.service} className="mb-1.5 block text-sm font-semibold text-ink">
            Service <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <Select
            id={fieldIds.service}
            aria-describedby={`${fieldIds.service}-error`}
            aria-invalid={!!errors.service}
            {...register("service")}
          >
            {serviceSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {serviceNames[slug]}
              </option>
            ))}
          </Select>
          <FieldError id={`${fieldIds.service}-error`} message={errors.service?.message} />
        </div>
        <div>
          <label htmlFor={fieldIds.budget} className="mb-1.5 block text-sm font-semibold text-ink">
            Budget <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <Select
            id={fieldIds.budget}
            aria-describedby={`${fieldIds.budget}-error`}
            aria-invalid={!!errors.budget}
            {...register("budget")}
          >
            {budgetBands.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </Select>
          <FieldError id={`${fieldIds.budget}-error`} message={errors.budget?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={fieldIds.message} className="mb-1.5 block text-sm font-semibold text-ink">
            Your message <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <Textarea
            id={fieldIds.message}
            rows={5}
            placeholder="Tell us about your business and what you want to build…"
            aria-describedby={`${fieldIds.message}-error`}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          <FieldError id={`${fieldIds.message}-error`} message={errors.message?.message} />
        </div>
      </div>

      <Controller
        name="consent"
        control={control}
        render={({ field }) => (
          <ConsentCheckbox
            id="contact-consent"
            checked={field.value === true}
            onChange={field.onChange}
            error={errors.consent?.message}
          />
        )}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-7 w-full sm:w-auto"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send aria-hidden="true" /> Send message
          </>
        )}
      </Button>
      <p className="mt-3 text-sm text-ink-soft">
        Prefer talking?{" "}
        <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-700 underline">
          {siteConfig.email}
        </a>{" "}
        or {siteConfig.phone}.
      </p>
    </form>
  );
}

export default function ContactClient() {
  return (
    <>
      <noscript>
        <div className="border-b border-sun-500/40 bg-sun-400/15 px-4 py-3 text-center text-sm font-medium text-ink">
          This form needs JavaScript to submit. Please email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>{" "}
          instead — we reply within 24 hours.
        </div>
      </noscript>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <EditorialHeader
              index="01"
              eyebrow="Contact"
              title={
                <>
                  Tell us what you want{" "}
                  <em className="font-serif font-medium italic">to build.</em>
                </>
              }
              description="One message is all it takes. We reply within 24 hours with honest next steps — no sales pressure."
            />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <Reveal className="space-y-6">
              <div className="border-t border-ink/15 pt-5">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
                  <Mail className="size-4" aria-hidden="true" /> Email
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-2 block text-lg font-semibold text-brand-950 underline decoration-sun-400 decoration-2 underline-offset-4"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
                  <Phone className="size-4" aria-hidden="true" /> Call / WhatsApp
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="mt-2 block text-lg font-semibold text-brand-950 underline decoration-sun-400 decoration-2 underline-offset-4"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                Based in India, working with clients worldwide. English and
                Hindi — whichever you&apos;re comfortable in.
              </p>
            </Reveal>
            <Reveal>
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-brand-900/10 bg-white p-8 text-ink-soft">
                    Loading form…
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
