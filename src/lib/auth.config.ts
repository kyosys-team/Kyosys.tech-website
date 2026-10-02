import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // real providers live in auth.ts
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
} satisfies NextAuthConfig;