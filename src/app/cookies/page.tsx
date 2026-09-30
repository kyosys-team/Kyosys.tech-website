import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/cookies" },
  title: "Cookie Policy",
  description:
    "Kyosys sets essential cookies only — no tracking, no ads. Here's exactly what we use and how to manage it.",
};

type Section = { index: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    index: "01",
    title: "Our short version",
    body: (
      <>
        <p>
          We use <strong>essential cookies only</strong>: an admin sign-in
          session cookie, and your cookie-consent choice (stored in your
          browser&apos;s local storage, not a cookie). We set{" "}
          <strong>no tracking, analytics, or advertising cookies</strong>{" "}
          before or after you click anything on our banner.
        </p>
      </>
    ),
  },
  {
    index: "02",
    title: "What we actually store",
    body: (
      <>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/15">
              <th className="py-2 pr-4 align-top font-semibold text-ink">
                Name
              </th>
              <th className="py-2 pr-4 align-top font-semibold text-ink">
                What it does
              </th>
              <th className="py-2 align-top font-semibold text-ink">
                Expires
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink/10">
              <td className="py-2 pr-4 align-top font-medium text-ink">
                Admin session cookie
              </td>
              <td className="py-2 pr-4 align-top">
                Keeps our own team signed in to the website&apos;s admin area.
                Not used for public visitors.
              </td>
              <td className="py-2 align-top">End of session / 30 days</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 align-top font-medium text-ink">
                kyosys-cookie-consent
              </td>
              <td className="py-2 pr-4 align-top">
                Remembers whether you accepted or declined the cookie banner,
                so we don&apos;t ask again. Stored in localStorage, not a
                cookie.
              </td>
              <td className="py-2 align-top">
                Until you clear your browser data
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Our hosting provider (Vercel) may log basic technical data for
          security — see our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    index: "03",
    title: "Why we ask for consent at all",
    body: (
      <>
        <p>
          Good question — if we don&apos;t track anyone, why show a banner?
          Two reasons: India&apos;s DPDP Act, 2023 expects clear notice about
          data practices, and we believe in asking first as a matter of
          principle. Declining changes nothing about how the site works; you
          get the exact same experience either way.
        </p>
      </>
    ),
  },
  {
    index: "04",
    title: "Managing or clearing your choice",
    body: (
      <>
        <p>
          You can clear your consent choice at any time by clearing your
          browser&apos;s site data for kyosys (however our domain reads) — the
          banner will simply appear again on your next visit. You can also:
        </p>
        <ul>
          <li>
            Use your browser&apos;s cookie controls to block or delete
            cookies entirely (Settings → Privacy in Chrome, Safari, Firefox,
            or Edge).
          </li>
          <li>
            Use private/incognito mode if you&apos;d rather leave no trace at
            all.
          </li>
        </ul>
        <p>
          Blocking our essential admin session cookie only affects the admin
          sign-in area — the public site works fully without it.
        </p>
      </>
    ),
  },
  {
    index: "05",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          If we ever start using new cookies (for example, if we add
          analytics), we&apos;ll update this page and the &ldquo;Last
          updated&rdquo; date below — and the banner will ask for your consent
          again before anything non-essential is set.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Cookies" }]}
            />
          </Reveal>
          <Reveal className="mt-8">
            <EditorialHeader
              index="00"
              eyebrow="Legal"
              title={
                <>
                  Cookie{" "}
                  <em className="font-serif font-medium italic">Policy.</em>
                </>
              }
              description="Essential cookies only. No tracking, no advertising, no analytics — and your consent choice is genuinely optional."
            />
          </Reveal>
          <Reveal className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Last updated: September 2026
            </p>
          </Reveal>

          <div className="mt-10 space-y-0 sm:mt-14">
            {sections.map((s) => (
              <Reveal key={s.index}>
                <section className="border-t border-ink/10 py-8 sm:py-10">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
                    {s.index} <span aria-hidden="true" className="mx-1">—</span>{" "}
                    {s.title}
                  </p>
                  <div className="legal-body mt-4 max-w-3xl space-y-4 overflow-x-auto text-[16px] leading-relaxed text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-brand-900 [&_a]:underline [&_a]:decoration-sun-400 [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:text-brand-700">
                    {s.body}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
              Want to know what else we do (and don&apos;t do) with your data?
            </p>
            <Link
              href="/privacy"
              className="group mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-900"
            >
              <span className="link-underline">Read our Privacy Policy</span>
              <ArrowUpRight
                className="size-5 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
