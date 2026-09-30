"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/work", label: "Work" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-3" aria-label="Kyosys home">
          <Logo size={36} />
          <span className="font-display text-xl font-extrabold tracking-tight text-brand-900">
            Kyosys
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline text-[15px] font-medium transition-colors",
                    active ? "font-semibold text-brand-900" : "text-ink-soft hover:text-brand-900"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/quote"
            className="btn-sun group inline-flex h-11 items-center gap-2 rounded-full px-6 text-[15px] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get a Quote
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand-900 transition-colors hover:bg-ink/5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-ink/10 bg-paper md:hidden">
          <ul className="space-y-1 px-4 py-4">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 rounded-lg px-3 py-3",
                    pathname === l.href ? "text-brand-900" : "text-ink-soft"
                  )}
                >
                  <span aria-hidden="true" className="font-display text-xs font-bold tabular-nums text-brand-500">
                    0{i + 1}
                  </span>
                  <span className="font-display text-2xl font-extrabold tracking-tight">
                    {l.label}
                  </span>
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/quote"
                className="btn-sun flex items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white"
              >
                Get a Quote <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
