import { query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE COMPLIANCE - Queries for Audit & Compliance
// ============================================================================

// Deadline constants (in milliseconds)
const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;
const THREE_YEARS_MS = 3 * 365 * 24 * 60 * 60 * 1000;

// Compliance score deduction constants
const LATE_CERTIFICATE_PENALTY = 5;
const OVERDUE_FEEDBACK_PENALTY = 3;
const OVERDUE_COMPLAINT_PENALTY = 10;
const MISSING_DOCUMENTATION_PENALTY = 5;
const EXPIRED_CREDENTIALS_PENALTY = 20;

// ============================================================================
// getComplianceScore - Calculate compliance score for a provider
// ============================================================================
export const getComplianceScore = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();
    let score = 100;
    const deductions: Array<{ reason: string; points: number; count: number }> = [];

    // Get provider
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");

    // Get all events for this provider
    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const completedEvents = events.filter((e) => e.status === "completed");

    // Get all certificates for this provider
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // -5 for each certificate issued > 45 days after event completion
    let lateCertCount = 0;
    for (const cert of certificates) {
      if (cert.status === "issued" && cert.issuedAt) {
        const event = await ctx.db.get(cert.eventId);
        if (event) {
          const eventEndDate = event.endDate || event.startDate;
          const deadline = eventEndDate + FORTY_FIVE_DAYS_MS;
          if (cert.issuedAt > deadline) {
            lateCertCount++;
          }
        }
      }
    }

    // Also count pending certificates past the 45-day window
    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const deadline = eventEndDate + FORTY_FIVE_DAYS_MS;
      if (now > deadline) {
        const eventCerts = certificates.filter(
          (c) => c.eventId === event._id && c.status === "pending"
        );
        lateCertCount += eventCerts.length;
      }
    }

    if (lateCertCount > 0) {
      const penalty = lateCertCount * LATE_CERTIFICATE_PENALTY;
      score -= penalty;
      deductions.push({
        reason: "Certificate issued > 45 days after event completion",
        points: LATE_CERTIFICATE_PENALTY,
        count: lateCertCount,
      });
    }

    // -3 for each feedback not reviewed within 45 days
    let overdueFeedbackCount = 0;
    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const reviewDeadline = eventEndDate + FORTY_FIVE_DAYS_MS;
      if (now > reviewDeadline) {
        // Get feedback for this event that hasn't been reviewed
        const feedback = await ctx.db
          .query("aceFeedbackResponses")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        // In the schema, there's no coordinatorReviewedAt field on aceFeedbackResponses,
        // so we check if feedback exists for events past the review deadline
        // and consider unreviewed any that exist past the deadline window
        const unreviewedFeedback = feedback.filter((fb) => {
          // Feedback submitted before the deadline that still hasn't been reviewed
          return fb.submittedAt < reviewDeadline;
        });

        if (unreviewedFeedback.length > 0) {
          overdueFeedbackCount++;
        }
      }
    }

    if (overdueFeedbackCount > 0) {
      const penalty = overdueFeedbackCount * OVERDUE_FEEDBACK_PENALTY;
      score -= penalty;
      deductions.push({
        reason: "Feedback not reviewed within 45 days",
        points: OVERDUE_FEEDBACK_PENALTY,
        count: overdueFeedbackCount,
      });
    }

    // -10 for each complaint not responded within 45 days
    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const overdueComplaints = complaints.filter((c) => {
      if (c.status === "resolved" || c.status === "escalated_to_bacb") return false;
      const responseDeadline = c.submittedAt + FORTY_FIVE_DAYS_MS;
      return now > responseDeadline;
    });

    if (overdueComplaints.length > 0) {
      const penalty = overdueComplaints.length * OVERDUE_COMPLAINT_PENALTY;
      score -= penalty;
      deductions.push({
        reason: "Complaint not responded within 45 days",
        points: OVERDUE_COMPLAINT_PENALTY,
        count: overdueComplaints.length,
      });
    }

    // -5 for each event missing required documentation
    let missingDocsCount = 0;
    for (const event of completedEvents) {
      const hasLearningObjectives =
        event.learningObjectives && event.learningObjectives.length > 0;
      const hasInstructorInfo = !!event.instructorQualificationsSummary;

      // Check if event has attendance records
      const attendanceRecords = await ctx.db
        .query("aceAttendanceRecords")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      // Check if event has quiz (for async events)
      const quiz = await ctx.db
        .query("aceQuizzes")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .first();

      const isAsyncMissingQuiz =
        event.modality === "asynchronous" && !quiz;

      if (
        !hasLearningObjectives ||
        !hasInstructorInfo ||
        attendanceRecords.length === 0 ||
        isAsyncMissingQuiz
      ) {
        missingDocsCount++;
      }
    }

    // Also check provider-level documentation
    if (
      provider.providerType === "organization" &&
      !provider.legalEntityVerified
    ) {
      missingDocsCount++;
    }
    if (
      provider.providerType === "organization" &&
      !provider.leadershipAttestationUrl
    ) {
      missingDocsCount++;
    }

    if (missingDocsCount > 0) {
      const penalty = missingDocsCount * MISSING_DOCUMENTATION_PENALTY;
      score -= penalty;
      deductions.push({
        reason: "Event or provider missing required documentation",
        points: MISSING_DOCUMENTATION_PENALTY,
        count: missingDocsCount,
      });
    }

    // -20 for expired coordinator credentials
    const coordinatorCertExpires = provider.coordinatorCertificationExpires;
    if (coordinatorCertExpires && now > coordinatorCertExpires) {
      score -= EXPIRED_CREDENTIALS_PENALTY;
      deductions.push({
        reason: "Expired coordinator credentials",
        points: EXPIRED_CREDENTIALS_PENALTY,
        count: 1,
      });
    }

    score = Math.max(0, score);

    // Determine level
    let level: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
    if (score >= 95) level = "Excellent";
    else if (score >= 85) level = "Good";
    else if (score >= 70) level = "Fair";
    else if (score >= 50) level = "Poor";
    else level = "Critical";

    return {
      score,
      deductions,
      level,
      calculatedAt: now,
    };
  },
});

// ============================================================================
// getOverdueCertificates - Certificates not issued within 45 days
// ============================================================================
export const getOverdueCertificates = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get all completed events for this provider
    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const completedEvents = events.filter((e) => e.status === "completed");

    // Get all certificates for this provider
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const overdueCerts: Array<{
      eventId: string;
      eventTitle: string;
      eventDate: number;
      pendingCount: number;
      deadline: number;
      daysOverdue: number;
      certificates: Array<{
        certificateId: string;
        participantName: string;
        participantEmail: string;
        status: string;
      }>;
    }> = [];

    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const deadline = eventEndDate + FORTY_FIVE_DAYS_MS;

      if (now > deadline) {
        const eventCerts = certificates.filter(
          (c) => c.eventId === event._id && c.status === "pending"
        );

        if (eventCerts.length > 0) {
          const daysOverdue = Math.ceil(
            (now - deadline) / (1000 * 60 * 60 * 24)
          );
          overdueCerts.push({
            eventId: event._id,
            eventTitle: event.title,
            eventDate: event.startDate,
            pendingCount: eventCerts.length,
            deadline,
            daysOverdue,
            certificates: eventCerts.map((c) => ({
              certificateId: c._id,
              participantName: c.participantName,
              participantEmail: c.participantEmail,
              status: c.status,
            })),
          });
        }
      }
    }

    return overdueCerts;
  },
});

// ============================================================================
// getOverdueFeedback - Feedback not reviewed within 45 days
// ============================================================================
export const getOverdueFeedback = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const completedEvents = events.filter((e) => e.status === "completed");

    const overdueFeedback: Array<{
      eventId: string;
      eventTitle: string;
      eventDate: number;
      feedbackCount: number;
      deadline: number;
      daysOverdue: number;
    }> = [];

    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const reviewDeadline = eventEndDate + FORTY_FIVE_DAYS_MS;

      if (now > reviewDeadline) {
        const feedback = await ctx.db
          .query("aceFeedbackResponses")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        if (feedback.length > 0) {
          const daysOverdue = Math.ceil(
            (now - reviewDeadline) / (1000 * 60 * 60 * 24)
          );
          overdueFeedback.push({
            eventId: event._id,
            eventTitle: event.title,
            eventDate: event.startDate,
            feedbackCount: feedback.length,
            deadline: reviewDeadline,
            daysOverdue,
          });
        }
      }
    }

    return overdueFeedback;
  },
});

// ============================================================================
// getOverdueComplaints - Complaints not responded within 45 days
// ============================================================================
export const getOverdueComplaints = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const overdueComplaints = complaints
      .filter((c) => {
        if (c.status === "resolved" || c.status === "escalated_to_bacb")
          return false;
        const responseDeadline = c.submittedAt + FORTY_FIVE_DAYS_MS;
        return now > responseDeadline;
      })
      .map((c) => {
        const responseDeadline = c.submittedAt + FORTY_FIVE_DAYS_MS;
        return {
          complaintId: c._id,
          submitterName: c.submitterName,
          submitterEmail: c.submitterEmail,
          complaintText:
            c.complaintText.length > 200
              ? c.complaintText.substring(0, 200) + "..."
              : c.complaintText,
          submittedAt: c.submittedAt,
          status: c.status,
          eventId: c.eventId,
          deadline: responseDeadline,
          daysOverdue: Math.ceil(
            (now - responseDeadline) / (1000 * 60 * 60 * 24)
          ),
        };
      });

    return overdueComplaints;
  },
});

// ============================================================================
// getRetentionStatus - Events with document retention status (3-year rule)
// ============================================================================
export const getRetentionStatus = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const completedOrArchivedEvents = events.filter(
      (e) => e.status === "completed" || e.status === "archived"
    );

    const retentionStatuses = await Promise.all(
      completedOrArchivedEvents.map(async (event) => {
        const eventEndDate = event.endDate || event.startDate;
        const retentionDeadline = eventEndDate + THREE_YEARS_MS;
        const daysUntilArchive = Math.ceil(
          (retentionDeadline - now) / (1000 * 60 * 60 * 24)
        );

        // Check document availability
        const attendanceRecords = await ctx.db
          .query("aceAttendanceRecords")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const feedback = await ctx.db
          .query("aceFeedbackResponses")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const certificates = await ctx.db
          .query("aceCertificates")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const quiz = await ctx.db
          .query("aceQuizzes")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .first();

        const quizSubmissions = quiz
          ? await ctx.db
              .query("aceQuizSubmissions")
              .withIndex("by_quiz", (q) => q.eq("quizId", quiz._id))
              .collect()
          : [];

        const instructors = await ctx.db
          .query("aceEventInstructors")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        // Check instructor qualifications
        const instructorQuals = await Promise.all(
          instructors.map(async (i) => {
            const quals = await ctx.db
              .query("aceInstructorQualifications")
              .withIndex("by_user", (q) => q.eq("userId", i.userId))
              .collect();
            return quals.filter((q) => q.providerId === args.providerId);
          })
        );

        const hasInstructorQualifications =
          instructorQuals.flat().length > 0 ||
          !!event.instructorQualificationsSummary;

        const documents = {
          syllabus:
            !!event.learningObjectives &&
            event.learningObjectives.length > 0,
          materials: !!event.description,
          recording: event.modality !== "asynchronous" || !!event.onlineMeetingUrl,
          attendance: attendanceRecords.length > 0,
          quizResults: quizSubmissions.length > 0 || event.modality !== "asynchronous",
          feedback: feedback.length > 0,
          certificates: certificates.length > 0,
          instructorQualifications: hasInstructorQualifications,
        };

        const totalDocs = Object.keys(documents).length;
        const completedDocs = Object.values(documents).filter(Boolean).length;

        let retentionStatus: "active" | "due_soon" | "past_due" | "archived";
        if (event.status === "archived") {
          retentionStatus = "archived";
        } else if (daysUntilArchive < 0) {
          retentionStatus = "past_due";
        } else if (daysUntilArchive <= 90) {
          retentionStatus = "due_soon";
        } else {
          retentionStatus = "active";
        }

        return {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate,
          eventEndDate,
          eventStatus: event.status,
          retentionDeadline,
          daysUntilArchive,
          retentionStatus,
          documents,
          completionPercentage: Math.round((completedDocs / totalDocs) * 100),
          completedDocs,
          totalDocs,
        };
      })
    );

    // Sort by retention deadline (soonest first)
    retentionStatuses.sort((a, b) => a.retentionDeadline - b.retentionDeadline);

    return retentionStatuses;
  },
});

// ============================================================================
// getAuditSummary - Full audit data for a provider
// ============================================================================
export const getAuditSummary = query({
  args: {
    providerId: v.id("aceProviders"),
    dateRangeStart: v.optional(v.number()),
    dateRangeEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");

    // Get coordinator
    const coordinator = await ctx.db.get(provider.coordinatorId);

    // Get all events (with optional date range filter)
    let events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    if (args.dateRangeStart) {
      events = events.filter((e) => e.startDate >= args.dateRangeStart!);
    }
    if (args.dateRangeEnd) {
      events = events.filter((e) => e.startDate <= args.dateRangeEnd!);
    }

    // Get certificates
    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Get complaints
    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Get instructor qualifications
    const instructorQuals = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Aggregate attendance data per event
    const attendanceData = await Promise.all(
      events.map(async (event) => {
        const records = await ctx.db
          .query("aceAttendanceRecords")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const registrations = await ctx.db
          .query("aceRegistrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        return {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate,
          status: event.status,
          totalRegistrations: registrations.length,
          totalAttendanceRecords: records.length,
          verifiedAttendance: records.filter((r) => r.verified).length,
        };
      })
    );

    // Aggregate feedback data per event
    const feedbackData = await Promise.all(
      events.map(async (event) => {
        const feedback = await ctx.db
          .query("aceFeedbackResponses")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const avgRating =
          feedback.length > 0
            ? feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
              feedback.length
            : 0;

        return {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate,
          totalFeedback: feedback.length,
          averageRating: Math.round(avgRating * 10) / 10,
        };
      })
    );

    // Certificate data by event
    const certificateData = events.map((event) => {
      const eventCerts = certificates.filter((c) => c.eventId === event._id);
      const issued = eventCerts.filter((c) => c.status === "issued");
      const pending = eventCerts.filter((c) => c.status === "pending");
      const revoked = eventCerts.filter((c) => c.status === "revoked");

      return {
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        totalCertificates: eventCerts.length,
        issued: issued.length,
        pending: pending.length,
        revoked: revoked.length,
        totalCEUs: issued.reduce((sum, c) => sum + c.totalCeus, 0),
      };
    });

    // Instructor qualifications with user info
    const qualificationsData = await Promise.all(
      instructorQuals.map(async (qual) => {
        const user = await ctx.db.get(qual.userId);
        return {
          qualificationId: qual._id,
          instructorName: user
            ? `${user.firstName} ${user.lastName}`
            : "Unknown",
          instructorEmail: user?.email || "Unknown",
          isApproved: qual.isApproved,
          isBcba: qual.isBcba,
          isBcbaD: qual.isBcbaD,
          qualificationPath: qual.qualificationPath,
          certificationExpiration: qual.certificationExpiration,
          verifiedAt: qual.verifiedAt,
        };
      })
    );

    // Complaint summary
    const complaintData = complaints.map((c) => ({
      complaintId: c._id,
      submitterName: c.submitterName,
      submittedAt: c.submittedAt,
      status: c.status,
      resolvedAt: c.resolvedAt,
      eventId: c.eventId,
    }));

    // Provider status
    let providerStatus: "Active" | "Grace Period" | "Lapsed" = "Active";
    if (!provider.isActive) {
      providerStatus = "Lapsed";
    } else if (
      provider.gracePeriodEndDate &&
      now <= provider.gracePeriodEndDate
    ) {
      providerStatus = "Grace Period";
    }

    return {
      provider: {
        id: provider._id,
        name: provider.providerName,
        type: provider.providerType,
        bacbNumber: provider.bacbProviderNumber,
        status: providerStatus,
        isActive: provider.isActive,
        expirationDate: provider.expirationDate,
        coordinatorName: coordinator
          ? `${coordinator.firstName} ${coordinator.lastName}`
          : "Unknown",
        coordinatorCertificationExpires:
          provider.coordinatorCertificationExpires,
      },
      summary: {
        totalEvents: events.length,
        completedEvents: events.filter((e) => e.status === "completed").length,
        totalCertificates: certificates.length,
        issuedCertificates: certificates.filter((c) => c.status === "issued")
          .length,
        totalComplaints: complaints.length,
        resolvedComplaints: complaints.filter((c) => c.status === "resolved")
          .length,
        totalInstructors: instructorQuals.length,
        approvedInstructors: instructorQuals.filter((q) => q.isApproved)
          .length,
        totalCEUsIssued: certificates
          .filter((c) => c.status === "issued")
          .reduce((sum, c) => sum + c.totalCeus, 0),
      },
      attendanceData,
      feedbackData,
      certificateData,
      qualificationsData,
      complaintData,
      generatedAt: now,
      dateRange: {
        start: args.dateRangeStart || null,
        end: args.dateRangeEnd || null,
      },
    };
  },
});

// ============================================================================
// getEventAuditChecklist - Check audit readiness for a single event
// ============================================================================
export const getEventAuditChecklist = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Get provider
    const provider = await ctx.db.get(event.providerId);

    // Check each document/data category
    const attendanceRecords = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const feedback = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const certificates = await ctx.db
      .query("aceCertificates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const quiz = await ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .first();

    const quizSubmissions = quiz
      ? await ctx.db
          .query("aceQuizSubmissions")
          .withIndex("by_quiz", (q) => q.eq("quizId", quiz._id))
          .collect()
      : [];

    const eventInstructors = await ctx.db
      .query("aceEventInstructors")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Check instructor qualifications
    const instructorQuals = await Promise.all(
      eventInstructors.map(async (i) => {
        const quals = await ctx.db
          .query("aceInstructorQualifications")
          .withIndex("by_user", (q) => q.eq("userId", i.userId))
          .collect();
        const user = await ctx.db.get(i.userId);
        return {
          user,
          qualifications: quals.filter(
            (q) => q.providerId === event.providerId
          ),
        };
      })
    );

    const hasApprovedInstructorQuals =
      instructorQuals.some((iq) =>
        iq.qualifications.some((q) => q.isApproved)
      ) || !!event.instructorQualificationsSummary;

    const registrations = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const checklist = {
      syllabus: {
        label: "Event Syllabus / Learning Objectives",
        present:
          !!event.learningObjectives && event.learningObjectives.length > 0,
        details: event.learningObjectives
          ? `${event.learningObjectives.length} objectives defined`
          : "No learning objectives",
      },
      materials: {
        label: "Presentation Materials",
        present: !!event.description && event.description.length > 0,
        details: event.description
          ? "Description available"
          : "No materials uploaded",
      },
      recording: {
        label: "Recording (if applicable)",
        present: event.modality !== "asynchronous" || !!event.onlineMeetingUrl,
        details:
          event.modality === "in_person"
            ? "In-person event - recording optional"
            : event.onlineMeetingUrl
              ? "Meeting URL available"
              : "No recording URL",
      },
      attendance: {
        label: "Attendance Records",
        present: attendanceRecords.length > 0,
        details:
          attendanceRecords.length > 0
            ? `${attendanceRecords.length} records (${attendanceRecords.filter((r) => r.verified).length} verified)`
            : "No attendance records",
      },
      quizResults: {
        label: "Quiz Results",
        present: quizSubmissions.length > 0 || event.modality !== "asynchronous",
        details:
          quizSubmissions.length > 0
            ? `${quizSubmissions.length} submissions (${quizSubmissions.filter((s) => s.passed).length} passed)`
            : event.modality === "asynchronous"
              ? "No quiz results - required for async events"
              : "Synchronous event - quiz optional",
      },
      feedback: {
        label: "Feedback Responses",
        present: feedback.length > 0,
        details:
          feedback.length > 0
            ? `${feedback.length} responses`
            : "No feedback responses",
      },
      certificates: {
        label: "Certificates Issued",
        present: certificates.length > 0,
        details:
          certificates.length > 0
            ? `${certificates.filter((c) => c.status === "issued").length} issued, ${certificates.filter((c) => c.status === "pending").length} pending`
            : "No certificates",
      },
      instructorQualifications: {
        label: "Instructor Qualifications",
        present: hasApprovedInstructorQuals,
        details: hasApprovedInstructorQuals
          ? `${eventInstructors.length} instructor(s) documented`
          : "No instructor qualifications on file",
      },
    };

    const items = Object.values(checklist);
    const totalItems = items.length;
    const completedItems = items.filter((item) => item.present).length;
    const readinessPercentage = Math.round(
      (completedItems / totalItems) * 100
    );

    return {
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventStatus: event.status,
      providerName: provider?.providerName || "Unknown",
      checklist,
      readinessPercentage,
      completedItems,
      totalItems,
      totalRegistrations: registrations.length,
      totalAttendance: attendanceRecords.length,
      totalFeedback: feedback.length,
      totalCertificates: certificates.length,
    };
  },
});
