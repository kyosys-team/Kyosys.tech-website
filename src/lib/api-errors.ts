import { z } from "zod";

/**
 * Canonical API validation-error shape.
 *
 * EVERY route in this app returns validation failures as:
 *   { error: string, fields: Record<string, string> }
 * so every client form can read errors the same way. Root-level issues are
 * keyed "_" (the public forms skip that key when mapping to fields).
 */

/** First zod issue per field, shaped as `{ field: message }`. */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

/** Standard 400 response for a failed `safeParse`. */
export function validationErrorResponse(error: z.ZodError, status = 400) {
  return Response.json(
    { error: "Please fix the highlighted fields.", fields: zodFieldErrors(error) },
    { status }
  );
}
