import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const FORTY_FIVE_DAYS_MS = 45 * DAY_MS;
const NINETY_DAYS_MS = 90 * DAY_MS;

function daysOverdue(deadline?: number) {
  if (!deadline) return undefined;
  return Math.max(0, Math.ceil((Date.now() - deadline) / DAY_MS));
}

function parseDate(value?: string) {
  if (!value) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function fullName(user: Doc<"aceUsers"> | null) {
  if (!user) return null;
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;
}

async function getProviders(ctx: QueryCtx, providerId?: Id<"aceProviders">) {
  if (providerId) {
    const provider = await ctx.db.get(providerId);
    return provider ? [provider] : [];
  }
  return ctx.db.query("aceProviders").collect();
}

async function getEvents(ctx: QueryCtx, providerId?: Id<"aceProviders">) {
  return providerId
    ? ctx.db
        .query("aceEvents")
        .withIndex("by_provider", (q) => q.eq("providerId", providerId))
        .collect()
    : ctx.db.query("aceEvents").collect();
}

async function getCertificates(ctx: QueryCtx, providerId?: Id<"aceProviders">) {
  return providerId
    ? ctx.db
        .query("aceCertificates")
        .withIndex("by_provider", (q) => q.eq("providerId", providerId))
        .collect()
    : ctx.db.query("aceCertificates").collect();
}

async function getFeedback(
  ctx: QueryCtx,
  events: Doc<"aceEvents">[],
  providerId?: Id<"aceProviders">
) {
  if (!providerId) return ctx.db.query("aceFeedbackResponses").collect();

  const rows: Doc<"aceFeedbackResponses">[] = [];
  for (const event of events) {
    const eventRows = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();
    rows.push(...eventRows);
  }
  return rows;
}

async function getComplaints(ctx: QueryCtx, providerId?: Id<"aceProviders">) {
  return providerId
    ? ctx.db
        .query("aceComplaints")
        .withIndex("by_provider", (q) => q.eq("providerId", providerId))
        .collect()
    : ctx.db.query("aceComplaints").collect();
}

async function getQualifications(ctx: QueryCtx, providerId?: Id<"aceProviders">) {
  return providerId
    ? ctx.db
        .query("aceInstructorQualifications")
        .withIndex("by_provider", (q) => q.eq("providerId", providerId))
        .collect()
    : ctx.db.query("aceInstructorQualifications").collect();
}

function certificateDeadline(certificate: Doc<"aceCertificates">) {
  return certificate.issuedAt ?? certificate.createdAt + FORTY_FIVE_DAYS_MS;
}

function activeComplaint(complaint: Doc<"aceComplaints">) {
  return complaint.status !== "resolved" && complaint.status !== "escalated_to_bacb";
}

async function listOverdueCertificates(ctx: QueryCtx, providerId: Id<"aceProviders">) {
  const certificates = await getCertificates(ctx, providerId);
  const now = Date.now();
  return certificates
    .filter((certificate) =>
      certificate.status === "pending" && certificateDeadline(certificate) < now
    )
    .map((certificate) => ({
      ...certificate,
      deadline: certificateDeadline(certificate),
      daysOverdue: daysOverdue(certificateDeadline(certificate)),
    }))
    .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0));
}

async function listOverdueFeedback(ctx: QueryCtx, providerId: Id<"aceProviders">) {
  const events = await getEvents(ctx, providerId);
  const eventMap = new Map(events.map((event) => [event._id, event]));
  const feedback = await getFeedback(ctx, events, providerId);
  const now = Date.now();
  return feedback
    .filter((row) =>
      !row.coordinatorReviewedAt
      && row.coordinatorReviewDueDate !== undefined
      && row.coordinatorReviewDueDate < now
    )
    .map((row) => ({
      ...row,
      eventTitle: eventMap.get(row.eventId)?.title ?? null,
      daysOverdue: daysOverdue(row.coordinatorReviewDueDate),
    }))
    .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0));
}

async function listOverdueComplaints(ctx: QueryCtx, providerId: Id<"aceProviders">) {
  const complaints = await getComplaints(ctx, providerId);
  const now = Date.now();
  return complaints
    .filter((complaint) =>
      activeComplaint(complaint)
      && complaint.responseDueDate !== undefined
      && complaint.responseDueDate < now
    )
    .map((complaint) => ({
      ...complaint,
      daysOverdue: daysOverdue(complaint.responseDueDate),
    }))
    .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0));
}

export const getOverdueCertificates = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => listOverdueCertificates(ctx, args.providerId),
});

export const getOverdueFeedback = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => listOverdueFeedback(ctx, args.providerId),
});

export const getOverdueComplaints = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => listOverdueComplaints(ctx, args.providerId),
});

export const getComplianceScore = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const [provider, overdueCertificates, overdueFeedback, overdueComplaints] = await Promise.all([
      ctx.db.get(args.providerId),
      listOverdueCertificates(ctx, args.providerId),
      listOverdueFeedback(ctx, args.providerId),
      listOverdueComplaints(ctx, args.providerId),
    ]);

    if (!provider) throw new Error("Provider not found");

    let score = 100;
    const deductions: Array<{ reason: string; points: number; count: number }> = [];

    const addDeduction = (reason: string, points: number, count: number) => {
      if (count <= 0) return;
      score -= points * count;
      deductions.push({ reason, points, count });
    };

    addDeduction("Late certificate issuance", 5, overdueCertificates.length);
    addDeduction("Overdue feedback review", 3, overdueFeedback.length);
    addDeduction("Overdue complaint response", 10, overdueComplaints.length);

    if (provider.providerType === "organization" && !provider.legalEntityVerified) {
      addDeduction("Missing legal entity verification", 5, 1);
    }

    const expires = provider.coordinatorCertificationExpires;
    if (expires !== undefined && expires <= Date.now()) {
      addDeduction("Expired coordinator credentials", 20, 1);
    }

    score = Math.max(0, Math.min(100, score));
    return {
      score,
      deductions,
      level: score >= 90 ? "good" : score >= 70 ? "needs_attention" : "critical",
      calculatedAt: Date.now(),
    };
  },
});

export const getAdminDashboard = query({
  args: { providerId: v.optional(v.id("aceProviders")) },
  handler: async (ctx, args) => {
    const [providers, events, certificates, complaints, qualifications] = await Promise.all([
      getProviders(ctx, args.providerId),
      getEvents(ctx, args.providerId),
      getCertificates(ctx, args.providerId),
      getComplaints(ctx, args.providerId),
      getQualifications(ctx, args.providerId),
    ]);
    const feedback = await getFeedback(ctx, events, args.providerId);
    const now = Date.now();

    const overdueCertificates = certificates.filter((certificate) =>
      certificate.status === "pending" && certificateDeadline(certificate) < now
    );
    const overdueFeedbackReviews = feedback.filter((row) =>
      !row.coordinatorReviewedAt
      && row.coordinatorReviewDueDate !== undefined
      && row.coordinatorReviewDueDate < now
    );
    const overdueComplaints = complaints.filter((complaint) =>
      activeComplaint(complaint)
      && complaint.responseDueDate !== undefined
      && complaint.responseDueDate < now
    );
    const coordinatorCertExpiringSoon = providers.filter((provider) =>
      provider.isActive
      && provider.coordinatorCertificationExpires !== undefined
      && provider.coordinatorCertificationExpires < now + NINETY_DAYS_MS
    );
    const providersLapsed = providers.filter((provider) => provider.canPublishEvents === false);
    const missingLegalVerification = providers.filter((provider) =>
      provider.providerType === "organization" && provider.legalEntityVerified === false
    );

    let score = 100;
    score -= overdueCertificates.length * 5;
    score -= overdueFeedbackReviews.length * 3;
    score -= overdueComplaints.length * 10;
    score -= coordinatorCertExpiringSoon.length * 5;
    score -= providersLapsed.length * 20;
    score -= missingLegalVerification.length * 5;
    score = Math.max(0, Math.min(100, score));

    const auditItems = [
      ...overdueCertificates.slice(0, 10).map((certificate) => {
        const deadline = certificateDeadline(certificate);
        const overdueDays = daysOverdue(deadline);
        return {
          type: "certificate",
          id: certificate._id,
          title: `Certificate for ${certificate.participantName} - ${certificate.eventTitle}`,
          severity: overdueDays !== undefined && overdueDays > 7 ? "critical" : "warning",
          daysOverdue: overdueDays,
          action: "Issue certificate immediately",
        };
      }),
      ...overdueFeedbackReviews.slice(0, 10).map((feedbackRow) => {
        const overdueDays = daysOverdue(feedbackRow.coordinatorReviewDueDate);
        return {
          type: "feedback",
          id: feedbackRow._id,
          title: "Feedback pending coordinator review",
          severity: overdueDays !== undefined && overdueDays > 7 ? "critical" : "warning",
          daysOverdue: overdueDays,
          action: "Review feedback and document findings",
        };
      }),
      ...overdueComplaints.slice(0, 10).map((complaint) => ({
        type: "complaint",
        id: complaint._id,
        title: `Complaint from ${complaint.submitterName}`,
        severity: "critical",
        daysOverdue: daysOverdue(complaint.responseDueDate),
        action: "Provide written response immediately",
      })),
    ];

    return {
      metrics: {
        overdueCertificates: overdueCertificates.length,
        overdueFeedbackReviews: overdueFeedbackReviews.length,
        overdueComplaints: overdueComplaints.length,
        coordinatorCertExpiringSoon: coordinatorCertExpiringSoon.length,
        providersLapsed: providersLapsed.length,
        missingLegalVerification: missingLegalVerification.length,
        complianceScore: score,
      },
      auditItems,
      totals: {
        providers: providers.length,
        events: events.length,
        certificates: certificates.length,
        feedbackResponses: feedback.length,
        complaints: complaints.length,
        instructorQualifications: qualifications.length,
      },
    };
  },
});

export const getAuditSummary = query({
  args: {
    providerId: v.id("aceProviders"),
    dateRangeStart: v.optional(v.string()),
    dateRangeEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const [provider, events, certificates, complaints, qualifications] = await Promise.all([
      ctx.db.get(args.providerId),
      getEvents(ctx, args.providerId),
      getCertificates(ctx, args.providerId),
      getComplaints(ctx, args.providerId),
      getQualifications(ctx, args.providerId),
    ]);
    if (!provider) throw new Error("Provider not found");

    const start = parseDate(args.dateRangeStart);
    const end = parseDate(args.dateRangeEnd);
    const inRange = (timestamp?: number) =>
      timestamp !== undefined
      && (start === undefined || timestamp >= start)
      && (end === undefined || timestamp <= end);

    const filteredEvents = events.filter((event) => inRange(event.startDate));
    const eventIds = new Set(filteredEvents.map((event) => event._id));
    const feedback = (await getFeedback(ctx, filteredEvents, args.providerId)).filter((row) =>
      eventIds.has(row.eventId)
    );

    const attendanceData = [];
    const feedbackData = [];
    const certificateData = [];
    for (const event of filteredEvents) {
      const [registrations, attendance] = await Promise.all([
        ctx.db
          .query("aceRegistrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect(),
        ctx.db
          .query("aceAttendanceRecords")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect(),
      ]);
      const eventFeedback = feedback.filter((row) => row.eventId === event._id);
      const eventCertificates = certificates.filter((row) => row.eventId === event._id);

      attendanceData.push({
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        totalRegistrations: registrations.length,
        totalAttendanceRecords: attendance.length,
        verifiedAttendance: attendance.filter((row) => row.verified).length,
      });
      feedbackData.push({
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        totalFeedback: eventFeedback.length,
        averageRating: eventFeedback.length > 0
          ? Math.round(
              (eventFeedback.reduce((sum, row) => sum + (row.rating ?? 0), 0)
                / eventFeedback.length) * 10
            ) / 10
          : 0,
      });
      certificateData.push({
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        issued: eventCertificates.filter((row) => row.status === "issued").length,
        pending: eventCertificates.filter((row) => row.status === "pending").length,
        revoked: eventCertificates.filter((row) => row.status === "revoked").length,
      });
    }

    const qualificationsData = [];
    for (const qualification of qualifications) {
      const user = await ctx.db.get(qualification.userId);
      qualificationsData.push({
        ...qualification,
        instructorName: fullName(user) ?? String(qualification.userId),
      });
    }

    const filteredCertificates = certificates.filter((certificate) =>
      inRange(certificate.createdAt)
    );
    const filteredComplaints = complaints.filter((complaint) =>
      inRange(complaint.submittedAt)
    );
    const issuedCertificates = filteredCertificates.filter((row) => row.status === "issued");
    const approvedInstructors = qualifications.filter((row) => row.isApproved);
    const resolvedComplaints = filteredComplaints.filter((row) =>
      row.status === "resolved" || row.status === "escalated_to_bacb"
    );

    return {
      provider,
      dateRange: {
        start: args.dateRangeStart ?? null,
        end: args.dateRangeEnd ?? null,
      },
      generatedAt: Date.now(),
      summary: {
        totalEvents: filteredEvents.length,
        totalInstructors: qualifications.length,
        approvedInstructors: approvedInstructors.length,
        totalCertificates: filteredCertificates.length,
        issuedCertificates: issuedCertificates.length,
        totalCEUsIssued: issuedCertificates.reduce((sum, row) => sum + row.totalCeus, 0),
        totalComplaints: filteredComplaints.length,
        resolvedComplaints: resolvedComplaints.length,
      },
      attendanceData,
      feedbackData,
      certificateData,
      qualificationsData,
      complaintData: filteredComplaints,
    };
  },
});
