"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LeadStatus } from "@prisma/client";
import { LEAD_STATUSES, type LeadType } from "@/lib/leads";

/**
 * Status changer + delete for a single lead. Mutations go through the
 * /api/admin/leads API; sonner toasts confirm the outcome.
 */
export default function LeadActions({
  id,
  type,
  status,
}: {
  id: string;
  type: LeadType;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<LeadStatus>(status);
  const [busy, setBusy] = useState(false);

  async function changeStatus(next: LeadStatus) {
    if (next === current || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, status: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCurrent(next);
      toast.success(`Lead marked as ${next.toLowerCase()}`);
      router.refresh();
    } catch {
      toast.error("Could not update status", { description: "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}?type=${type}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Lead deleted");
      router.push("/admin/leads");
      router.refresh();
    } catch {
      toast.error("Could not delete lead", { description: "Please try again." });
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="lead-status" className="sr-only">
        Change lead status
      </label>
      <select
        id="lead-status"
        value={current}
        disabled={busy}
        onChange={(e) => changeStatus(e.target.value as LeadStatus)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-slate-500 disabled:opacity-60"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}
