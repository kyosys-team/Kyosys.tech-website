"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/blog-validation";

type Category = { id: string; name: string; slug: string; _count: { posts: number } };

const input =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none";

export default function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
    }
    router.refresh();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, slug: slugify(trimmed) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create category");
      toast.success("Category created");
      setName("");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create category");
    } finally {
      setCreating(false);
    }
  }

  async function rename(id: string) {
    const trimmed = editName.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, slug: slugify(trimmed) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not rename category");
      toast.success("Category renamed");
      setEditingId(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not rename category");
    }
  }

  async function remove(cat: Category) {
    if (cat._count.posts > 0) {
      toast.error(
        `Cannot delete "${cat.name}" — ${cat._count.posts} post${cat._count.posts === 1 ? "" : "s"} still use it. Move or delete them first.`
      );
      return;
    }
    if (!window.confirm(`Delete the category "${cat.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete category");
      toast.success("Category deleted");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete category");
    }
  }

  return (
    <div>
      <form onSubmit={create} className="mb-6 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="cat-name" className="mb-1.5 block text-sm font-medium text-neutral-700">
            New category
          </label>
          <input
            id="cat-name"
            className={`${input} w-64`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Case studies"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {creating ? "Adding…" : "Add category"}
        </button>
      </form>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <p className="text-sm text-neutral-500">No categories yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Slug</th>
                <th scope="col" className="px-4 py-3 font-medium">Posts</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        className={`${input} w-48`}
                        value={editName}
                        autoFocus
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void rename(cat.id);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        aria-label="Category name"
                      />
                    ) : (
                      <span className="font-medium text-neutral-900">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">/{cat.slug}</td>
                  <td className="px-4 py-3 text-neutral-600">{cat._count.posts}</td>
                  <td className="px-4 py-3 text-right">
                    {editingId === cat.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void rename(cat.id)}
                          className="rounded-md px-2 py-1 font-medium text-neutral-900 hover:bg-neutral-100"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-md px-2 py-1 font-medium text-neutral-500 hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                          className="rounded-md px-2 py-1 font-medium text-neutral-700 hover:bg-neutral-100"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove(cat)}
                          disabled={cat._count.posts > 0}
                          title={
                            cat._count.posts > 0
                              ? "Cannot delete — posts still use this category"
                              : "Delete category"
                          }
                          className="rounded-md px-2 py-1 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-neutral-400 disabled:hover:bg-transparent"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
