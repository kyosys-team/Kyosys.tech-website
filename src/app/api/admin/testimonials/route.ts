import { NextRequest } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { testimonialSchema } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

function dbDown() {
  return Response.json({ error: "Database not configured" }, { status: 503 });
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();
  const rows = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const created = await db.testimonial.create({
    data: { ...parsed.data, sample: false },
  });
  return Response.json(created, { status: 201 });
}
