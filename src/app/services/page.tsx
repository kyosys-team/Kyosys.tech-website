import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Reveal } from "@/components/marketing/Reveal";
import { ServiceIndex } from "@/components/marketing/ServiceIndex";
import { CtaBand } from "@/components/marketing/CtaBand";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Our Services",
  description:
    "Web development, mobile apps, social media marketing, SEO, and video production — everything your business needs to grow online.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <EditorialHeader
              index="01"
              eyebrow="Services"
              title={
                <>
                  What can we do for{" "}
                  <em className="font-serif font-medium italic">your business?</em>
                </>
              }
              description="Five services, one accountable team. Pick one — or let us combine them into a growth plan."
            />
          </Reveal>
          <div className="mt-10 sm:mt-14">
            <ServiceIndex services={services} className="grad-rows" />
          </div>
          <Reveal className="mt-10">
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
              Every engagement starts with a free 30-minute call. We&apos;ll
              tell you honestly which service fits — even if the answer is
              &ldquo;you don&apos;t need us yet.&rdquo;
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
      <CtaBand
        index="02"
        eyebrow="Not sure yet"
        title={
          <>
            Not sure which service{" "}
            <em className="font-serif font-medium italic">fits?</em>
          </>
        }
        description="Describe your goal in one message. We'll point you to the right starting point — free, no sales pressure."
      />
    </>
  );
}
