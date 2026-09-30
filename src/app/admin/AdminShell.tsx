"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Inbox,
  MessageSquareQuote,
  Briefcase,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: Newspaper },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/case-studies", label: "Case Studies", icon: Briefcase },
  { href: "/admin/password", label: "Change Password", icon: KeyRound },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

function SignOutButton({ onDone }: { onDone?: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        onDone?.();
        signOut({ callbackUrl: "/admin/login" });
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </button>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-6 overflow-y-auto">
      <div className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(pathname, item.href, item.exact) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, item.href, item.exact)
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View site
        </a>
        <SignOutButton onDone={onNavigate} />
      </div>
    </nav>
  );
}

/**
 * Admin shell — clean, professional, functional (the editorial treatment is
 * public-only). Sidebar on desktop; hamburger + slide-over drawer on small
 * screens. The login page renders without the shell (see layout).
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // /admin/login must never render inside the shell.
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <span className="text-base font-extrabold tracking-tight">
          Kyosys <span className="font-medium text-slate-400">Admin</span>
        </span>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-base font-extrabold tracking-tight">
                Kyosys <span className="font-medium text-slate-400">Admin</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-slate-200 bg-white p-4 md:flex">
          <Link href="/admin" className="px-1 text-lg font-extrabold tracking-tight">
            Kyosys <span className="font-medium text-slate-400">Admin</span>
          </Link>
          <SidebarNav />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
