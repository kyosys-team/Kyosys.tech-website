import { z } from "zod";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { LEAD_STATUSES, LEAD_TYPES } from "@/lib/leads";

const patchSchema = z.object({
  type: z.enum(LEAD_TYPES),
  status: z.enum(LEAD_STATUSES),
});

/** PATCH /api/admin/leads/:id — { type, status } → updates the lead status. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: `Status must be one of: ${LEAD_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const { type, status } = parsed.data;
  try {
    const lead =
      type === "contact"
        ? await db.contactSubmission.update({ where: { id: params.id }, data: { status } })
        : await db.quoteRequest.update({ where: { id: params.id }, data: { status } });
    return Response.json({ lead });
  } catch {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }
}

/** DELETE /api/admin/leads/:id?type=contact|quote */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const type = new URL(req.url).searchParams.get("type");
  if (type !== "contact" && type !== "quote") {
    return Response.json({ error: "Query param ?type=contact|quote is required" }, { status: 400 });
  }

  try {
    if (type === "contact") {
      await db.contactSubmission.delete({ where: { id: params.id } });
    } else {
      await db.quoteRequest.delete({ where: { id: params.id } });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }
}
