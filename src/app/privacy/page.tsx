import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description:
    "How Kyosys collects, uses, and protects your personal data — India-aware, aligned with the DPDP Act, 2023.",
};

type Section = { index: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    index: "01",
    title: "Who we are",
    body: (
      <>
        <p>
          This Privacy Policy describes how{" "}
          <strong>[LEGAL ENTITY NAME]</strong> (trading as{" "}
          <strong>Kyosys</strong>, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;), located at <strong>[REGISTERED ADDRESS]</strong>,
          India, collects and handles your personal data when you visit this
          website or contact us about our services.
        </p>
      </>
    ),
  },
  {
    index: "02",
    title: "What data we collect",
    body: (
      <>
        <p>
          We collect only what we need to run our agency and talk to you. That
          includes:
        </p>
        <ul>
          <li>
            <strong>Contact &amp; quote forms:</strong> your name, email
            address, phone number, company name (optional), and the message or
            project details you share with us.
          </li>
          <li>
            <strong>Admin session:</strong> when our team signs in to the
            website&apos;s admin area, we store an essential session cookie so
            they stay signed in.
          </li>
          <li>
            <strong>Cookie consent choice:</strong> whether you accepted or
            declined our cookie banner, stored in your own browser so we
            don&apos;t ask again.
          </li>
          <li>
            <strong>Technical data:</strong> basic information your browser
            shares automatically (such as page views, device type, and browser),
            which our hosting provider logs for security and reliability.
          </li>
        </ul>
        <p>
          We do not collect sensitive personal data, and we set no
          tracking or advertising cookies. Ever. See our{" "}
          <Link href="/cookies">Cookie Policy</Link> for details.
        </p>
      </>
    ),
  },
  {
    index: "03",
    title: "Why we collect it, and your consent",
    body: (
      <>
        <p>
          In line with India&apos;s Digital Personal Data Protection Act, 2023
          (DPDP Act), we process your data only on lawful grounds — primarily
          your <strong>free, informed consent</strong> and our legitimate need
          to respond to you:
        </p>
        <ul>
          <li>To reply to your enquiries and prepare project quotes.</li>
          <li>
            To manage the client relationship if you hire us (contracts,
            invoices, delivery).
          </li>
          <li>
            To keep the site secure, reliable, and working (hosting logs,
            admin sessions).
          </li>
        </ul>
        <p>
          Our contact and quote forms include a consent checkbox. Ticking it is
          your consent; you can withdraw that consent at any time by writing to
          us (see &ldquo;Your rights&rdquo; below), and we&apos;ll stop
          processing your data accordingly.
        </p>
      </>
    ),
  },
  {
    index: "04",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We do not sell your data. We share it only with the processors we
          need to run the website and our agency, each bound by their own
          privacy commitments:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> — website hosting and delivery.
          </li>
          <li>
            <strong>Neon (PostgreSQL)</strong> — the database where form
            submissions are stored.
          </li>
          <li>
            <strong>Resend</strong> — email delivery for enquiry
            notifications.
          </li>
        </ul>
        <p>
          We will also share data if the law requires it (for example, a court
          order) or to protect our legal rights.
        </p>
      </>
    ),
  },
  {
    index: "05",
    title: "How long we keep it",
    body: (
      <>
        <ul>
          <li>
            <strong>Enquiry &amp; quote data:</strong> kept for up to{" "}
            <strong>24 months</strong> from your last contact, so we can follow
            up and refer back to earlier conversations.
          </li>
          <li>
            <strong>Client project data:</strong> kept for{" "}
            <strong>7 years</strong> after a project ends, for tax and legal
            record-keeping.
          </li>
          <li>
            <strong>Admin session cookies:</strong> expire when the browser
            session ends or after 30 days, whichever comes first.
          </li>
        </ul>
        <p>
          After these periods, we delete the data or anonymise it so it can no
          longer identify you.
        </p>
      </>
    ),
  },
  {
    index: "06",
    title: "Your rights",
    body: (
      <>
        <p>
          Under the DPDP Act, you have the right to access the personal data we
          hold about you, ask for corrections, request deletion (erasure),
          withdraw your consent, and nominate someone to act on your behalf in
          case of your death or incapacity. You can also complain to the Data
          Protection Board of India if you feel we haven&apos;t handled your
          request fairly.
        </p>
        <p>
          To exercise any of these rights, email our grievance contact at{" "}
          <strong>[GRIEVANCE EMAIL]</strong>. We aim to respond within 30
          days.
        </p>
      </>
    ),
  },
  {
    index: "07",
    title: "Grievance redressal",
    body: (
      <>
        <p>
          If you have a question or complaint about how we handle your data,
          contact our Grievance Officer:
        </p>
        <ul>
          <li>
            Email: <strong>[GRIEVANCE EMAIL]</strong>
          </li>
          <li>
            Phone: <strong>[GRIEVANCE PHONE]</strong>
          </li>
          <li>
            Address: <strong>[REGISTERED ADDRESS]</strong>
          </li>
        </ul>
        <p>
          We take every grievance seriously and will acknowledge yours within
          7 days.
        </p>
      </>
    ),
  },
  {
    index: "08",
    title: "Children's data",
    body: (
      <>
        <p>
          This website and our services are meant for adults. We do not
          knowingly collect data from children under 18. If you believe a child
          has shared data with us, contact us and we will delete it promptly.
        </p>
      </>
    ),
  },
  {
    index: "09",
    title: "Data security & transfers",
    body: (
      <>
        <p>
          We use reasonable safeguards — encrypted connections (HTTPS),
          access-controlled databases, and limited team access — to protect
          your data. Some of our processors (for example, hosting and email
          infrastructure) may store or process data outside India; we choose
          providers with strong security practices.
        </p>
      </>
    ),
  },
  {
    index: "10",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          We may update this policy as our practices or the law change. The
          &ldquo;Last updated&rdquo; date at the top always shows the current
          version, and significant changes will be noted here. Continued use of
          the site after changes means you accept the updated policy.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
            />
          </Reveal>
          <Reveal className="mt-8">
            <EditorialHeader
              index="00"
              eyebrow="Legal"
              title={
                <>
                  Privacy{" "}
                  <em className="font-serif font-medium italic">Policy.</em>
                </>
              }
              description="Plain-language answers about your data: what we collect, why, and what rights you have. India-aware, aligned with the DPDP Act, 2023."
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
                  <div className="legal-body mt-4 max-w-3xl space-y-4 text-[16px] leading-relaxed text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-brand-900 [&_a]:underline [&_a]:decoration-sun-400 [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:text-brand-700">
                    {s.body}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
              Questions about your data? We answer fast and in plain language.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-900"
            >
              <span className="link-underline">Contact us</span>
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
