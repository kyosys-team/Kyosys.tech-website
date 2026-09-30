"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";

type Props = {
  value: JSONContent | null;
  onChange: (doc: JSONContent) => void;
  id?: string;
};

const btn =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900 disabled:opacity-40";
const btnActive = "bg-neutral-900 text-white hover:bg-neutral-900";

function ToolButton({
  label,
  title,
  active,
  onClick,
  children,
}: {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      aria-pressed={!!active}
      className={`${btn} ${active ? btnActive : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function PostEditor({ value, onChange, id = "post-content" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: value ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        class:
          "tiptap-content min-h-64 rounded-b-lg border-0 bg-white p-4 focus:outline-none",
        "aria-label": "Post content",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getJSON()),
  });

  // If the form resets or a different post loads, sync new content in.
  const initialRef = useRef(value);
  useEffect(() => {
    if (editor && value && value !== initialRef.current) {
      initialRef.current = value;
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  }, [editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        toast.error("Only JPG, PNG or WebP images are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be 5MB or smaller");
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        toast.success("Image inserted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white focus-within:border-neutral-500">
      <div
        role="toolbar"
        aria-label="Formatting toolbar"
        className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5"
      >
        <ToolButton
          label="Heading 1"
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolButton>
        <ToolButton
          label="Heading 2"
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolButton>
        <ToolButton
          label="Heading 3"
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden />
        <ToolButton
          label="Bold"
          title="Bold (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolButton>
        <ToolButton
          label="Italic"
          title="Italic (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden />
        <ToolButton
          label="Bulleted list"
          title="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolButton>
        <ToolButton
          label="Numbered list"
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolButton>
        <ToolButton
          label="Quote"
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </ToolButton>
        <ToolButton
          label="Code block"
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden />
        <ToolButton
          label="Add link"
          title="Add or edit link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          Link
        </ToolButton>
        <ToolButton
          label="Upload image"
          title="Upload and insert image"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "…" : "Image"}
        </ToolButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label="Upload image"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadImage(f);
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
