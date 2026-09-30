import type { LeadStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const styles: Record<LeadStatus, string> = {
  NEW: "bg-amber-100 text-amber-800",
  READ: "bg-slate-100 text-slate-700",
  REPLIED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-200 text-slate-500",
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
