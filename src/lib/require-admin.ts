import { redirect } from "next/navigation";

/**
 * Fail-closed admin guard. The auth track builds `@/lib/auth` in parallel;
 * until then (or if the session check throws) this returns null and every
 * admin surface redirects to the login page instead of leaking data.
 */
export async function requireAdmin() {
  try {
    const { auth } = await import("@/lib/auth");
    const s = await auth();
    return s?.user ?? null;
  } catch {
    return null;
  }
}

/** Server-component page helper: redirects unauthenticated visitors. */
export async function requireAdminPage() {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

/** API-route helper: 401 JSON response when unauthenticated. */
export async function requireAdminApi() {
  const user = await requireAdmin();
  if (!user) {
    return { user: null as null, error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null as null };
}
