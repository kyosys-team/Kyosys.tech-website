import { notFound } from "next/navigation";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdminPage();

  if (!isDbConfigured()) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">Database not configured.</p>
      </div>
    );
  }

  const row = await db.testimonial.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Edit testimonial</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">Editing testimonial from {row.name}.</p>
      <TestimonialForm
        initial={{
          id: row.id,
          name: row.name,
          role: row.role,
          company: row.company ?? "",
          quote: row.quote,
          rating: row.rating,
          avatarUrl: row.avatarUrl ?? "",
          featured: row.featured,
          approved: row.approved,
          sample: row.sample,
        }}
      />
    </div>
  );
}
