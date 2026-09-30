"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "./hooks";

/**
 * Magnetic wrapper — translates its child a few px toward the cursor with
 * lerped easing. pointer:fine only, disabled under prefers-reduced-motion.
 * Apply to primary CTAs. NOTE: the child must not rely on its own
 * translate hover (inline transform wins) — use shadow/brightness instead.
 */
export function Magnetic({
  children,
  strength = 6,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let running = false;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = Math.max(-strength, Math.min(strength, nx * strength * 2));
      ty = Math.max(-strength, Math.min(strength, ny * strength * 2));
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    // The loop only runs while the magnet is displaced — no idle frames.
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      const settled =
        Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05;
      if (settled && tx === 0 && ty === 0) {
        el.style.transform = "";
        running = false;
        return;
      }
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced, strength]);

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
