import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * Editorial process timeline — oversized numerals, each under its own
 * hairline segment (segments read as one continuous rule on desktop).
 * Vertical rail on mobile.
 */
export function ProcessTimeline({
  steps,
  dark = false,
}: {
  steps: ProcessStep[];
  dark?: boolean;
}) {
  return (
    <ol className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
      {steps.map((st, i) => (
        <Reveal key={st.title} delay={i * 90}>
          <li
            className={cn(
              "relative border-t-2 pt-6 transition-transform duration-500 ease-out hover:-translate-y-1",
              dark ? "border-white/20" : "border-ink/20"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute -top-[2px] left-0 h-[2px] w-10",
                dark ? "bg-sun-400" : "bg-brand-700"
              )}
            />
            <p
              aria-hidden="true"
              className={cn(
                "font-display text-6xl font-extrabold tabular-nums tracking-tight sm:text-7xl",
                dark ? "text-paper/95" : "text-brand-900"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3
              className={cn(
                "mt-4 font-display text-xl font-bold",
                dark ? "text-paper" : "text-brand-900"
              )}
            >
              {st.title}
            </h3>
            <p
              className={cn(
                "mt-2 max-w-xs text-[15px] leading-relaxed",
                dark ? "text-white/70" : "text-ink-soft"
              )}
            >
              {st.description}
            </p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
