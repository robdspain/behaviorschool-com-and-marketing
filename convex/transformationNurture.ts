import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

const status = v.union(
  v.literal("active"),
  v.literal("completed"),
  v.literal("converted"),
  v.literal("paused"),
  v.literal("canceled")
);

const emailStatus = v.union(
  v.literal("queued"),
  v.literal("sent"),
  v.literal("failed"),
  v.literal("skipped"),
  v.literal("canceled")
);

const TRANSFORMATION_TAGS = [
  "transformation-program",
  "transformation-lead",
  "school-bcba-program",
];

export const sequenceSteps = [
  { step: 0, delayDays: 0, subject: "Your district packet and next step" },
  { step: 1, delayDays: 1, subject: "The school BCBA workload problem is not a personal failure" },
  { step: 2, delayDays: 3, subject: "What changes during the 6-week Transformation Program" },
  { step: 3, delayDays: 5, subject: "A quick district approval reminder" },
  { step: 4, delayDays: 7, subject: "Want to talk through the August cohort?" },
] as const;

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function addDaysIso(startIso: string, days: number) {
  const date = new Date(startIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function addDaysDate(startIso: string, days: number) {
  return addDaysIso(startIso, days).slice(0, 10);
}

function splitName(name?: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || undefined,
    lastName: parts.join(" ") || undefined,
  };
}

function mergeTags(existing: string[] = [], additions: string[] = []) {
  return Array.from(new Set([...existing, ...additions].filter(Boolean)));
}

async function getContactByEmailLower(ctx: any, emailLower: string) {
  return ctx.db
    .query("crmContacts")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", emailLower))
    .first();
}

async function getActiveEnrollment(ctx: any, emailLower: string) {
  const enrollments: Doc<"transformationNurtureEnrollments">[] = await ctx.db
    .query("transformationNurtureEnrollments")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", emailLower))
    .collect();

  return enrollments
    .filter((enrollment) => enrollment.status === "active" || enrollment.status === "paused")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

async function insertActivity(
  ctx: any,
  args: {
    contactId: Id<"crmContacts">;
    activityType: string;
    subject: string;
    body?: string;
    metadata?: unknown;
  }
) {
  const createdAt = nowIso();
  await ctx.db.insert("crmActivities", {
    contactId: args.contactId,
    activityType: args.activityType,
    subject: args.subject,
    body: args.body,
    activityDate: createdAt,
    metadata: args.metadata,
    createdAt,
  });
}

export const start = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.string()),
    source: v.string(),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const emailLower = normalizeEmail(args.email);
    const split = splitName(args.name);
    const firstName = (args.firstName || split.firstName || emailLower.split("@")[0]).trim();
    const lastName = (args.lastName || split.lastName || "").trim();
    const tags = mergeTags(TRANSFORMATION_TAGS, args.tags || []);
    const contactNotes = args.notes || `Transformation nurture started from ${args.source}.`;

    let contactId: Id<"crmContacts">;
    const existingContact = await getContactByEmailLower(ctx, emailLower);

    if (existingContact) {
      contactId = existingContact._id;
      await ctx.db.patch(contactId, {
        firstName: firstName || existingContact.firstName,
        lastName: lastName || existingContact.lastName,
        email: args.email.trim(),
        phone: args.phone ?? existingContact.phone,
        organization: args.organization ?? existingContact.organization,
        role: args.role ?? existingContact.role,
        status: existingContact.status === "customer" ? existingContact.status : "lead",
        leadSource: existingContact.leadSource ?? args.source,
        tags: mergeTags(existingContact.tags, tags),
        notes: existingContact.notes ? `${existingContact.notes}\n\n${contactNotes}` : contactNotes,
        followUpDate: existingContact.followUpDate ?? timestamp.slice(0, 10),
        priority: existingContact.priority === "urgent" ? "urgent" : "high",
        isArchived: false,
        updatedAt: timestamp,
      });
    } else {
      contactId = await ctx.db.insert("crmContacts", {
        firstName,
        lastName,
        email: args.email.trim(),
        emailLower,
        phone: args.phone,
        organization: args.organization,
        role: args.role,
        status: "lead",
        leadSource: args.source,
        tags,
        notes: contactNotes,
        leadScore: 40,
        priority: "high",
        followUpDate: timestamp.slice(0, 10),
        revenue: 0,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    const active = await getActiveEnrollment(ctx, emailLower);
    if (active) {
      await ctx.db.patch(active._id, {
        contactId,
        firstName,
        source: active.source || args.source,
        metadata: {
          ...(typeof active.metadata === "object" && active.metadata ? active.metadata : {}),
          latestSource: args.source,
          latestMetadata: args.metadata,
        },
        updatedAt: timestamp,
      });

      await insertActivity(ctx, {
        contactId,
        activityType: "nurture_touch",
        subject: "Transformation nurture already active",
        body: `New signal from ${args.source}; existing sequence kept active.`,
        metadata: args.metadata,
      });

      return { contactId, enrollmentId: active._id, alreadyActive: true };
    }

    const enrollmentId = await ctx.db.insert("transformationNurtureEnrollments", {
      contactId,
      email: args.email.trim(),
      emailLower,
      firstName,
      source: args.source,
      status: "active",
      startedAt: timestamp,
      metadata: args.metadata,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    for (const item of sequenceSteps) {
      await ctx.db.insert("transformationNurtureEmails", {
        enrollmentId,
        contactId,
        email: args.email.trim(),
        emailLower,
        firstName,
        step: item.step,
        subject: item.subject,
        scheduledFor: addDaysIso(timestamp, item.delayDays),
        status: "queued",
        metadata: { source: args.source },
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await ctx.db.insert("crmTasks", {
      title: "Get Transformation lead scheduled",
      description: "Reach out personally and get this lead onto Rob's calendar for a fit call.",
      contactId,
      dueDate: timestamp.slice(0, 10),
      priority: "urgent",
      status: "pending",
      taskType: "transformation_fit_call",
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId,
      activityType: "nurture_started",
      subject: "Transformation nurture sequence started",
      body: `5-email sequence started from ${args.source}.`,
      metadata: args.metadata,
    });

    return { contactId, enrollmentId, alreadyActive: false };
  },
});

export const listDueEmails = query({
  args: {
    now: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 25, 100);
    const due = await ctx.db
      .query("transformationNurtureEmails")
      .withIndex("by_status_scheduled", (q) =>
        q.eq("status", "queued").lte("scheduledFor", args.now)
      )
      .take(limit);

    const rows = [];
    for (const email of due) {
      const enrollment = await ctx.db.get(email.enrollmentId);
      const contact = await ctx.db.get(email.contactId);
      if (!enrollment || !contact || enrollment.status !== "active" || contact.status === "customer") {
        rows.push({ ...email, shouldSkip: true, enrollmentStatus: enrollment?.status, contactStatus: contact?.status });
      } else {
        rows.push({ ...email, shouldSkip: false, enrollmentStatus: enrollment.status, contactStatus: contact.status });
      }
    }

    return rows;
  },
});

export const markEmailSent = mutation({
  args: {
    id: v.id("transformationNurtureEmails"),
    providerMessageId: v.optional(v.string()),
    sentAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const sentAt = args.sentAt ?? timestamp;
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Queued email not found");

    await ctx.db.patch(args.id, {
      status: "sent",
      providerMessageId: args.providerMessageId,
      sentAt,
      updatedAt: timestamp,
    });

    await ctx.db.patch(email.enrollmentId, {
      lastSentStep: email.step,
      completedAt: email.step === sequenceSteps[sequenceSteps.length - 1].step ? sentAt : undefined,
      status: email.step === sequenceSteps[sequenceSteps.length - 1].step ? "completed" : "active",
      updatedAt: timestamp,
    });

    await ctx.db.patch(email.contactId, {
      lastContactedAt: sentAt,
      followUpDate: email.step === sequenceSteps[sequenceSteps.length - 1].step ? addDaysDate(sentAt, 2) : email.scheduledFor.slice(0, 10),
      updatedAt: timestamp,
    });

    if (email.step === sequenceSteps[sequenceSteps.length - 1].step) {
      await ctx.db.insert("crmTasks", {
        title: "Personal follow-up after Transformation nurture",
        description: "The 5-email Transformation sequence is complete. Follow up personally unless this lead has already scheduled or purchased.",
        contactId: email.contactId,
        dueDate: addDaysDate(sentAt, 2),
        priority: "high",
        status: "pending",
        taskType: "transformation_personal_follow_up",
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await ctx.db.insert("crmEmailLogs", {
      contactId: email.contactId,
      recipient: email.email,
      subject: email.subject,
      providerMessageId: args.providerMessageId,
      status: "sent",
      sentAt,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId: email.contactId,
      activityType: "nurture_email_sent",
      subject: email.subject,
      body: `Transformation nurture step ${email.step} sent.`,
      metadata: { step: email.step, enrollmentId: String(email.enrollmentId) },
    });
  },
});

export const markEmailFailed = mutation({
  args: {
    id: v.id("transformationNurtureEmails"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Queued email not found");

    await ctx.db.patch(args.id, {
      status: "failed",
      errorMessage: args.errorMessage,
      updatedAt: timestamp,
    });

    await ctx.db.insert("crmEmailLogs", {
      contactId: email.contactId,
      recipient: email.email,
      subject: email.subject,
      errorMessage: args.errorMessage,
      status: "failed",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId: email.contactId,
      activityType: "nurture_email_failed",
      subject: `Failed: ${email.subject}`,
      body: args.errorMessage,
      metadata: { step: email.step, enrollmentId: String(email.enrollmentId) },
    });
  },
});

export const markEmailSkipped = mutation({
  args: {
    id: v.id("transformationNurtureEmails"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Queued email not found");

    await ctx.db.patch(args.id, {
      status: "skipped",
      errorMessage: args.reason,
      updatedAt: timestamp,
    });
  },
});

export const markConvertedByEmail = mutation({
  args: {
    email: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const emailLower = normalizeEmail(args.email);
    const enrollments: Doc<"transformationNurtureEnrollments">[] = await ctx.db
      .query("transformationNurtureEnrollments")
      .withIndex("by_email_lower", (q: any) => q.eq("emailLower", emailLower))
      .collect();

    for (const enrollment of enrollments.filter((row) => row.status === "active" || row.status === "paused")) {
      await ctx.db.patch(enrollment._id, {
        status: "converted",
        completedAt: timestamp,
        updatedAt: timestamp,
      });

      const queued: Doc<"transformationNurtureEmails">[] = await ctx.db
        .query("transformationNurtureEmails")
        .withIndex("by_enrollment", (q: any) => q.eq("enrollmentId", enrollment._id))
        .collect();

      for (const email of queued.filter((row) => row.status === "queued")) {
        await ctx.db.patch(email._id, {
          status: "canceled",
          errorMessage: args.reason || "Lead converted",
          updatedAt: timestamp,
        });
      }

      await insertActivity(ctx, {
        contactId: enrollment.contactId,
        activityType: "nurture_converted",
        subject: "Transformation nurture stopped after conversion",
        body: args.reason || "Lead converted.",
      });
    }

    return { updated: enrollments.length };
  },
});

export const listEnrollments = query({
  args: {
    status: v.optional(status),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 500);
    const rows = args.status
      ? await ctx.db
          .query("transformationNurtureEnrollments")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("transformationNurtureEnrollments").collect();

    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  },
});

export const listEmails = query({
  args: {
    status: v.optional(emailStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 500);
    const rows = args.status
      ? await ctx.db
          .query("transformationNurtureEmails")
          .withIndex("by_status_scheduled", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("transformationNurtureEmails").collect();

    return rows.sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor)).slice(0, limit);
  },
});
