"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/**
 * Small share row for article pages: X, LinkedIn, WhatsApp share intents plus
 * a copy-link button with confirmation state.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "X",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (permissions / insecure context) — fall back
      // to selecting via a temporary textarea.
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
        Share
      </span>
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-brand-900 transition-colors hover:border-brand-700 hover:bg-brand-950 hover:text-paper"
        >
          {t.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-brand-900 transition-colors hover:border-brand-700 hover:bg-brand-950 hover:text-paper"
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="size-4" aria-hidden="true" /> Copied
          </>
        ) : (
          <>
            <Link2 className="size-4" aria-hidden="true" /> Copy link
          </>
        )}
      </button>
    </div>
  );
}
