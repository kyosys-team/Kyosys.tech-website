import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Editorial section header — numbered kicker in uppercase micro-type with a
 * hairline rule, left-aligned, never centered. The house style for all
 * section openers.
 */
export function EditorialHeader({
  index,
  eyebrow,
  title,
  description,
  dark = false,
  className,
  id,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "border-t pt-5 sm:pt-6",
        dark ? "border-white/15" : "border-ink/15",
        className
      )}
    >
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.22em]",
          dark ? "text-sun-400" : "text-brand-700"
        )}
      >
        {index} <span aria-hidden="true" className="mx-1">—</span> {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-4 max-w-3xl font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-paper" : "text-brand-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-xl text-lg leading-relaxed",
            dark ? "text-white/70" : "text-ink-soft"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
