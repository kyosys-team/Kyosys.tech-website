import NextAuth, { CredentialsSignin } from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// NOTE: this module must be import-safe with no AUTH_SECRET and no
// DATABASE_URL set (build-time prerender), AND edge-safe (the middleware
// dynamic-imports it). So: no static Prisma import (lazy dynamic import
// inside `authorize`, which only ever runs in the Node route handler) and
// no static bcryptjs import (also lazy — bcryptjs pulls in node:crypto,
// which the edge runtime cannot evaluate).

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

// NOTE: in Auth.js v5 `next-auth/jwt` is a pure re-export barrel and cannot
// be module-augmented, so the token id is carried via a local cast below.

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Thrown from `authorize` when the login rate limit is hit.
 *
 * Auth.js only forwards a fixed set of error *types* to the client
 * (isClientError), so a custom Error subclass would surface as a generic
 * "Configuration" error. `CredentialsSignin` IS client-safe, and its `code`
 * property is passed through the `code` query param to `signIn(...,
 * { redirect: false })`, which returns it as `res.code`. The login page maps
 * code === "RATE_LIMITED" to a clear "too many attempts" message, while a
 * plain null return (bad credentials) yields error "CredentialsSignin" with
 * no code.
 */
export class RateLimitedSignin extends CredentialsSignin {
  code = "RATE_LIMITED";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // No custom `credentials` fields: the login form posts email+password.
      authorize: async (creds, request) => {
        // 1) Rate limit BEFORE any expensive work: 5 attempts / 15 min / IP.
        const ip = clientIp(request as unknown as Request);
        if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
          throw new RateLimitedSignin();
        }

        // 2) Validate shape.
        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;

        // 3) No database → nobody can authenticate. Returning null keeps the
        //    build green with no DATABASE_URL and never throws at runtime.
        const { isDbConfigured, db } = await import("@/lib/db");
        if (!isDbConfigured()) return null;

        // 4) Single shared admin row (PRD §9.5).
        const admin = await db.admin.findUnique({
          where: { email: parsed.data.email },
        });
        if (!admin) return null;

        const ok = await (await import("bcryptjs")).default.compare(
          parsed.data.password,
          admin.passwordHash
        );
        if (!ok) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // 12-hour admin sessions
  pages: { signIn: "/admin/login" },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) (token as unknown as { id?: string }).id = user.id;
      return token;
    },
    async session({ session, token }) {
      const id = (token as unknown as { id?: string }).id;
      if (id) session.user.id = id;
      return session;
    },
  },
});
