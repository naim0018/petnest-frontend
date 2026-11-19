// Pure browser-native HTML -> Markdown converter & Markdown paste normalizer
// Zero external dependencies (uses native DOMParser).

const SAFE_URL_REGEX = /^(https?:|mailto:|\/|#|blob:)/i;

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return SAFE_URL_REGEX.test(trimmed);
}

function escapeTableCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\s*\n+\s*/g, " ").trim();
}

function convertChildren(node: Node, listDepth = 0): string {
  let out = "";
  node.childNodes.forEach((child) => {
    out += convertNode(child, listDepth);
  });
  return out;
}

function convertTable(tableEl: HTMLElement): string {
  const rows: string[][] = [];
  const trList = Array.from(tableEl.querySelectorAll("tr"));

  for (const tr of trList) {
    const cells = Array.from(tr.children).filter(
      (el) => el.tagName === "TH" || el.tagName === "TD"
    ) as HTMLElement[];
    if (cells.length === 0) continue;

    const rowValues = cells.map((cell) => {
      const inner = convertChildren(cell).trim();
      return escapeTableCell(inner);
    });

    // Skip completely empty rows
    if (rowValues.every((v) => !v)) continue;
    rows.push(rowValues);
  }

  if (rows.length === 0) return "";

  const colCount = Math.max(...rows.map((r) => r.length));
  const normalizeRow = (r: string[]) => {
    const padded = [...r];
    while (padded.length < colCount) padded.push("");
    return `| ${padded.join(" | ")} |`;
  };

  const header = normalizeRow(rows[0]);
  const separator = `| ${Array(colCount).fill("---").join(" | ")} |`;
  const body = rows.slice(1).map(normalizeRow);

  return `\n\n${[header, separator, ...body].join("\n")}\n\n`;
}

function convertList(listEl: HTMLElement, ordered: boolean, depth: number): string {
  const items = Array.from(listEl.children).filter((el) => el.tagName === "LI");
  if (items.length === 0) return "";

  const indent = "  ".repeat(depth);
  const lines: string[] = [];

  items.forEach((li, index) => {
    const prefix = ordered ? `${index + 1}. ` : "- ";
    let itemText = "";
    const nestedLists: string[] = [];

    li.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = (child as HTMLElement).tagName;
        if (tag === "UL") {
          nestedLists.push(convertList(child as HTMLElement, false, depth + 1));
          return;
        }
        if (tag === "OL") {
          nestedLists.push(convertList(child as HTMLElement, true, depth + 1));
          return;
        }
      }
      itemText += convertNode(child, depth + 1);
    });

    const cleaned = itemText.replace(/\n+/g, " ").trim();
    if (cleaned) {
      lines.push(`${indent}${prefix}${cleaned}`);
    }
    nestedLists.forEach((nested) => {
      const trimmedNested = nested.trimEnd();
      if (trimmedNested) lines.push(trimmedNested.replace(/^\n+/, ""));
    });
  });

  if (depth === 0) {
    return `\n\n${lines.join("\n")}\n\n`;
  }
  return `\n${lines.join("\n")}`;
}

function convertNode(node: Node, listDepth = 0): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    // Collapse excessive internal whitespace from HTML indentation while keeping spaces
    return text.replace(/[\t\r\n]+/g, " ");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as HTMLElement;
  const tag = el.tagName;

  // Ignore non-content tags
  if (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "NOSCRIPT" ||
    tag === "META" ||
    tag === "LINK" ||
    tag === "SVG"
  ) {
    return "";
  }

  // Line breaks & dividers
  if (tag === "BR") return "\n";
  if (tag === "HR") return "\n\n---\n\n";

  // Headings
  if (tag === "H1" || tag === "H2") {
    const content = convertChildren(el).replace(/\n+/g, " ").trim();
    return content ? `\n\n## ${content}\n\n` : "";
  }
  if (tag === "H3") {
    const content = convertChildren(el).replace(/\n+/g, " ").trim();
    return content ? `\n\n### ${content}\n\n` : "";
  }
  if (tag === "H4" || tag === "H5" || tag === "H6") {
    const content = convertChildren(el).replace(/\n+/g, " ").trim();
    return content ? `\n\n#### ${content}\n\n` : "";
  }

  // Inline formatting
  if (tag === "STRONG" || tag === "B") {
    const content = convertChildren(el).trim();
    return content ? `**${content}**` : "";
  }
  if (tag === "EM" || tag === "I") {
    const content = convertChildren(el).trim();
    return content ? `*${content}*` : "";
  }
  if (tag === "CODE") {
    if (el.parentElement?.tagName === "PRE") {
      return el.textContent || "";
    }
    const content = (el.textContent || "").trim();
    return content ? `\`${content}\`` : "";
  }
  if (tag === "PRE") {
    const raw = (el.textContent || "").trim();
    return raw ? `\n\n\`\`\`\n${raw}\n\`\`\`\n\n` : "";
  }

  // Links
  if (tag === "A") {
    const href = el.getAttribute("href") || "";
    const text = convertChildren(el).replace(/\n+/g, " ").trim();
    if (!text) return "";
    if (isSafeUrl(href)) {
      return `[${text}](${href.trim()})`;
    }
    return text;
  }

  // Images
  if (tag === "IMG") {
    const src = el.getAttribute("src") || "";
    const alt = (el.getAttribute("alt") || "").trim();
    if (!isSafeUrl(src)) return "";
    return `\n\n![${alt}](${src.trim()})\n\n`;
  }

  // Lists
  if (tag === "UL") return convertList(el, false, listDepth);
  if (tag === "OL") return convertList(el, true, listDepth);

  // Tables
  if (tag === "TABLE") return convertTable(el);

  // Blockquotes & Callouts
  if (tag === "BLOCKQUOTE" || tag === "ASIDE") {
    const calloutAttr = (
      el.getAttribute("data-callout") ||
      el.className ||
      ""
    ).toLowerCase();

    const inner = convertChildren(el).trim();
    if (!inner) return "";

    const lines = inner
      .split("\n")
      .map((l) => l.trim())
      .filter((l, idx, arr) => l || (idx > 0 && idx < arr.length - 1));

    // Preserve existing [!TYPE] header if already present
    if (lines[0] && /^\[!(TIP|NOTE|INFO|WARNING|CAUTION|IMPORTANT|VET)\]/i.test(lines[0])) {
      return `\n\n${lines.map((l) => `> ${l}`).join("\n")}\n\n`;
    }

    // Detect callout hints on aside or class names
    if (tag === "ASIDE" || /\b(callout|alert|tip|warning|note)\b/.test(calloutAttr)) {
      let type = "NOTE";
      if (/warn|caution|danger/.test(calloutAttr)) type = "WARNING";
      else if (/tip|success/.test(calloutAttr)) type = "TIP";
      else if (/important|vet/.test(calloutAttr)) type = "IMPORTANT";

      return `\n\n> [!${type}]\n${lines.map((l) => `> ${l}`).join("\n")}\n\n`;
    }

    return `\n\n${lines.map((l) => `> ${l}`).join("\n")}\n\n`;
  }

  // Inline span with bold/italic CSS (common in Google Docs / Word / Notion paste)
  if (tag === "SPAN") {
    const content = convertChildren(el);
    if (!content.trim()) return content;
    const style = (el.getAttribute("style") || "").toLowerCase();
    const isBold = /font-weight\s*:\s*(bold|[6-9]00)/.test(style);
    const isItalic = /font-style\s*:\s*italic/.test(style);
    let formatted = content.trim();
    if (isBold && !formatted.startsWith("**")) formatted = `**${formatted}**`;
    if (isItalic && !formatted.startsWith("*")) formatted = `*${formatted}*`;
    const leadingSpace = /^\s/.test(content) ? " " : "";
    const trailingSpace = /\s$/.test(content) ? " " : "";
    return `${leadingSpace}${formatted}${trailingSpace}`;
  }

  // Specialized figure handling (img + figcaption -> Markdown image with caption)
  if (tag === "FIGURE") {
    const img = el.querySelector("img");
    const figcaption = el.querySelector("figcaption");
    if (img) {
      const src = img.getAttribute("src") || "";
      const caption = (figcaption?.textContent || img.getAttribute("alt") || "").trim();
      if (isSafeUrl(src)) {
        return `\n\n![${caption}](${src.trim()})\n\n`;
      }
    }
    const inner = convertChildren(el, listDepth).trim();
    return inner ? `\n\n${inner}\n\n` : "";
  }

  // Block-level containers
  if (
    tag === "P" ||
    tag === "DIV" ||
    tag === "SECTION" ||
    tag === "ARTICLE" ||
    tag === "HEADER" ||
    tag === "FOOTER"
  ) {
    // Check if div is styled as a callout box
    const cls = (el.className || "").toLowerCase();
    if (tag === "DIV" && /\b(callout|admonition|alert-box)\b/.test(cls)) {
      const inner = convertChildren(el).trim();
      if (!inner) return "";
      const type = /warn|caution/.test(cls)
        ? "WARNING"
        : /tip/.test(cls)
        ? "TIP"
        : "NOTE";
      const lines = inner.split("\n").map((l) => `> ${l.trim()}`);
      return `\n\n> [!${type}]\n${lines.join("\n")}\n\n`;
    }

    const inner = convertChildren(el, listDepth).trim();
    return inner ? `\n\n${inner}\n\n` : "";
  }

  return convertChildren(el, listDepth);
}

/**
 * Checks whether an HTML clipboard string contains actual rich formatting
 * worth converting (rather than plain text wrapped in a single span/p).
 */
export function hasRichHtmlFormatting(html: string): boolean {
  if (!html || !html.trim()) return false;
  return /<(h[1-6]|strong|b|em|i|ul|ol|li|table|thead|tbody|tr|th|td|blockquote|aside|hr|pre|code|a\s|img\s)[\s>]/i.test(
    html
  ) || /font-weight\s*:\s*(bold|[6-9]00)|font-style\s*:\s*italic/i.test(html);
}

/**
 * Checks if raw user-pasted text appears to be HTML source code.
 */
export function looksLikeHtmlSource(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /<\/?(h[1-6]|p|div|ul|ol|li|table|tr|td|th|blockquote|strong|b|em|i|hr|br|section|article|aside|a|img)[\s/>]/i.test(
    trimmed
  );
}

/**
 * Converts HTML string to clean, normalized Markdown preserving headings,
 * bold/italic, lists, blockquotes, callouts, dividers, links, images, and tables.
 */
export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined" || !html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const raw = convertChildren(doc.body);

  return normalizeMarkdownSpacing(raw);
}

/**
 * Cleans up pasted Markdown: standardizes newlines, converts unicode bullets
 * (`•`, `▪`, `‣`) to standard `- ` items, cleans extra spaces, and ensures clean
 * spacing around structural blocks.
 */
export function normalizeMarkdownSpacing(md: string): string {
  return md
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Convert common rich-text unicode bullet characters to Markdown bullets
    .replace(/^(\s*)[•▪‣◦●○]\s+/gm, "$1- ")
    // Clean trailing whitespace on lines
    .replace(/[ \t]+$/gm, "")
    // Collapse multiple spaces inside normal text (but preserve leading list indentation)
    .replace(/([^\s])[ \t]{2,}/g, "$1 ")
    // Fix accidental double bolding like ****text****
    .replace(/\*{4}([^*]+)\*{4}/g, "**$1**")
    // Collapse 3+ consecutive blank lines into double newline
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Smart converter for raw Paste Markdown / HTML modal input.
 */
export function convertRawPasteToMarkdown(input: string): {
  markdown: string;
  detectedType: "html" | "markdown";
} {
  if (looksLikeHtmlSource(input)) {
    return {
      markdown: htmlToMarkdown(input),
      detectedType: "html",
    };
  }
  return {
    markdown: normalizeMarkdownSpacing(input),
    detectedType: "markdown",
  };
}
