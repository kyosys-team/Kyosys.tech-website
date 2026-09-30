import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import type { Service } from "@/lib/services";

/**
 * Editorial services index — full-width numbered rows with hairline
 * dividers. Hover inverts the row: brand-950 bg, paper text, arrow slides.
 */
export function ServiceIndex({
  services,
  className,
}: {
  services: Service[];
  className?: string;
}) {
  return (
    <div className={cn("border-b border-ink/15", className)}>
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={Math.min(i * 60, 240)}>
          <Link
            href={`/services/${s.slug}`}
            aria-label={`${s.name} — ${s.tagline}`}
            className="service-row group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-t border-ink/15 px-1 py-6 transition-colors duration-300 sm:grid-cols-[4rem_1fr_auto] sm:gap-6 sm:px-4 sm:py-8"
          >
            <span
              aria-hidden="true"
              className="font-display text-sm font-bold tabular-nums text-ink-soft transition-colors duration-300 group-hover:text-sun-400"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-2xl font-extrabold tracking-tight text-brand-900 transition-colors duration-300 group-hover:text-paper sm:text-4xl">
                {s.name}
              </span>
              <span className="mt-1 block max-w-xl text-[15px] leading-relaxed text-ink-soft transition-colors duration-300 group-hover:text-white/70 sm:text-base">
                {s.tagline}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-brand-700 transition-all duration-300 group-hover:border-sun-400 group-hover:bg-sun-400 group-hover:text-brand-950 sm:size-14"
            >
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-6" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
