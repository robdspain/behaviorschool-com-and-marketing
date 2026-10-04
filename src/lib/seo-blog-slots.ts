export type SeoSlot =
  | { type: "soft"; text: string; linkLabel: string }
  | { type: "diagram"; id: string }
  | { type: "newsletter" }
  | { type: "end"; heading: string; line: string };

function slotComment(slots: SeoSlot[], slot: SeoSlot): string {
  const id = slots.length;
  slots.push(slot);
  return `\n\n%%SEO_SLOT_${id}%%\n\n`;
}

/**
 * Replaces funnel and diagram markers with HTML comments the blog page splits on.
 * The markers themselves must not be rendered.
 */
export function extractSeoSlots(markdown: string): { markdown: string; slots: SeoSlot[] } {
  const slots: SeoSlot[] = [];

  let next = markdown.replace(
    /\[\[SOFT_CTA:\s*([\s\S]*?)\s*\|\s*([^\]]+?)\]\]/g,
    (_match, text: string, label: string) =>
      slotComment(slots, { type: "soft", text: text.trim(), linkLabel: label.trim() }),
  );

  next = next.replace(
    /\[\[END_CTA:\s*([\s\S]*?)\s*\|\s*([^\]]+?)\]\]/g,
    (_match, heading: string, line: string) =>
      slotComment(slots, { type: "end", heading: heading.trim(), line: line.trim() }),
  );

  next = next.replace(/\[\[NEWSLETTER\]\]/g, () => slotComment(slots, { type: "newsletter" }));

  next = next.replace(/\[\[DIAGRAM\s+([a-z0-9-]+)[\s\S]*?\]\]/g, (_match, id: string) =>
    slotComment(slots, { type: "diagram", id }),
  );

  return { markdown: next, slots };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x22;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#x26;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&#x3C;/g, "<")
    .replace(/&#60;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x3E;/g, ">")
    .replace(/&#62;/g, ">");
}

function htmlToPlain(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

/** Visible FAQ text for FAQPage JSON-LD. Details/summary first, then h3 questions. */
export function extractFaqPairs(html: string): { question: string; answer: string }[] {
  if (!html) return [];

  const faqSectionMatch = html.match(
    /<h2[^>]*>Frequently Asked Questions[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i,
  );
  if (!faqSectionMatch) return [];

  const faqSection = faqSectionMatch[1];
  const faqs: { question: string; answer: string }[] = [];

  const detailsRegex =
    /<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/gi;
  let match: RegExpExecArray | null;
  while ((match = detailsRegex.exec(faqSection)) !== null) {
    const question = htmlToPlain(match[1]);
    const answer = htmlToPlain(match[2]);
    if (question && answer) faqs.push({ question, answer });
  }
  if (faqs.length > 0) return faqs;

  const h3Regex = /<h3[^>]*>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs;
  while ((match = h3Regex.exec(faqSection)) !== null) {
    const question = htmlToPlain(match[1]);
    const answer = htmlToPlain(match[2]);
    if (question && answer) faqs.push({ question, answer });
  }

  return faqs;
}
