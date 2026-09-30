"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "./hooks";

/**
 * Cursor — hover-anywhere system, mounted once in the root layout.
 * A small amber dot plus a larger lerped trailing ring replace the
 * native cursor on fine-pointer devices (never on touch, never under
 * prefers-reduced-motion). The ring expands over interactive elements
 * (a, button, [data-hover]) and glows over the video hero.
 * A separate faint warm aura follows the pointer across the whole page
 * at ~7% opacity. Single rAF loop, transform-only.
 *
 * Native cursor is hidden via the `has-custom-cursor` class on <html>,
 * but form fields (input/textarea/select) always keep `cursor: auto`.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    if (!dot || !ring || !aura) return;

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let dx = -100;
    let dy = -100;
    let rx = -100;
    let ry = -100;
    let ax = -100;
    let ay = -100;
    let active = false;
    let interactive = false;
    let videoZone = false;
    let lastActive: boolean | null = null;
    let lastMode: string | null = null;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      active = true;
      const t = e.target as HTMLElement | null;
      interactive = !!t?.closest?.("a, button, [data-hover]");
      videoZone = !!t?.closest?.('[data-cursor-zone="video"]');
    };
    const onLeave = () => {
      active = false;
    };

    const loop = () => {
      // Dot tracks fast, ring trails, aura drifts — all lerped.
      dx += (tx - dx) * 0.4;
      dy += (ty - dy) * 0.4;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ax += (tx - ax) * 0.06;
      ay += (ty - ay) * 0.06;

      dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${interactive ? 0.55 : 1})`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%) scale(${interactive ? 1.7 : videoZone ? 1.25 : 1})`;
      aura.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0) translate(-50%, -50%)`;

      if (active !== lastActive) {
        const o = active ? "1" : "0";
        dot.style.opacity = o;
        ring.style.opacity = o;
        aura.style.opacity = active ? "0.07" : "0";
        lastActive = active;
      }
      const mode = interactive ? "i" : videoZone ? "v" : "n";
      if (mode !== lastMode) {
        ring.style.borderColor =
          mode === "i" ? "rgb(255 201 31 / 0.9)" : "rgb(255 201 31 / 0.55)";
        ring.style.boxShadow =
          mode === "v"
            ? "0 0 28px rgb(255 201 31 / 0.45)"
            : mode === "i"
              ? "0 0 18px rgb(255 201 31 / 0.35)"
              : "none";
        lastMode = mode;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Global warm aura — faint, follows everywhere */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className="cursor-aura pointer-events-none fixed left-0 top-0 z-[60] opacity-0"
        style={{ willChange: "transform, opacity", transition: "opacity 0.6s ease" }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] size-9 rounded-full border-[1.5px] opacity-0"
        style={{
          borderColor: "rgb(255 201 31 / 0.55)",
          willChange: "transform, opacity",
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-2 rounded-full bg-sun-400 opacity-0"
        style={{ willChange: "transform, opacity", transition: "opacity 0.3s ease" }}
      />
    </>
  );
}
