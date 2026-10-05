"use client";

import { usePathname } from "next/navigation";

/**
 * SiteChrome — wraps marketing-only chrome (announcement bar, navbar,
 * footer, floating CTAs) so it never renders inside the admin panel.
 * The admin has its own shell and sidebar; the public nav/footer links
 * would yank admins out to the live website mid-task.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
