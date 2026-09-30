import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin gate — fail closed.
 *
 * - /admin/login is always reachable (otherwise nobody could sign in).
 * - Every other /admin/* path requires a valid session.
 * - ANY error while checking the session (missing AUTH_SECRET, bad secret,
 *   crypto failure…) redirects to /admin/login?error=config instead of
 *   crashing or letting the request through.
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const loginUrl = (withError: boolean) => {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = withError ? "?error=config" : "";
    return url;
  };

  try {
    // Dynamic import: keeps the middleware bundle lazy and lets us catch
    // auth misconfiguration instead of failing at module-eval time.
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (session?.user) return NextResponse.next();
    return NextResponse.redirect(loginUrl(false));
  } catch {
    return NextResponse.redirect(loginUrl(true));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
