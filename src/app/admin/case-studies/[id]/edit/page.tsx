import { notFound } from "next/navigation";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { CaseStudyForm, type CaseStudyFormData } from "@/components/admin/CaseStudyForm";
import type { TiptapDoc } from "@/components/admin/CaseStudyEditor";

export const dynamic = "force-dynamic";

function toFormData(row: {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  industry: string | null;
  services: string[];
  excerpt: string;
  content: unknown;
  coverImage: string | null;
  results: unknown;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string | null;
  seoDescription: string | null;
}): CaseStudyFormData {
  const results = Array.isArray(row.results)
    ? (row.results as { metric?: unknown; value?: unknown }[])
        .filter((r) => r && typeof r.metric === "string" && typeof r.value === "string")
        .map((r) => ({ metric: r.metric as string, value: r.value as string }))
    : [];
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    client: row.client ?? "",
    industry: row.industry ?? "",
    services: row.services,
    excerpt: row.excerpt,
    content: (row.content as TiptapDoc | null) ?? null,
    coverImage: row.coverImage ?? "",
    results,
    status: row.status,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}

export default async function EditCaseStudyPage({
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

  const row = await db.caseStudy.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Edit case study</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">Editing “{row.title}”.</p>
      <CaseStudyForm initial={toFormData(row)} />
    </div>
  );
}
