import Link from "next/link";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import DbNotice from "@/components/admin/DbNotice";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "New post | Kyosys Admin" };

export default async function NewPostPage() {
  await requireAdminPage();
  if (!isDbConfigured()) return <DbNotice feature="blog management" />;

  const categories = await db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/posts" className="text-sm text-neutral-500 underline hover:text-neutral-800">
          ← Back to posts
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New post</h1>
      </div>
      <PostForm categories={categories} />
    </div>
  );
}
