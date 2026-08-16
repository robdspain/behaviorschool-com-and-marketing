import { createHash } from "node:crypto";
import { api, getConvexClient } from "@/lib/convex";

export type PublishingSite = "behaviorschool" | "robspain";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function normalize(value: unknown): JsonValue {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === "object" && value) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalize(item)]),
    );
  }
  return String(value ?? "");
}

export function contentFingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(normalize(value))).digest("hex");
}

function tagNames(tags: unknown) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => typeof tag === "string" ? tag : String((tag as { name?: unknown })?.name ?? ""))
    .map((tag) => tag.trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

export function blogPublishingIdentity(body: Record<string, unknown>, fallbackSlug?: string) {
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug || fallbackSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  const canonical = {
    title,
    slug,
    excerpt: String(body.excerpt ?? ""),
    content: String(body.markdown ?? body.content ?? body.html ?? ""),
    featureImage: String(body.featured_image ?? ""),
    metaTitle: String(body.meta_title ?? ""),
    metaDescription: String(body.meta_description ?? ""),
    tags: tagNames(body.tags),
  };
  return {
    site: "behaviorschool" as const,
    contentKey: `blog:${slug}`,
    contentHash: contentFingerprint(canonical),
    title,
    contentType: "blog-article",
    tier: "A" as const,
  };
}

export function newsletterPublishingIdentity(detail: any) {
  const issue = detail?.issue ?? detail ?? {};
  const articles = Array.isArray(detail?.articles) ? detail.articles : [];
  const issueKey = String(issue.issueKey ?? issue._id ?? "unknown");
  const canonical = {
    issueKey,
    subject: String(issue.subject ?? ""),
    preheader: String(issue.preheader ?? ""),
    schoolBcbaProblem: String(issue.schoolBcbaProblem ?? ""),
    html: String(issue.html ?? ""),
    text: String(issue.text ?? ""),
    recipientSegment: String(issue.recipientSegment ?? ""),
    ctaKind: String(issue.ctaKind ?? ""),
    ctaUrl: String(issue.ctaUrl ?? ""),
    articles: articles.map((article: any) => ({
      title: String(article.title ?? ""),
      apaCitation: String(article.apaCitation ?? ""),
      fullTextUrl: String(article.fullTextUrl ?? ""),
      fullTextVerifiedAt: Number(article.fullTextVerifiedAt ?? 0),
      summary: String(article.summary ?? ""),
      schoolBcbaUse: String(article.schoolBcbaUse ?? ""),
      tryThis: String(article.tryThis ?? ""),
    })),
  };
  return {
    site: "robspain" as const,
    contentKey: `newsletter:${issueKey}`,
    contentHash: contentFingerprint(canonical),
    title: String(issue.subject ?? issueKey),
    contentType: "newsletter-issue",
    tier: "A" as const,
  };
}

export async function checkPublishingRelease(identity: {
  site: PublishingSite;
  contentKey: string;
  contentHash: string;
}) {
  return getConvexClient().query(api.publishingStandards.checkRelease, identity) as Promise<{
    approved: boolean;
    reason: string;
    record: Record<string, unknown> | null;
  }>;
}

export function publishingApprovalUrl(identity: {
  site: PublishingSite;
  contentKey: string;
  contentHash: string;
  title?: string;
  contentType?: string;
  tier?: string;
}) {
  const query = new URLSearchParams({
    site: identity.site,
    contentKey: identity.contentKey,
    contentHash: identity.contentHash,
    title: identity.title ?? "",
    contentType: identity.contentType ?? "",
    tier: identity.tier ?? "A",
  });
  return `/admin/publishing-standards?${query.toString()}`;
}
