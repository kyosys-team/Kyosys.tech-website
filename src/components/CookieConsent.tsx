"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kyosys-cookie-consent";

/**
 * Cookie consent banner. Kyosys sets no tracking or advertising cookies
 * (see /cookies), so this banner is notice + preference storage only.
 * The choice persists in localStorage; the banner never shows again once
 * chosen. Hidden on /admin/*. Positioned bottom-left and lifted on mobile
 * so it clears the fixed WhatsApp button — and above the sticky mobile
 * CTA bar too when `lifted` (see FloatingCluster).
 * Respects prefers-reduced-motion: no slide animation then.
 */
export function CookieConsent({ lifted = false }: { lifted?: boolean }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage unavailable (private mode etc.) — just dismiss.
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={cn(
        "cookie-banner fixed bottom-24 left-4 right-4 z-40 rounded-2xl border border-ink/10 bg-paper p-4 shadow-xl shadow-brand-950/10 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:p-5",
        lifted && "max-md:bottom-36"
      )}
    >
      <p className="flex items-center gap-2 text-sm font-bold text-brand-900">
        <Cookie className="size-4 text-brand-500" aria-hidden="true" />
        A quick note on cookies
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        We use essential cookies only — no tracking, no ads. Your choice just
        remembers this banner.{" "}
        <Link
          href="/cookies"
          className="font-semibold text-brand-900 underline decoration-sun-400 decoration-2 underline-offset-4 hover:text-brand-700"
        >
          Cookie Policy
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="flex-1 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("declined")}
          className="flex-1 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand-700 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
