import { z } from "zod";

export const postStatuses = ["DRAFT", "PUBLISHED"] as const;

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(120, "Slug must be 120 characters or fewer")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may only contain lowercase letters, numbers and hyphens"
  );

const basePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(160, "Excerpt must be 160 characters or fewer"),
  content: z.record(z.string(), z.unknown()).refine(
    (doc) => doc.type === "doc",
    "Content must be a valid editor document"
  ),
  coverImage: z
    .union([z.string().url("Cover image must be a valid URL"), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? v : null)),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(postStatuses).default("DRAFT"),
  seoTitle: z
    .union([z.string().max(60, "SEO title must be 60 characters or fewer"), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? v : null)),
  seoDescription: z
    .union([
      z.string().max(160, "SEO description must be 160 characters or fewer"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((v) => (v ? v : null)),
  authorName: z
    .union([
      z.string().max(100, "Author name must be 100 characters or fewer"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((v) => (v ? v : null)),
  authorBio: z
    .union([
      z.string().max(160, "Author bio must be 160 characters or fewer"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((v) => (v ? v : null)),
});

export const createPostSchema = basePostSchema;
export const updatePostSchema = basePostSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Name must be 80 characters or fewer"),
  slug: slugSchema,
});

export const updateCategorySchema = categorySchema.partial();

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// Validation-error responses use the single shared helper in "@/lib/api-errors"
// (same { error, fields } envelope as every other route).
