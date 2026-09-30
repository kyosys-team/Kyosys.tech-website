"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import PostEditor from "./PostEditor";
import { slugify } from "@/lib/blog-validation";

type Category = { id: string; name: string };

export type PostInitial = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: JSONContent | null;
  coverImage: string | null;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string | null;
  seoDescription: string | null;
  authorName: string | null;
  authorBio: string | null;
};

const emptyPost: PostInitial = {
  title: "",
  slug: "",
  excerpt: "",
  content: null,
  coverImage: null,
  categoryId: "",
  status: "DRAFT",
  seoTitle: null,
  seoDescription: null,
  authorName: null,
  authorBio: null,
};

const input =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none";
const label = "mb-1.5 block text-sm font-medium text-neutral-700";
const errText = "mt-1 text-xs text-red-600";

export default function PostForm({
  initial = emptyPost,
  categories,
}: {
  initial?: PostInitial;
  categories: Category[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [content, setContent] = useState<JSONContent | null>(initial.content);
  const [coverImage, setCoverImage] = useState(initial.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initial.status);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription ?? "");
  const [authorName, setAuthorName] = useState(initial.authorName ?? "");
  const [authorBio, setAuthorBio] = useState(initial.authorBio ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initial.id;

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function uploadCover(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    setUploadingCover(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCoverImage(data.url);
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
      if (coverFileRef.current) coverFileRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
      coverImage: coverImage.trim() || null,
      categoryId,
      status,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      authorName: authorName.trim() || null,
      authorBio: authorBio.trim() || null,
    };
    try {
      const res = await fetch(
        isEdit ? `/api/admin/posts/${initial.id}` : "/api/admin/posts",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        toast.error(data.error || "Could not save the post");
        return;
      }
      toast.success(isEdit ? "Post updated" : "Post created");
      router.push("/admin/posts");
      router.refresh();
    } catch {
      toast.error("Could not save the post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div>
            <label htmlFor="post-title" className={label}>
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="post-title"
              className={input}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="How we ship websites in 4 weeks"
              required
            />
            {fieldErrors.title && <p className={errText}>{fieldErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="post-slug" className={label}>
              Slug <span className="text-red-600">*</span>
            </label>
            <input
              id="post-slug"
              className={input}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="how-we-ship-websites-in-4-weeks"
              required
            />
            <p className="mt-1 text-xs text-neutral-500">
              Auto-generated from the title; you can edit it. Must be unique.
            </p>
            {fieldErrors.slug && <p className={errText}>{fieldErrors.slug}</p>}
          </div>

          <div>
            <label htmlFor="post-excerpt" className={label}>
              Excerpt <span className="text-red-600">*</span>
            </label>
            <textarea
              id="post-excerpt"
              className={input}
              rows={3}
              maxLength={200}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One or two sentences shown on cards and in search results."
              required
            />
            <p
              className={`mt-1 text-xs ${excerpt.length > 160 ? "text-red-600" : "text-neutral-500"}`}
            >
              {excerpt.length}/160
            </p>
            {fieldErrors.excerpt && <p className={errText}>{fieldErrors.excerpt}</p>}
          </div>

          <div>
            <span className={label} id="post-content-label">
              Content
            </span>
            <div aria-labelledby="post-content-label">
              <PostEditor value={content} onChange={setContent} />
            </div>
            {fieldErrors.content && <p className={errText}>{fieldErrors.content}</p>}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <span className={label} id="post-status-label">
              Status
            </span>
            <div role="radiogroup" aria-labelledby="post-status-label" className="space-y-2">
              {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700"
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="h-4 w-4 accent-neutral-900"
                  />
                  {s === "DRAFT" ? "Draft" : "Published"}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {isEdit && status === "PUBLISHED"
                ? "Saving as published updates the publish date."
                : "Publishing sets the publish date to now."}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <label htmlFor="post-category" className={label}>
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="post-category"
              className={input}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && <p className={errText}>{fieldErrors.categoryId}</p>}
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-neutral-500">
                No categories yet — create one from{" "}
                <a href="/admin/categories" className="underline">
                  Categories
                </a>
                .
              </p>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <label htmlFor="post-cover-url" className={label}>
              Cover image
            </label>
            <input
              id="post-cover-url"
              className={input}
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://… or upload below"
              inputMode="url"
            />
            <button
              type="button"
              onClick={() => coverFileRef.current?.click()}
              disabled={uploadingCover}
              className="mt-2 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
            >
              {uploadingCover ? "Uploading…" : "Upload image (JPG/PNG/WebP, ≤5MB)"}
            </button>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Upload cover image"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadCover(f);
              }}
            />
            {coverImage && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="max-h-40 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="mt-1 text-xs text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            )}
            {fieldErrors.coverImage && <p className={errText}>{fieldErrors.coverImage}</p>}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <span className={label} id="post-seo-label">
              SEO
            </span>
            <div aria-labelledby="post-seo-label" className="space-y-3">
              <div>
                <label htmlFor="post-seo-title" className="mb-1 block text-xs text-neutral-600">
                  SEO title
                </label>
                <input
                  id="post-seo-title"
                  className={input}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to the post title"
                />
                <p className="mt-1 text-xs text-neutral-500">{seoTitle.length}/60</p>
                {fieldErrors.seoTitle && <p className={errText}>{fieldErrors.seoTitle}</p>}
              </div>
              <div>
                <label htmlFor="post-seo-desc" className="mb-1 block text-xs text-neutral-600">
                  SEO description
                </label>
                <textarea
                  id="post-seo-desc"
                  className={input}
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Defaults to the excerpt"
                />
                <p className="mt-1 text-xs text-neutral-500">{seoDescription.length}/160</p>
                {fieldErrors.seoDescription && <p className={errText}>{fieldErrors.seoDescription}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <span className={label} id="post-author-label">
              Author
            </span>
            <div aria-labelledby="post-author-label" className="space-y-3">
              <div>
                <label htmlFor="post-author-name" className="mb-1 block text-xs text-neutral-600">
                  Author name
                </label>
                <input
                  id="post-author-name"
                  className={input}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Abhishek"
                />
                <p className="mt-1 text-xs text-neutral-500">{authorName.length}/100</p>
                {fieldErrors.authorName && <p className={errText}>{fieldErrors.authorName}</p>}
              </div>
              <div>
                <label htmlFor="post-author-bio" className="mb-1 block text-xs text-neutral-600">
                  Author bio (one line)
                </label>
                <textarea
                  id="post-author-bio"
                  className={input}
                  rows={2}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="e.g. Co-founder & full-stack developer at Kyosys"
                />
                <p className="mt-1 text-xs text-neutral-500">{authorBio.length}/160</p>
                {fieldErrors.authorBio && <p className={errText}>{fieldErrors.authorBio}</p>}
              </div>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Shown on the article byline. Leave empty to credit the Kyosys team.
            </p>
          </div>
        </aside>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
