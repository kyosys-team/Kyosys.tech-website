import Link from "next/link";
import { Inbox, Newspaper, MessageSquareQuote, Briefcase, KeyRound, ArrowRight } from "lucide-react";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { getLeads, formatDateTime, type LeadRow } from "@/lib/leads";
import DbNotice from "@/components/admin/DbNotice";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";

export const dynamic = "force-dynamic";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
        View <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function LeadRowItem({ lead }: { lead: LeadRow }) {
  return (
    <Link
      href={`/admin/leads/${lead.id}?type=${lead.type}`}
      className="flex items-center gap-4 border-b border-slate-100 px-1 py-3 last:border-0 hover:bg-slate-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {lead.name}
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {lead.type === "contact" ? "Contact" : "Quote"}
          </span>
        </p>
        <p className="truncate text-xs text-slate-500">{lead.service} · {lead.email}</p>
      </div>
      <LeadStatusBadge status={lead.status} />
      <span className="hidden text-xs text-slate-400 sm:block">{formatDateTime(lead.createdAt)}</span>
    </Link>
  );
}

const quickLinks = [
  { href: "/admin/leads", label: "Leads inbox", desc: "Contact + quote requests", icon: Inbox },
  { href: "/admin/posts", label: "Posts", desc: "Blog posts", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Social proof", icon: MessageSquareQuote },
  { href: "/admin/case-studies", label: "Case Studies", desc: "Work portfolio", icon: Briefcase },
  { href: "/admin/password", label: "Change Password", desc: "Rotate the admin password", icon: KeyRound },
];

export default async function AdminDashboard() {
  await requireAdminPage();

  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <div className="mt-6">
          <DbNotice feature="the dashboard" />
        </div>
      </div>
    );
  }

  const [newContacts, newQuotes, publishedPosts, testimonials, latestLeads] = await Promise.all([
    db.contactSubmission.count({ where: { status: "NEW" } }),
    db.quoteRequest.count({ where: { status: "NEW" } }),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.testimonial.count(),
    getLeads({ limit: 5 }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        New leads, content status, and quick links for the Kyosys site.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New contact leads" value={newContacts} href="/admin/leads?type=contact&status=NEW" />
        <StatCard label="New quote leads" value={newQuotes} href="/admin/leads?type=quote&status=NEW" />
        <StatCard label="Published posts" value={publishedPosts} href="/admin/posts" />
        <StatCard label="Testimonials" value={testimonials} href="/admin/testimonials" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Latest leads</h2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900">
              All leads <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {latestLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No leads yet.</p>
          ) : (
            <div>{latestLeads.map((lead) => <LeadRowItem key={`${lead.type}:${lead.id}`} lead={lead} />)}</div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold tracking-tight">Quick links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="group rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm"
              >
                <q.icon className="size-5 text-slate-700" aria-hidden="true" />
                <p className="mt-2 text-sm font-bold">{q.label}</p>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
