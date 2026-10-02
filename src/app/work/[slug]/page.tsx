import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/marketing/Reveal";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Prose } from "@/components/blog/Prose";
import { db, isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { serviceOptions } from "@/lib/services";

export const revalidate = 60;
export const dynamicParams = true;

type ResultPair = { metric: string; value: string };

function parseResults(raw: unknown): ResultPair[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (r): r is { metric: unknown; value: unknown } =>
        !!r && typeof r === "object"
    )
    .filter((r) => typeof r.metric === "string" && typeof r.value === "string" && r.metric && r.value)
    .map((r) => ({ metric: r.metric as string, value: r.value as string }));
}

function serviceName(slug: string): string {
  return serviceOptions.find((s) => s.slug === slug)?.name ?? slug;
}

async function getCaseStudy(slug: string) {
  if (!isDbConfigured()) return null;
  try {
    return await db.caseStudy.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const study = await getCaseStudy(params.slug);
  if (!study) return { title: "Case study not found" };
  const title = study.seoTitle?.trim() || study.title;
  const description = study.seoDescription?.trim() || study.excerpt;
  const url = `${siteConfig.url}/work/${study.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      ...(study.coverImage ? { images: [{ url: study.coverImage }] } : {}),
    },
    twitter: {
      card: study.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(study.coverImage ? { images: [study.coverImage] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = await getCaseStudy(params.slug);
  // Drafts and missing studies are never public — same as a 404.
  if (!study) notFound();

  const results = parseResults(study.results);
  const published = study.publishedAt ?? study.createdAt;
  const url = `${siteConfig.url}/work/${study.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.excerpt,
    url,
    datePublished: published.toISOString(),
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(study.coverImage ? { image: study.coverImage } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="wash-sun bg-paper pb-14 pt-14 sm:pb-20 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: "/work" },
                { label: study.title },
              ]}
            />
          </Reveal>
          <Reveal className="mt-6">
            <EditorialHeader
              index="01"
              eyebrow={[study.client, study.industry].filter(Boolean).join(" · ") || "Case study"}
              title={study.title}
              description={study.excerpt}
            />
          </Reveal>

          {study.coverImage && (
            <Reveal className="mt-8 sm:mt-10">
              <Image
                src={study.coverImage}
                alt=""
                width={1280}
                height={720}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="aspect-[16/9] w-full rounded-3xl object-cover"
              />
            </Reveal>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-ink/10 py-4 text-sm">
            {study.client && (
              <p>
                <span className="font-bold uppercase tracking-[0.18em] text-brand-700 text-xs">Client</span>
                <span className="ml-2 font-medium text-ink">{study.client}</span>
              </p>
            )}
            {study.industry && (
              <p>
                <span className="font-bold uppercase tracking-[0.18em] text-brand-700 text-xs">Industry</span>
                <span className="ml-2 font-medium text-ink">{study.industry}</span>
              </p>
            )}
            <p>
              <span className="font-bold uppercase tracking-[0.18em] text-brand-700 text-xs">Published</span>
              <span className="ml-2 font-medium text-ink">
                {published.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </p>
          </div>

          {study.services.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Services involved">
              {study.services.map((slug) => (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-brand-900 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-paper"
                >
                  {serviceName(slug)}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {results.length > 0 && (
        <section className="bg-dark-gradient py-12 sm:py-16" aria-label="Results">
          <Container>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-400">
                02 — Results
              </p>
              <dl className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((r) => (
                  <div key={r.metric} className="border-t border-white/15 pt-4">
                    <dt className="text-sm font-medium text-white/70">{r.metric}</dt>
                    <dd className="mt-1 font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              {results.length > 0 ? "03" : "02"} — The story
            </p>
            <div className="mt-6 max-w-3xl">
              <Prose content={study.content} />
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        index={results.length > 0 ? "04" : "03"}
        eyebrow="Your project"
        title={
          <>
            Want a story like{" "}
            <em className="font-serif font-medium italic">this one?</em>
          </>
        }
        description="Tell us where your business is and where you want it to be. We'll map the honest path there."
      />
    </>
  );
}
