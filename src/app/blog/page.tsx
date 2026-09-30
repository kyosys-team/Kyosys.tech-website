import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { db, isDbConfigured } from "@/lib/db";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog",
  description:
    "Practical notes on websites, apps, SEO, and marketing from the Kyosys team — written for business owners, not developers.",
};

const PER_PAGE = 9;

type SearchParams = { page?: string; category?: string };

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function pageHref(page: number, categorySlug?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (categorySlug) params.set("category", categorySlug);
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const activeCategory = searchParams.category?.trim() || undefined;
  const requestedPage = parsePage(searchParams.page);

  const dbReady = isDbConfigured();

  const categories = dbReady
    ? await db.category.findMany({
        where: {
          posts: { some: { status: "PUBLISHED", publishedAt: { not: null } } },
        },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      })
    : [];

  const categoryExists =
    !activeCategory || categories.some((c) => c.slug === activeCategory);

  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { not: null },
    ...(activeCategory && categoryExists
      ? { category: { slug: activeCategory } }
      : {}),
  };

  const total = dbReady
    ? await db.post.count({ where })
    : 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(requestedPage, totalPages);

  const posts = dbReady
    ? await db.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          coverImage: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { name: true, slug: true } },
        },
      })
    : [];

  const activeCategoryName = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name
    : undefined;

  // "Start here" cue for first-time readers: the oldest published posts are
  // the most foundational. Only queried on the unfiltered first page.
  const showStarterCue = !activeCategory && page === 1;
  const starterPosts =
    dbReady && showStarterCue
      ? await db.post.findMany({
          where: { status: "PUBLISHED", publishedAt: { not: null } },
          orderBy: { publishedAt: "asc" },
          take: 3,
          select: { title: true, slug: true },
        })
      : [];

  return (
    <>
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container>
          <Reveal>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
            />
          </Reveal>
          <Reveal className="mt-8">
            <EditorialHeader
              index="06"
              eyebrow="Blog"
              title={
                <>
                  Notes on building{" "}
                  <em className="font-serif font-medium italic">
                    things that sell.
                  </em>
                </>
              }
              description="Practical writing on websites, apps, SEO, and marketing — for business owners, not developers."
            />
          </Reveal>

          {starterPosts.length >= 2 && (
            <Reveal className="mt-10">
              <div className="rounded-2xl border border-ink/10 bg-white/70 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
                  New here?
                </p>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  Start with these — the first things we wrote, and still the
                  best introduction to how we think.
                </p>
                <ul className="mt-5 space-y-3">
                  {starterPosts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-brand-950"
                      >
                        <span className="link-underline">{p.title}</span>
                        <ArrowRight
                          className="size-4 shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-ink/10 pt-5 text-[15px] text-ink-soft">
                  Here to hire us, not read?{" "}
                  <Link
                    href="/services"
                    className="font-semibold text-brand-900"
                  >
                    <span className="link-underline">See what we do</span>
                  </Link>
                </p>
              </div>
            </Reveal>
          )}

          {categories.length > 0 && (
            <Reveal className="mt-10">
              <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by category">
                <Link
                  href={pageHref(1)}
                  aria-current={!activeCategory ? "page" : undefined}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                    !activeCategory
                      ? "border-brand-950 bg-brand-950 text-paper"
                      : "border-ink/15 text-brand-900 hover:border-brand-700"
                  )}
                >
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={pageHref(1, c.slug)}
                    aria-current={activeCategory === c.slug ? "page" : undefined}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                      activeCategory === c.slug
                        ? "border-brand-950 bg-brand-950 text-paper"
                        : "border-ink/15 text-brand-900 hover:border-brand-700"
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <div className="mt-10 sm:mt-12">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-ink/10 bg-white p-10 text-center sm:p-14">
                <p className="font-display text-2xl font-extrabold tracking-tight text-brand-950">
                  {total === 0 && !activeCategory
                    ? "Articles are on the way."
                    : `No articles in ${activeCategoryName ?? "this category"} yet.`}
                </p>
                <p className="mx-auto mt-3 max-w-md text-ink-soft">
                  {total === 0 && !activeCategory
                    ? "We're writing our first pieces now. Check back soon — or tell us what you'd like us to cover."
                    : "Try another category, or browse everything we've published."}
                </p>
                {activeCategory && total === 0 && (
                  <Link
                    href="/blog"
                    className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-brand-900"
                  >
                    <span className="link-underline">View all articles</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((p, i) => (
                    <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
                      <PostCard
                        post={{
                          ...p,
                          publishedAt: p.publishedAt ?? p.createdAt,
                        }}
                      />
                    </Reveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-12 flex items-center justify-between border-t border-ink/10 pt-6"
                    aria-label="Blog pagination"
                  >
                    {page > 1 ? (
                      <Link
                        href={pageHref(page - 1, activeCategory)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900"
                      >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        <span className="link-underline">Newer</span>
                      </Link>
                    ) : (
                      <span />
                    )}
                    <p className="text-sm text-ink-soft">
                      Page {page} of {totalPages}
                    </p>
                    {page < totalPages ? (
                      <Link
                        href={pageHref(page + 1, activeCategory)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900"
                      >
                        <span className="link-underline">Older</span>
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span />
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
