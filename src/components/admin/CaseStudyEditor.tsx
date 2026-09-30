"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TiptapDoc = {
  type: "doc";
  content?: Record<string, unknown>[];
};

/**
 * Compact TipTap editor for case-study body content. Supports headings,
 * bold/italic, bullet + ordered lists, and quotes. Stores the TipTap JSON
 * document via onChange.
 */
export function CaseStudyEditor({
  initial,
  onChange,
}: {
  initial?: TiptapDoc | null;
  onChange: (doc: TiptapDoc) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initial ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap prose-like min-h-[240px] rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] leading-relaxed text-ink focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as TiptapDoc),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) {
    return (
      <div className="min-h-[240px] animate-pulse rounded-xl border border-ink/15 bg-slate-50" />
    );
  }

  const btn = (active: boolean) =>
    cn(
      "flex size-8 items-center justify-center rounded-lg transition-colors",
      active ? "bg-emerald-800 text-white" : "text-slate-600 hover:bg-slate-100"
    );

  return (
    <div>
      <div
        className="mb-2 flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5"
        role="toolbar"
        aria-label="Formatting"
      >
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold" title="Bold">
          <Bold className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic" title="Italic">
          <Italic className="size-4" aria-hidden="true" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading" title="Heading">
          <Heading2 className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Subheading" title="Subheading">
          <Heading3 className="size-4" aria-hidden="true" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list" title="Bullet list">
          <List className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered list" title="Numbered list">
          <ListOrdered className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Quote" title="Quote">
          <Quote className="size-4" aria-hidden="true" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
