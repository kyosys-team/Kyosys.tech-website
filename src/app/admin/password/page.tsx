import { requireAdminPage } from "@/lib/require-admin";
import { isDbConfigured } from "@/lib/db";
import DbNotice from "@/components/admin/DbNotice";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  await requireAdminPage();

  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Change password</h1>
        <div className="mt-6">
          <DbNotice feature="password rotation" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold tracking-tight">Change password</h1>
      <p className="mt-1 text-sm text-slate-500">
        Rotates the shared admin password. You&apos;ll be signed out and asked
        to sign in again with the new password.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
