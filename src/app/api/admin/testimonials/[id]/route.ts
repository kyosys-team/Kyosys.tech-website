import { NextRequest } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { testimonialSchema } from "@/lib/admin-validation";
import { validationErrorResponse } from "@/lib/api-errors";

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
  const row = await db.testimonial.findUnique({ where: { id: params.id } });
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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  try {
    const updated = await db.testimonial.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) return dbDown();
  try {
    await db.testimonial.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
