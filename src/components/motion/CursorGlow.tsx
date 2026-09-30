"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "./hooks";

/**
 * CursorGlow — NOT a custom cursor (native cursor stays). A soft radial
 * bloom that trails the pointer at low opacity inside its positioned
 * parent. Drop inside dark sections only. pointer:fine only, disabled
 * under prefers-reduced-motion and on touch.
 */
export function CursorGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(fine && !reduced);
  }, [fine, reduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let hovering = false;
    let lastHover: boolean | null = null;
    const R = 220; // half of the 440px glow disc

    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.transform = `translate3d(${(cx - R).toFixed(1)}px, ${(cy - R).toFixed(1)}px, 0)`;
      if (hovering !== lastHover) {
        el.style.opacity = hovering ? "1" : "0";
        lastHover = hovering;
      }
      raf = requestAnimationFrame(loop);
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "cursor-glow pointer-events-none absolute left-0 top-0 z-0 size-[440px] rounded-full opacity-0",
        className
      )}
      style={{ willChange: "transform, opacity", transition: "opacity 0.5s ease" }}
    />
  );
}
