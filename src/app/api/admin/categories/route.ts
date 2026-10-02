import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/blog-validation";
import { validationErrorResponse } from "@/lib/api-errors";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const categories = await db.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return Response.json({ categories });
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const { name, slug } = parsed.data;
  const taken = await db.category.findFirst({
    where: { OR: [{ name }, { slug }] },
    select: { name: true, slug: true },
  });
  if (taken) {
    const fields: Record<string, string> = {};
    if (taken.name === name) fields.name = "A category with this name already exists.";
    if (taken.slug === slug) fields.slug = "A category with this slug already exists.";
    return Response.json({ error: "Category already exists", fields }, { status: 400 });
  }

  const category = await db.category.create({ data: { name, slug } });
  return Response.json({ category }, { status: 201 });
}
