import NextAuth, { CredentialsSignin } from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { authConfig } from "./auth.config";

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
  ...authConfig,
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
});