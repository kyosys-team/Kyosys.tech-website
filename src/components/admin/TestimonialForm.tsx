"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface TestimonialFormData {
  id?: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  featured: boolean;
  approved: boolean;
  sample?: boolean;
}

const empty: TestimonialFormData = {
  name: "",
  role: "",
  company: "",
  quote: "",
  rating: 5,
  avatarUrl: "",
  featured: false,
  approved: false,
};

export function TestimonialForm({ initial }: { initial?: TestimonialFormData }) {
  const router = useRouter();
  const [data, setData] = useState<TestimonialFormData>(initial ?? empty);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(
        initial?.id ? `/api/admin/testimonials/${initial.id}` : "/api/admin/testimonials",
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
      toast.success(initial?.id ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      {initial?.sample && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          This is a SAMPLE placeholder. Update it with a real client testimonial —
          samples never appear on the public site.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="t-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name *
          </label>
          <Input id="t-name" required value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Ananya Iyer" />
        </div>
        <div>
          <label htmlFor="t-role" className="mb-1.5 block text-sm font-medium text-slate-700">
            Role *
          </label>
          <Input id="t-role" required value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="Founder" />
        </div>
      </div>
      <div>
        <label htmlFor="t-company" className="mb-1.5 block text-sm font-medium text-slate-700">
          Company
        </label>
        <Input id="t-company" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Iyer Foods, Bengaluru" />
      </div>
      <div>
        <label htmlFor="t-quote" className="mb-1.5 block text-sm font-medium text-slate-700">
          Quote *
        </label>
        <Textarea
          id="t-quote"
          required
          value={data.quote}
          onChange={(e) => set("quote", e.target.value)}
          placeholder="Paste the client's own words — never invent or paraphrase quotes."
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-slate-400">{data.quote.length}/2000</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="t-rating" className="mb-1.5 block text-sm font-medium text-slate-700">
            Rating
          </label>
          <Select id="t-rating" value={String(data.rating)} onChange={(e) => set("rating", Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} star{r > 1 ? "s" : ""}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="t-avatar" className="mb-1.5 block text-sm font-medium text-slate-700">
            Avatar image URL
          </label>
          <Input
            id="t-avatar"
            type="url"
            value={data.avatarUrl}
            onChange={(e) => set("avatarUrl", e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="size-4 accent-emerald-800"
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={data.approved}
            onChange={(e) => set("approved", e.target.checked)}
            className="size-4 accent-emerald-800"
          />
          Approved for public display
        </label>
      </div>
      <p className="text-xs text-slate-400">
        Only testimonials that are <strong>featured</strong> and <strong>approved</strong>{" "}
        (and not samples) appear on the homepage.
      </p>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : initial?.id ? "Save changes" : "Create testimonial"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/testimonials")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
