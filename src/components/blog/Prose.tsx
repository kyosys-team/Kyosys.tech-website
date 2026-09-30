import Image from "next/image";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Safe recursive renderer for TipTap JSON documents.
 *
 * Renders paragraphs, headings 1–3, bullet/ordered lists, blockquotes, code
 * blocks, images, and text marks (bold / italic / underline / strike / code /
 * link) — with no dangerouslySetInnerHTML anywhere. Unknown node types render
 * nothing (fail safe), so editor upgrades can never break the page or inject
 * markup.
 */

type TipTapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TipTapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
};

function isExternal(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).hostname !== new URL(siteConfig.url).hostname;
  } catch {
    return true;
  }
}

function renderText(node: TipTapNode, key: string): React.ReactNode {
  let el: React.ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        el = <strong className="font-semibold text-brand-950">{el}</strong>;
        break;
      case "italic":
        el = <em>{el}</em>;
        break;
      case "underline":
        el = <u className="decoration-sun-400 decoration-2 underline-offset-2">{el}</u>;
        break;
      case "strike":
        el = <s>{el}</s>;
        break;
      case "code":
        el = (
          <code className="rounded bg-brand-950/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-brand-900">
            {el}
          </code>
        );
        break;
      case "link": {
        const href =
          typeof mark.attrs?.href === "string" ? mark.attrs.href : undefined;
        if (!href) break;
        const external = isExternal(href);
        el = (
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="font-medium text-brand-700 underline decoration-sun-400 decoration-2 underline-offset-2 transition-colors hover:text-brand-900"
          >
            {el}
          </a>
        );
        break;
      }
      default:
        break; // unknown marks are ignored — fail safe
    }
  }
  return <Fragment key={key}>{el}</Fragment>;
}

function renderNodes(nodes: TipTapNode[] | undefined, keyPrefix: string): React.ReactNode {
  if (!nodes || !Array.isArray(nodes)) return null;
  return nodes.map((node, i) => renderNode(node, `${keyPrefix}-${i}`));
}

function renderNode(node: TipTapNode, key: string): React.ReactNode {
  if (!node || typeof node !== "object" || typeof node.type !== "string") {
    return null;
  }

  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{renderNodes(node.content, key)}</Fragment>;

    case "text":
      return renderText(node, key);

    case "hardBreak":
      return <br key={key} />;

    case "paragraph":
      return (
        <p
          key={key}
          className="text-lg leading-relaxed text-ink-soft [&:not(:first-child)]:mt-6"
        >
          {renderNodes(node.content, key)}
        </p>
      );

    case "heading": {
      const level =
        typeof node.attrs?.level === "number"
          ? Math.min(3, Math.max(1, node.attrs.level))
          : 2;
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      return (
        <Tag
          key={key}
          className={cn(
            "font-display font-extrabold tracking-tight text-brand-950",
            level === 1 && "mt-10 text-3xl sm:text-4xl",
            level === 2 && "mt-10 text-2xl sm:text-3xl",
            level === 3 && "mt-8 text-xl sm:text-2xl"
          )}
        >
          {renderNodes(node.content, key)}
        </Tag>
      );
    }

    case "bulletList":
      return (
        <ul
          key={key}
          className="mt-6 list-disc space-y-3 pl-6 text-lg leading-relaxed text-ink-soft marker:text-sun-400"
        >
          {renderNodes(node.content, key)}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={key}
          className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-relaxed text-ink-soft marker:font-bold marker:text-brand-700"
        >
          {renderNodes(node.content, key)}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className="pl-1">
          {renderNodes(node.content, key)}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="mt-8 border-l-4 border-sun-400 bg-brand-950/[0.03] py-4 pl-6 pr-4"
        >
          <div className="font-serif text-xl italic leading-relaxed text-brand-900">
            {renderNodes(node.content, key)}
          </div>
        </blockquote>
      );

    case "codeBlock":
      return (
        <div key={key} className="mt-8 overflow-hidden rounded-xl bg-brand-950">
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-paper/90">
            <code>{renderNodes(node.content, key)}</code>
          </pre>
        </div>
      );

    case "image": {
      const src =
        typeof node.attrs?.src === "string" ? node.attrs.src : undefined;
      if (!src) return null;
      const alt =
        typeof node.attrs?.alt === "string" ? node.attrs.alt : "Article image";
      return (
        <figure key={key} className="mt-8 overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </figure>
      );
    }

    default:
      return null; // unknown node types render nothing — fail safe
  }
}

export function Prose({
  content,
  className,
}: {
  content: unknown;
  className?: string;
}) {
  const doc = (content ?? null) as TipTapNode | null;
  return (
    <div className={cn("prose-kyosys", className)}>
      {doc ? renderNode(doc, "root") : null}
    </div>
  );
}
