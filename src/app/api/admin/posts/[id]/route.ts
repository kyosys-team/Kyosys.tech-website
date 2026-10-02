import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { updatePostSchema } from "@/lib/blog-validation";
import { validationErrorResponse } from "@/lib/api-errors";

async function slugTaken(slug: string, excludeId: string): Promise<boolean> {
  const existing = await db.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!existing && existing.id !== excludeId;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const post = await db.post.findUnique({
    where: { id: params.id },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!post) return Response.json({ error: "Post not found" }, { status: 404 });
  return Response.json({ post });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const existing = await db.post.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Post not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const data = parsed.data;
  if (data.slug && (await slugTaken(data.slug, params.id))) {
    return Response.json(
      { error: "That slug is already in use", fields: { slug: "That slug is already in use — try a variation." } },
      { status: 400 }
    );
  }
  if (data.categoryId) {
    const category = await db.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });
    if (!category) {
      return Response.json(
        { error: "Category not found", fields: { categoryId: "Please choose a valid category." } },
        { status: 400 }
      );
    }
  }

  // Publishing sets publishedAt; unpublishing clears it.
  const nextStatus = data.status ?? existing.status;
  const publishedAt =
    nextStatus === "PUBLISHED"
      ? (existing.publishedAt ?? new Date())
      : null;

  const post = await db.post.update({
    where: { id: params.id },
    data: {
      ...data,
      content:
        data.content === undefined
          ? undefined
          : JSON.parse(JSON.stringify(data.content)),
      coverImage: data.coverImage === undefined ? undefined : data.coverImage,
      seoTitle: data.seoTitle === undefined ? undefined : data.seoTitle,
      seoDescription: data.seoDescription === undefined ? undefined : data.seoDescription,
      authorName: data.authorName === undefined ? undefined : data.authorName,
      authorBio: data.authorBio === undefined ? undefined : data.authorBio,
      publishedAt,
    },
  });
  return Response.json({ post });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbConfigured())
    return Response.json({ error: "Database not configured" }, { status: 503 });

  const existing = await db.post.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return Response.json({ error: "Post not found" }, { status: 404 });

  await db.post.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
