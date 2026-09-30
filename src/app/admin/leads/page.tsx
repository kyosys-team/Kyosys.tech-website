import Link from "next/link";
import { requireAdminPage } from "@/lib/require-admin";
import { isDbConfigured } from "@/lib/db";
import {
  getLeads,
  parseLeadType,
  parseLeadStatus,
  formatDateTime,
  LEAD_STATUSES,
  type LeadRow,
} from "@/lib/leads";
import DbNotice from "@/components/admin/DbNotice";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function filterHref(current: { type: string; status: string }, key: "type" | "status", value: string) {
  const params = new URLSearchParams();
  params.set("type", key === "type" ? value : current.type);
  params.set("status", key === "status" ? value : current.status);
  return `/admin/leads?${params.toString()}`;
}

function FilterPills({
  label,
  options,
  active,
  current,
  filterKey,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  current: { type: string; status: string };
  filterKey: "type" | "status";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {options.map((o) => (
        <Link
          key={o.value}
          href={filterHref(current, filterKey, o.value)}
          aria-current={active === o.value ? "true" : undefined}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            active === o.value
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          )}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string };
}) {
  await requireAdminPage();

  const type = parseLeadType(searchParams.type);
  const status = parseLeadStatus(searchParams.status);
  const current = { type, status };

  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Leads</h1>
        <div className="mt-6">
          <DbNotice feature="the leads inbox" />
        </div>
      </div>
    );
  }

  const leads: LeadRow[] = await getLeads({ type, status });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Leads</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contact submissions and quote requests, newest first. Opening a new lead marks it as read.
      </p>

      <div className="mt-5 space-y-3">
        <FilterPills
          label="Type"
          filterKey="type"
          active={type}
          current={current}
          options={[
            { value: "all", label: "All" },
            { value: "contact", label: "Contact" },
            { value: "quote", label: "Quote" },
          ]}
        />
        <FilterPills
          label="Status"
          filterKey="status"
          active={status}
          current={current}
          options={[
            { value: "all", label: "All" },
            ...LEAD_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() })),
          ]}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {leads.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            No leads match these filters.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <li key={`${lead.type}:${lead.id}`}>
                <Link
                  href={`/admin/leads/${lead.id}?type=${lead.type}`}
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                      {lead.name}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {lead.type === "contact" ? "Contact" : "Quote"}
                      </span>
                      {lead.status === "NEW" && (
                        <span className="size-2 rounded-full bg-amber-400" aria-label="New" />
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {lead.service} · {lead.email}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{lead.summary}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <LeadStatusBadge status={lead.status} />
                    <span className="text-xs text-slate-400">{formatDateTime(lead.createdAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
