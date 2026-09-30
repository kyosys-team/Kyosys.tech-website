import { Resend } from "resend";

/**
 * Team notifications for public lead forms (contact + quote).
 *
 * Graceful degradation: if RESEND_API_KEY or TEAM_EMAIL is missing, we
 * console.warn and return { skipped: true } — never throw. Losing a lead
 * email must never break a form submission; the DB row is the record of
 * truth, email is best-effort.
 */
export async function sendTeamEmail(
  subject: string,
  html: string
): Promise<{ skipped: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_EMAIL;

  if (!apiKey || !teamEmail) {
    console.warn(
      "[email] RESEND_API_KEY or TEAM_EMAIL not set — skipping team email:",
      subject
    );
    return { skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Kyosys Website <website@kyosys.com>",
      to: [teamEmail],
      subject,
      html,
    });
    if (error) {
      console.warn("[email] Resend send failed:", error.message);
      return { skipped: true };
    }
    return { skipped: false, id: data?.id };
  } catch (err) {
    console.warn("[email] Resend threw:", (err as Error).message);
    return { skipped: true };
  }
}

/** Minimal HTML wrapper for lead emails — escapes caller-provided strings. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
