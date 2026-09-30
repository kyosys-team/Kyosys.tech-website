import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { quoteSchema, zodFieldErrors, serviceNames } from "@/lib/validations";
import { sendTeamEmail, esc } from "@/lib/email";
import {
  computeEstimate,
  formatRange,
  pricing,
  timelineLabels,
  type QuotableService,
} from "@/config/pricing";

/**
 * POST /api/quote — public quote estimator (SRS US-032).
 *
 * 1. zod-validate the body (includes required DPDP consent checkbox)
 * 2. rate limit: 5 requests / 10 min / IP → 429
 * 3. re-validate scale + feature keys against the server pricing config
 *    (client preview is advisory; this is the source of truth)
 * 4. computeEstimate server-side → save QuoteRequest (status NEW, consent=true)
 * 5. best-effort team email → 201 { estimateMin, estimateMax }
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

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fields: zodFieldErrors(parsed.error) },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const ip = clientIp(req);
  if (!rateLimit(`quote:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // Fail closed: scale/feature keys must exist in the server pricing config.
  const service = data.service as QuotableService;
  const svc = pricing[service];
  const scaleOk = svc.scales.some((s) => s.key === data.scale);
  if (!scaleOk) {
    return NextResponse.json(
      { error: "Invalid request.", fields: { scale: "Pick a valid project size." } },
      { status: 400 }
    );
  }
  const validFeatures = data.features.filter((f) =>
    svc.features.some((feat) => feat.key === f)
  );

  const { min: estimateMin, max: estimateMax } = computeEstimate(
    service,
    data.scale,
    validFeatures,
    data.timeline
  );

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "Our quote form is temporarily unavailable. Please email us directly or use WhatsApp.",
      },
      { status: 503 }
    );
  }

  try {
    await db.quoteRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        service: data.service,
        features: validFeatures,
        scale: data.scale,
        timeline: data.timeline,
        estimateMin,
        estimateMax,
        status: "NEW",
        consent: true, // enforced by schema above — recorded for DPDP
      },
    });
  } catch (err) {
    console.error("[api/quote] DB write failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please try again." },
      { status: 500 }
    );
  }

  const scaleLabel =
    svc.scales.find((s) => s.key === data.scale)?.label ?? data.scale;
  const featureLabels = validFeatures
    .map((f) => svc.features.find((feat) => feat.key === f)?.label ?? f)
    .join(", ");

  // Best-effort — never throws, never blocks the 201.
  await sendTeamEmail(
    `New quote request: ${data.name} — ${serviceNames[service]} (${formatRange(estimateMin, estimateMax)})`,
    `
      <h2>New quote request</h2>
      <p><strong>Estimate:</strong> ${esc(formatRange(estimateMin, estimateMax))}</p>
      <p><strong>Name:</strong> ${esc(data.name)}</p>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${esc(data.phone)}</p>` : ""}
      <p><strong>Service:</strong> ${esc(serviceNames[service])}</p>
      <p><strong>Size:</strong> ${esc(scaleLabel)}</p>
      ${featureLabels ? `<p><strong>Features:</strong> ${esc(featureLabels)}</p>` : ""}
      <p><strong>Timeline:</strong> ${esc(timelineLabels[data.timeline])}</p>
    `
  );

  return NextResponse.json({ ok: true, estimateMin, estimateMax }, { status: 201 });
}
