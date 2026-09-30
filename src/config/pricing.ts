/**
 * Pricing engine for the public quote estimator (SRS FR-Q03, FR-Q04).
 *
 * PURE MODULE — no server-only imports. Imported by the /quote client page
 * (live range preview) and by POST /api/quote (server-side truth). The two
 * must produce identical numbers because they run the same code.
 *
 * ⚠️  PLACEHOLDER BANDS ⚠️
 * Every band and add-on below is a market-guess placeholder. Abhishek must
 * confirm (or rewrite) all numbers before launch. Do NOT ship to production
 * with these values unreviewed.
 *
 * Units: INR (₹). computeEstimate ALWAYS returns a range — never a single
 * price — per SRS FR-Q04.
 */

import { quotableServices } from "@/lib/validations";

export type QuotableService = (typeof quotableServices)[number];
export type Timeline = "standard" | "fast" | "urgent";

export interface ScaleOption {
  /** Stable key sent to the API (zod validates against these per service). */
  key: string;
  /** Short label shown in the wizard. */
  label: string;
  /** PLACEHOLDER base price band [min, max] in ₹. */
  band: [number, number];
  blurb?: string;
}

export interface FeatureAddon {
  key: string;
  label: string;
  /** PLACEHOLDER add-on band [min, max] in ₹. */
  band: [number, number];
  recurring?: boolean; // true => priced per month, shown as "/mo"
}

export interface ServicePricing {
  scales: ScaleOption[];
  features: FeatureAddon[];
}

/**
 * ⚠️ PLACEHOLDER pricing (SRS FR-Q03). Abhishek must confirm before launch.
 */
export const pricing: Record<QuotableService, ServicePricing> = {
  "web-development": {
    scales: [
      { key: "landing", label: "Landing page", band: [15000, 30000], blurb: "1-page, launch fast" },
      { key: "business", label: "Business website", band: [30000, 80000], blurb: "5–10 pages" },
      { key: "web-app", label: "Web application", band: [80000, 250000], blurb: "Login, dashboard, database" },
    ],
    features: [
      { key: "blog", label: "Blog / news section", band: [8000, 15000] },
      { key: "cms", label: "Admin panel to edit content", band: [15000, 30000] },
      { key: "ecommerce", label: "Online store + payments", band: [30000, 80000] },
      { key: "multilang", label: "Multi-language (2 languages)", band: [12000, 25000] },
      { key: "animations", label: "Custom animations & motion", band: [8000, 20000] },
    ],
  },
  "app-development": {
    scales: [
      { key: "mvp", label: "MVP", band: [100000, 250000], blurb: "Core features, one platform" },
      { key: "full", label: "Full product", band: [250000, 600000], blurb: "Both platforms + backend" },
    ],
    features: [
      { key: "android-ios", label: "Both Android & iOS", band: [50000, 150000] },
      { key: "payments", label: "In-app payments", band: [20000, 50000] },
      { key: "push", label: "Push notifications", band: [10000, 25000] },
      { key: "offline", label: "Offline mode", band: [25000, 60000] },
      { key: "admin-web", label: "Admin web dashboard", band: [30000, 70000] },
    ],
  },
  "social-media-marketing": {
    scales: [
      { key: "starter", label: "Starter", band: [15000, 20000], blurb: "12 posts/mo, 1 platform" },
      { key: "growth", label: "Growth", band: [25000, 40000], blurb: "20 posts/mo, 2 platforms" },
    ],
    features: [
      { key: "reels", label: "Reels / video editing", band: [5000, 10000], recurring: true },
      { key: "ads", label: "Paid ad management", band: [5000, 12000], recurring: true },
      { key: "extra-platform", label: "Extra platform", band: [4000, 8000], recurring: true },
      { key: "influencer", label: "Influencer outreach", band: [8000, 20000], recurring: true },
    ],
  },
  seo: {
    scales: [
      { key: "local", label: "Local SEO", band: [15000, 25000], blurb: "Google Business + local keywords" },
      { key: "growth", label: "Growth SEO", band: [30000, 50000], blurb: "Full technical + content SEO" },
    ],
    features: [
      { key: "content", label: "4 blog articles / month", band: [8000, 15000], recurring: true },
      { key: "linkbuilding", label: "Link building", band: [10000, 25000], recurring: true },
      { key: "multicity", label: "Multi-city targeting", band: [8000, 15000], recurring: true },
    ],
  },
  "video-production": {
    scales: [
      { key: "short", label: "Short video", band: [10000, 20000], blurb: "Reel / ad, up to 60s" },
      { key: "brand", label: "Brand film", band: [25000, 50000], blurb: "2–5 min, full crew" },
    ],
    features: [
      { key: "script", label: "Scriptwriting", band: [5000, 12000] },
      { key: "drone", label: "Drone footage", band: [8000, 15000] },
      { key: "motion-gfx", label: "Motion graphics", band: [8000, 20000] },
      { key: "voiceover", label: "Professional voiceover", band: [5000, 10000] },
    ],
  },
};

/** Timeline multipliers — standard ×1, fast ×1.25, urgent ×1.5. */
export const timelineMultipliers: Record<Timeline, number> = {
  standard: 1,
  fast: 1.25,
  urgent: 1.5,
};

export const timelineLabels: Record<Timeline, string> = {
  standard: "Standard (relaxed pace)",
  fast: "Fast (priority scheduling)",
  urgent: "Urgent (rush)",
};

function roundToK(n: number): number {
  return Math.round(n / 1000) * 1000;
}

/**
 * Compute the estimate range for a configuration.
 * ALWAYS returns a range [min, max] — never a single price (FR-Q04).
 * Pure function: identical results on client and server.
 */
export function computeEstimate(
  service: QuotableService,
  scaleKey: string,
  featureKeys: string[],
  timeline: Timeline
): { min: number; max: number } {
  const svc = pricing[service];
  const scale = svc.scales.find((s) => s.key === scaleKey) ?? svc.scales[0];
  let min = scale.band[0];
  let max = scale.band[1];

  for (const key of featureKeys) {
    const feat = svc.features.find((f) => f.key === key);
    if (!feat) continue; // unknown keys are ignored, not trusted
    min += feat.band[0];
    max += feat.band[1];
  }

  const mult = timelineMultipliers[timeline] ?? 1;
  min = roundToK(min * mult);
  max = roundToK(max * mult);

  return { min, max };
}

/** Format a range for display, e.g. "₹55,000 – ₹95,000". */
export function formatRange(min: number, max: number): string {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
