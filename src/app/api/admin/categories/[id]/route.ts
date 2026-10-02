import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { updateCategorySchema } from "@/lib/blog-validation";
import { validationErrorResponse } from "@/lib/api-errors";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const existing = await db.category.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const { name, slug } = parsed.data;
  if (name || slug) {
    const taken = await db.category.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          { OR: [...(name ? [{ name }] : []), ...(slug ? [{ slug }] : [])] },
        ],
      },
      select: { name: true, slug: true },
    });
    if (taken) {
      const fields: Record<string, string> = {};
      if (name && taken.name === name) fields.name = "A category with this name already exists.";
      if (slug && taken.slug === slug) fields.slug = "A category with this slug already exists.";
      return Response.json({ error: "Category already exists", fields }, { status: 400 });
    }
  }

  const category = await db.category.update({
    where: { id: params.id },
    data: { ...(name !== undefined ? { name } : {}), ...(slug !== undefined ? { slug } : {}) },
  });
  return Response.json({ category });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const existing = await db.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { posts: true } } },
  });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  if (existing._count.posts > 0) {
    return Response.json(
      {
        error: `Cannot delete — ${existing._count.posts} post${existing._count.posts === 1 ? "" : "s"} still use${existing._count.posts === 1 ? "s" : ""} this category. Move or delete them first.`,
      },
      { status: 400 }
    );
  }

  await db.category.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
