import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

const contactStatus = v.union(
  v.literal("lead"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("onboarding"),
  v.literal("customer"),
  v.literal("churned"),
  v.literal("inactive")
);

const priority = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent")
);

const taskStatus = v.union(
  v.literal("pending"),
  v.literal("completed"),
  v.literal("overdue")
);

const fitAssessment = v.union(
  v.literal("perfect_fit"),
  v.literal("strong_fit"),
  v.literal("not_fit"),
  v.literal("needs_follow_up")
);

const paymentOption = v.union(
  v.literal("pay_in_full"),
  v.literal("payment_plan"),
  v.literal("both"),
  v.literal("not_discussed"),
  v.literal("other")
);

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

function fullName(contact: Doc<"crmContacts"> | null) {
  if (!contact) return "Unknown Contact";
  return [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim();
}

function getDealValue(paymentOptionDiscussed: "pay_in_full" | "payment_plan" | "both" | "not_discussed" | "other") {
  if (paymentOptionDiscussed === "payment_plan") return 2091;
  return 1997;
}

async function getContactByEmailLower(ctx: any, emailLower: string) {
  return ctx.db
    .query("crmContacts")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", emailLower))
    .first();
}

async function insertActivity(
  ctx: any,
  args: {
    contactId?: Id<"crmContacts">;
    taskId?: Id<"crmTasks">;
    dealId?: Id<"crmDeals">;
    discoveryCallId?: Id<"crmDiscoveryCalls">;
    activityType: string;
    subject: string;
    body?: string;
    metadata?: unknown;
  }
) {
  const createdAt = nowIso();
  await ctx.db.insert("crmActivities", {
    contactId: args.contactId,
    taskId: args.taskId,
    dealId: args.dealId,
    discoveryCallId: args.discoveryCallId,
    activityType: args.activityType,
    subject: args.subject,
    body: args.body,
    activityDate: createdAt,
    metadata: args.metadata,
    createdAt,
  });
}

export const listContacts = query({
  args: {
    query: v.optional(v.string()),
    status: v.optional(v.string()),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const contacts = await ctx.db.query("crmContacts").collect();
    const search = args.query?.trim().toLowerCase();

    return contacts
      .filter((contact) => args.includeArchived || !contact.isArchived)
      .filter((contact) => !args.status || contact.status === args.status)
      .filter((contact) => {
        if (!search) return true;
        return (
          fullName(contact).toLowerCase().includes(search) ||
          contact.emailLower.includes(search) ||
          contact.organization?.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
});

export const getContact = query({
  args: { id: v.id("crmContacts") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const getContactByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return getContactByEmailLower(ctx, normalizeEmail(email));
  },
});

export const createContact = mutation({
  args: {
    firstName: v.string(),
    lastName: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.string()),
    caseloadSize: v.optional(v.number()),
    status: v.optional(contactStatus),
    leadSource: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    leadScore: v.optional(v.number()),
    priority: v.optional(priority),
    followUpDate: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const emailLower = normalizeEmail(args.email);
    const existing = await getContactByEmailLower(ctx, emailLower);
    if (existing && !existing.isArchived) {
      throw new Error("Contact with this email already exists");
    }

    const timestamp = nowIso();
    return ctx.db.insert("crmContacts", {
      firstName: args.firstName.trim(),
      lastName: args.lastName?.trim() ?? "",
      email: args.email.trim(),
      emailLower,
      phone: args.phone,
      organization: args.organization,
      role: args.role,
      caseloadSize: args.caseloadSize,
      status: args.status ?? "lead",
      leadSource: args.leadSource,
      tags: args.tags ?? [],
      notes: args.notes,
      leadScore: args.leadScore ?? 0,
      priority: args.priority ?? "medium",
      followUpDate: args.followUpDate,
      stripeCustomerId: args.stripeCustomerId,
      revenue: args.revenue ?? 0,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const upsertContact = mutation({
  args: {
    firstName: v.string(),
    lastName: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.optional(contactStatus),
    leadSource: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const emailLower = normalizeEmail(args.email);
    const existing = await getContactByEmailLower(ctx, emailLower);
    const timestamp = nowIso();

    if (existing) {
      await ctx.db.patch(existing._id, compact({
        firstName: args.firstName.trim(),
        lastName: args.lastName?.trim() ?? existing.lastName,
        email: args.email.trim(),
        phone: args.phone ?? existing.phone,
        organization: args.organization ?? existing.organization,
        role: args.role ?? existing.role,
        status: args.status ?? existing.status,
        leadSource: args.leadSource ?? existing.leadSource,
        tags: args.tags ?? existing.tags,
        notes: args.notes ?? existing.notes,
        followUpDate: args.followUpDate ?? existing.followUpDate,
        stripeCustomerId: args.stripeCustomerId ?? existing.stripeCustomerId,
        revenue: args.revenue ?? existing.revenue,
        isArchived: false,
        updatedAt: timestamp,
      }));
      return existing._id;
    }

    return ctx.db.insert("crmContacts", {
      firstName: args.firstName.trim(),
      lastName: args.lastName?.trim() ?? "",
      email: args.email.trim(),
      emailLower,
      phone: args.phone,
      organization: args.organization,
      role: args.role,
      status: args.status ?? "lead",
      leadSource: args.leadSource,
      tags: args.tags ?? [],
      notes: args.notes,
      followUpDate: args.followUpDate,
      leadScore: 0,
      priority: "medium",
      stripeCustomerId: args.stripeCustomerId,
      revenue: args.revenue ?? 0,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateContact = mutation({
  args: {
    id: v.id("crmContacts"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.string()),
    caseloadSize: v.optional(v.number()),
    status: v.optional(contactStatus),
    leadSource: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    leadScore: v.optional(v.number()),
    priority: v.optional(priority),
    lastContactedAt: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, email, ...updates } = args;
    await ctx.db.patch(id, compact({
      ...updates,
      email: email?.trim(),
      emailLower: email ? normalizeEmail(email) : undefined,
      updatedAt: nowIso(),
    }));
    return ctx.db.get(id);
  },
});

export const deleteContact = mutation({
  args: { id: v.id("crmContacts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const archiveContact = mutation({
  args: { id: v.id("crmContacts") },
  handler: async (ctx, { id }) => {
    const timestamp = nowIso();
    await ctx.db.patch(id, {
      isArchived: true,
      archivedAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const listTasks = query({
  args: { includeArchived: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("crmTasks").withIndex("by_due_date").collect();
    const rows = [];
    for (const task of tasks) {
      if (!args.includeArchived && task.isArchived) continue;
      const contact = await ctx.db.get(task.contactId);
      rows.push({ ...task, contactName: fullName(contact) });
    }
    return rows;
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    contactId: v.id("crmContacts"),
    dueDate: v.string(),
    priority: v.optional(priority),
    taskType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    return ctx.db.insert("crmTasks", {
      title: args.title,
      description: args.description,
      contactId: args.contactId,
      dueDate: args.dueDate,
      priority: args.priority ?? "medium",
      status: "pending",
      taskType: args.taskType ?? "follow_up",
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("crmTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    priority: v.optional(priority),
    status: v.optional(taskStatus),
    taskType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, compact({
      ...updates,
      completedAt: updates.status === "completed" ? nowIso() : undefined,
      updatedAt: nowIso(),
    }));
    return ctx.db.get(id);
  },
});

export const deleteTask = mutation({
  args: { id: v.id("crmTasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const listDeals = query({
  args: { includeArchived: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const deals = await ctx.db.query("crmDeals").collect();
    const rows = [];
    for (const deal of deals) {
      if (!args.includeArchived && deal.isArchived) continue;
      const contact = await ctx.db.get(deal.contactId);
      rows.push({ ...deal, contactName: fullName(contact) });
    }
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const createDeal = mutation({
  args: {
    title: v.string(),
    contactId: v.id("crmContacts"),
    value: v.number(),
    stage: v.optional(v.string()),
    probability: v.optional(v.number()),
    expectedCloseDate: v.optional(v.string()),
    paymentOption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    return ctx.db.insert("crmDeals", {
      title: args.title,
      contactId: args.contactId,
      value: args.value,
      stage: args.stage ?? "qualification",
      probability: args.probability ?? 50,
      expectedCloseDate: args.expectedCloseDate,
      paymentOption: args.paymentOption,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const logDiscoveryCall = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    role: v.string(),
    schoolSettingNotes: v.string(),
    callDateTime: v.string(),
    fitAssessment,
    programDiscussed: v.string(),
    paymentOptionDiscussed: paymentOption,
    nextStep: v.string(),
    checkoutLink: v.optional(v.string()),
    expectedCloseDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const emailLower = normalizeEmail(args.email);
    const existingContact = await getContactByEmailLower(ctx, emailLower);
    let contactId: Id<"crmContacts">;

    if (existingContact) {
      contactId = existingContact._id;
      await ctx.db.patch(contactId, compact({
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        email: args.email.trim(),
        role: args.role,
        status: args.fitAssessment === "not_fit" ? "contacted" : "qualified",
        notes: args.schoolSettingNotes,
        lastContactedAt: args.callDateTime,
        followUpDate: args.callDateTime.slice(0, 10),
        isArchived: false,
        updatedAt: timestamp,
      }));
    } else {
      contactId = await ctx.db.insert("crmContacts", {
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        email: args.email.trim(),
        emailLower,
        role: args.role,
        status: args.fitAssessment === "not_fit" ? "contacted" : "qualified",
        leadSource: "discovery_call",
        tags: ["discovery-call"],
        notes: args.schoolSettingNotes,
        leadScore: 0,
        priority: args.fitAssessment === "perfect_fit" || args.fitAssessment === "strong_fit" ? "high" : "medium",
        lastContactedAt: args.callDateTime,
        followUpDate: args.callDateTime.slice(0, 10),
        revenue: 0,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    const discoveryCallId = await ctx.db.insert("crmDiscoveryCalls", {
      contactId,
      callDateTime: args.callDateTime,
      role: args.role,
      schoolSettingNotes: args.schoolSettingNotes,
      fitAssessment: args.fitAssessment,
      programDiscussed: args.programDiscussed,
      paymentOptionDiscussed: args.paymentOptionDiscussed,
      nextStep: args.nextStep,
      checkoutLink: args.checkoutLink,
      followUpStatus: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const dueDate = args.callDateTime.slice(0, 10);
    const taskId = await ctx.db.insert("crmTasks", {
      title: "Send checkout follow-up",
      description: `Send payment options and checkout link for ${args.programDiscussed}.`,
      contactId,
      discoveryCallId,
      dueDate,
      priority: "high",
      status: "pending",
      taskType: "follow_up",
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const dealId = await ctx.db.insert("crmDeals", {
      title: `${args.programDiscussed} - ${args.firstName} ${args.lastName}`,
      contactId,
      discoveryCallId,
      value: getDealValue(args.paymentOptionDiscussed),
      stage: "discovery_call_completed",
      probability: 50,
      expectedCloseDate: args.expectedCloseDate ?? dueDate,
      paymentOption: args.paymentOptionDiscussed,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await ctx.db.patch(discoveryCallId, {
      followUpTaskId: taskId,
      dealId,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId,
      taskId,
      dealId,
      discoveryCallId,
      activityType: "discovery_call",
      subject: "Discovery call logged",
      body: args.nextStep,
      metadata: {
        fitAssessment: args.fitAssessment,
        paymentOptionDiscussed: args.paymentOptionDiscussed,
      },
    });

    return { contactId, discoveryCallId, taskId, dealId };
  },
});

export const logCheckoutFollowUpSent = mutation({
  args: {
    discoveryCallId: v.id("crmDiscoveryCalls"),
    recipient: v.string(),
    subject: v.string(),
    checkoutLink: v.string(),
    sentAt: v.optional(v.string()),
    providerMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const sentAt = args.sentAt ?? timestamp;
    const discoveryCall = await ctx.db.get(args.discoveryCallId);
    if (!discoveryCall) throw new Error("Discovery call not found");

    const emailLogId = await ctx.db.insert("crmEmailLogs", {
      contactId: discoveryCall.contactId,
      discoveryCallId: args.discoveryCallId,
      taskId: discoveryCall.followUpTaskId,
      recipient: args.recipient,
      subject: args.subject,
      checkoutLink: args.checkoutLink,
      providerMessageId: args.providerMessageId,
      status: "sent",
      sentAt,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (discoveryCall.followUpTaskId) {
      await ctx.db.patch(discoveryCall.followUpTaskId, {
        status: "completed",
        completedAt: sentAt,
        updatedAt: timestamp,
      });
    }

    await ctx.db.patch(discoveryCall.contactId, {
      lastContactedAt: sentAt,
      followUpDate: undefined,
      updatedAt: timestamp,
    });

    await ctx.db.patch(args.discoveryCallId, {
      followUpStatus: "sent",
      followUpEmailLogId: emailLogId,
      checkoutLink: args.checkoutLink,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId: discoveryCall.contactId,
      taskId: discoveryCall.followUpTaskId,
      discoveryCallId: args.discoveryCallId,
      activityType: "email",
      subject: args.subject,
      body: `Checkout follow-up sent to ${args.recipient}.`,
      metadata: { checkoutLink: args.checkoutLink, status: "sent" },
    });

    return { emailLogId };
  },
});

export const logCheckoutFollowUpFailed = mutation({
  args: {
    discoveryCallId: v.id("crmDiscoveryCalls"),
    recipient: v.string(),
    subject: v.string(),
    checkoutLink: v.string(),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const discoveryCall = await ctx.db.get(args.discoveryCallId);
    if (!discoveryCall) throw new Error("Discovery call not found");

    const emailLogId = await ctx.db.insert("crmEmailLogs", {
      contactId: discoveryCall.contactId,
      discoveryCallId: args.discoveryCallId,
      taskId: discoveryCall.followUpTaskId,
      recipient: args.recipient,
      subject: args.subject,
      checkoutLink: args.checkoutLink,
      errorMessage: args.errorMessage,
      status: "failed",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await insertActivity(ctx, {
      contactId: discoveryCall.contactId,
      taskId: discoveryCall.followUpTaskId,
      discoveryCallId: args.discoveryCallId,
      activityType: "email_failed",
      subject: `Failed: ${args.subject}`,
      body: args.errorMessage,
      metadata: { checkoutLink: args.checkoutLink, status: "failed" },
    });

    return { emailLogId };
  },
});

export const listDiscoveryCalls = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("crmDiscoveryCalls")
      .withIndex("by_call_date")
      .order("desc")
      .take(Math.min(args.limit ?? 100, 500));

    const rows = [];
    for (const call of calls) {
      const contact = await ctx.db.get(call.contactId);
      const task = call.followUpTaskId ? await ctx.db.get(call.followUpTaskId) : null;
      const deal = call.dealId ? await ctx.db.get(call.dealId) : null;
      rows.push({ ...call, contact, task, deal });
    }
    return rows;
  },
});

export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const contacts = (await ctx.db.query("crmContacts").collect()).filter((c) => !c.isArchived);
    const deals = (await ctx.db.query("crmDeals").collect()).filter((d) => !d.isArchived);
    const tasks = (await ctx.db.query("crmTasks").collect()).filter((t) => !t.isArchived);
    const discoveryCalls = await ctx.db.query("crmDiscoveryCalls").collect();
    const activities = await ctx.db.query("crmActivities").withIndex("by_activity_date").order("desc").take(10);
    const today = new Date().toISOString().slice(0, 10);
    const activeDeals = deals.filter((deal) => !["closed_won", "closed_lost"].includes(deal.stage));
    const pendingTasks = tasks.filter((task) => task.status === "pending");
    const overdueTasks = pendingTasks.filter((task) => task.dueDate < today);

    const contactsByStatus: Record<string, number> = {};
    for (const contact of contacts) {
      contactsByStatus[contact.status] = (contactsByStatus[contact.status] ?? 0) + 1;
    }

    const dealsByStage: Record<string, number> = {};
    for (const deal of deals) {
      dealsByStage[deal.stage] = (dealsByStage[deal.stage] ?? 0) + 1;
    }

    const recentActivities = [];
    for (const activity of activities) {
      const contact = activity.contactId ? await ctx.db.get(activity.contactId) : null;
      recentActivities.push({ ...activity, contactName: fullName(contact) });
    }

    const upcomingTasks = [];
    for (const task of pendingTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 10)) {
      const contact = await ctx.db.get(task.contactId);
      upcomingTasks.push({ ...task, contactName: fullName(contact) });
    }

    return {
      totalContacts: contacts.length,
      activeDeals: activeDeals.length,
      totalPipelineValue: activeDeals.reduce((sum, deal) => sum + deal.value, 0),
      pendingTasks: pendingTasks.length,
      contactsByStatus,
      dealsByStage,
      recentActivities,
      upcomingTasks,
      discovery: {
        callsToday: discoveryCalls.filter((call) => call.callDateTime.slice(0, 10) === today).length,
        followUpNotSent: discoveryCalls.filter((call) => call.followUpStatus === "pending").length,
        followUpSent: discoveryCalls.filter((call) => call.followUpStatus === "sent").length,
        checkoutOpened: 0,
        checkoutStarted: 0,
        paidEnrolled: deals.filter((deal) => deal.stage === "closed_won").length,
        overdueFollowUps: overdueTasks.length,
      },
    };
  },
});
