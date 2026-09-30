"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Password rotation form. On success the admin is signed out and sent back
 * to the login page (?changed=1) so the new password takes effect
 * immediately and the old session can't linger.
 */
export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "The new password and its confirmation must be identical.",
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        toast.error("Password not changed", {
          description: data?.error ?? "Please try again.",
        });
        return;
      }
      toast.success("Password changed", {
        description: "Please sign in again with your new password.",
      });
      // Force re-login: the old JWT must not survive the rotation.
      await signOut({ redirect: true, callbackUrl: "/admin/login?changed=1" });
    } catch {
      toast.error("Password not changed", { description: "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Current password
        </label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={busy}
        />
      </div>
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-700">
          New password
        </label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={busy}
        />
        <p className="mt-1 text-xs text-slate-500">
          At least 10 characters, with both letters and numbers.
        </p>
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={busy}
        />
      </div>
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? "Changing…" : "Change password"}
      </Button>
    </form>
  );
}
