import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

/**
 * W-9 request tracking for the Transformation Program form.
 *
 * The Next.js server calls these functions. Listing, reading, and marking a
 * request sent happen only after the admin session check in
 * /api/admin/w9-requests. The public form records a row from that same server
 * path, which already validates and rate-limits the submission.
 *
 * Marketing admin auth is the site session cookie, the same boundary used by
 * CRM and signup submissions. These functions do not read a Convex user
 * identity because that server client does not present one.
 *
 * list, get, pendingCount, and markSent also require W9_ADMIN_ACCESS_KEY,
 * set to the same value on Netlify and in the Convex dashboard. record stays
 * callable from the public form route so a request can be stored after the
 * schema deploy. It returns only the new id.
 */

const w9Status = v.union(v.literal("pending"), v.literal("sent"));
const w9SentBy = v.union(v.literal("auto"), v.literal("manual"));
const w9AutoSendResult = v.union(
  v.literal("sent"),
  v.literal("fallback_no_pdf"),
  v.literal("error"),
);

const w9RequestReturn = v.object({
  _id: v.id("w9Requests"),
  _creationTime: v.number(),
  name: v.string(),
  email: v.string(),
  organization: v.string(),
  createdAt: v.number(),
  status: w9Status,
  sentAt: v.optional(v.number()),
  sentBy: v.optional(w9SentBy),
  sourcePage: v.string(),
  autoSendResult: w9AutoSendResult,
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EARLIEST_CREATED_AT = Date.parse("2024-01-01T00:00:00.000Z");
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;
const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 200;
const PENDING_COUNT_CAP = 500;

function requireAdminAccess(accessKey: string) {
  const expected = process.env.W9_ADMIN_ACCESS_KEY ?? "";
  if (!expected) throw new Error("W-9 admin access is not configured.");

  const length = Math.max(accessKey.length, expected.length);
  let difference = accessKey.length ^ expected.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (accessKey.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }
  if (difference !== 0) throw new Error("Unauthorized");
}

function cleanLine(value: string, maxLength: number): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function clampLimit(limit: number | undefined): number {
  if (limit === undefined || !Number.isFinite(limit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(limit), 1), MAX_LIMIT);
}

function toPublicRequest(doc: Doc<"w9Requests">) {
  return {
    _id: doc._id,
    _creationTime: doc._creationTime,
    name: doc.name,
    email: doc.email,
    organization: doc.organization,
    createdAt: doc.createdAt,
    status: doc.status,
    sourcePage: doc.sourcePage,
    autoSendResult: doc.autoSendResult,
    ...(doc.sentAt !== undefined ? { sentAt: doc.sentAt } : {}),
    ...(doc.sentBy !== undefined ? { sentBy: doc.sentBy } : {}),
  };
}

export const record = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organization: v.string(),
    createdAt: v.number(),
    status: w9Status,
    sentAt: v.optional(v.number()),
    sentBy: v.optional(w9SentBy),
    sourcePage: v.string(),
    autoSendResult: w9AutoSendResult,
  },
  returns: v.id("w9Requests"),
  handler: async (ctx, args) => {
    const name = cleanLine(args.name, 120);
    const email = cleanLine(args.email, 320).toLowerCase();
    const organization = cleanLine(args.organization, 200);
    const sourcePage = cleanLine(args.sourcePage, 200);

    if (name.length < 2 || organization.length < 2 || !emailPattern.test(email)) {
      throw new Error("Enter your name, work email, and organization.");
    }
    if (!sourcePage.startsWith("/") || sourcePage.includes("://") || sourcePage.includes("..")) {
      throw new Error("Source page must be a site path.");
    }
    if (
      !Number.isFinite(args.createdAt) ||
      args.createdAt < EARLIEST_CREATED_AT ||
      args.createdAt > Date.now() + MAX_FUTURE_SKEW_MS
    ) {
      throw new Error("Invalid request time.");
    }

    if (args.status === "sent") {
      if (args.sentBy !== "auto" || args.autoSendResult !== "sent" || args.sentAt === undefined) {
        throw new Error("An automatic send must include the send time.");
      }
      return await ctx.db.insert("w9Requests", {
        name,
        email,
        organization,
        createdAt: args.createdAt,
        status: "sent",
        sentAt: args.sentAt,
        sentBy: "auto",
        sourcePage,
        autoSendResult: "sent",
      });
    }

    if (args.sentAt !== undefined || args.sentBy !== undefined || args.autoSendResult === "sent") {
      throw new Error("A pending request cannot be marked sent.");
    }

    return await ctx.db.insert("w9Requests", {
      name,
      email,
      organization,
      createdAt: args.createdAt,
      status: "pending",
      sourcePage,
      autoSendResult: args.autoSendResult,
    });
  },
});

export const list = query({
  args: {
    accessKey: v.string(),
    status: v.optional(w9Status),
    limit: v.optional(v.number()),
  },
  returns: v.array(w9RequestReturn),
  handler: async (ctx, args) => {
    requireAdminAccess(args.accessKey);
    const limit = clampLimit(args.limit);
    const status = args.status;
    const rows = status
      ? await ctx.db
          .query("w9Requests")
          .withIndex("by_status_and_created", (q) => q.eq("status", status))
          .order("desc")
          .take(limit)
      : await ctx.db.query("w9Requests").withIndex("by_created_at").order("desc").take(limit);
    return rows.map(toPublicRequest);
  },
});

export const get = query({
  args: { accessKey: v.string(), id: v.id("w9Requests") },
  returns: v.union(w9RequestReturn, v.null()),
  handler: async (ctx, args) => {
    requireAdminAccess(args.accessKey);
    const doc = await ctx.db.get(args.id);
    return doc ? toPublicRequest(doc) : null;
  },
});

export const pendingCount = query({
  args: { accessKey: v.string() },
  returns: v.object({
    pendingCount: v.number(),
    capped: v.boolean(),
  }),
  handler: async (ctx, args) => {
    requireAdminAccess(args.accessKey);
    const rows = await ctx.db
      .query("w9Requests")
      .withIndex("by_status_and_created", (q) => q.eq("status", "pending"))
      .take(PENDING_COUNT_CAP + 1);
    const capped = rows.length > PENDING_COUNT_CAP;
    return {
      pendingCount: capped ? PENDING_COUNT_CAP : rows.length,
      capped,
    };
  },
});

export const markSent = mutation({
  args: { accessKey: v.string(), id: v.id("w9Requests") },
  returns: w9RequestReturn,
  handler: async (ctx, args) => {
    requireAdminAccess(args.accessKey);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("W-9 request not found");
    if (existing.status === "sent") return toPublicRequest(existing);

    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
      sentBy: "manual",
    });

    const updated = await ctx.db.get(args.id);
    if (!updated) throw new Error("W-9 request not found");
    return toPublicRequest(updated);
  },
});
