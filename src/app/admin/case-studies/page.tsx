import Link from "next/link";
import { Plus } from "lucide-react";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { Button } from "@/components/ui/button";
import { CaseStudyActions, StatusBadge } from "@/components/admin/CaseStudyRow";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  await requireAdminPage();

  if (!isDbConfigured()) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-extrabold">Case Studies</h1>
        <p className="mt-2 text-sm text-slate-500">Database not configured.</p>
      </div>
    );
  }

  const rows = await db.caseStudy.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Case Studies</h1>
          <p className="mt-1 text-sm text-slate-500">
            Only <strong>published</strong> studies appear on /work. Real client names
            and real numbers only — there is no seed data.
          </p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button>
            <Plus className="size-4" aria-hidden="true" /> New case study
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-slate-700">No case studies yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Publish your first real client story here — /work shows an honest empty
            state until then.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <p className="font-mono text-xs text-slate-400">/work/{r.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.client ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <CaseStudyActions row={r} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
