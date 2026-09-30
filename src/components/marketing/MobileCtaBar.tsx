"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUp } from "lucide-react";

/** Pages where a "Get a Quote" nudge would be noise — you're already there. */
const HIDDEN_ON = ["/quote", "/contact", "/admin"];

/**
 * Sticky bottom CTA bar for mobile (the big-company conversion touch).
 * Mobile-only; hidden on quote/contact/admin. A back-to-top shortcut
 * joins the bar once the user has scrolled. Respects
 * prefers-reduced-motion for the scroll-to-top behavior.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  const scrollTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        className="border-t border-white/10 bg-brand-950/95 px-4 pt-3 backdrop-blur-md"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3">
          {showTop && (
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Back to top"
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-paper transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sun-400"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </button>
          )}
          <Link
            href="/quote"
            className="btn-emerald flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-base font-bold"
          >
            Get a Quote
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
