import { db, isDbConfigured } from "@/lib/db";
import type { LeadStatus } from "@prisma/client";

export type LeadType = "contact" | "quote";

export interface LeadRow {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  summary: string;
  status: LeadStatus;
  createdAt: Date;
}

/** Single source of truth for lead statuses/types — used by UI pickers AND the
 * API's zod enums, so adding a status only ever means editing one array. */
export const LEAD_TYPES = ["contact", "quote"] as const;
export const LEAD_STATUSES = ["NEW", "READ", "REPLIED", "CLOSED"] as const;

export function parseLeadType(v: unknown): LeadType | "all" {
  return (LEAD_TYPES as readonly string[]).includes(v as string)
    ? (v as LeadType)
    : "all";
}

export function parseLeadStatus(v: unknown): LeadStatus | "all" {
  return (LEAD_STATUSES as readonly string[]).includes(v as string)
    ? (v as LeadStatus)
    : "all";
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDateTime(d: Date): string {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function quoteSummary(q: {
  estimateMin: number;
  estimateMax: number;
  timeline: string;
}): string {
  return `Estimate ${formatINR(q.estimateMin)}–${formatINR(q.estimateMax)} · ${q.timeline}`;
}

/**
 * Unified leads inbox: contact submissions + quote requests, newest first.
 * Returns [] when the DB is not configured (callers render DbNotice).
 */
export async function getLeads(opts: {
  type?: LeadType | "all";
  status?: LeadStatus | "all";
  limit?: number;
}): Promise<LeadRow[]> {
  if (!isDbConfigured()) return [];
  const type = opts.type ?? "all";
  const status = opts.status ?? "all";
  const where = status === "all" ? {} : { status };
  const take = opts.limit;

  const [contacts, quotes] = await Promise.all([
    type === "quote"
      ? []
      : db.contactSubmission.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...(take ? { take } : {}),
        }),
    type === "contact"
      ? []
      : db.quoteRequest.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...(take ? { take } : {}),
        }),
  ]);

  const rows: LeadRow[] = [
    ...contacts.map((c) => ({
      id: c.id,
      type: "contact" as const,
      name: c.name,
      email: c.email,
      phone: c.phone,
      service: c.service,
      summary: c.message,
      status: c.status,
      createdAt: c.createdAt,
    })),
    ...quotes.map((q) => ({
      id: q.id,
      type: "quote" as const,
      name: q.name,
      email: q.email,
      phone: q.phone,
      service: q.service,
      summary: quoteSummary(q),
      status: q.status,
      createdAt: q.createdAt,
    })),
  ];
  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return take ? rows.slice(0, take) : rows;
}

export async function getLead(id: string, type: LeadType): Promise<LeadRow | null> {
  if (!isDbConfigured()) return null;
  if (type === "contact") {
    const c = await db.contactSubmission.findUnique({ where: { id } });
    if (!c) return null;
    return {
      id: c.id, type, name: c.name, email: c.email, phone: c.phone,
      service: c.service, summary: c.message, status: c.status, createdAt: c.createdAt,
    };
  }
  const q = await db.quoteRequest.findUnique({ where: { id } });
  if (!q) return null;
  return {
    id: q.id, type, name: q.name, email: q.email, phone: q.phone,
    service: q.service, summary: quoteSummary(q), status: q.status, createdAt: q.createdAt,
  };
}

/** Full records for the detail view (extra fields beyond the list row). */
export async function getLeadDetail(id: string, type: LeadType) {
  if (!isDbConfigured()) return null;
  if (type === "contact") {
    return db.contactSubmission.findUnique({ where: { id } });
  }
  return db.quoteRequest.findUnique({ where: { id } });
}

/** Mark a NEW lead READ. Idempotent — only transitions NEW → READ. */
export async function markLeadRead(id: string, type: LeadType): Promise<void> {
  if (!isDbConfigured()) return;
  const where = { id, status: "NEW" as LeadStatus };
  if (type === "contact") {
    await db.contactSubmission.updateMany({ where, data: { status: "READ" } });
  } else {
    await db.quoteRequest.updateMany({ where, data: { status: "READ" } });
  }
}
