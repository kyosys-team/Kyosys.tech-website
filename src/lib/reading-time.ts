/**
 * Reading-time estimate for TipTap JSON documents.
 * Walks the node tree, counts words, assumes ~200 wpm. Always ≥ 1 minute.
 */

function extractText(node: unknown): string {
  if (node == null || typeof node !== "object") return "";
  if (typeof node === "string") return node;
  const n = node as {
    text?: unknown;
    content?: unknown;
    type?: unknown;
  };
  const parts: string[] = [];
  if (typeof n.text === "string") parts.push(n.text);
  if (Array.isArray(n.content)) {
    for (const child of n.content) parts.push(extractText(child));
  }
  return parts.join(" ");
}

export function readingTime(tiptapJson: unknown): number {
  const words = extractText(tiptapJson)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
