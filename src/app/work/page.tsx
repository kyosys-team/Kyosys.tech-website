import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/marketing/Reveal";
import { CtaBand } from "@/components/marketing/CtaBand";
import { db, isDbConfigured } from "@/lib/db";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work — Client Case Studies",
  description:
    "Real projects, real outcomes. Case studies from Kyosys client work — published only when there's a genuine story to tell.",
};

async function getPublishedCaseStudies() {
  if (!isDbConfigured()) return [];
  try {
    return await db.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        client: true,
        industry: true,
        excerpt: true,
        coverImage: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function WorkPage() {
  const studies = await getPublishedCaseStudies();

  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Work" }]}
            />
          </Reveal>
          <Reveal className="mt-8">
            <EditorialHeader
              index="01"
              eyebrow="Selected work"
              title={
                <>
                  Proof, not{" "}
                  <em className="font-serif font-medium italic">promises.</em>
                </>
              }
              description="Every case study below is a real project with a real client. Nothing here is invented — if a slot is empty, we simply haven't earned it yet."
            />
          </Reveal>

          {studies.length === 0 ? (
            <Reveal className="mt-10 sm:mt-14">
              <div className="rounded-3xl border border-ink/10 bg-white/60 p-10 text-center sm:p-16">
                <p className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
                  Our first client stories will appear here.
                </p>
                <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                  Check back soon — or be the first.
                </p>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-950 px-7 py-3.5 text-base font-semibold text-paper transition-colors hover:bg-brand-900"
                >
                  Start your project
                  <ArrowRight
                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-2">
              {studies.map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <Link
                    href={`/work/${s.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-ink/10 bg-white/60 transition-shadow duration-300 hover:shadow-xl"
                  >
                    {s.coverImage ? (
                      <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                        <Image
                          src={s.coverImage}
                          alt={s.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="aspect-[16/9] bg-dark-gradient"
                      />
                    )}
                    <div className="p-6 sm:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                        {[s.client, s.industry].filter(Boolean).join(" · ") || "Case study"}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-brand-900">
                        <span className="link-underline">{s.title}</span>
                        <ArrowUpRight
                          className="ml-1 inline size-6 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </h2>
                      <p className="mt-3 leading-relaxed text-ink-soft">{s.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        index="02"
        eyebrow="Your turn"
        title={
          <>
            Want results like{" "}
            <em className="font-serif font-medium italic">these?</em>
          </>
        }
        description="Tell us about your project. If we're not the right fit, we'll say so — honestly."
      />
    </>
  );
}
