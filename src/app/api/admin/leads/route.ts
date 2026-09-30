import { isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { getLeads, parseLeadType, parseLeadStatus } from "@/lib/leads";

/** GET /api/admin/leads?type=contact|quote|all&status=NEW|READ|REPLIED|CLOSED|all */
export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const leads = await getLeads({
    type: parseLeadType(searchParams.get("type")),
    status: parseLeadStatus(searchParams.get("status")),
  });
  return Response.json({ leads });
}
