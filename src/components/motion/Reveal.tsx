"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. `variant="fade"` (default) fades + rises 24px;
 * `variant="mask"` reveals headline lines through an overflow mask
 * (inner translateY 112% → 0). Stagger siblings with `delay`.
 * Honors prefers-reduced-motion via CSS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "mask";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (variant === "mask") {
    return (
      <div
        ref={ref}
        className={cn("reveal-mask", visible && "is-visible", className)}
      >
        <span
          className="reveal-mask-inner"
          style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
        >
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
