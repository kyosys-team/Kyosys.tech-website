"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ConsentCheckboxProps = {
  /** Controlled checked state. */
  checked: boolean;
  /** Change handler. */
  onChange: (checked: boolean) => void;
  /** Validation error text, e.g. from zod/react-hook-form. Hidden when empty. */
  error?: string | null;
  /** Input id — must be unique per form if both forms render on one page. */
  id?: string;
  className?: string;
};

/**
 * DPDP consent checkbox for the public lead forms (contact + quote).
 *
 * Renders a required "I agree to the Privacy Policy" checkbox with
 * `name="consent"` so the value posts as part of the form body, and shows
 * a validation error when the parent passes one.
 *
 * Server side, pair this with `assertConsent` from "@/lib/consent":
 *
 * ```ts
 * import { assertConsent } from "@/lib/consent";
 * // inside the route handler, before processing the body:
 * const err = assertConsent(body);
 * if (err) return Response.json({ error: err }, { status: 400 });
 * ```
 */
export function ConsentCheckbox({
  checked,
  onChange,
  error,
  id = "consent",
  className,
}: ConsentCheckboxProps) {
  const errorId = `${id}-error`;
  return (
    <div className={cn("mt-5", className)}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed text-ink-soft"
      >
        <input
          type="checkbox"
          id={id}
          name="consent"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-1 size-4 shrink-0 cursor-pointer accent-brand-700",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          )}
        />
        <span>
          I agree to the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-900 underline decoration-sun-400 decoration-2 underline-offset-4 hover:text-brand-700"
          >
            Privacy Policy
          </Link>{" "}
          and consent to Kyosys processing my details to respond to my
          enquiry.
        </span>
      </label>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
