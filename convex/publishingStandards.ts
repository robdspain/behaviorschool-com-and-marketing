import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { approvalStatusAfterSave, publishingStandardFailures, releaseMatches } from "./publishingStandardCore";

const siteValidator = v.union(v.literal("behaviorschool"), v.literal("robspain"));
const tierValidator = v.union(
  v.literal("A"),
  v.literal("B"),
  v.literal("C"),
  v.literal("social-derivative"),
);
const disclosureValidator = v.union(
  v.literal("site-standard"),
  v.literal("page-specific"),
  v.literal("not-needed"),
);
const anchorValidator = v.object({
  type: v.string(),
  detail: v.string(),
  verifiedByRob: v.boolean(),
});
const recordValidator = v.object({
  id: v.id("editorialPublishingRecords"),
  site: siteValidator,
  contentKey: v.string(),
  title: v.string(),
  contentType: v.string(),
  tier: tierValidator,
  contentHash: v.string(),
  approvalStatus: v.union(v.literal("draft"), v.literal("approved"), v.literal("stale"), v.literal("revoked")),
  audienceNeed: v.string(),
  firstPartyInputReference: v.string(),
  distinctiveThesis: v.string(),
  specificityAnchors: v.array(anchorValidator),
  evidenceInterpretationSeparated: v.boolean(),
  informationGain: v.string(),
  disclosureDecision: disclosureValidator,
  detectorOptimizationUsed: v.boolean(),
  claimsReviewed: v.boolean(),
  canonicalSource: v.optional(v.string()),
  sourceApprovalReference: v.optional(v.string()),
  notes: v.optional(v.string()),
  approvedContentHash: v.optional(v.string()),
  approvedBy: v.optional(v.string()),
  approvedAt: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
});

function nowIso() {
  return new Date().toISOString();
}

function publicRecord(record: any) {
  const { _id, _creationTime: _ignoredCreationTime, ...fields } = record;
  return { id: _id, ...fields };
}

async function byContentKey(ctx: any, site: "behaviorschool" | "robspain", contentKey: string) {
  return ctx.db
    .query("editorialPublishingRecords")
    .withIndex("by_site_content_key", (q: any) => q.eq("site", site).eq("contentKey", contentKey))
    .first();
}

export const list = query({
  args: {},
  returns: v.array(recordValidator),
  handler: async (ctx) => {
    const records = await ctx.db
      .query("editorialPublishingRecords")
      .withIndex("by_updated_at")
      .order("desc")
      .take(250);
    return records.map(publicRecord);
  },
});

export const upsert = mutation({
  args: {
    site: siteValidator,
    contentKey: v.string(),
    title: v.string(),
    contentType: v.string(),
    tier: tierValidator,
    contentHash: v.string(),
    audienceNeed: v.string(),
    firstPartyInputReference: v.string(),
    distinctiveThesis: v.string(),
    specificityAnchors: v.array(anchorValidator),
    evidenceInterpretationSeparated: v.boolean(),
    informationGain: v.string(),
    disclosureDecision: disclosureValidator,
    detectorOptimizationUsed: v.boolean(),
    claimsReviewed: v.boolean(),
    canonicalSource: v.optional(v.string()),
    sourceApprovalReference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.union(recordValidator, v.null()),
  handler: async (ctx, args) => {
    const existing = await byContentKey(ctx, args.site, args.contentKey);
    const timestamp = nowIso();

    if (existing) {
      const contentChanged = existing.contentHash !== args.contentHash;
      const approvedReviewNowFails = existing.approvalStatus === "approved"
        && publishingStandardFailures(args).length > 0;
      const approvalBecameStale = contentChanged || approvedReviewNowFails;
      await ctx.db.patch(existing._id, {
        ...args,
        approvalStatus: approvalStatusAfterSave(existing.approvalStatus, contentChanged, approvedReviewNowFails),
        approvedContentHash: approvalBecameStale ? undefined : existing.approvedContentHash,
        approvedBy: approvalBecameStale ? undefined : existing.approvedBy,
        approvedAt: approvalBecameStale ? undefined : existing.approvedAt,
        updatedAt: timestamp,
      });
      const updated = await ctx.db.get(existing._id);
      return updated ? publicRecord(updated) : null;
    }

    const id = await ctx.db.insert("editorialPublishingRecords", {
      ...args,
      approvalStatus: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const inserted = await ctx.db.get(id);
    return inserted ? publicRecord(inserted) : null;
  },
});

export const approve = mutation({
  args: { id: v.id("editorialPublishingRecords"), approvedBy: v.string() },
  returns: v.union(recordValidator, v.null()),
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (!record) throw new Error("Publishing record not found.");

    const failures = publishingStandardFailures(record);
    if (failures.length) throw new Error(`Release blocked: ${failures.join(" ")}`);

    const timestamp = nowIso();
    await ctx.db.patch(args.id, {
      approvalStatus: "approved",
      approvedContentHash: record.contentHash,
      approvedBy: args.approvedBy,
      approvedAt: timestamp,
      updatedAt: timestamp,
    });
    const updated = await ctx.db.get(args.id);
    return updated ? publicRecord(updated) : null;
  },
});

export const revoke = mutation({
  args: { id: v.id("editorialPublishingRecords") },
  returns: v.union(recordValidator, v.null()),
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (!record) throw new Error("Publishing record not found.");
    await ctx.db.patch(args.id, {
      approvalStatus: "revoked",
      approvedContentHash: undefined,
      approvedBy: undefined,
      approvedAt: undefined,
      updatedAt: nowIso(),
    });
    const updated = await ctx.db.get(args.id);
    return updated ? publicRecord(updated) : null;
  },
});

export const checkRelease = query({
  args: { site: siteValidator, contentKey: v.string(), contentHash: v.string() },
  returns: v.object({
    approved: v.boolean(),
    reason: v.string(),
    record: v.union(recordValidator, v.null()),
  }),
  handler: async (ctx, args) => {
    const record = await byContentKey(ctx, args.site, args.contentKey);
    if (!record) return { approved: false, reason: "missing", record: null };
    if (!releaseMatches(record.approvalStatus, args.contentHash, record.approvedContentHash)) {
      const reason = record.approvalStatus === "approved" && record.approvedContentHash !== args.contentHash
        ? "hash_mismatch"
        : record.approvalStatus;
      return { approved: false, reason, record: publicRecord(record) };
    }
    return { approved: true, reason: "approved", record: publicRecord(record) };
  },
});
