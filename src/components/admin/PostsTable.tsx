import Link from "next/link";
import DeletePostButton from "./DeletePostButton";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: Date;
  category: { name: string };
};

function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-700"
      }`}
    >
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}

export default function PostsTable({ posts }: { posts: PostRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <th scope="col" className="px-4 py-3 font-medium">Title</th>
            <th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Updated</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-900">{post.title}</div>
                <div className="text-xs text-neutral-500">/{post.slug}</div>
              </td>
              <td className="px-4 py-3 text-neutral-600">{post.category.name}</td>
              <td className="px-4 py-3">
                <StatusBadge status={post.status} />
              </td>
              <td className="px-4 py-3 text-neutral-500">
                {new Date(post.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="rounded-md px-2 py-1 font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
