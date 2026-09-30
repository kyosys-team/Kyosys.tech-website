/**
 * Seed script — run with:  npx prisma db seed
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD_HASH from the environment (never committed).
 * The seed NEVER handles a raw password: generate the hash locally first, e.g.
 *   node -e "require('bcryptjs').hash('YOUR_STRONG_PASSWORD', 12).then(console.log)"
 * Idempotent: safe to re-run.
 */
import { config as loadEnv } from "dotenv";

// tsx doesn't auto-load .env.local (only the Next.js runtime does), so load
// it here for `prisma db seed`.
loadEnv({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CATEGORIES = [
  { name: "Web Development", slug: "web-development" },
  { name: "App Development", slug: "app-development" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "SEO", slug: "seo" },
  { name: "Startup Growth", slug: "startup-growth" },
];

// HONESTY RULE: every seeded testimonial is sample=true — placeholders only.
// They NEVER appear on public pages. Set approved=true + sample=false only
// for genuine client testimonials collected by the team.
const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Founder",
    company: "Sharma Textiles, Surat",
    quote:
      "Kyosys rebuilt our outdated website in three weeks. Enquiries through the site doubled within two months. Clear communication from day one — no jargon, no surprises.",
    rating: 5,
    featured: true,
    sample: true,
    approved: false,
  },
  {
    name: "Priya Nair",
    role: "Owner",
    company: "Bloom Cafe, Kochi",
    quote:
      "They didn't just build us a website, they set up our Instagram and Google presence too. Online orders are now 40% of our business. Worth every rupee.",
    rating: 5,
    featured: true,
    sample: true,
    approved: false,
  },
  {
    name: "Amit Verma",
    role: "Co-founder",
    company: "FitTrack (startup)",
    quote:
      "We needed an MVP app fast and on a startup budget. Kyosys shipped our Android and iOS app in six weeks and stayed in touch after launch. Rare to find this reliability.",
    rating: 5,
    featured: true,
    sample: true,
    approved: false,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    throw new Error(
      "Seed aborted: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH env vars first (see .env.example). " +
        'Generate the hash with: node -e "require(\'bcryptjs\').hash(\'YOUR_PASSWORD\', 12).then(console.log)"'
    );
  }

  // Single shared admin login (PRD §9.5). Hash is passed in pre-computed —
  // the seed never sees a raw password.
  await db.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: { email: adminEmail, passwordHash: adminPasswordHash },
  });
  console.log(`✓ Admin upserted: ${adminEmail}`);

  for (const c of CATEGORIES) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }
  console.log(`✓ ${CATEGORIES.length} categories upserted`);

  for (const t of TESTIMONIALS) {
    const existing = await db.testimonial.findFirst({
      where: { name: t.name, company: t.company },
    });
    if (!existing) await db.testimonial.create({ data: t });
  }
  console.log(`✓ Testimonials seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
