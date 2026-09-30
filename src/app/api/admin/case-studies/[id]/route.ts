import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { caseStudySchema } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

function dbDown() {
  return Response.json({ error: "Database not configured" }, { status: 503 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();
  const row = await db.caseStudy.findUnique({ where: { id: params.id } });
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = caseStudySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const current = await db.caseStudy.findUnique({ where: { id: params.id } });
  if (!current) return Response.json({ error: "Not found" }, { status: 404 });

  if (parsed.data.slug !== current.slug) {
    const clash = await db.caseStudy.findUnique({ where: { slug: parsed.data.slug } });
    if (clash) return Response.json({ error: "Slug already in use" }, { status: 409 });
  }

  const { content, ...rest } = parsed.data;
  const updated = await db.caseStudy.update({
    where: { id: params.id },
    data: {
      ...rest,
      // Prisma Json fields reject bare `null` — use JsonNull instead.
      content: (content ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      // Stamp publishedAt the first time a study goes live.
      publishedAt:
        parsed.data.status === "PUBLISHED" && !current.publishedAt
          ? new Date()
          : current.publishedAt,
    },
  });
  return Response.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();
  try {
    await db.caseStudy.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
