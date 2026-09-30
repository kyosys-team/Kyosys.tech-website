import { z } from "zod";

/**
 * Shared zod schemas for the public lead forms (contact + quote estimator).
 * Imported by BOTH client form components and API routes so validation
 * is identical on both sides (SRS FR-Q01 / US-030).
 */

export const serviceSlugs = [
  "web-development",
  "app-development",
  "social-media-marketing",
  "seo",
  "video-production",
  "other",
] as const;

export const serviceNames: Record<(typeof serviceSlugs)[number], string> = {
  "web-development": "Web Development",
  "app-development": "App Development",
  "social-media-marketing": "Social Media Marketing",
  seo: "SEO",
  "video-production": "Video Production",
  other: "Something else",
};

/** Services the quote estimator can price (everything except "other"). */
export const quotableServices = [
  "web-development",
  "app-development",
  "social-media-marketing",
  "seo",
  "video-production",
] as const;

export const budgetBands = [
  "< ₹25k",
  "₹25–75k",
  "₹75k–2L",
  "₹2L+",
  "Not sure yet",
] as const;

export const timelineOptions = ["standard", "fast", "urgent"] as const;

/** Phone: optional; if given, strip spaces/dashes/brackets/leading + → 10–15 digits. */
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (v === "") return true;
      const digits = v.replace(/[\s\-().+]/g, "");
      return /^\d{10,15}$/.test(digits);
    },
    { message: "Enter a valid phone number (10–15 digits)." }
  )
  .optional();

/**
 * DPDP consent — the Privacy Policy checkbox must be explicitly checked.
 * Enforced on BOTH the client form and the API route (shared schema).
 * Records consent given: the API saves `consent: true` on the lead record.
 */
const consentField = z
  .boolean({ error: "Please accept the Privacy Policy to continue." })
  .refine((v) => v === true, {
    message: "Please accept the Privacy Policy to continue.",
  });

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be at most 80 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: phoneSchema,
  company: z
    .string()
    .trim()
    .max(120, "Company must be at most 120 characters.")
    .optional(),
  service: z.enum(serviceSlugs, {
    message: "Pick a service.",
  }),
  budget: z.enum(budgetBands, {
    message: "Pick a budget band.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters)."),
  /** DPDP consent — required. See consentField above. */
  consent: consentField,
  /** Honeypot — real users leave this blank; bots fill it. */
  website: z.string().max(200).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be at most 80 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: phoneSchema,
  service: z.enum(quotableServices, {
    message: "Pick a service.",
  }),
  /** Sub-type / scope within the service (e.g. "business", "mvp"). */
  scale: z.string().trim().min(1, "Pick a project size."),
  /** Selected feature add-on keys from src/config/pricing.ts. Client always sends [] (possibly empty). */
  features: z.array(z.string()),
  timeline: z.enum(timelineOptions, {
    message: "Pick a timeline.",
  }),
  /** DPDP consent — required. See consentField above. */
  consent: consentField,
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

/** Shape of an API validation-failure response. */
export function zodFieldErrors(err: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}
