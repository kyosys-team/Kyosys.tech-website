"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CaseStudyEditor, type TiptapDoc } from "@/components/admin/CaseStudyEditor";

export const SERVICE_OPTIONS = [
  { slug: "web-development", name: "Web Development" },
  { slug: "app-development", name: "Mobile App Development" },
  { slug: "social-media-marketing", name: "Social Media Marketing" },
  { slug: "seo", name: "Search Engine Optimization" },
  { slug: "video-production", name: "Video Production" },
] as const;

export interface CaseStudyFormData {
  id?: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  services: string[];
  excerpt: string;
  content: TiptapDoc | null;
  coverImage: string;
  results: { metric: string; value: string }[];
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
}

const empty: CaseStudyFormData = {
  title: "",
  slug: "",
  client: "",
  industry: "",
  services: [],
  excerpt: "",
  content: null,
  coverImage: "",
  results: [],
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

function Help({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-slate-400">{children}</p>;
}

export function CaseStudyForm({ initial }: { initial?: CaseStudyFormData }) {
  const router = useRouter();
  const [data, setData] = useState<CaseStudyFormData>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof CaseStudyFormData>(key: K, value: CaseStudyFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  function onTitleChange(title: string) {
    setData((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
  }

  function toggleService(slug: string) {
    setData((d) => ({
      ...d,
      services: d.services.includes(slug)
        ? d.services.filter((s) => s !== slug)
        : [...d.services, slug],
    }));
  }

  function setResult(i: number, key: "metric" | "value", value: string) {
    setData((d) => ({
      ...d,
      results: d.results.map((r, j) => (j === i ? { ...r, [key]: value } : r)),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(
        initial?.id ? `/api/admin/case-studies/${initial.id}` : "/api/admin/case-studies",
        {
          method: initial?.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = json.issues
          ? Object.entries(json.issues)
              .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
              .join(" · ")
          : json.error;
        throw new Error(detail || "Save failed");
      }
      toast.success(initial?.id ? "Case study updated" : "Case study created");
      router.push("/admin/case-studies");
      router.refresh();
    } catch (err) {
      toast.error("Could not save", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="c-title">Title *</FieldLabel>
          <Input id="c-title" required value={data.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="How we doubled enquiries for a Surat textile brand" />
        </div>
        <div>
          <FieldLabel htmlFor="c-slug">Slug *</FieldLabel>
          <Input
            id="c-slug"
            required
            value={data.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            placeholder="surat-textile-enquiries"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens only"
          />
          <Help>Auto-generated from the title; you can edit it. Must be unique.</Help>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="c-client">Client</FieldLabel>
          <Input id="c-client" value={data.client} onChange={(e) => set("client", e.target.value)} placeholder="Sharma Textiles" />
          <Help>Real client name only. Leave blank until a real project ships.</Help>
        </div>
        <div>
          <FieldLabel htmlFor="c-industry">Industry</FieldLabel>
          <Input id="c-industry" value={data.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Retail / Manufacturing" />
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Services involved</span>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((s) => (
            <label
              key={s.slug}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                data.services.includes(s.slug)
                  ? "border-emerald-800 bg-emerald-800 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={data.services.includes(s.slug)}
                onChange={() => toggleService(s.slug)}
              />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="c-excerpt">Excerpt *</FieldLabel>
        <Textarea
          id="c-excerpt"
          required
          value={data.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          maxLength={160}
          placeholder="One or two sentences summarising the outcome."
        />
        <Help>{data.excerpt.length}/160 characters — also used as the meta description fallback.</Help>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Story content</span>
        <CaseStudyEditor initial={data.content} onChange={(doc) => set("content", doc)} />
        <Help>Headings, bold/italic, lists and quotes. Write the real story — no invented details.</Help>
      </div>

      <div>
        <FieldLabel htmlFor="c-cover">Cover image URL</FieldLabel>
        <Input id="c-cover" type="url" value={data.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Results</span>
        <Help>Real numbers only. Shown as a metrics band on the public page; omit entirely if you have none yet.</Help>
        <div className="mt-2 space-y-2">
          {data.results.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input
                aria-label={`Result ${i + 1} metric`}
                value={r.metric}
                onChange={(e) => setResult(i, "metric", e.target.value)}
                placeholder="Enquiries per month"
                className="flex-1"
              />
              <Input
                aria-label={`Result ${i + 1} value`}
                value={r.value}
                onChange={(e) => setResult(i, "value", e.target.value)}
                placeholder="2×"
                className="w-36"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove result ${i + 1}`}
                onClick={() => set("results", data.results.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4 text-red-600" aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => set("results", [...data.results, { metric: "", value: "" }])}
            className="text-sm"
          >
            <Plus className="size-4" aria-hidden="true" /> Add result
          </Button>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="c-status">Status</FieldLabel>
        <Select id="c-status" value={data.status} onChange={(e) => set("status", e.target.value as "DRAFT" | "PUBLISHED")} className="max-w-xs">
          <option value="DRAFT">Draft — hidden from the public site</option>
          <option value="PUBLISHED">Published — visible on /work</option>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="c-seo-title">SEO title</FieldLabel>
          <Input id="c-seo-title" value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={70} placeholder="Defaults to the case study title" />
          <Help>{data.seoTitle.length}/70</Help>
        </div>
        <div>
          <FieldLabel htmlFor="c-seo-desc">SEO description</FieldLabel>
          <Textarea id="c-seo-desc" value={data.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} maxLength={160} placeholder="Defaults to the excerpt" className="min-h-[80px]" />
          <Help>{data.seoDescription.length}/160</Help>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : initial?.id ? "Save changes" : "Create case study"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/case-studies")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
