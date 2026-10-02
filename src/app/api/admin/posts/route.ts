import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { createPostSchema, postStatuses } from "@/lib/blog-validation";
import { validationErrorResponse } from "@/lib/api-errors";

async function slugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await db.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!existing && existing.id !== excludeId;
}

export async function GET(req: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim().toUpperCase();

  const where: { title?: { contains: string; mode: "insensitive" }; status?: (typeof postStatuses)[number] } = {};
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status === "DRAFT" || status === "PUBLISHED") where.status = status;

  const posts = await db.post.findMany({
    where,
    include: { category: { select: { id: true, name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return Response.json({ posts });
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const data = parsed.data;
  if (await slugTaken(data.slug)) {
    return Response.json(
      { error: "That slug is already in use", fields: { slug: "That slug is already in use — try a variation." } },
      { status: 400 }
    );
  }

  const category = await db.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
  if (!category) {
    return Response.json(
      { error: "Category not found", fields: { categoryId: "Please choose a valid category." } },
      { status: 400 }
    );
  }

  const post = await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: JSON.parse(JSON.stringify(data.content)),
      coverImage: data.coverImage ?? null,
      categoryId: data.categoryId,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      authorName: data.authorName ?? null,
      authorBio: data.authorBio ?? null,
    },
  });
  return Response.json({ post }, { status: 201 });
}
