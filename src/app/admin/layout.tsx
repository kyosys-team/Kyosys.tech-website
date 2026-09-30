import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

/**
 * Admin shell wrapper. All /admin pages (except /admin/login, which
 * AdminShell renders chrome-less) render inside the sidebar shell.
 * Auth is enforced by middleware + requireAdminPage() on each page.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
