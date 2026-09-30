"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Admin sign-in form. Credential checking lives in `@/lib/auth`
 * (NextAuth credentials provider); this form just collects credentials and
 * maps the provider result to human-readable errors:
 * - code === "RATE_LIMITED" → too many attempts (5 / 15 min / IP)
 * - error "CredentialsSignin" (no code) → invalid email/password
 */
export default function LoginForm({
  configError,
  passwordChanged,
}: {
  configError: boolean;
  passwordChanged: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res) {
        setError("Sign-in is unavailable right now. Please try again.");
      } else if (res.code === "RATE_LIMITED") {
        setError("Too many login attempts. Please wait 15 minutes and try again.");
      } else if (res.error) {
        setError("Invalid email or password.");
      } else {
        toast.success("Signed in");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h1 className="text-xl font-extrabold tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Kyosys team only.</p>

          {configError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              Authentication is not configured on the server. Ask the site
              administrator to set <code>AUTH_SECRET</code>.
            </div>
          )}
          {passwordChanged && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
              Password changed successfully. Please sign in again.
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kyosys.com"
                disabled={busy}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Authorized access only. Sessions expire after 12 hours.
        </p>
      </div>
    </div>
  );
}
