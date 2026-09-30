import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { caseStudySchema } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

function dbDown() {
  return Response.json({ error: "Database not configured" }, { status: 503 });
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();
  const rows = await db.caseStudy.findMany({ orderBy: { updatedAt: "desc" } });
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
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

  const existing = await db.caseStudy.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return Response.json({ error: "Slug already in use" }, { status: 409 });
  }

  const { content, ...rest } = parsed.data;
  const created = await db.caseStudy.create({
    data: {
      ...rest,
      // Prisma Json fields reject bare `null` — use JsonNull instead.
      content: (content ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  return Response.json(created, { status: 201 });
}
