import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { contactSchema, zodFieldErrors, serviceNames } from "@/lib/validations";
import { sendTeamEmail, esc } from "@/lib/email";

/**
 * POST /api/contact — public contact form (SRS US-030).
 *
 * 1. bot trap: `website` filled on the raw body → fake 201, save NOTHING
 * 2. zod-validate the body (includes required DPDP consent checkbox)
 * 3. rate limit: 5 submissions / 10 min / IP → 429
 * 4. save ContactSubmission (status NEW, consent=true); 503 if DB unconfigured
 * 5. best-effort team email → 201
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", fields: {} },
      { status: 400 }
    );
  }

  // Bot trap first — pretend success, store nothing. Checked on the raw
  // body so bots that skip the consent checkbox still get the fake 201.
  const raw = (body ?? {}) as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fields: zodFieldErrors(parsed.error) },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "Our contact form is temporarily unavailable. Please email us directly or use WhatsApp.",
      },
      { status: 503 }
    );
  }

  try {
    await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        service: data.service,
        budget: data.budget,
        message: data.message,
        status: "NEW",
        consent: true, // enforced by schema above — recorded for DPDP
      },
    });
  } catch (err) {
    console.error("[api/contact] DB write failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your message. Please try again." },
      { status: 500 }
    );
  }

  // Best-effort — never throws, never blocks the 201.
  await sendTeamEmail(
    `New contact: ${data.name} — ${serviceNames[data.service] ?? data.service}`,
    `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${esc(data.name)}</p>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${esc(data.phone)}</p>` : ""}
      ${data.company ? `<p><strong>Company:</strong> ${esc(data.company)}</p>` : ""}
      <p><strong>Service:</strong> ${esc(serviceNames[data.service] ?? data.service)}</p>
      <p><strong>Budget:</strong> ${esc(data.budget)}</p>
      <p><strong>Message:</strong></p>
      <p>${esc(data.message).replace(/\n/g, "<br>")}</p>
    `
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
