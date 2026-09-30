"use client";

import { useRef } from "react";
import { useInView, useReducedMotion, useVelocityRaf } from "./hooks";

/**
 * Velocity-reactive marquee. A single rAF loop (only while in view) moves
 * the track at a base speed plus a share of the smoothed scroll velocity,
 * lerping back to base when scrolling stops; the band skews a few degrees
 * proportional to velocity. transform-only, GPU cheap.
 * Under prefers-reduced-motion the ticker is static.
 */
export function VelocityMarquee({ items }: { items: string[] }) {
  const [viewRef, inView] = useInView<HTMLDivElement>(0);
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const skewRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ offset: 0, half: 0 });
  const hoveredRef = useRef(false);

  const animate = !reduced && inView;

  useVelocityRaf(animate, (_t, dt, scrollVel) => {
    const track = trackRef.current;
    const skewEl = skewRef.current;
    if (!track) return;
    const s = stateRef.current;

    // Half-width of the duplicated track — the wrap point. Recompute
    // cheaply each frame in case of resize.
    s.half = track.scrollWidth / 2;
    if (s.half <= 0) return;

    // Pause the drift while hovered — the reader is reading.
    if (!hoveredRef.current) {
      const BASE_PX_S = 55;
      const speed =
        BASE_PX_S + Math.min(Math.abs(scrollVel) * 0.12, 420);
      s.offset -= speed * dt;
      // Normalize into (-half, 0] for a seamless loop.
      s.offset = -((((-s.offset) % s.half) + s.half) % s.half);
      track.style.transform = `translate3d(${s.offset.toFixed(1)}px, 0, 0)`;
    }

    if (skewEl) {
      const skew = Math.max(-7, Math.min(7, scrollVel * 0.0035));
      skewEl.style.transform = `skewX(${skew.toFixed(2)}deg)`;
    }
  });

  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item + (hidden ? "-dup" : "")} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-lg font-extrabold uppercase tracking-[0.08em] sm:text-xl">
            {item}
          </span>
          <span aria-hidden="true" className="text-sm">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={viewRef}
      className="overflow-hidden"
      role="presentation"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <div className="-mx-[2vw] w-[104vw] -rotate-1 marquee-band py-3.5 text-brand-950 shadow-[0_2px_20px_rgba(6,36,23,0.12)] sm:py-4">
        <div ref={skewRef} className="will-change-transform">
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max will-change-transform"
              style={reduced ? undefined : { transform: "translate3d(0,0,0)" }}
            >
              {row(false)}
              {row(true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
