import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { Prose } from "@/components/blog/Prose";
import { formatPostDate } from "@/components/blog/PostCard";
import { ArticleNextSteps } from "@/components/blog/ArticleNextSteps";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { db, isDbConfigured } from "@/lib/db";
import { readingTime } from "@/lib/reading-time";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string };

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

async function getPost(slug: string) {
  if (!isDbConfigured()) return null;
  return db.post.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { not: null } },
    include: { category: { select: { name: true, slug: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article not found" };

  const title = truncate(post.seoTitle || post.title, 60);
  const description = truncate(post.seoDescription || post.excerpt, 160);
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName || "Kyosys Team"],
      ...(post.coverImage
        ? { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const publishedAt = post.publishedAt ?? post.createdAt;
  const minutes = readingTime(post.content);
  const url = `${siteConfig.url}/blog/${post.slug}`;

  // Related reading: same category first, then the latest published posts
  // to fill up to 3 — so the "keep reading" row never sits half-empty.
  const relatedSelect = {
    title: true,
    slug: true,
    excerpt: true,
    content: true,
    coverImage: true,
    publishedAt: true,
    createdAt: true,
    category: { select: { name: true, slug: true } },
  } as const;

  const relatedSameCategory = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      categoryId: post.categoryId,
      slug: { not: post.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: relatedSelect,
  });

  const related =
    relatedSameCategory.length < 3
      ? [
          ...relatedSameCategory,
          ...(await db.post.findMany({
            where: {
              status: "PUBLISHED",
              publishedAt: { not: null },
              slug: {
                notIn: [post.slug, ...relatedSameCategory.map((r) => r.slug)],
              },
            },
            orderBy: { publishedAt: "desc" },
            take: 3 - relatedSameCategory.length,
            select: relatedSelect,
          })),
        ]
      : relatedSameCategory;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.authorName
      ? {
          "@type": "Person",
          name: post.authorName,
          ...(post.authorBio ? { description: post.authorBio } : {}),
        }
      : { "@type": "Organization", name: "Kyosys", url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: "Kyosys",
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <article className="bg-paper pb-16 pt-10 sm:pb-24 sm:pt-14">
        <Container className="max-w-3xl">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </Reveal>

          <Reveal className="mt-8">
            <div className="border-t border-ink/15 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
                {post.category.name}
              </p>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-brand-950 sm:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
                <span className="font-semibold text-brand-900">
                  {post.authorName || "Kyosys Team"}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={publishedAt.toISOString()}>
                  {formatPostDate(publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{minutes} min read</span>
              </div>
            </div>
          </Reveal>

          {post.coverImage && (
            <Reveal className="mt-8">
              <figure className="overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </figure>
            </Reveal>
          )}

          <div className="mt-8 sm:mt-10">
            <Prose content={post.content} />
          </div>

          <div className="mt-12 border-t border-ink/15 pt-6">
            <ShareButtons url={url} title={post.title} />
          </div>
        </Container>

        <ArticleNextSteps
          related={related.map((r) => ({
            ...r,
            publishedAt: r.publishedAt ?? r.createdAt,
          }))}
        />
      </article>
    </>
  );
}
