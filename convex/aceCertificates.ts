import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

const status = v.union(
  v.literal("pending"),
  v.literal("issued"),
  v.literal("revoked")
);

function now() {
  return Date.now();
}

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `CE-${year}-${random}`;
}

function fullName(user: Doc<"aceUsers">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;
}

async function getExistingCertificate(
  ctx: any,
  eventId: Id<"aceEvents">,
  participantId: Id<"aceUsers">
) {
  const certificates = await ctx.db
    .query("aceCertificates")
    .withIndex("by_event", (q: any) => q.eq("eventId", eventId))
    .collect();
  return certificates.find((certificate: Doc<"aceCertificates">) =>
    certificate.participantId === participantId && certificate.status !== "revoked"
  );
}

async function getInstructorName(ctx: any, eventId: Id<"aceEvents">) {
  const instructors = await ctx.db
    .query("aceEventInstructors")
    .withIndex("by_event", (q: any) => q.eq("eventId", eventId))
    .collect();

  const names = [];
  for (const instructor of instructors) {
    const user = await ctx.db.get(instructor.userId);
    if (user) names.push(fullName(user));
  }

  return names.length > 0 ? names.join(", ") : undefined;
}

async function getProviderDetails(ctx: any, providerId: Id<"aceProviders">) {
  const provider = await ctx.db.get(providerId);
  return {
    provider,
    providerName: provider?.providerName,
    providerNumber: provider?.bacbProviderNumber,
  };
}

export const getById = query({
  args: { id: v.id("aceCertificates") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("aceCertificates").collect();
    return rows.sort((a, b) => (b.issuedAt ?? b.createdAt) - (a.issuedAt ?? a.createdAt));
  },
});

export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceCertificates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return rows.sort((a, b) => (b.issuedAt ?? b.createdAt) - (a.issuedAt ?? a.createdAt));
  },
});

export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceCertificates")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();
    return rows.sort((a, b) => (b.issuedAt ?? b.createdAt) - (a.issuedAt ?? a.createdAt));
  },
});

export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();
    return rows.sort((a, b) => (b.issuedAt ?? b.createdAt) - (a.issuedAt ?? a.createdAt));
  },
});

export const getByNumber = query({
  args: { certificateNumber: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("aceCertificates")
      .withIndex("by_certificate_number", (q) =>
        q.eq("certificateNumber", args.certificateNumber.trim())
      )
      .unique(),
});

export const checkEligibility = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .unique();

    const attendance = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .unique();

    const feedback = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    const participantFeedback = feedback.find((row) => row.participantId === args.participantId);

    const quiz = await ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .first();
    const quizSubmissions = quiz
      ? await ctx.db
          .query("aceQuizSubmissions")
          .withIndex("by_quiz_participant", (q) =>
            q.eq("quizId", quiz._id).eq("participantId", args.participantId)
          )
          .collect()
      : [];
    const quizRequired = Boolean(quiz?.isRequired);
    const quizPassed = !quizRequired || quizSubmissions.some((submission) => submission.passed);

    const requirements = {
      registered: Boolean(registration),
      attendanceVerified: Boolean(attendance?.verified || registration?.attendanceVerified),
      quizPassed,
      feedbackSubmitted: Boolean(participantFeedback || registration?.feedbackCompleted),
    };

    const reasons = [];
    if (!requirements.registered) reasons.push("Participant is not registered for this event");
    if (!requirements.attendanceVerified) reasons.push("Attendance has not been verified");
    if (!requirements.quizPassed) reasons.push("Required quiz has not been passed");
    if (!requirements.feedbackSubmitted) reasons.push("Feedback has not been submitted");

    return {
      eligible: reasons.length === 0,
      reasons,
      requirements,
    };
  },
});

export const issue = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    instructorName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getExistingCertificate(ctx, args.eventId, args.participantId);
    if (existing) throw new Error("Certificate already exists for this participant and event");

    const [event, participant] = await Promise.all([
      ctx.db.get(args.eventId),
      ctx.db.get(args.participantId),
    ]);
    if (!event) throw new Error("Event not found");
    if (!participant) throw new Error("Participant not found");

    const attendance = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .unique();
    if (!attendance?.verified) {
      throw new Error("Participant must have attended the event to receive a certificate");
    }

    const { providerName, providerNumber } = await getProviderDetails(ctx, event.providerId);
    const timestamp = now();

    const instructorName = args.instructorName?.trim() || await getInstructorName(ctx, args.eventId);
    if (!instructorName) {
      throw new Error("Instructor name is required before issuing a certificate");
    }

    const id = await ctx.db.insert("aceCertificates", {
      eventId: args.eventId,
      participantId: args.participantId,
      providerId: event.providerId,
      certificateNumber: generateCertificateNumber(),
      participantName: fullName(participant),
      participantEmail: participant.email,
      participantBacbId: participant.bacbId ?? participant.credentialNumber,
      eventTitle: event.title,
      eventDate: new Date(event.startDate).toISOString(),
      instructorName,
      providerName,
      providerNumber,
      totalCeus: event.totalCeus,
      ceCategory: event.ceCategory,
      status: "issued",
      issuedAt: timestamp,
      createdAt: timestamp,
    });

    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .unique();
    if (registration) {
      await ctx.db.patch(registration._id, {
        certificateIssued: true,
        updatedAt: timestamp,
      });
    }

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("aceCertificates"),
    status: v.optional(status),
    certificateUrl: v.optional(v.string()),
    revokedBy: v.optional(v.id("aceUsers")),
    revocationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Certificate not found");

    const revokedAt = args.status === "revoked" ? now() : undefined;
    await ctx.db.patch(args.id, {
      status: args.status,
      certificateUrl: args.certificateUrl?.trim() || undefined,
      revokedBy: args.revokedBy,
      revokedAt,
      revocationReason: args.revocationReason?.trim() || undefined,
    });

    if (args.status === "revoked") {
      const registration = await ctx.db
        .query("aceRegistrations")
        .withIndex("by_event_participant", (q) =>
          q.eq("eventId", existing.eventId).eq("participantId", existing.participantId)
        )
        .unique();
      if (registration) {
        await ctx.db.patch(registration._id, {
          certificateIssued: false,
          updatedAt: now(),
        });
      }
    }

    return ctx.db.get(args.id);
  },
});
