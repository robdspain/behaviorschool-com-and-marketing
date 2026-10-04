import type { ReactNode } from "react";
import { BlogNewsletterSignup } from "@/components/blog/NewsletterSignup";
import { FaDecisionTree } from "@/components/content/FaDecisionTree";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import type { SeoSlot } from "@/lib/seo-blog-slots";

function cleanChunk(chunk: string): string {
  return chunk
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/^\s*<\/p>/, "")
    .replace(/<p>\s*$/, "")
    .trim();
}

function SeoSlotView({ slot, campaign }: { slot: SeoSlot; campaign: string }) {
  if (slot.type === "soft") {
    return (
      <SoftProgramCta campaign={campaign} linkLabel={slot.linkLabel}>
        {slot.text}
      </SoftProgramCta>
    );
  }
  if (slot.type === "diagram" && slot.id === "fa-decision-tree") {
    return <FaDecisionTree />;
  }
  if (slot.type === "newsletter") {
    return <BlogNewsletterSignup submitTone="paper" />;
  }
  if (slot.type === "end") {
    return <ProgramCtaBlock campaign={campaign} heading={slot.heading} line={slot.line} />;
  }
  return null;
}

function articleHtml(html: string): string {
  return html.replace(
    /<table\b([^>]*)>/gi,
    '<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Comparison table"><table$1>',
  ).replace(/<\/table>/gi, "</table></div>");
}

export function ProgramBlogArticle({
  title,
  date,
  excerpt,
  html,
  slots,
  campaign,
}: {
  title: string;
  date: string;
  excerpt: string | null;
  html: string;
  slots: SeoSlot[];
  campaign: string;
}) {
  const published = new Date(date).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pageUrl = `https://behaviorschool.com/blog/${campaign}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://behaviorschool.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://behaviorschool.com/blog" },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };

  const parts = articleHtml(html).split(/%%SEO_SLOT_(\d+)%%/);
  const nodes: ReactNode[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    if (index % 2 === 0) {
      const cleaned = cleanChunk(parts[index] ?? "");
      if (!cleaned) continue;
      nodes.push(<div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: cleaned }} />);
      continue;
    }
    const slot = slots[Number(parts[index])];
    if (!slot) continue;
    nodes.push(<SeoSlotView key={`slot-${index}`} slot={slot} campaign={campaign} />);
  }

  const linkClass =
    "inline-flex min-h-11 items-center text-base font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

  return (
    <article className="mx-auto max-w-3xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
      <CtaClickTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-[#365548]">
          <li>
            <a href="/" className={linkClass}>
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a href="/blog" className={linkClass}>
              Blog
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="flex min-h-11 items-center text-[#171f1d]" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
      <header>
        <h1 className="text-3xl font-bold leading-tight text-[#171f1d] sm:text-4xl">{title}</h1>
        <p className="mt-2 text-base text-[#365548]">{published}</p>
      </header>
      {excerpt ? <p className="mt-6 text-lg leading-8 text-[#365548]">{excerpt}</p> : null}
      <div className="seo-program-article prose prose-lg mt-8 max-w-none">{nodes}</div>
      <style>{`
        .seo-program-article.prose :where(p, li, td, th, strong, blockquote) {
          color: #171f1d;
        }
        .seo-program-article.prose :where(h2, h3, h4) {
          color: #171f1d;
        }
        .seo-program-article.prose :where(a) {
          color: #1f4d3f;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .seo-program-article.prose :where(a:hover) {
          color: #123628;
        }
        .seo-program-article a:focus-visible,
        .seo-program-article summary:focus-visible,
        .seo-program-article .overflow-x-auto:focus-visible {
          outline: 3px solid #1f4d3f;
          outline-offset: 2px;
        }
        .seo-program-article table {
          min-width: 36rem;
          border-collapse: collapse;
          font-size: 1rem;
        }
        .seo-program-article th,
        .seo-program-article td {
          border: 1px solid #d9cdb8;
          padding: 0.75rem;
          text-align: left;
          vertical-align: top;
        }
        .seo-program-article th {
          background: #f4efe5;
        }
        .seo-program-article details {
          border-bottom: 1px solid #d9cdb8;
        }
        .seo-program-article details > summary {
          min-height: 2.75rem;
          padding: 0.75rem 0;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.125rem;
          line-height: 1.5;
          color: #171f1d;
        }
        .seo-program-article details > p {
          padding-bottom: 0.75rem;
        }
      `}</style>
    </article>
  );
}
