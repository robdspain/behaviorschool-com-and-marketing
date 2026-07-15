import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const providerType = v.union(v.literal("individual"), v.literal("organization"));

function now() {
  return Date.now();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

async function fullName(ctx: any, userId: Id<"aceUsers">) {
  const user = await ctx.db.get(userId);
  if (!user) return { name: "Unknown", email: "", bacbId: "" };
  return {
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    email: user.email,
    bacbId: user.bacbId ?? user.credentialNumber ?? "",
  };
}

export const getAll = query({
  args: {
    activeOnly: v.optional(v.boolean()),
    type: v.optional(providerType),
  },
  handler: async (ctx, args) => {
    const providers = await ctx.db.query("aceProviders").collect();
    return providers
      .filter((provider) => (args.activeOnly ? provider.isActive : true))
      .filter((provider) => (args.type ? provider.providerType === args.type : true))
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getById = query({
  args: { id: v.id("aceProviders") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    providerName: v.string(),
    providerType,
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
    coordinatorCertificationDate: v.optional(v.number()),
    coordinatorCertificationExpires: v.optional(v.number()),
    coordinatorCertificationVerified: v.optional(v.boolean()),
    ein: v.optional(v.string()),
    leadershipName: v.optional(v.string()),
    leadershipTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const coordinator = await ctx.db.get(args.coordinatorId);
    if (!coordinator) throw new Error("Coordinator not found");
    if (args.coordinatorYearsCertified < 5) {
      throw new Error("Coordinator must have at least 5 years certification");
    }
    if (args.providerType === "organization" && !args.ein?.trim()) {
      throw new Error("EIN is required for organization providers");
    }

    const timestamp = now();
    return ctx.db.insert("aceProviders", {
      providerName: args.providerName.trim(),
      providerType: args.providerType,
      bacbProviderNumber: args.bacbProviderNumber?.trim() || undefined,
      coordinatorId: args.coordinatorId,
      coordinatorYearsCertified: args.coordinatorYearsCertified,
      coordinatorCertificationDate: args.coordinatorCertificationDate,
      coordinatorCertificationExpires: args.coordinatorCertificationExpires,
      coordinatorCertificationVerified: args.coordinatorCertificationVerified ?? false,
      primaryEmail: args.primaryEmail.trim().toLowerCase(),
      primaryPhone: args.primaryPhone?.trim() || undefined,
      website: args.website?.trim() || undefined,
      addressLine1: args.addressLine1?.trim() || undefined,
      addressLine2: args.addressLine2?.trim() || undefined,
      city: args.city?.trim() || undefined,
      state: args.state?.trim() || undefined,
      zipCode: args.zipCode?.trim() || undefined,
      country: args.country?.trim() || undefined,
      applicationDate: timestamp,
      isActive: true,
      applicationFeePaid: false,
      renewalFeePaid: false,
      canPublishEvents: true,
      canIssueCertificates: true,
      ein: args.ein?.trim() || undefined,
      leadershipName: args.leadershipName?.trim() || undefined,
      leadershipTitle: args.leadershipTitle?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("aceProviders"),
    providerName: v.optional(v.string()),
    providerType: v.optional(providerType),
    bacbProviderNumber: v.optional(v.string()),
    coordinatorYearsCertified: v.optional(v.number()),
    coordinatorCertificationDate: v.optional(v.number()),
    coordinatorCertificationExpires: v.optional(v.number()),
    coordinatorCertificationVerified: v.optional(v.boolean()),
    primaryEmail: v.optional(v.string()),
    primaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    ein: v.optional(v.string()),
    leadershipName: v.optional(v.string()),
    leadershipTitle: v.optional(v.string()),
    canPublishEvents: v.optional(v.boolean()),
    canIssueCertificates: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Provider not found");

    if (args.coordinatorYearsCertified !== undefined && args.coordinatorYearsCertified < 5) {
      throw new Error("Coordinator must have at least 5 years certification");
    }

    const expires = args.coordinatorCertificationExpires;
    const isExpired = expires !== undefined && expires < now();
    if (isExpired && (args.canPublishEvents || args.canIssueCertificates)) {
      throw new Error("Cannot enable operations: coordinator certification has expired");
    }

    await ctx.db.patch(args.id, compact({
      providerName: args.providerName?.trim(),
      providerType: args.providerType,
      bacbProviderNumber: args.bacbProviderNumber?.trim() || undefined,
      coordinatorYearsCertified: args.coordinatorYearsCertified,
      coordinatorCertificationDate: args.coordinatorCertificationDate,
      coordinatorCertificationExpires: args.coordinatorCertificationExpires,
      coordinatorCertificationVerified: args.coordinatorCertificationVerified,
      primaryEmail: args.primaryEmail?.trim().toLowerCase(),
      primaryPhone: args.primaryPhone?.trim() || undefined,
      website: args.website?.trim() || undefined,
      ein: args.ein?.trim() || undefined,
      leadershipName: args.leadershipName?.trim() || undefined,
      leadershipTitle: args.leadershipTitle?.trim() || undefined,
      canPublishEvents: isExpired ? false : args.canPublishEvents,
      canIssueCertificates: isExpired ? false : args.canIssueCertificates,
      lapseStartDate: isExpired ? now() : undefined,
      isActive: args.isActive,
      updatedAt: now(),
    }));

    return ctx.db.get(args.id);
  },
});

export const listCoordinatorStatuses = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const providers = await ctx.db.query("aceProviders").collect();
    const rows = [];
    for (const provider of providers) {
      if (args.activeOnly && !provider.isActive) continue;
      const coordinator = await fullName(ctx, provider.coordinatorId);
      rows.push({
        ...provider,
        coordinatorName: coordinator.name,
        coordinatorEmail: coordinator.email,
        coordinatorBacbId: coordinator.bacbId,
      });
    }

    return rows.sort((a, b) => {
      const aExpires = a.coordinatorCertificationExpires ?? Number.MAX_SAFE_INTEGER;
      const bExpires = b.coordinatorCertificationExpires ?? Number.MAX_SAFE_INTEGER;
      return aExpires - bExpires;
    });
  },
});

export const updateCoordinatorStatus = mutation({
  args: {
    providerId: v.id("aceProviders"),
    coordinatorCertificationVerified: v.optional(v.boolean()),
    coordinatorCertificationDate: v.optional(v.number()),
    coordinatorCertificationExpires: v.optional(v.number()),
    canPublishEvents: v.optional(v.boolean()),
    canIssueCertificates: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");

    const expires = args.coordinatorCertificationExpires ?? provider.coordinatorCertificationExpires;
    const isExpired = expires !== undefined && expires < now();
    if (isExpired && (args.canPublishEvents || args.canIssueCertificates)) {
      throw new Error("Cannot enable operations: coordinator certification has expired");
    }

    await ctx.db.patch(args.providerId, compact({
      coordinatorCertificationVerified: args.coordinatorCertificationVerified,
      coordinatorCertificationDate: args.coordinatorCertificationDate,
      coordinatorCertificationExpires: args.coordinatorCertificationExpires,
      canPublishEvents: isExpired ? false : args.canPublishEvents,
      canIssueCertificates: isExpired ? false : args.canIssueCertificates,
      lapseStartDate: isExpired ? now() : undefined,
      updatedAt: now(),
    }));

    return ctx.db.get(args.providerId);
  },
});

export const renew = mutation({
  args: {
    providerId: v.id("aceProviders"),
    includeLateFee: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");

    const timestamp = now();
    const newExpiration = new Date(timestamp);
    newExpiration.setFullYear(newExpiration.getFullYear() + 1);
    const newExpirationTime = newExpiration.getTime();
    const lateFee = args.includeLateFee ? 50 : 0;
    const renewalFee = 400;

    await ctx.db.patch(args.providerId, {
      lastRenewalDate: timestamp,
      expirationDate: newExpirationTime,
      nextRenewalDate: newExpirationTime,
      renewalFeePaid: true,
      lateFeePaid: args.includeLateFee ?? false,
      lateFeeAmount: lateFee,
      lateFeePaidDate: args.includeLateFee ? timestamp : undefined,
      gracePeriodEndDate: undefined,
      lapseEndDate: provider.lapseStartDate ? timestamp : undefined,
      reinstatementDate: provider.lapseStartDate ? timestamp : undefined,
      canPublishEvents: true,
      canIssueCertificates: true,
      isActive: true,
      updatedAt: timestamp,
    });

    const data = await ctx.db.get(args.providerId);
    return {
      data,
      renewal: {
        renewalFee,
        lateFee,
        totalFee: renewalFee + lateFee,
        newExpiration: newExpirationTime,
      },
    };
  },
});
