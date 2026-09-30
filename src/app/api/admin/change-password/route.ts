import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(10, "New password must be at least 10 characters")
    .refine((v) => /[A-Za-z]/.test(v) && /[0-9]/.test(v), {
      message: "New password must include both letters and numbers",
    }),
});

/**
 * POST /api/admin/change-password — rotate the shared admin password.
 * Verifies the current password, hashes the new one (bcrypt cost 12), and
 * updates the Admin row. The client forces a re-login afterwards.
 */
export async function POST(req: Request) {
  const { user, error } = await requireAdminApi();
  if (error) return error;
  if (!isDbConfigured()) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }
  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid password" },
      { status: 400 }
    );
  }

  const admin = await db.admin.findUnique({ where: { email: user.email } });
  if (!admin) {
    return Response.json({ error: "Admin account not found" }, { status: 404 });
  }

  const ok = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!ok) {
    return Response.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return Response.json({ ok: true });
}
