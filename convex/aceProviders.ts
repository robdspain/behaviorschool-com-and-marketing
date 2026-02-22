import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE PROVIDERS - Queries & Mutations
// ============================================================================

// Get provider by ID
export const getById = query({
  args: { id: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.id);
    if (!provider) return null;

    // Get coordinator
    const coordinator = await ctx.db.get(provider.coordinatorId);
    return { ...provider, coordinator };
  },
});

// Get provider by BACB number
export const getByProviderNumber = query({
  args: { bacbProviderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceProviders")
      .withIndex("by_provider_number", (q) =>
        q.eq("bacbProviderNumber", args.bacbProviderNumber)
      )
      .first();
  },
});

// Get providers by coordinator
export const getByCoordinator = query({
  args: { coordinatorId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceProviders")
      .withIndex("by_coordinator", (q) => q.eq("coordinatorId", args.coordinatorId))
      .collect();
  },
});

// Get all providers (with optional type filter)
export const getAll = query({
  args: {
    type: v.optional(v.union(v.literal("individual"), v.literal("organization"))),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let providers;

    if (args.activeOnly) {
      providers = await ctx.db
        .query("aceProviders")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
    } else {
      providers = await ctx.db.query("aceProviders").collect();
    }

    // Filter by type if specified
    if (args.type) {
      providers = providers.filter((p) => p.providerType === args.type);
    }

    // Attach coordinators
    const withCoordinators = await Promise.all(
      providers.map(async (provider) => {
        const coordinator = await ctx.db.get(provider.coordinatorId);
        return { ...provider, coordinator };
      })
    );

    return withCoordinators;
  },
});

// Get active providers
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aceProviders")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get provider dashboard data
export const getDashboard = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");

    // Get events
    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const totalEvents = events.length;

    // Active events (approved or in_progress, future dates)
    const now = Date.now();
    const activeEvents = events.filter(
      (e) =>
        (e.status === "approved" || e.status === "in_progress") &&
        e.startDate >= now
    ).length;

    // Get certificates
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const totalCertificates = certificates.length;
    const totalCEUs = certificates.reduce((sum, c) => sum + (c.totalCeus || 0), 0);

    // Get registrations (need to iterate through events)
    let totalRegistrations = 0;
    for (const event of events) {
      const regs = await ctx.db
        .query("aceRegistrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();
      totalRegistrations += regs.length;
    }

    // Get coordinator
    const coordinator = await ctx.db.get(provider.coordinatorId);

    return {
      provider: { ...provider, coordinator },
      stats: {
        totalEvents,
        activeEvents,
        totalRegistrations,
        totalCertificates,
        totalCEUsIssued: totalCEUs,
      },
    };
  },
});

// Create provider
export const create = mutation({
  args: {
    providerName: v.string(),
    providerType: v.union(v.literal("individual"), v.literal("organization")),
    coordinatorId: v.id("aceUsers"),
    coordinatorYearsCertified: v.number(),
    primaryEmail: v.string(),
    primaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    bacbProviderNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("aceProviders", {
      ...args,
      isActive: false, // Pending approval
      applicationFeePaid: false,
      renewalFeePaid: false,
      applicationDate: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update provider
export const update = mutation({
  args: {
    id: v.id("aceProviders"),
    providerName: v.optional(v.string()),
    primaryEmail: v.optional(v.string()),
    primaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    canPublishEvents: v.optional(v.boolean()),
    canIssueCertificates: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Approve provider
export const approve = mutation({
  args: {
    id: v.id("aceProviders"),
    bacbProviderNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expirationDate = now + 365 * 24 * 60 * 60 * 1000; // 1 year

    return await ctx.db.patch(args.id, {
      isActive: true,
      bacbProviderNumber: args.bacbProviderNumber,
      approvalDate: now,
      expirationDate,
      canPublishEvents: true,
      canIssueCertificates: true,
      updatedAt: now,
    });
  },
});

// Record payment
export const recordPayment = mutation({
  args: {
    id: v.id("aceProviders"),
    type: v.union(v.literal("application"), v.literal("renewal"), v.literal("late")),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: Record<string, any> = { updatedAt: now };

    if (args.type === "application") {
      updates.applicationFeePaid = true;
      updates.applicationFeeAmount = args.amount;
      updates.applicationFeePaidDate = now;
    } else if (args.type === "renewal") {
      updates.renewalFeePaid = true;
      updates.lastRenewalDate = now;
      updates.nextRenewalDate = now + 365 * 24 * 60 * 60 * 1000;
    } else if (args.type === "late") {
      updates.lateFeePaid = true;
      updates.lateFeeAmount = args.amount;
      updates.lateFeePaidDate = now;
    }

    return await ctx.db.patch(args.id, updates);
  },
});
