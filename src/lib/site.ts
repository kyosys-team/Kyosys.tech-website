/**
 * Central site configuration.
 * Placeholder contact details — the team replaces these with real values in US-050.
 * Nothing secret here: all values are public by design.
 */
export const siteConfig = {
  name: "Kyosys",
  tagline: "We build websites & apps that bring you customers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kyosys.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@kyosys.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 98765 43210",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
  whatsappMessage: "Hi Kyosys! I want to discuss a project.",
  socials: {
    // Override with real profile URLs via env; set to "" to drop from JSON-LD.
    linkedin:
      process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ??
      "https://linkedin.com/company/kyosys",
    x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "https://x.com/kyosys",
    instagram:
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ??
      "https://instagram.com/kyosys",
    youtube:
      process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "https://youtube.com/@kyosys",
  },
} as const;

export function whatsappUrl(): string {
  const text = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
