"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestimonialData } from "@/lib/testimonials";

const AUTO_ADVANCE_MS = 6000;

/**
 * Editorial testimonial carousel — oversized quote typography, minimal
 * chrome. Auto-advances every 6s with a thin progress bar; pauses on hover.
 * No star cards, no boxes.
 */
export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: TestimonialData[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + testimonials.length) % testimonials.length),
    [testimonials.length]
  );

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const t = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused, go, testimonials.length]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <span aria-hidden="true" className="font-serif text-7xl italic leading-none text-brand-500/40">
        &ldquo;
      </span>
      <blockquote
        aria-live="polite"
        aria-atomic="true"
        data-hover
        className="t-quote -mt-6 max-w-4xl text-balance font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.2] tracking-tight text-brand-900"
      >
        {current.quote}
      </blockquote>
      <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">
        {current.name}
        <span aria-hidden="true" className="mx-2 text-brand-500">·</span>
        <span className="font-medium normal-case tracking-normal">
          {current.role}
          {current.company ? `, ${current.company}` : ""}
        </span>
      </p>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-brand-900 transition-all duration-300 hover:border-brand-900 hover:bg-brand-900 hover:text-paper"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-brand-900 transition-all duration-300 hover:border-brand-900 hover:bg-brand-900 hover:text-paper"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
          {/* Auto-advance progress — thin bar, keyed by index so it restarts */}
          <div
            aria-hidden="true"
            className="h-[3px] w-36 overflow-hidden rounded-full bg-ink/15"
          >
            <div
              key={index}
              className={cn(
                "h-full w-full origin-left animate-progress rounded-full bg-brand-700",
                paused && "[animation-play-state:paused]"
              )}
            />
          </div>
          <p className="ml-2 font-display text-sm font-bold tabular-nums text-ink-soft" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-ink/30">/</span>
            {String(testimonials.length).padStart(2, "0")}
          </p>
          <p className="sr-only" aria-live="polite">
            Showing testimonial {index + 1} of {testimonials.length}
          </p>
        </div>
      )}
    </div>
  );
}

