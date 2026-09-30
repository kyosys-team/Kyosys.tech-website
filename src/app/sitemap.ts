import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/lib/services";
import { db, isDbConfigured } from "@/lib/db";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/work",
  "/blog",
  "/contact",
  "/quote",
  "/privacy",
  "/terms",
  "/cookies",
];

/**
 * Sitemap: static public routes + published blog posts + published case
 * studies. DB lookups are gated behind isDbConfigured() so builds and
 * runtime without DATABASE_URL still emit a correct static sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map(
      (path): MetadataRoute.Sitemap[number] => ({
        url: `${siteConfig.url}${path || "/"}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      })
    ),
    ...services.map(
      (s): MetadataRoute.Sitemap[number] => ({
        url: `${siteConfig.url}/services/${s.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      })
    ),
  ];

  if (isDbConfigured()) {
    try {
      const [posts, studies] = await Promise.all([
        db.post.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true },
          orderBy: { publishedAt: "desc" },
        }),
        db.caseStudy.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true },
          orderBy: { publishedAt: "desc" },
        }),
      ]);
      for (const p of posts) {
        entries.push({
          url: `${siteConfig.url}/blog/${p.slug}`,
          lastModified: p.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
      for (const c of studies) {
        entries.push({
          url: `${siteConfig.url}/work/${c.slug}`,
          lastModified: c.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    } catch {
      // DB unreachable at build time — static entries still stand.
    }
  }

  return entries;
}
