import NextAuth, { CredentialsSignin } from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class RateLimitedSignin extends CredentialsSignin {
  code = "RATE_LIMITED";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      authorize: async (creds, request) => {
        const ip = clientIp(request as unknown as Request);
        if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
          throw new RateLimitedSignin();
        }

        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;

        const { isDbConfigured, db } = await import("@/lib/db");
        if (!isDbConfigured()) return null;

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
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
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