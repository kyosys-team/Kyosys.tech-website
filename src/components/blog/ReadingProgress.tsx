"use client";

import { useEffect, useState } from "react";

/**
 * Slim scroll-progress bar pinned to the top of the viewport for
 * long articles. Scroll-driven (rAF-throttled); no animation library,
 * and nothing to disable under prefers-reduced-motion since there is
 * no autonomous motion — it only mirrors the user's own scrolling.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(
        total > 0 ? Math.min(1, Math.max(0, el.scrollTop / total)) : 0
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        data-reading-progress
        className="h-full bg-gradient-to-r from-brand-700 via-brand-500 to-sun-400"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
