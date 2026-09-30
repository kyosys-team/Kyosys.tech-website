import Link from "next/link";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import DbNotice from "@/components/admin/DbNotice";
import PostsTable from "@/components/admin/PostsTable";

export const dynamic = "force-dynamic";

export const metadata = { title: "Posts | Kyosys Admin" };

type SearchParams = { q?: string; status?: string };

export default async function AdminPostsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminPage();
  if (!isDbConfigured()) return <DbNotice feature="blog management" />;

  const q = (searchParams.q ?? "").trim();
  const statusParam = (searchParams.status ?? "").toUpperCase();
  const statusFilter =
    statusParam === "DRAFT" || statusParam === "PUBLISHED" ? statusParam : undefined;

  const posts = await db.post.findMany({
    where: {
      ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          New post
        </Link>
      </div>

      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <label htmlFor="admin-post-search" className="sr-only">
          Search posts by title
        </label>
        <input
          id="admin-post-search"
          name="q"
          defaultValue={q}
          placeholder="Search by title…"
          className="w-64 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <label htmlFor="admin-post-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="admin-post-status"
          name="status"
          defaultValue={statusFilter ?? ""}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Filter
        </button>
        {(q || statusFilter) && (
          <Link href="/admin/posts" className="text-sm text-neutral-500 underline hover:text-neutral-800">
            Clear
          </Link>
        )}
      </form>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <p className="text-sm text-neutral-500">
            {q || statusFilter ? "No posts match your filters." : "No posts yet."}
          </p>
          {!q && !statusFilter && (
            <Link
              href="/admin/posts/new"
              className="mt-3 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Write the first post
            </Link>
          )}
        </div>
      ) : (
        <PostsTable posts={posts} />
      )}
    </div>
  );
}
