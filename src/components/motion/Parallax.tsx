"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./hooks";

/**
 * Subtle scroll parallax — the element drifts against scroll at a fraction
 * of the scroll speed. transform-only. Desktop only (≥768px), disabled
 * under prefers-reduced-motion.
 */
export function useParallax(speed = 0.1, max = 120) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const delta =
        (r.top + r.height / 2 - window.innerHeight / 2) * speed;
      const clamped = Math.max(-max, Math.min(max, delta));
      el.style.transform = `translate3d(0, ${clamped.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, speed, max]);

  return ref;
}

export function Parallax({
  children,
  speed = 0.1,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useParallax(speed);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
