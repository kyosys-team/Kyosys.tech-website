import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/marketing/Reveal";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { CtaBand } from "@/components/marketing/CtaBand";
import {
  getService,
  getRelatedServices,
  serviceSlugs,
} from "@/lib/services";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.name} Services`,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();

  const related = getRelatedServices(service.slug);
  const position = serviceSlugs.indexOf(service.slug);

  const projectNoun: Record<string, string> = {
    "web-development": "website",
    "app-development": "mobile app",
    "social-media-marketing": "social media",
    seo: "SEO",
    "video-production": "video",
  };
  const noun = projectNoun[service.slug] ?? service.shortName.toLowerCase();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb + editorial header */}
      <section className="wash-sun bg-paper pb-12 pt-10 sm:pb-16 sm:pt-14">
        <Container>
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="link-underline hover:text-brand-900">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
                <li><Link href="/services" className="link-underline hover:text-brand-900">Services</Link></li>
                <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
                <li aria-current="page" className="font-bold text-brand-900">
                  {service.name}
                </li>
              </ol>
            </nav>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              {String(position + 1).padStart(2, "0")} <span aria-hidden="true" className="mx-1">—</span> Service
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-brand-900">
              {service.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-2xl">
              {service.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/quote?service=${service.slug}`}
                className="btn-sun group inline-flex h-14 items-center gap-2.5 rounded-full px-9 text-base font-bold text-white"
              >
                Get an Instant Estimate
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="link-underline text-base font-semibold text-brand-900"
              >
                Talk to Us
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Overview — long-form with drop cap */}
      <section className="border-t border-ink/10 bg-paper py-14 sm:py-20" aria-labelledby="overview-heading">
        <Container className="max-w-3xl">
          <Reveal>
            <h2 id="overview-heading" className="sr-only">Overview</h2>
            {service.overview.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "dropcap text-xl leading-relaxed text-ink sm:text-[1.35rem]"
                    : "mt-6 text-lg leading-relaxed text-ink-soft"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Deliverables — numbered editorial list */}
      <section className="bg-brand-950 bg-dark-gradient py-14 text-paper sm:py-20" aria-labelledby="deliverables-heading">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-400">
              02 <span aria-hidden="true" className="mx-1">—</span> What&apos;s included
            </p>
            <h2
              id="deliverables-heading"
              className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              What does this service <em className="font-serif font-medium italic">include?</em>
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {service.deliverables.map((d, i) => (
              <Reveal key={d} delay={Math.min(i * 50, 300)}>
                <li className="row-sweep-dark flex items-baseline gap-5 border-t border-white/15 py-5">
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-display text-sm font-bold tabular-nums text-sun-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[17px] font-medium leading-relaxed">{d}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Process */}
      <section className="wash-green bg-paper py-14 sm:py-20" aria-labelledby="process-heading">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              03 <span aria-hidden="true" className="mx-1">—</span> How we work
            </p>
            <h2
              id="process-heading"
              className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl"
            >
              How does the{" "}
              <em className="font-serif font-medium italic">process</em> work?
            </h2>
          </Reveal>
          <ProcessTimeline
            steps={service.process.map((st) => ({
              title: st.title,
              description: st.description,
            }))}
          />
        </Container>
      </section>

      {/* Tech + FAQs */}
      <section className="border-t border-ink/10 bg-paper py-14 sm:py-20" aria-labelledby="faq-heading">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              04 <span aria-hidden="true" className="mx-1">—</span> Toolkit
            </p>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
              What tools and <em className="font-serif font-medium italic">technologies</em> do we use?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft" aria-label="Technologies we use">
              {service.tech.join("  ·  ")}
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              05 <span aria-hidden="true" className="mx-1">—</span> Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-4 font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl"
            >
              Common <em className="font-serif font-medium italic">questions.</em>
            </h2>
          </Reveal>
          <div className="mt-6 border-b border-ink/15">
            {service.faqs.map((f) => (
              <details
                key={f.question}
                className="group border-t border-ink/15"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 transition-colors duration-300 hover:bg-ink/[0.03] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg font-bold tracking-tight text-brand-900 transition-colors duration-300 group-hover:text-brand-700 sm:text-xl">
                    {f.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-brand-700 transition-all duration-300 group-hover:border-brand-700 group-open:rotate-45 group-open:border-brand-900 group-open:bg-brand-900 group-open:text-paper"
                  >
                    <Plus className="size-4" />
                  </span>
                </summary>
                {/* Smooth open/close: grid-rows 0fr → 1fr animation */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Related services — mini index */}
      <section className="bg-paper py-14 sm:py-20" aria-labelledby="related-heading">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              06 <span aria-hidden="true" className="mx-1">—</span> Keep exploring
            </p>
            <h2
              id="related-heading"
              className="mt-4 font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl"
            >
              Which services pair <em className="font-serif font-medium italic">well</em> with this?
            </h2>
          </Reveal>
          <div className="mt-8 border-b border-ink/15">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 60}>
                <Link
                  href={`/services/${r.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-t border-ink/15 py-5 transition-colors duration-300 hover:bg-brand-950 sm:grid-cols-[3.5rem_1fr_auto] sm:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-sm font-bold tabular-nums text-ink-soft transition-colors duration-300 group-hover:text-sun-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-extrabold tracking-tight text-brand-900 transition-colors duration-300 group-hover:text-paper sm:text-2xl">
                      {r.shortName}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft transition-colors duration-300 group-hover:text-white/70">
                      {r.tagline}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-brand-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sun-400"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        index="07"
        eyebrow="Start a project"
        title={
          <>
            Ready to start your {noun}{" "}
            <em className="font-serif font-medium italic">project?</em>
          </>
        }
        description="Get an instant estimate, or just say hello — we reply within 24 hours."
      />
    </>
  );
}
