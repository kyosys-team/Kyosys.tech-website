"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Desktop back-to-top floating button. Sits above the WhatsApp float
 * (bottom-right). Mobile gets its back-to-top inside the sticky CTA
 * bar instead, so this renders on md+ only. Appears after scrolling;
 * respects prefers-reduced-motion for the scroll behavior.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-24 right-6 z-40 hidden size-12 items-center justify-center rounded-full border border-ink/15 bg-paper text-brand-900 shadow-lg shadow-brand-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 md:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
