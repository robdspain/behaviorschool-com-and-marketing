import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE CERTIFICATES - Queries & Mutations
// ============================================================================

// Generate certificate number
function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `CE-${year}-${random}`;
}

// Get certificate by number
export const getByNumber = query({
  args: { certificateNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceCertificates")
      .withIndex("by_certificate_number", (q) =>
        q.eq("certificateNumber", args.certificateNumber)
      )
      .first();
  },
});

// Get certificate by ID
export const getById = query({
  args: { id: v.id("aceCertificates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get certificates for participant
export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();

    // Get event info
    const certsWithEvents = await Promise.all(
      certificates.map(async (cert) => {
        const event = await ctx.db.get(cert.eventId);
        return { ...cert, event };
      })
    );

    return certsWithEvents;
  },
});

// Get certificates for event
export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get participant info
    const certsWithParticipants = await Promise.all(
      certificates.map(async (cert) => {
        const participant = await ctx.db.get(cert.participantId);
        return { ...cert, participant };
      })
    );

    return certsWithParticipants;
  },
});

// Check eligibility for certificate
export const checkEligibility = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    const reasons: string[] = [];

    // Get registration
    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .first();

    const requirements = {
      registered: !!registration,
      attendanceVerified: registration?.attendanceVerified || false,
      quizPassed: registration?.quizCompleted || false,
      feedbackSubmitted: registration?.feedbackCompleted || false,
    };

    if (!requirements.registered) {
      reasons.push("Not registered for this event");
    }

    if (!requirements.attendanceVerified) {
      reasons.push("Attendance not verified");
    }

    // Get event to check if quiz is required
    const event = await ctx.db.get(args.eventId);

    if (event?.verificationMethod === "quiz_completion" && !requirements.quizPassed) {
      reasons.push("Quiz not completed/passed");
    }

    // Async events always require quiz
    if (event?.modality === "asynchronous" && !requirements.quizPassed) {
      reasons.push("Quiz required for asynchronous events");
    }

    const eligible = reasons.length === 0;

    return { eligible, reasons, requirements };
  },
});

// Issue certificate
export const issue = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if certificate already exists
    const existing = await ctx.db
      .query("aceCertificates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("participantId"), args.participantId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Get event details
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Get provider
    const provider = await ctx.db.get(event.providerId);

    // Get participant
    const participant = await ctx.db.get(args.participantId);
    if (!participant) throw new Error("Participant not found");

    // Generate certificate number
    const certificateNumber = generateCertificateNumber();

    // Create certificate
    const certificateId = await ctx.db.insert("aceCertificates", {
      eventId: args.eventId,
      participantId: args.participantId,
      providerId: event.providerId,
      certificateNumber,
      participantName: `${participant.firstName} ${participant.lastName}`,
      participantEmail: participant.email,
      participantBacbId: participant.bacbId,
      eventTitle: event.title,
      eventDate: new Date(event.startDate).toISOString().split("T")[0],
      instructorName: "Rob Spain, M.S., BCBA, IBA",
      providerName: provider?.providerName || "Behavior School",
      providerNumber: provider?.bacbProviderNumber,
      totalCeus: event.totalCeus,
      ceCategory: event.ceCategory,
      status: "issued",
      issuedAt: now,
      createdAt: now,
    });

    // Update registration
    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();

    if (registration) {
      await ctx.db.patch(registration._id, {
        certificateIssued: true,
        updatedAt: now,
      });
    }

    return certificateId;
  },
});

// Verify certificate
export const verify = query({
  args: { certificateNumber: v.string() },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query("aceCertificates")
      .withIndex("by_certificate_number", (q) =>
        q.eq("certificateNumber", args.certificateNumber)
      )
      .first();

    if (!certificate) {
      return { valid: false, message: "Certificate not found" };
    }

    if (certificate.status === "revoked") {
      return { valid: false, message: "Certificate has been revoked" };
    }

    return {
      valid: true,
      certificate: {
        number: certificate.certificateNumber,
        participantName: certificate.participantName,
        eventTitle: certificate.eventTitle,
        eventDate: certificate.eventDate,
        totalCeus: certificate.totalCeus,
        ceCategory: certificate.ceCategory,
        providerName: certificate.providerName,
        issuedAt: certificate.issuedAt,
      },
    };
  },
});

// Revoke certificate
export const revoke = mutation({
  args: {
    id: v.id("aceCertificates"),
    reason: v.string(),
    revokedBy: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      status: "revoked",
      revokedAt: now,
      revokedBy: args.revokedBy,
      revocationReason: args.reason,
    });
  },
});

// Get certificates for provider
export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();
  },
});

// Get all certificates (for admin dashboard)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const certificates = await ctx.db.query("aceCertificates").collect();

    const enriched = await Promise.all(
      certificates.map(async (cert) => {
        const event = await ctx.db.get(cert.eventId);
        const participant = await ctx.db.get(cert.participantId);
        return { ...cert, event, participant };
      })
    );

    return enriched;
  },
});

// Update certificate (for revoke, status changes)
export const update = mutation({
  args: {
    id: v.id("aceCertificates"),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("issued"), v.literal("revoked"))
    ),
    revocationReason: v.optional(v.string()),
    revokedBy: v.optional(v.string()),
    certificateUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const { id, ...updates } = args;

    const updateData: Record<string, unknown> = {};

    if (updates.status) {
      updateData.status = updates.status;
    }

    if (updates.status === "revoked") {
      updateData.revokedAt = now;
      if (updates.revocationReason) {
        updateData.revocationReason = updates.revocationReason;
      }
      if (updates.revokedBy) {
        updateData.revokedBy = updates.revokedBy;
      }
    }

    if (updates.status === "issued") {
      updateData.issuedAt = now;
    }

    if (updates.certificateUrl) {
      updateData.certificateUrl = updates.certificateUrl;
    }

    await ctx.db.patch(id, updateData);

    return await ctx.db.get(id);
  },
});
