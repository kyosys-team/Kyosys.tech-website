"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Mount-triggered hero intro choreography. Wrap the hero in <HeroIntro>;
 * the `intro-run` class is added after two rAFs (first paint committed),
 * then <MaskLine> and <IntroFade> children animate with their `delay`.
 * transform + opacity only. Static under prefers-reduced-motion.
 */
export function HeroIntro({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => el.classList.add("intro-run"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** One headline line revealed through an overflow mask (112% → 0). */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("intro-mask", className)}>
      <span
        className="intro-mask-inner"
        style={{ "--intro-delay": `${delay}ms` } as React.CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

/** Fade + slight rise on mount, with stagger `delay`. */
export function IntroFade({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("intro-fade", className)}
      style={
        {
          "--intro-delay": `${delay}ms`,
          "--intro-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
