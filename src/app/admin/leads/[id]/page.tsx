import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { requireAdminPage } from "@/lib/require-admin";
import { isDbConfigured } from "@/lib/db";
import {
  getLeadDetail,
  markLeadRead,
  formatDateTime,
  formatINR,
  type LeadType,
} from "@/lib/leads";
import DbNotice from "@/components/admin/DbNotice";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LeadActions from "../LeadActions";

export const dynamic = "force-dynamic";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  await requireAdminPage();
  const type: LeadType = searchParams.type === "quote" ? "quote" : "contact";

  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Lead</h1>
        <div className="mt-6">
          <DbNotice feature="this lead" />
        </div>
      </div>
    );
  }

  const lead = await getLeadDetail(params.id, type);
  if (!lead) notFound();

  // Opening a NEW lead marks it READ — before render, so the badge is fresh.
  if (lead.status === "NEW") {
    await markLeadRead(params.id, type);
    lead.status = "READ";
  }

  const isQuote = type === "quote";
  // getLeadDetail returns ContactSubmission | QuoteRequest; narrow by the
  // requested type (the `type` query param selected which table we read).
  const contact = !isQuote ? (lead as unknown as {
    company: string | null; budget: string; message: string; consent: boolean;
  }) : null;
  const quote = isQuote ? (lead as unknown as {
    estimateMin: number; estimateMax: number; scale: string; timeline: string; features: unknown; consent: boolean;
  }) : null;
  const consent = isQuote ? quote?.consent : contact?.consent;

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight">
            {lead.name}
            <LeadStatusBadge status={lead.status} />
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isQuote ? "Quote request" : "Contact submission"} · received {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <LeadActions id={lead.id} type={type} status={lead.status} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Email">
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900">
              <Mail className="size-4" aria-hidden="true" /> {lead.email}
            </a>
          </Field>
          <Field label="Phone">
            {lead.phone ? (
              <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900">
                <Phone className="size-4" aria-hidden="true" /> {lead.phone}
              </a>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </Field>
          <Field label="Service">{lead.service}</Field>
          <Field label="Privacy consent">
            {consent ? (
              <span className="font-medium text-emerald-700">Given — privacy policy accepted</span>
            ) : (
              <span className="font-medium text-amber-700">Not recorded (pre-consent form)</span>
            )}
          </Field>
          {quote ? (
            <>
              <Field label="Estimate">
                {formatINR(quote.estimateMin)} – {formatINR(quote.estimateMax)}
              </Field>
              <Field label="Scale">{quote.scale}</Field>
              <Field label="Timeline">{quote.timeline}</Field>
              <div className="sm:col-span-2">
                <Field label="Requested features">
                  {Array.isArray(quote.features) && quote.features.length > 0 ? (
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {(quote.features as string[]).map((f) => (
                        <li key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </Field>
              </div>
            </>
          ) : (
            <>
              <Field label="Company">{contact?.company || <span className="text-slate-400">—</span>}</Field>
              <Field label="Budget">{contact?.budget}</Field>
              <div className="sm:col-span-2">
                <Field label="Message">
                  <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">
                    {contact?.message}
                  </p>
                </Field>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
