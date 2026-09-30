import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

/**
 * Server wrapper: decides per request whether auth is configured, so this
 * page prerenders safely at build time (no AUTH_SECRET / no DATABASE_URL)
 * and stays correct if env changes without a rebuild.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; changed?: string };
}) {
  // Auth not configured → honest notice instead of a broken form.
  if (!process.env.AUTH_SECRET) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-8 text-center">
          <h1 className="text-xl font-extrabold tracking-tight text-amber-900">
            Authentication is not configured
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            <code>AUTH_SECRET</code> is not set on the server, so the admin
            sign-in is disabled. Set <code>AUTH_SECRET</code> (see
            .env.example) and redeploy to enable it.
          </p>
        </div>
      </div>
    );
  }

  // Already signed in → skip the form.
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (session?.user) redirect("/admin");
  } catch {
    // Misconfigured secret etc. — fall through and let the form surface it.
  }

  return (
    <LoginForm
      configError={searchParams.error === "config"}
      passwordChanged={searchParams.changed === "1"}
    />
  );
}
