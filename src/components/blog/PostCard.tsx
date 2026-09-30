import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { readingTime } from "@/lib/reading-time";

export type BlogCardPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string };
};

export function formatPostDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Editorial article card: cover image, category kicker, title, excerpt
 * (≤160 chars), and a meta line with date + reading time. Used on the blog
 * index and the related-posts row.
 */
export function PostCard({ post }: { post: BlogCardPost }) {
  const excerpt =
    post.excerpt.length > 160 ? `${post.excerpt.slice(0, 157)}…` : post.excerpt;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(20,60,40,0.35)]"
    >
      {post.coverImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-950/5">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="wash-green relative aspect-[16/9] bg-brand-950">
          <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold text-sun-400/80">
            {post.category.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
          {post.category.name}
        </p>
        <h3 className="mt-3 font-display text-xl font-extrabold leading-snug tracking-tight text-brand-950">
          <span className="link-underline">{post.title}</span>
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
          {excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-sm text-ink-soft">
          <span>
            {formatPostDate(post.publishedAt)} · {readingTime(post.content)} min
            read
          </span>
          <ArrowUpRight
            className="size-4 text-brand-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
