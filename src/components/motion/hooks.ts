"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared motion primitives. Every effect in this system animates ONLY
 * transform and opacity (GPU-composited), runs on rAF with passive
 * listeners, and bails out under prefers-reduced-motion.
 */

/** True when the OS asks for reduced motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True for mouse/trackpad pointers — gates cursor & magnetic effects. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** True when the element is at least `threshold` visible in the viewport. */
export function useInView<T extends HTMLElement>(
  threshold = 0.2,
  once = true
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}

/**
 * A single rAF loop that also reports smoothed scroll velocity.
 * The callback receives (time, deltaSeconds, smoothedScrollVelocityPxPerSec).
 * The loop only ticks while `active` is true — pair with useInView to
 * avoid burning frames offscreen.
 */
export function useVelocityRaf(
  active: boolean,
  cb: (t: number, dt: number, scrollVel: number) => void
) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let lastT = performance.now();
    let lastY = window.scrollY;
    let smoothVel = 0;

    const loop = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      const y = window.scrollY;
      const instant = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      // Exponential smoothing — responsive but not jittery.
      smoothVel += (instant - smoothVel) * 0.09;
      if (Math.abs(smoothVel) < 0.5) smoothVel = 0;
      cbRef.current(t, dt, smoothVel);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
