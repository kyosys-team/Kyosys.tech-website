# Deploy Guide — Kyosys Website

Vercel/Neon/Resend need **your** accounts, so this part is click-by-you.
Budget ~20 minutes. Do it once; every push after that auto-deploys.

## 0. What you'll create (all have free tiers)

| Service | For | Where |
|---|---|---|
| GitHub repo | Code | github.com → New repository `kyosys-web` |
| Neon | PostgreSQL database | neon.tech |
| Resend | Contact/quote emails | resend.com |
| Vercel | Hosting | vercel.com |

---

## 1. Push the code to GitHub

```bash
cd kyosys-web
git remote add origin https://github.com/<your-username>/kyosys-web.git
git push -u origin main
git push -u origin dev
```

## 2. Neon — database

1. Sign up at **neon.tech** → **Create project** (region: closest to India, e.g. Singapore).
2. Copy the **connection string** (it looks like `postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/kyosys?sslmode=require`).
3. On your machine, with the connection string in `.env.local` as `DATABASE_URL`:
   ```bash
   npx prisma migrate deploy   # applies prisma/migrations/20260928_sprint2_init (all 7 tables)
   npx prisma db seed           # admin user + categories (+ explicitly-marked SAMPLE testimonials)
   ```
   The seed reads `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` from `.env.local` — set them first
   (see `.env.example`). **The seed never handles a raw password:** generate the
   bcrypt hash locally first (cost 12):
   ```bash
   node -e "require('bcryptjs').hash('YOUR_STRONG_PASSWORD', 12).then(console.log)"
   ```
   **Never commit real values.** `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` are seed-only —
   they are **not** Vercel env vars.

### Changing the admin password later

Don't re-seed. Log in at `/admin/login` → **Change Password** in the sidebar:
verifies the current password, requires ≥10 chars with letters + numbers,
re-hashes with bcrypt(12), then forces a re-login on all sessions.

## 3. Resend — email

1. Sign up at **resend.com** → **API Keys** → create one → copy it (`re_...`).
2. For production, verify your domain under **Domains** (add the DNS records they show).
   Until then, emails can only go to your own signup address.

## 4. Vercel Blob — image uploads

1. In the Vercel dashboard → **Storage** → **Create** → **Blob**.
2. Copy the `BLOB_READ_WRITE_TOKEN`.

## 5. Vercel — hosting

1. Sign up at **vercel.com** (use the **same GitHub account**).
2. **Add New → Project** → import `kyosys-web`.
3. Framework preset: **Next.js** (auto-detected). No build-setting changes needed.
4. **Environment Variables** — add each of these (Production + Preview):
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Neon connection string (from step 2) |
   | `AUTH_SECRET` | Run `npx auth secret` locally and paste the output |
   | `RESEND_API_KEY` | From step 3 |
   | `TEAM_EMAIL` | Where lead notifications go, e.g. `hello@kyosys.com` |
   | `BLOB_READ_WRITE_TOKEN` | From step 4 |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` (after DNS, step 6) |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |
   | `NEXT_PUBLIC_CONTACT_PHONE` | Public phone, e.g. `+91 98765 43210` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, digits only, e.g. `919876543210` |
   | `NEXT_PUBLIC_SOCIAL_LINKEDIN` | (optional) real LinkedIn URL, or empty to omit |
   | `NEXT_PUBLIC_SOCIAL_X` | (optional) real X URL, or empty to omit |
   | `NEXT_PUBLIC_SOCIAL_INSTAGRAM` | (optional) real Instagram URL, or empty to omit |
   | `NEXT_PUBLIC_SOCIAL_YOUTUBE` | (optional) real YouTube URL, or empty to omit |
5. **Deploy.** Every PR now gets a preview URL automatically; pushes to `main` deploy to production.

> `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` are **not** Vercel env vars — they're only
> needed locally when running the seed (step 2).

## 5b. Before launch — placeholders you must fill (US-050)

The site builds and runs with placeholder values, but these must be real before
going live:

- **Contact details:** `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (defaults are obviously fake `98765 43210` numbers).
- **Domain:** `NEXT_PUBLIC_SITE_URL` (drives canonical URLs, sitemap, OG tags).
- **Quote estimator pricing:** `src/config/pricing.ts` — every band is marked `PLACEHOLDER`; confirm real numbers with the team.
- **About page:** two co-founder profiles are visibly marked "profile coming soon" — replace with real names/bios.
- **Legal pages** (`/privacy`, `/terms`): replace `[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]`, `[GRIEVANCE EMAIL]`, `[GRIEVANCE PHONE]`, `[STATE / CITY]` and have a qualified lawyer review the Client Service Agreement template (`files/legal/Client-Service-Agreement-TEMPLATE.md` in the goal folder — not legal advice).
- **Testimonials / case studies:** the homepage testimonial section stays hidden until you approve a genuine (non-sample) testimonial in `/admin/testimonials`; `/work` shows an honest empty state until you publish a real case study. Never mark sample content as approved.

## 6. Domain (US-054, Sprint 2)

1. Buy your domain (e.g. `kyosys.in`) at any registrar.
2. Vercel project → **Settings → Domains** → add it → follow the DNS instructions.
3. Update `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy.

## 7. Post-deploy smoke test

- [ ] Home loads on the custom domain with HTTPS
- [ ] `/services` + one `/services/[slug]` page render
- [ ] `/about` renders
- [ ] `/blog` renders (honest empty state until first post); publish a test post via `/admin/posts` and confirm it appears
- [ ] `/contact` — submit without the consent checkbox → inline error; check it → submits, lead appears in `/admin/leads` with "Privacy consent: Given"
- [ ] `/quote` — complete the 3-step wizard; estimate shows the exact disclaimer "Rough estimate — exact quote after a free 30-min discovery call."
- [ ] `/work` renders (honest empty state until first case study)
- [ ] `/privacy`, `/terms`, `/cookies` render; cookie banner appears on first visit and doesn't cover the WhatsApp button on mobile
- [ ] `/sitemap.xml` includes legal + blog + work URLs; `/robots.txt` disallows `/admin/` and `/api/`
- [ ] `/admin` (logged out) → redirects to `/admin/login`; login works; dashboard shows counts
- [ ] A nonsense URL (e.g. `/nope`) shows the branded 404
- [ ] Security headers present: `curl -sI https://<domain> | grep -i "x-frame-options"`
- [ ] Testimonials: homepage shows NO testimonial section until a genuine testimonial is approved in admin (never approve SAMPLE entries)

---

**Sprint 2 shipped:** `/quote`, `/contact`, `/blog`, `/admin/*` (posts, categories, leads, testimonials, case studies, password change), WhatsApp button, `/work`, legal pages + cookie consent, DPDP consent on lead forms.
Schema changes: run `npx prisma migrate deploy` (Vercel doesn't run migrations automatically).
