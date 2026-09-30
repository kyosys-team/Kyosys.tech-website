import { z } from "zod";

/**
 * DPDP consent helpers for the public lead forms (contact + quote).
 *
 * Wire-up (for the forms track):
 *  1. Render <ConsentCheckbox> from "@/components/forms/ConsentCheckbox"
 *     inside ContactClient.tsx and QuoteClient.tsx (controlled, name="consent").
 *  2. Client-side: extend the form zod schema with `consent: consentSchema`
 *     so the submit button can show "Please accept the Privacy Policy".
 *  3. Server-side: call `assertConsent(body)` in the API route BEFORE
 *     processing — it returns an error string when consent !== true.
 */

/** Consent must be an explicit boolean true (not "on", not 1). */
export const consentSchema = z.literal(true, {
  error: "Please accept the Privacy Policy to continue.",
});

/** Extract + validate the consent field from a parsed request body. */
export function parseConsent(body: { consent?: unknown }): boolean {
  return consentSchema.safeParse(body?.consent).success;
}

/**
 * Server helper: returns an error message when consent is missing/invalid,
 * otherwise null. Use it at the top of the route handler:
 *
 *   const err = assertConsent(body);
 *   if (err) return Response.json({ error: err }, { status: 400 });
 */
export function assertConsent(body: { consent?: unknown }): string | null {
  if (!parseConsent(body)) {
    return "Consent is required. Please accept the Privacy Policy.";
  }
  return null;
}
