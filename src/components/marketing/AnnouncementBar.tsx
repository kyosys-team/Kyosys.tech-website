"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "kyosys-announcement-dismissed";
const ROTATE_MS = 5000;

// Honest, evergreen messages only — no fake offers, no countdowns.
const MESSAGES = [
  "Currently accepting new projects",
  "Free 30-min discovery call — no sales pressure",
  "We reply within 24 hours",
];

/**
 * Slim announcement bar above the header (the Frido-style touch).
 * Rotating messages, dismissible, dismissal persists in localStorage.
 * Lives in normal document flow with a fixed height, so showing or
 * dismissing it never causes layout shift. Auto-rotation is disabled
 * for prefers-reduced-motion.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage unavailable — just hide for this session.
    }
    setDismissed(true);
  };

  return (
    <div className="bg-brand-950 text-paper">
      <div className="relative mx-auto flex h-10 w-full max-w-6xl items-center justify-center px-10">
        <p
          key={index}
          aria-live="polite"
          className="announcement-message flex min-w-0 items-center gap-2 truncate text-[13px] font-medium tracking-wide"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-sun-400"
          />
          <span className="truncate">{MESSAGES[index]}</span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-paper/70 transition-colors hover:bg-white/10 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sun-400"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
