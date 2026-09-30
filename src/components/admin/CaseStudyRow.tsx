"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CaseStudyRowData {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  status: "DRAFT" | "PUBLISHED";
}

export function CaseStudyActions({ row }: { row: CaseStudyRowData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/case-studies/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Case study deleted");
      router.refresh();
    } catch (err) {
      toast.error("Could not delete", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/case-studies/${row.id}/edit`} aria-label={`Edit ${row.title}`}>
        <Button variant="ghost" size="icon">
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={remove} disabled={busy} aria-label={`Delete ${row.title}`}>
        <Trash2 className="size-4 text-red-600" aria-hidden="true" />
      </Button>
    </div>
  );
}

export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        status === "PUBLISHED"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-600"
      )}
    >
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}
