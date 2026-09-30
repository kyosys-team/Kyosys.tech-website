"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast.success("Post deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
