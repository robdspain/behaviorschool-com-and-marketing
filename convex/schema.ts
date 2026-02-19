import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist_submissions: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.string(),
    organization: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  newsletter_subscribers: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    status: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  schools: defineTable({
    slug: v.string(),
    name: v.string(),
    teamKeyHash: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  school_members: defineTable({
    schoolId: v.id("schools"),
    email: v.string(),
    role: v.string(),
    createdAt: v.number(),
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_email", ["schoolId", "email"]),

  iep_goal_docs: defineTable({
    schoolId: v.id("schools"),
    title: v.string(),
    createdBy: v.string(),
    payload: v.string(),
    payloadVersion: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_school", ["schoolId"]),

  bip_docs: defineTable({
    schoolId: v.id("schools"),
    title: v.string(),
    createdBy: v.string(),
    payload: v.string(),
    payloadVersion: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_school", ["schoolId"]),
});
