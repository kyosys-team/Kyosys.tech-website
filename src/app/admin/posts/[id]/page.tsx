import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import DbNotice from "@/components/admin/DbNotice";
import PostForm, { type PostInitial } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit post | Kyosys Admin" };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  await requireAdminPage();
  if (!isDbConfigured()) return <DbNotice feature="blog management" />;

  const [post, categories] = await Promise.all([
    db.post.findUnique({ where: { id: params.id } }),
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!post) notFound();

  const initial: PostInitial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: (post.content ?? null) as JSONContent | null,
    coverImage: post.coverImage,
    categoryId: post.categoryId,
    status: post.status,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    authorName: post.authorName,
    authorBio: post.authorBio,
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/posts" className="text-sm text-neutral-500 underline hover:text-neutral-800">
          ← Back to posts
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit post</h1>
      </div>
      <PostForm initial={initial} categories={categories} />
    </div>
  );
}
