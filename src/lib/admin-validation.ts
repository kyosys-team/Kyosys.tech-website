import { z } from "zod";

const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v === undefined ? null : v), schema.nullable());

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: z.string().trim().min(1, "Role is required").max(120),
  company: z.string().trim().max(160).optional().nullable(),
  quote: z.string().trim().min(1, "Quote is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarUrl: emptyToNull(z.string().trim().url("Must be a valid URL").max(2048)),
  featured: z.boolean().default(false),
  approved: z.boolean().default(false),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const tiptapDoc = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

const resultPair = z.object({
  metric: z.string().trim().min(1, "Metric label is required").max(80),
  value: z.string().trim().min(1, "Metric value is required").max(40),
});

export const caseStudySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180)
    .regex(slugPattern, "Slug must be lowercase letters, numbers and hyphens"),
  client: z.string().trim().max(160).optional().nullable(),
  industry: z.string().trim().max(120).optional().nullable(),
  services: z.array(z.string().trim().min(1)).max(10).default([]),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(160, "Excerpt must be ≤ 160 characters"),
  content: tiptapDoc.nullable().default(null),
  coverImage: emptyToNull(z.string().trim().url("Must be a valid URL").max(2048)),
  results: z.array(resultPair).max(12).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seoTitle: z.string().trim().max(70).optional().nullable(),
  seoDescription: z.string().trim().max(160).optional().nullable(),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;
