import { db, isDbConfigured } from "@/lib/db";

/**
 * Featured testimonials for the homepage.
 *
 * HONESTY RULE (US-044): the public site NEVER renders placeholder or seeded
 * testimonials. Only rows that are featured + approved + NOT sample appear.
 * When the database is not configured, or no such row exists, the homepage
 * hides the testimonials section entirely instead of showing invented quotes.
 */
export interface TestimonialData {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export async function getFeaturedTestimonials(): Promise<TestimonialData[]> {
  if (!isDbConfigured()) return [];
  try {
    const rows = await db.testimonial.findMany({
      where: { featured: true, approved: true, sample: false },
      orderBy: { createdAt: "desc" },
      select: { name: true, role: true, company: true, quote: true, rating: true },
    });
    return rows.map((r) => ({
      name: r.name,
      role: r.role,
      company: r.company ?? "",
      quote: r.quote,
      rating: r.rating,
    }));
  } catch {
    // A DB outage must never break the homepage: degrade to no testimonials.
    return [];
  }
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
