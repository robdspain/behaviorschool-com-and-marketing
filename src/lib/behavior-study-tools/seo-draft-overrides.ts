import type { Metadata } from "next";
import { api, getConvexClient } from "@/lib/convex";

export type BehaviorStudyToolsSeoOverride = {
  pageTitle: string;
  pageHref: string;
  targetFile: string;
  keyword: string;
  priority: string;
  evidence: string;
  heroHeadline: string;
  metaDescription: string;
  faqAnswer: string;
  primaryCta: string;
  status: string;
};

type DraftRow = {
  url?: string | null;
  keyword?: string | null;
  status?: string | null;
  metadata?: Record<string, unknown> | null;
};

function cleanString(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function proposedCopy(metadata: Record<string, unknown> | null) {
  const proposed = metadata?.proposed;
  if (!proposed || typeof proposed !== "object" || Array.isArray(proposed)) return {};
  return proposed as Record<string, unknown>;
}

function toOverride(row: DraftRow): BehaviorStudyToolsSeoOverride {
  const metadata = row.metadata || {};
  const proposed = proposedCopy(metadata);
  return {
    pageTitle: cleanString(metadata.pageTitle, 300),
    pageHref: cleanString(metadata.pageHref, 1000) || row.url || "",
    targetFile: cleanString(metadata.targetFile, 500),
    keyword: cleanString(metadata.keyword, 300) || row.keyword || "",
    priority: cleanString(metadata.priority, 20),
    evidence: cleanString(metadata.evidence, 1200),
    heroHeadline: cleanString(proposed.heroHeadline, 300),
    metaDescription: cleanString(proposed.metaDescription, 500),
    faqAnswer: cleanString(proposed.faqAnswer, 800),
    primaryCta: cleanString(proposed.primaryCta, 120),
    status: row.status || "",
  };
}

export async function getBehaviorStudyToolsSeoOverride(pageHref: string): Promise<BehaviorStudyToolsSeoOverride | null> {
  let data: DraftRow[] = [];
  try {
    data = await getConvexClient().query(api.bstMarketing.listGrowthSignals, {
      source: "seo_content_draft",
      signalTypes: ["page_copy_draft"],
      statuses: ["approved", "applied"],
      limit: 100,
    });
  } catch {
    return null;
  }

  const row = data.find((item) => item.url === pageHref);
  if (!row) return null;
  const override = toOverride(row);
  return override.heroHeadline || override.metaDescription || override.faqAnswer || override.primaryCta
    ? override
    : null;
}

export function applySeoMetadataOverride({
  base,
  pageHref,
  override,
}: {
  base: Metadata;
  pageHref: string;
  override: BehaviorStudyToolsSeoOverride | null;
}): Metadata {
  if (!override) return base;

  const title = override.heroHeadline ? `${override.heroHeadline} | BehaviorSchool Study` : base.title;
  const description = override.metaDescription || base.description;

  return {
    ...base,
    title,
    description,
    alternates: {
      ...base.alternates,
      canonical: pageHref,
    },
    openGraph: {
      ...base.openGraph,
      title: typeof title === "string" ? title : base.openGraph?.title,
      description: typeof description === "string" ? description : base.openGraph?.description,
      url: pageHref,
    },
  };
}

export function seoOverrideFaq(override: BehaviorStudyToolsSeoOverride | null) {
  if (!override?.faqAnswer) return [];
  return [{
    title: "How does this help me pass?",
    body: override.faqAnswer,
  }];
}
