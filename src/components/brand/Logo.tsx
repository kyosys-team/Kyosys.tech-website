/**
 * Kyosys brand mark — "The Signal K".
 *
 * A geometric K monogram drawn as circuit traces: a deep-blue stem with two
 * diagonal arms, the rising arm plugging into an emerald node — the signal,
 * the go-live moment, growth. Two-tone by design:
 *   blue   #1E40AF  stability, enterprise authority (spec role 1)
 *   emerald #10B981 growth, ROI (spec role 2)
 *
 * Variants:
 *   "color"   — light backgrounds (navbar, docs)
 *   "on-dark" — dark backgrounds; blue lifts to #3B82F6 so the mark keeps
 *               its weight on #0B0F19, emerald stays #10B981.
 *
 * No gradients, no fine detail: reads cleanly from 24px (navbar) to
 * billboard size. Pure geometry — scales without banding.
 */
interface LogoProps {
  /** Rendered size in px (square). Default 36. */
  size?: number;
  /** "color" for light surfaces, "on-dark" for dark surfaces. */
  variant?: "color" | "on-dark";
  className?: string;
  /** Accessible label. */
  title?: string;
}

export function Logo({
  size = 36,
  variant = "color",
  className,
  title = "Kyosys logo",
}: LogoProps) {
  const blue = variant === "on-dark" ? "#3B82F6" : "#1E40AF";
  const node = "#10B981";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Stem */}
      <rect x="8" y="8" width="7" height="32" rx="2.5" fill={blue} />
      {/* Upper arm — rises into the node */}
      <path
        d="M16 22 L35 8"
        stroke={blue}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Lower arm */}
      <path
        d="M16 26 L35 40"
        stroke={blue}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Signal node — the emerald accent */}
      <circle cx="38.5" cy="5.5" r="4.5" fill={node} />
    </svg>
  );
}
