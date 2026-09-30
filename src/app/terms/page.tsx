import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description:
    "The terms for using the Kyosys website and engaging our web, app, marketing, SEO, and video services.",
};

type Section = { index: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    index: "01",
    title: "Who we are & what this covers",
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this
          website and any engagement with{" "}
          <strong>[LEGAL ENTITY NAME]</strong> (trading as{" "}
          <strong>Kyosys</strong>, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;), located at{" "}
          <strong>[REGISTERED ADDRESS]</strong>, India.
        </p>
        <p>
          Using this website means you accept these Terms. If you don&apos;t
          agree, please don&apos;t use the site.
        </p>
      </>
    ),
  },
  {
    index: "02",
    title: "Our services",
    body: (
      <>
        <p>
          Kyosys is a small agency offering five services: Web Development,
          Mobile App Development, Social Media Marketing, Search Engine
          Optimization, and Video Production.
        </p>
        <p>
          Anything you read on this website — service descriptions, sample
          work, and especially the <strong>quote estimator</strong> — is
          marketing information, not a contract. Estimates are
          non-binding until we both sign a written service agreement that
          locks in scope, price, and timeline.
        </p>
      </>
    ),
  },
  {
    index: "03",
    title: "Engaging us",
    body: (
      <>
        <p>
          When you contact us about a project, we typically agree on a written
          proposal or service agreement before any work starts. That agreement
          — not this website — defines what we deliver, what it costs, and
          when it&apos;s due. If the two ever conflict, the signed agreement
          wins.
        </p>
        <p>
          You&apos;re responsible for giving us accurate, timely information
          and materials (content, images, logins) so we can do our part.
        </p>
      </>
    ),
  },
  {
    index: "04",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use this website for anything unlawful or harmful.</li>
          <li>
            Try to break, overload, or gain unauthorised access to the site or
            its systems.
          </li>
          <li>
            Submit false, misleading, or someone else&apos;s information
            through our forms.
          </li>
          <li>
            Scrape, copy, or republish our content without permission (see
            below).
          </li>
        </ul>
      </>
    ),
  },
  {
    index: "05",
    title: "Intellectual property",
    body: (
      <>
        <p>
          Everything on this website — text, design, images, video, and code —
          belongs to Kyosys or our licensors and is protected by copyright and
          other IP laws. You may read, share links to, and download our
          content for personal reference, but you may not copy, republish, or
          use it commercially without our written permission.
        </p>
        <p>
          For paid client work, IP transfer is handled in your signed service
          agreement — as a rule, full rights transfer to you once the project
          is paid in full.
        </p>
      </>
    ),
  },
  {
    index: "06",
    title: "Liability limitation",
    body: (
      <>
        <p>
          We work hard and stand behind our work, but some limits apply:
        </p>
        <ul>
          <li>
            This website is provided &ldquo;as is&rdquo; — we don&apos;t
            guarantee it&apos;s error-free or always available.
          </li>
          <li>
            To the maximum extent allowed by law, our total liability to you
            for any claim is limited to the amount you actually paid us in the
            12 months before the claim (or ₹0 if you paid us nothing).
          </li>
          <li>
            We&apos;re not liable for indirect losses — lost profits, lost
            data, or business interruption — arising from using this website
            or, unless your signed agreement says otherwise, from our
            services.
          </li>
        </ul>
        <p>
          Nothing in these Terms limits rights you have under Indian law that
          can&apos;t be limited by contract.
        </p>
      </>
    ),
  },
  {
    index: "07",
    title: "Third-party links & content",
    body: (
      <>
        <p>
          Our site may link to third-party websites or services. We don&apos;t
          control them and aren&apos;t responsible for their content,
          privacy practices, or availability — their own terms apply.
        </p>
      </>
    ),
  },
  {
    index: "08",
    title: "Governing law",
    body: (
      <>
        <p>
          These Terms are governed by the laws of India. Any dispute will be
          subject to the exclusive jurisdiction of the courts at{" "}
          <strong>[STATE / CITY]</strong>.
        </p>
      </>
    ),
  },
  {
    index: "09",
    title: "Changes & contact",
    body: (
      <>
        <p>
          We may update these Terms from time to time; the &ldquo;Last
          updated&rdquo; date at the top shows the current version. Continued
          use of the site after changes means you accept them.
        </p>
        <p>
          Questions about these Terms? Reach us at{" "}
          <strong>[GRIEVANCE EMAIL]</strong> or through our{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Terms" }]}
            />
          </Reveal>
          <Reveal className="mt-8">
            <EditorialHeader
              index="00"
              eyebrow="Legal"
              title={
                <>
                  Terms of{" "}
                  <em className="font-serif font-medium italic">Service.</em>
                </>
              }
              description="The ground rules for using our website and working with us — written in plain language, not legalese."
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
              Planning a project with us? Let&apos;s put it in writing — the
              right way.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-900"
            >
              <span className="link-underline">Talk to us first</span>
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
