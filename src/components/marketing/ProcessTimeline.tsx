import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * Editorial process timeline — the four steps read as ONE continuous flow:
 * each step is a distinct card, and a spine line runs through the numbered
 * badges (vertical on mobile, horizontal on desktop) so the sequence is
 * unmistakable at every breakpoint.
 */
export function ProcessTimeline({
  steps,
  dark = false,
}: {
  steps: ProcessStep[];
  dark?: boolean;
}) {
  return (
    <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {/* connecting spine — vertical on mobile, horizontal on desktop */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-10 left-10 top-10 w-px lg:hidden",
          dark ? "bg-white/20" : "bg-brand-700/25"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-10 right-10 top-10 hidden h-px lg:block",
          dark ? "bg-white/20" : "bg-brand-700/25"
        )}
      />
      {steps.map((st, i) => (
        <Reveal key={st.title} delay={i * 90} className="h-full">
          <li
            className={cn(
              "relative h-full rounded-2xl border p-6 pl-16 transition-all duration-500 ease-out hover:-translate-y-1 lg:pl-6 lg:pt-16",
              dark
                ? "border-white/15 bg-white/[0.04] hover:border-white/25"
                : "border-ink/10 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.06)] hover:shadow-xl hover:shadow-brand-950/[0.07]"
            )}
          >
            {/* numbered badge — sits on the spine */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-5 top-5 flex size-10 items-center justify-center rounded-full font-display text-sm font-extrabold tabular-nums",
                dark ? "bg-sun-400 text-brand-950" : "bg-brand-700 text-white"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className={cn(
                "font-display text-xl font-bold tracking-tight",
                dark ? "text-paper" : "text-brand-900"
              )}
            >
              {st.title}
            </h3>
            <p
              className={cn(
                "mt-2 text-[15px] leading-relaxed",
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
