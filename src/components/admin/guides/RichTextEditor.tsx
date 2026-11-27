"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Table2,
  Lightbulb,
  AlertTriangle,
  Info,
  ShieldAlert,
  ClipboardPaste,
  FileCode2,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/common/ImageUpload";
import {
  htmlToMarkdown,
  hasRichHtmlFormatting,
  looksLikeHtmlSource,
  normalizeMarkdownSpacing,
  convertRawPasteToMarkdown,
} from "./markdownUtils";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  onRegisterPendingImage?: (blobUrl: string, file: File) => void;
}

export interface TextBlock {
  id: string;
  type: "text";
  content: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  caption: string;
}

export type EditorBlock = TextBlock | ImageBlock;

// Parses raw markdown into structured text and inline image blocks
export function parseMarkdownToBlocks(markdown: string): EditorBlock[] {
  if (!markdown || !markdown.trim()) {
    return [{ id: "text-initial", type: "text", content: "" }];
  }

  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const blocks: EditorBlock[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(markdown)) !== null) {
    const textBefore = markdown.substring(lastIndex, match.index);
    blocks.push({
      id: `text-${idx++}`,
      type: "text",
      content: textBefore.replace(/^\n+/, "").replace(/\n+$/, ""),
    });

    blocks.push({
      id: `img-${idx++}`,
      type: "image",
      caption: match[1] || "",
      url: match[2] || "",
    });

    lastIndex = match.index + match[0].length;
  }

  const textAfter = markdown.substring(lastIndex);
  blocks.push({
    id: `text-${idx++}`,
    type: "text",
    content: textAfter.replace(/^\n+/, "").replace(/\n+$/, ""),
  });

  return blocks;
}

// Serializes structured blocks back to standard markdown
export function serializeBlocksToMarkdown(blocks: EditorBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.type === "text") {
      if (block.content.trim()) {
        parts.push(block.content.trim());
      }
    } else if (block.type === "image" && block.url.trim()) {
      parts.push(`![${block.caption.trim()}](${block.url.trim()})`);
    }
  }
  return parts.join("\n\n");
}

export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Formats ***bold italic***, **bold**, __bold__, *italic*, _italic_, `code`, and [links](url) inline
function formatInlineText(rawText: string): React.ReactNode {
  const text = decodeHtmlEntities(rawText);
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("***") && token.endsWith("***")) {
      parts.push(
        <strong key={match.index} className="font-bold italic text-ink">
          {token.slice(3, -3)}
        </strong>
      );
    } else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      parts.push(
        <strong key={match.index} className="font-bold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-ink">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-surface-muted border border-border-peach/70 font-mono text-[0.85em] text-coral"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const href = linkMatch[2].trim();
        const isSafe = /^(https?:|mailto:|\/|#)/i.test(href);
        if (isSafe) {
          parts.push(
            <a
              key={match.index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral hover:underline font-semibold"
            >
              {formatInlineText(linkMatch[1])}
            </a>
          );
        } else {
          parts.push(linkMatch[1]);
        }
      } else {
        parts.push(token);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Helper: Split a Markdown table row `| a | b |` cleanly (respecting escaped `\|`)
function parseTableRow(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|") && !trimmed.endsWith("\\|")) trimmed = trimmed.slice(0, -1);

  const cells: string[] = [];
  let current = "";
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === "\\" && trimmed[i + 1] === "|") {
      current += "|";
      i++;
    } else if (trimmed[i] === "|") {
      cells.push(current.trim());
      current = "";
    } else {
      current += trimmed[i];
    }
  }
  cells.push(current.trim());
  return cells;
}

function isTableSeparatorRow(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("|") && !trimmed.includes("-")) return false;
  const cells = parseTableRow(trimmed);
  return (
    cells.length >= 2 &&
    cells.every((c) => /^:?-{2,}:?$/.test(c.trim()))
  );
}

type CalloutVariant = "tip" | "note" | "warning" | "important";

function resolveCalloutVariant(raw: string): CalloutVariant {
  const upper = raw.toUpperCase();
  if (upper === "TIP" || upper === "SUCCESS") return "tip";
  if (upper === "WARNING" || upper === "CAUTION" || upper === "ALERT") return "warning";
  if (upper === "IMPORTANT" || upper === "VET" || upper === "CLINICAL") return "important";
  return "note";
}

const CALLOUT_STYLES: Record<
  CalloutVariant,
  {
    wrapper: string;
    title: string;
    defaultLabel: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  tip: {
    wrapper:
      "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/70 border-l-emerald-500",
    title: "text-emerald-700 dark:text-emerald-400",
    defaultLabel: "Vet Tip",
    Icon: Lightbulb,
  },
  note: {
    wrapper:
      "bg-sky-50/70 dark:bg-sky-950/30 border-sky-300/80 dark:border-sky-800/70 border-l-sky-500",
    title: "text-sky-700 dark:text-sky-400",
    defaultLabel: "Note",
    Icon: Info,
  },
  warning: {
    wrapper:
      "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/70 border-l-amber-500",
    title: "text-amber-700 dark:text-amber-400",
    defaultLabel: "Caution",
    Icon: AlertTriangle,
  },
  important: {
    wrapper: "bg-tint-rose/70 border-coral/30 border-l-coral",
    title: "text-coral",
    defaultLabel: "Important",
    Icon: ShieldAlert,
  },
};

type ParsedBlock =
  | { type: "image"; caption: string; url: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "hr" }
  | { type: "code"; lang: string; code: string }
  | {
      type: "table";
      headers: string[];
      alignments: ("left" | "center" | "right")[];
      rows: string[][];
    }
  | { type: "callout"; variant: CalloutVariant; title: string; lines: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "paragraph"; text: string };

function isSpecialBlockStart(lines: string[], idx: number): boolean {
  const line = lines[idx]?.trim() || "";
  if (!line) return true;
  if (/^!\[(.*?)\]\((.*?)\)$/.test(line)) return true;
  if (/^#{1,4}\s+/.test(line)) return true;
  if (/^(---|___|\*\*\*)$/.test(line)) return true;
  if (/^```/.test(line)) return true;
  if (/^:::(tip|note|info|warning|caution|important|vet|callout)/i.test(line)) return true;
  if (/^>\s?/.test(line)) return true;
  if (/^[-*•]\s+/.test(line)) return true;
  if (/^\d+\.\s+/.test(line)) return true;
  if (line.includes("|") && idx + 1 < lines.length && isTableSeparatorRow(lines[idx + 1])) {
    return true;
  }
  return false;
}

function parseContentBlocks(content: string): ParsedBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const result: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Standalone Image: ![caption](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      result.push({ type: "image", caption: imgMatch[1], url: imgMatch[2] });
      i++;
      continue;
    }

    // 2. Headings (# / ## -> h2, ### -> h3, #### -> h4)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const hashes = headingMatch[1].length;
      const level: 2 | 3 | 4 = hashes <= 2 ? 2 : hashes === 3 ? 3 : 4;
      result.push({ type: "heading", level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // 3. Divider: --- / *** / ___
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      result.push({ type: "hr" });
      i++;
      continue;
    }

    // 4. Fenced Code Block: ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      result.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    // 5. Fenced Callout: :::tip Title ... :::
    const fencedCallout = trimmed.match(
      /^:::(tip|note|info|warning|caution|important|vet|callout)(?:\s+(.*))?$/i
    );
    if (fencedCallout) {
      const variant = resolveCalloutVariant(fencedCallout[1]);
      const customTitle = (fencedCallout[2] || "").trim();
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        bodyLines.push(lines[i].trim());
        i++;
      }
      if (i < lines.length) i++; // skip closing :::
      result.push({
        type: "callout",
        variant,
        title: customTitle || CALLOUT_STYLES[variant].defaultLabel,
        lines: bodyLines,
      });
      continue;
    }

    // 6. Markdown Pipe Table
    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparatorRow(lines[i + 1])) {
      const headers = parseTableRow(trimmed);
      const sepCells = parseTableRow(lines[i + 1]);
      const alignments: ("left" | "center" | "right")[] = headers.map((_, colIdx) => {
        const marker = (sepCells[colIdx] || "").trim();
        if (marker.startsWith(":") && marker.endsWith(":")) return "center";
        if (marker.endsWith(":")) return "right";
        return "left";
      });

      const rows: string[][] = [];
      i += 2;
      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine || !rowLine.includes("|")) break;
        rows.push(parseTableRow(rowLine));
        i++;
      }

      result.push({ type: "table", headers, alignments, rows });
      continue;
    }

    // 7. Blockquote or GitHub/Obsidian Callout (> [!TIP] Title)
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }

      const calloutHeader = quoteLines[0]?.match(
        /^\[!(TIP|NOTE|INFO|WARNING|CAUTION|IMPORTANT|VET)\](?:\s+(.*))?$/i
      );
      if (calloutHeader) {
        const variant = resolveCalloutVariant(calloutHeader[1]);
        const customTitle = (calloutHeader[2] || "").trim();
        result.push({
          type: "callout",
          variant,
          title: customTitle || CALLOUT_STYLES[variant].defaultLabel,
          lines: quoteLines.slice(1),
        });
      } else {
        result.push({ type: "blockquote", lines: quoteLines });
      }
      continue;
    }

    // 8. Unordered List (- / * / •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, "").trim());
        i++;
      }
      result.push({ type: "ul", items });
      continue;
    }

    // 9. Ordered List (1. 2. ...)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      result.push({ type: "ol", items });
      continue;
    }

    // 10. Standard Paragraph (collect consecutive plain lines)
    const paraLines: string[] = [trimmed];
    i++;
    while (i < lines.length && !isSpecialBlockStart(lines, i)) {
      paraLines.push(lines[i].trim());
      i++;
    }
    result.push({ type: "paragraph", text: paraLines.join(" ") });
  }

  return result;
}

// Standalone renderer for guide content supporting headings, bold/italic, lists, tables, callouts, quotes, dividers, images
export function ArticleContentRenderer({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="py-12 text-center text-ink-muted italic text-sm">
        No content written yet. Start writing or paste formatted Markdown / HTML.
      </div>
    );
  }

  // Auto-normalize raw HTML into clean Markdown if HTML tags are detected
  const normalizedContent = looksLikeHtmlSource(content)
    ? htmlToMarkdown(content)
    : content;

  const parsedBlocks = parseContentBlocks(normalizedContent);

  return (
    <div className="space-y-4 text-ink leading-relaxed">
      {parsedBlocks.map((block, idx) => {
        if (block.type === "image") {
          return (
            <figure
              key={idx}
              className="my-5 rounded-lg overflow-hidden border border-border-peach bg-surface-muted/30 shadow-xs"
            >
              <div className="relative w-full aspect-video bg-surface-muted">
                <Image
                  src={block.url}
                  alt={block.caption || "Article visual reference"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              {block.caption && (
                <figcaption className="py-2.5 px-4 text-center text-xs font-medium text-ink-muted bg-card border-t border-border-peach">
                  {formatInlineText(block.caption)}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "heading") {
          if (block.level === 2) {
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-bold font-quicksand text-ink pt-4 pb-1.5 border-b border-border-peach/60"
              >
                {formatInlineText(block.text)}
              </h2>
            );
          }
          if (block.level === 3) {
            return (
              <h3
                key={idx}
                className="text-lg sm:text-xl font-bold font-quicksand text-ink pt-3"
              >
                {formatInlineText(block.text)}
              </h3>
            );
          }
          return (
            <h4
              key={idx}
              className="text-base font-bold font-quicksand text-coral pt-2"
            >
              {formatInlineText(block.text)}
            </h4>
          );
        }

        if (block.type === "hr") {
          return <hr key={idx} className="my-6 border-border-peach" />;
        }

        if (block.type === "code") {
          return (
            <pre
              key={idx}
              className="p-4 rounded-lg bg-surface-muted border border-border-peach overflow-x-auto text-xs font-mono text-ink leading-relaxed"
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "table") {
          const isKeyValue = block.headers.length === 2;
          return (
            <div
              key={idx}
              className="my-4 w-full overflow-x-auto rounded-lg border border-border-peach bg-card shadow-2xs"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-muted/80 border-b border-border-peach">
                    {block.headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className={cn(
                          "px-4 py-3 font-quicksand font-bold text-ink text-xs uppercase tracking-wider whitespace-nowrap",
                          block.alignments[hIdx] === "center" && "text-center",
                          block.alignments[hIdx] === "right" && "text-right"
                        )}
                      >
                        {formatInlineText(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-peach/60">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-surface-soft/60 transition-colors"
                    >
                      {block.headers.map((_, cIdx) => {
                        const cellVal = row[cIdx] || "";
                        return (
                          <td
                            key={cIdx}
                            className={cn(
                              "px-4 py-3 text-ink font-medium align-top leading-relaxed",
                              isKeyValue && cIdx === 0 && "font-bold text-ink w-1/3",
                              block.alignments[cIdx] === "center" && "text-center",
                              block.alignments[cIdx] === "right" && "text-right"
                            )}
                          >
                            {formatInlineText(cellVal)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "callout") {
          const style = CALLOUT_STYLES[block.variant];
          const IconComp = style.Icon;
          const bodyText = block.lines.filter((l) => l.length > 0);
          const isBulletBody =
            bodyText.length > 0 && bodyText.every((l) => /^[-*•]\s+/.test(l));

          return (
            <div
              key={idx}
              className={cn(
                "my-4 p-4 rounded-lg border border-l-4 space-y-2",
                style.wrapper
              )}
            >
              <div className={cn("flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-quicksand", style.title)}>
                <IconComp className="size-4 shrink-0" />
                <span>{formatInlineText(block.title)}</span>
              </div>
              {bodyText.length > 0 &&
                (isBulletBody ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink font-medium leading-relaxed">
                    {bodyText.map((item, bIdx) => (
                      <li key={bIdx}>
                        {formatInlineText(item.replace(/^[-*•]\s+/, ""))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-1.5 text-sm text-ink font-medium leading-relaxed">
                    {bodyText.map((line, lIdx) => (
                      <p key={lIdx}>{formatInlineText(line)}</p>
                    ))}
                  </div>
                ))}
            </div>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-coral bg-tint-rose/50 p-4 rounded-r-xl italic text-ink font-medium my-3 text-[15px] sm:text-base space-y-1.5 leading-relaxed"
            >
              {block.lines.map((line, lIdx) => (
                <p key={lIdx}>{formatInlineText(line)}</p>
              ))}
            </blockquote>
          );
        }

        if (block.type === "ul") {
          return (
            <ul
              key={idx}
              className="list-disc pl-5 space-y-2 my-3 text-[15px] sm:text-base text-ink font-medium leading-relaxed"
            >
              {block.items.map((item, i) => (
                <li key={i} className="pl-1">
                  {formatInlineText(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol
              key={idx}
              className="list-decimal pl-5 space-y-2 my-3 text-[15px] sm:text-base text-ink font-medium leading-relaxed"
            >
              {block.items.map((item, i) => (
                <li key={i} className="pl-1">
                  {formatInlineText(item)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p
            key={idx}
            className="text-[15px] sm:text-base text-ink leading-relaxed font-medium"
          >
            {formatInlineText(block.text)}
          </p>
        );
      })}
    </div>
  );
}

const CALLOUT_TEMPLATES: {
  id: CalloutVariant;
  label: string;
  template: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: "tip",
    label: "Vet Tip",
    template: "\n\n> [!TIP] Vet Tip\n> Add a practical tip or preventive care insight here.\n\n",
    Icon: Lightbulb,
    color: "text-emerald-600",
  },
  {
    id: "note",
    label: "Info Note",
    template: "\n\n> [!NOTE] Quick Note\n> Add helpful background information or context here.\n\n",
    Icon: Info,
    color: "text-sky-600",
  },
  {
    id: "warning",
    label: "Caution / Warning",
    template: "\n\n> [!WARNING] Caution\n> Highlight a safety warning, toxin alert, or red-flag symptom.\n\n",
    Icon: AlertTriangle,
    color: "text-amber-600",
  },
  {
    id: "important",
    label: "Clinical Alert",
    template: "\n\n> [!IMPORTANT] Veterinary Guidance\n> Consult a licensed veterinarian before making clinical diet or medication changes.\n\n",
    Icon: ShieldAlert,
    color: "text-coral",
  },
];

const TABLE_TEMPLATE = `\n\n| Feature / Metric | Recommended Standard |\n| --- | --- |\n| **Daily Intake** | Adjust by weight and activity level |\n| **Checkup Cadence** | Every 6–12 months |\n\n`;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write guide chapters and paragraphs here...",
  onRegisterPendingImage,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Callout dropdown state
  const [isCalloutMenuOpen, setIsCalloutMenuOpen] = useState(false);
  const calloutMenuRef = useRef<HTMLDivElement>(null);

  // Paste Markdown / HTML Modal state
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [rawPasteInput, setRawPasteInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Block-based state for WYSIWYG editing where images render as visual previews
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => parseMarkdownToBlocks(value));
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const lastSerializedRef = useRef<string>(value);

  // Close callout menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (calloutMenuRef.current && !calloutMenuRef.current.contains(e.target as Node)) {
        setIsCalloutMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Synchronize when value changes externally (e.g. initial draft load or form reset)
  useEffect(() => {
    if (value !== lastSerializedRef.current) {
      lastSerializedRef.current = value;
      setBlocks(parseMarkdownToBlocks(value));
    }
  }, [value]);

  // Auto-resize textarea to fit text content smoothly
  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 60)}px`;
  }, []);

  // Ensure all textareas are properly resized when blocks change
  useEffect(() => {
    blocks.forEach((b) => {
      if (b.type === "text") {
        const el = textareaRefs.current[b.id];
        if (el) autoResize(el);
      }
    });
  }, [blocks, autoResize]);

  // Handle text block content updates
  const handleUpdateText = (id: string, newContent: string) => {
    // If user pasted raw image markdown tag, automatically re-parse to convert to visual preview
    if (/!\[.*?\]\(.*?\)/.test(newContent)) {
      const updated = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
      const fullMarkdown = serializeBlocksToMarkdown(updated);
      const newBlocks = parseMarkdownToBlocks(fullMarkdown);
      setBlocks(newBlocks);
      lastSerializedRef.current = fullMarkdown;
      onChange(fullMarkdown);
      return;
    }

    const updated = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
    setBlocks(updated);
    const fullMarkdown = serializeBlocksToMarkdown(updated);
    lastSerializedRef.current = fullMarkdown;
    onChange(fullMarkdown);
  };

  // Smart Rich-Text, Markdown & Image Paste Handler directly inside text blocks
  const handleTextPaste = (
    blockId: string,
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    // 1. Check if clipboard contains an image file (screenshot or copied image)
    const items = Array.from(e.clipboardData.items || []);
    const imageItem = items.find(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );
    if (imageItem) {
      const blob = imageItem.getAsFile();
      if (blob) {
        e.preventDefault();
        if (blob.size > 5 * 1024 * 1024) {
          toast.error("Pasted image size must be under 5MB");
          return;
        }
        const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
        const file = new File([blob], `pasted-body-${Date.now()}.${ext}`, {
          type: blob.type,
        });
        const localUrl = URL.createObjectURL(file);
        onRegisterPendingImage?.(localUrl, file);

        const target = e.currentTarget;
        const start = target.selectionStart ?? target.value.length;
        const end = target.selectionEnd ?? target.value.length;
        const before = target.value.substring(0, start);
        const after = target.value.substring(end);
        const imageMd = `\n\n![](${localUrl})\n\n`;
        handleUpdateText(blockId, `${before}${imageMd}${after}`);
        toast.success("Image pasted into article! It will upload on submit.");
        return;
      }
    }

    const html = e.clipboardData.getData("text/html");
    const plain = e.clipboardData.getData("text/plain");

    let converted = "";
    let didConvert = false;

    if (html && hasRichHtmlFormatting(html)) {
      converted = htmlToMarkdown(html);
      didConvert = Boolean(converted);
    } else if (plain && looksLikeHtmlSource(plain)) {
      converted = htmlToMarkdown(plain);
      didConvert = Boolean(converted);
    } else if (plain && /^[ \t]*[•▪‣◦●○]\s+/m.test(plain)) {
      converted = normalizeMarkdownSpacing(plain);
      didConvert = true;
    }

    if (!didConvert || !converted) return;

    e.preventDefault();
    const target = e.currentTarget;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? 0;
    const currentText = target.value;
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);

    const needsLeadingGap = before.trim().length > 0 && !before.endsWith("\n\n");
    const needsTrailingGap = after.trim().length > 0 && !after.startsWith("\n\n");
    const inserted = `${needsLeadingGap ? "\n\n" : ""}${converted}${
      needsTrailingGap ? "\n\n" : ""
    }`;

    const nextValue = `${before}${inserted}${after}`;
    handleUpdateText(blockId, nextValue);
    toast.success("Formatted content pasted cleanly!");

    setTimeout(() => {
      const ta = textareaRefs.current[blockId];
      if (ta) {
        ta.focus();
        const cursor = start + inserted.length;
        ta.setSelectionRange(cursor, cursor);
        autoResize(ta);
      }
    }, 10);
  };

  // Update caption on an image block
  const handleUpdateCaption = (id: string, newCaption: string) => {
    const updated = blocks.map((b) =>
      b.id === id && b.type === "image" ? { ...b, caption: newCaption } : b
    );
    setBlocks(updated);
    const fullMarkdown = serializeBlocksToMarkdown(updated);
    lastSerializedRef.current = fullMarkdown;
    onChange(fullMarkdown);
  };

  // Delete an image block and merge surrounding text blocks
  const handleDeleteImage = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;

    const nextBlocks = [...blocks];
    nextBlocks.splice(idx, 1);

    // Merge adjacent text blocks
    const merged: EditorBlock[] = [];
    for (const b of nextBlocks) {
      const prev = merged[merged.length - 1];
      if (prev && prev.type === "text" && b.type === "text") {
        const mergedText = [prev.content, b.content].filter(Boolean).join("\n\n");
        prev.content = mergedText;
      } else {
        merged.push({ ...b });
      }
    }

    if (merged.length === 0) {
      merged.push({ id: `text-${Date.now()}`, type: "text", content: "" });
    }

    setBlocks(merged);
    const fullMarkdown = serializeBlocksToMarkdown(merged);
    lastSerializedRef.current = fullMarkdown;
    onChange(fullMarkdown);
    toast.success("Image removed from article");
  };

  // Move an image up or down
  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    const nextBlocks = [...blocks];
    const [moved] = nextBlocks.splice(idx, 1);
    nextBlocks.splice(targetIdx, 0, moved);

    setBlocks(nextBlocks);
    const fullMarkdown = serializeBlocksToMarkdown(nextBlocks);
    lastSerializedRef.current = fullMarkdown;
    onChange(fullMarkdown);
  };

  // Inserts markdown syntax into currently active text block
  const applySyntaxToActiveBlock = (
    prefix: string,
    suffix: string = "",
    defaultText: string = ""
  ) => {
    let targetBlockId = activeBlockId;
    let targetBlock = blocks.find(
      (b) => b.id === targetBlockId && b.type === "text"
    ) as TextBlock | undefined;

    if (!targetBlock) {
      targetBlock = blocks.find((b) => b.type === "text") as TextBlock | undefined;
      targetBlockId = targetBlock?.id || null;
    }

    if (!targetBlock || !targetBlockId) return;

    const textarea = textareaRefs.current[targetBlockId];
    const start = textarea?.selectionStart ?? targetBlock.content.length;
    const end = textarea?.selectionEnd ?? targetBlock.content.length;
    const selected = targetBlock.content.substring(start, end) || defaultText;
    const before = targetBlock.content.substring(0, start);
    const after = targetBlock.content.substring(end);

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = `${before}${replacement}${after}`;

    handleUpdateText(targetBlockId, newContent);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newCursorPos = start + prefix.length + selected.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        autoResize(textarea);
      }
    }, 10);
  };

  // Apply content from "Paste Markdown / HTML" modal
  const handleImportRawPaste = (mode: "insert" | "replace") => {
    if (!rawPasteInput.trim()) {
      toast.error("Please paste Markdown or HTML content first.");
      return;
    }

    const { markdown, detectedType } = convertRawPasteToMarkdown(rawPasteInput);
    if (!markdown.trim()) {
      toast.error("No readable content could be extracted.");
      return;
    }

    if (mode === "replace") {
      const nextBlocks = parseMarkdownToBlocks(markdown);
      setBlocks(nextBlocks);
      lastSerializedRef.current = markdown;
      onChange(markdown);
    } else {
      applySyntaxToActiveBlock("\n\n", "\n\n", markdown);
    }

    setRawPasteInput("");
    setIsPasteModalOpen(false);
    toast.success(
      detectedType === "html"
        ? "HTML converted and rendered cleanly!"
        : "Markdown formatted and applied!"
    );
  };

  // Copy full article Markdown content to clipboard
  const handleCopyMarkdown = async () => {
    const markdown = serializeBlocksToMarkdown(blocks) || value || "";
    if (!markdown.trim()) {
      toast.error("Article body is empty.");
      return;
    }
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdown);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = markdown;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setIsCopied(true);
      toast.success("Markdown copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy markdown to clipboard.");
    }
  };

  // Download article as a .md file
  const handleDownloadMarkdown = () => {
    const markdown = serializeBlocksToMarkdown(blocks) || value || "";
    if (!markdown.trim()) {
      toast.error("Article body is empty.");
      return;
    }
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `article-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded (.md)");
  };

  const handleCloseModal = () => {
    if (imageUrl && imageUrl.startsWith("blob:") && selectedFile) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl("");
    setImageCaption("");
    setSelectedFile(null);
    setIsImageModalOpen(false);
  };

  // Insert image right at cursor in active text block
  const handleInsertImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Please upload or enter an image URL");
      return;
    }

    if (selectedFile) {
      onRegisterPendingImage?.(imageUrl, selectedFile);
      setSelectedFile(null);
    }

    let insertIndex = -1;
    let splitCursor = 0;

    if (activeBlockId) {
      const idx = blocks.findIndex((b) => b.id === activeBlockId);
      if (idx !== -1 && blocks[idx].type === "text") {
        insertIndex = idx;
        const ta = textareaRefs.current[activeBlockId];
        if (ta) {
          splitCursor = ta.selectionStart;
        }
      }
    }

    const newImgId = `img-${Date.now()}`;
    const newTextId = `text-${Date.now() + 1}`;
    const newImgBlock: ImageBlock = {
      id: newImgId,
      type: "image",
      url: imageUrl.trim(),
      caption: imageCaption.trim(),
    };

    const nextBlocks: EditorBlock[] = [];

    if (insertIndex !== -1 && blocks[insertIndex].type === "text") {
      const curBlock = blocks[insertIndex] as TextBlock;
      const beforeText = curBlock.content.substring(0, splitCursor);
      const afterText = curBlock.content.substring(splitCursor);

      for (let i = 0; i < insertIndex; i++) {
        nextBlocks.push(blocks[i]);
      }

      nextBlocks.push({ ...curBlock, content: beforeText });
      nextBlocks.push(newImgBlock);
      nextBlocks.push({ id: newTextId, type: "text", content: afterText });

      for (let i = insertIndex + 1; i < blocks.length; i++) {
        nextBlocks.push(blocks[i]);
      }
    } else {
      nextBlocks.push(...blocks);
      nextBlocks.push(newImgBlock);
      nextBlocks.push({ id: newTextId, type: "text", content: "" });
    }

    setBlocks(nextBlocks);
    const fullMarkdown = serializeBlocksToMarkdown(nextBlocks);
    lastSerializedRef.current = fullMarkdown;
    onChange(fullMarkdown);

    setImageUrl("");
    setImageCaption("");
    setIsImageModalOpen(false);
    toast.success("Image inserted into article body!");

    setTimeout(() => {
      const nextTa = textareaRefs.current[newTextId];
      if (nextTa) {
        nextTa.focus();
        setActiveBlockId(newTextId);
        autoResize(nextTa);
      }
    }, 50);
  };

  const detectedPasteFormat = rawPasteInput.trim()
    ? looksLikeHtmlSource(rawPasteInput)
      ? "html"
      : "markdown"
    : null;

  return (
    <div className="rounded-xl border border-border-peach bg-card overflow-hidden shadow-xs">
      {/* Editor Top Bar with Actions & Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-border-peach bg-surface-muted/40 p-2 gap-2">
        {/* Formatting Toolbar */}
        {activeTab === "write" ? (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n## ", "\n", "Heading 2")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Heading 2"
            >
              <Heading2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n### ", "\n", "Heading 3")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Heading 3"
            >
              <Heading3 className="size-4" />
            </button>

            <div className="h-4 w-px bg-border-peach mx-1" />

            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("**", "**", "bold text")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Bold"
            >
              <Bold className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("*", "*", "italic text")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Italic"
            >
              <Italic className="size-4" />
            </button>

            <div className="h-4 w-px bg-border-peach mx-1" />

            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n- ", "\n", "List item")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Bullet List"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n1. ", "\n", "Step 1")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n> ", "\n", "Quote or veterinary note")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Blockquote"
            >
              <Quote className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("\n---\n", "", "")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Divider"
            >
              <Minus className="size-4" />
            </button>

            <div className="h-4 w-px bg-border-peach mx-1" />

            {/* Insert Table */}
            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock(TABLE_TEMPLATE, "", "")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Insert Table"
            >
              <Table2 className="size-4" />
            </button>

            {/* Insert Callout Dropdown */}
            <div className="relative" ref={calloutMenuRef}>
              <button
                type="button"
                onClick={() => setIsCalloutMenuOpen((o) => !o)}
                className={cn(
                  "p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors",
                  isCalloutMenuOpen && "bg-surface-muted text-coral"
                )}
                title="Insert Callout Box"
              >
                <Lightbulb className="size-4" />
              </button>

              {isCalloutMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-44 rounded-lg border border-border-peach bg-card shadow-lg py-1 z-30">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted border-b border-border-peach/60">
                    Insert Callout
                  </div>
                  {CALLOUT_TEMPLATES.map((ct) => {
                    const IconC = ct.Icon;
                    return (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => {
                          applySyntaxToActiveBlock(ct.template, "", "");
                          setIsCalloutMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted transition-colors cursor-pointer text-left"
                      >
                        <IconC className={cn("size-3.5 shrink-0", ct.color)} />
                        <span>{ct.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => applySyntaxToActiveBlock("[", "](https://example.com)", "Link title")}
              className="p-1.5 rounded hover:bg-surface-muted text-ink-muted hover:text-ink cursor-pointer transition-colors"
              title="Insert Link"
            >
              <Link2 className="size-4" />
            </button>

            <div className="h-4 w-px bg-border-peach mx-1" />

            {/* Insert Image Button */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-tint-rose text-coral hover:bg-coral hover:text-white font-bold text-xs cursor-pointer transition-all border border-coral/20"
              title="Insert image in middle of paragraph"
            >
              <ImageIcon className="size-3.5" />
              <span>Image</span>
            </button>

            {/* Paste Markdown / HTML Button */}
            <button
              type="button"
              onClick={() => setIsPasteModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-muted text-ink hover:border-coral/40 hover:text-coral font-bold text-xs cursor-pointer transition-all border border-border-peach"
              title="Paste formatted Markdown or raw HTML directly"
            >
              <ClipboardPaste className="size-3.5" />
              <span>Paste MD / HTML</span>
            </button>

            {/* Copy Markdown Button */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-muted text-ink hover:border-coral/40 hover:text-coral font-bold text-xs cursor-pointer transition-all border border-border-peach"
              title="Copy full article Markdown to clipboard"
            >
              {isCopied ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{isCopied ? "Copied!" : "Copy MD"}</span>
            </button>

            {/* Export Markdown File Button */}
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-muted text-ink hover:border-coral/40 hover:text-coral font-bold text-xs cursor-pointer transition-all border border-border-peach"
              title="Download full article as a .md file"
            >
              <Download className="size-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider font-quicksand">
              Article Live Render Preview
            </span>
            <div className="h-4 w-px bg-border-peach mx-1" />
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-muted text-ink hover:border-coral/40 hover:text-coral font-bold text-xs cursor-pointer transition-all border border-border-peach"
              title="Copy full article Markdown to clipboard"
            >
              {isCopied ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{isCopied ? "Copied!" : "Copy MD"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-muted text-ink hover:border-coral/40 hover:text-coral font-bold text-xs cursor-pointer transition-all border border-border-peach"
              title="Download full article as a .md file"
            >
              <Download className="size-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        )}

        {/* Write / Preview Tab Toggles */}
        <div className="flex items-center gap-1 bg-surface-muted p-0.5 rounded-lg border border-border-peach ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer",
              activeTab === "write"
                ? "bg-card text-coral shadow-2xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <Edit3 className="size-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer",
              activeTab === "preview"
                ? "bg-card text-coral shadow-2xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <Eye className="size-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "write" ? (
        <div className="p-4 space-y-3 min-h-80">
          {blocks.map((block, idx) => {
            if (block.type === "image") {
              return (
                <div
                  key={block.id}
                  className="relative rounded-xl border border-border-peach bg-surface-muted/30 overflow-hidden my-3 group shadow-2xs"
                >
                  {/* Top Overlay Badge & Action Controls */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                      <ImageIcon className="size-3.5 text-coral" />
                      <span>Article Photo</span>
                    </span>

                    <div className="flex items-center gap-1 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(block.id, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-md bg-black/65 hover:bg-black/85 text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                        title="Move photo up"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(block.id, "down")}
                        disabled={idx === blocks.length - 1}
                        className="p-1.5 rounded-md bg-black/65 hover:bg-black/85 text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                        title="Move photo down"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(block.id)}
                        className="p-1.5 rounded-md bg-black/65 hover:bg-destructive text-white transition-colors cursor-pointer shadow-xs"
                        title="Remove photo"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Image Render */}
                  <div className="relative w-full aspect-video bg-surface-muted flex items-center justify-center">
                    <Image
                      src={block.url}
                      alt={block.caption || "Inline article photo"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Editable Caption Bar */}
                  <div className="p-3 bg-card border-t border-border-peach flex items-center gap-2.5">
                    <span className="text-xs font-bold text-coral uppercase font-quicksand shrink-0">
                      Caption:
                    </span>
                    <input
                      type="text"
                      value={block.caption}
                      onChange={(e) => handleUpdateCaption(block.id, e.target.value)}
                      placeholder="Add a photo caption (optional)..."
                      className="w-full text-xs text-ink bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border-peach focus:outline-none focus:ring-1 focus:ring-coral/40"
                    />
                  </div>
                </div>
              );
            }

            // Text block with auto-resizing textarea & rich-text paste support
            return (
              <div key={block.id} className="relative">
                <textarea
                  ref={(el) => {
                    textareaRefs.current[block.id] = el;
                    if (el) autoResize(el);
                  }}
                  value={block.content}
                  onFocus={() => setActiveBlockId(block.id)}
                  onPaste={(e) => handleTextPaste(block.id, e)}
                  onChange={(e) => {
                    handleUpdateText(block.id, e.target.value);
                    autoResize(e.target);
                  }}
                  placeholder={
                    idx === 0
                      ? placeholder
                      : "Continue writing next paragraph or section..."
                  }
                  className="w-full bg-transparent text-ink text-[15px] font-medium font-sans focus:outline-none resize-none leading-relaxed overflow-hidden py-1 block"
                  rows={block.content ? Math.max(2, block.content.split("\n").length) : 2}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-surface-soft min-h-80">
          <ArticleContentRenderer content={value} />
        </div>
      )}

      {/* Footer stats bar */}
      <div className="px-4 py-2 bg-surface-muted/30 border-t border-border-peach flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
        <span>Rich paste, Markdown, tables, callouts & inline images supported</span>
        <span>
          {value.trim() ? value.trim().split(/\s+/).length : 0} words • ~
          {Math.max(1, Math.ceil((value.trim() ? value.trim().split(/\s+/).length : 0) / 200))} min read
        </span>
      </div>

      {/* ======================================================== */}
      {/* 📋 PASTE MARKDOWN / HTML MODAL DIALOG                    */}
      {/* ======================================================== */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card rounded-xl border border-border-peach max-w-2xl w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <button
              type="button"
              onClick={() => setIsPasteModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-surface-muted cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1 pr-8">
              <h3 className="text-base font-bold text-ink font-quicksand flex items-center gap-2">
                <FileCode2 className="size-5 text-coral" />
                Paste Raw Markdown or HTML
              </h3>
              <p className="text-xs text-ink-muted">
                Paste formatted Markdown or HTML directly. Headings, bold labels, lists, callout boxes, dividers, and tables are automatically parsed for the Live Guide Preview.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-ink font-quicksand">
                  Content Source
                </label>
                {detectedPasteFormat && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      detectedPasteFormat === "html"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    )}
                  >
                    {detectedPasteFormat === "html"
                      ? "HTML detected • Will convert to Markdown"
                      : "Markdown detected"}
                  </span>
                )}
              </div>

              <textarea
                rows={10}
                value={rawPasteInput}
                onChange={(e) => setRawPasteInput(e.target.value)}
                onPaste={(e) => {
                  // If user pastes rich clipboard content into the modal, prefer HTML when available
                  const clipHtml = e.clipboardData.getData("text/html");
                  const clipPlain = e.clipboardData.getData("text/plain");
                  if (clipHtml && hasRichHtmlFormatting(clipHtml) && !looksLikeHtmlSource(clipPlain)) {
                    e.preventDefault();
                    const converted = htmlToMarkdown(clipHtml);
                    setRawPasteInput(converted);
                  }
                }}
                placeholder={`Paste Markdown or HTML here...\n\nExample:\n## Feeding Schedule\n- **Puppies (8–16 weeks):** 3–4 small meals daily\n\n| Age | Meals / Day |\n| --- | --- |\n| 8–16 Weeks | 3–4 |\n| Adult | 2 |\n\n> [!TIP] Vet Tip\n> Always keep fresh water available.`}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border-peach">
              <button
                type="button"
                onClick={() => {
                  setRawPasteInput("");
                  setIsPasteModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleImportRawPaste("insert")}
                disabled={!rawPasteInput.trim()}
                className="px-4 py-2 text-xs font-bold text-ink bg-surface-muted hover:bg-surface-soft border border-border-peach rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert at Cursor
              </button>
              <button
                type="button"
                onClick={() => handleImportRawPaste("replace")}
                disabled={!rawPasteInput.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-coral hover:bg-coral-dark rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Replace Article Body
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🖼️ INSERT IMAGE MODAL DIALOG                              */}
      {/* ======================================================== */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card rounded-xl border border-border-peach max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-surface-muted cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-bold text-ink font-quicksand flex items-center gap-2 mb-4">
              <ImageIcon className="size-5 text-coral" />
              Insert Image in Middle of Paragraph
            </h3>

            <div className="space-y-4">
              {/* Reusable ImageUpload (Click, Drag & Drop, Ctrl+V Paste, or Direct URL) */}
              <ImageUpload
                label="Upload, Paste (Ctrl+V), or Enter Image URL"
                value={imageUrl}
                onChange={setImageUrl}
                onFileSelect={setSelectedFile}
                placeholder="Click, drag & drop, or press Ctrl+V"
                helperText="PNG, JPG, or WebP up to 5MB (Uploads on submit)"
                allowManualInput={true}
                enableClipboardPaste={true}
                height="h-[300px]"
              />

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5 font-quicksand">
                  Image Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1: Proper leash walking grip"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-peach">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  disabled={!imageUrl}
                  className="px-4 py-2 text-xs font-bold text-white bg-coral hover:bg-coral-dark rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert Image at Cursor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
