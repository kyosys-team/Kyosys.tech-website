"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TestimonialRowData {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number;
  avatarUrl: string | null;
  featured: boolean;
  approved: boolean;
  sample: boolean;
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-emerald-700" : "bg-slate-300",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

export function TestimonialRow({ row }: { row: TestimonialRowData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(patchData: Partial<Pick<TestimonialRowData, "featured" | "approved">>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          role: row.role,
          company: row.company,
          quote: row.quote,
          rating: row.rating,
          avatarUrl: row.avatarUrl,
          featured: row.featured,
          approved: row.approved,
          ...patchData,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Update failed");
      toast.success("Saved");
      router.refresh();
    } catch (err) {
      toast.error("Could not save", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete the testimonial from ${row.name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Testimonial deleted");
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
    <tr className="border-t border-slate-200 bg-white">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">
          {row.role}
          {row.company ? ` · ${row.company}` : ""}
        </p>
        {row.sample && (
          <span className="mt-1.5 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">
            Sample — replace before launch
          </span>
        )}
      </td>
      <td className="px-4 py-3" aria-label={`${row.rating} out of 5 stars`}>
        <span className="text-amber-500">{"★".repeat(row.rating)}</span>
        <span className="text-slate-300">{"★".repeat(5 - row.rating)}</span>
      </td>
      <td className="px-4 py-3">
        <Toggle label={`Featured for ${row.name}`} checked={row.featured} disabled={busy} onChange={(v) => patch({ featured: v })} />
      </td>
      <td className="px-4 py-3">
        <Toggle label={`Approved for ${row.name}`} checked={row.approved} disabled={busy} onChange={(v) => patch({ approved: v })} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link href={`/admin/testimonials/${row.id}/edit`} aria-label={`Edit ${row.name}`}>
            <Button variant="ghost" size="icon">
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={remove} disabled={busy} aria-label={`Delete ${row.name}`}>
            <Trash2 className="size-4 text-red-600" aria-hidden="true" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
