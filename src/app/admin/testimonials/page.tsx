import Link from "next/link";
import { Plus } from "lucide-react";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { Button } from "@/components/ui/button";
import { TestimonialRow } from "@/components/admin/TestimonialRow";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  await requireAdminPage();

  if (!isDbConfigured()) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-extrabold">Testimonials</h1>
        <p className="mt-2 text-sm text-slate-500">Database not configured.</p>
      </div>
    );
  }

  const rows = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            Only <strong>approved</strong> + <strong>featured</strong> non-sample testimonials
            appear on the homepage. Samples never go public.
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="size-4" aria-hidden="true" /> New testimonial
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-slate-700">No testimonials yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first real client testimonial — the homepage hides this section
            until one is approved and featured.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Approved</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TestimonialRow key={r.id} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
