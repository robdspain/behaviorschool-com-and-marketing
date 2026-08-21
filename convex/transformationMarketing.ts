import { query } from "./_generated/server";
import { v } from "convex/values";

const summaryReturns = v.object({
  generatedAt: v.string(),
  truncated: v.boolean(),
  contacts: v.object({
    active: v.number(),
    optedIn: v.number(),
    consentNotRequested: v.number(),
    unknownConsent: v.number(),
    unsubscribed: v.number(),
    knownRole: v.number(),
    knownOrganization: v.number(),
    neverContacted: v.number(),
    schoolBcbaSignals: v.number(),
    transformationSignals: v.number(),
    qualified: v.number(),
    customers: v.number(),
  }),
  pipeline: v.object({
    activeDeals: v.number(),
    activeDealValue: v.number(),
    pendingFollowUps: v.number(),
    overdueFollowUps: v.number(),
    strongFitCalls: v.number(),
    applications: v.number(),
  }),
});

export const summary = query({
  args: { limit: v.optional(v.number()) },
  returns: summaryReturns,
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 1000, 1), 1000);
    const today = new Date().toISOString().slice(0, 10);
    const [contacts, deals, pendingTasks, discoveryCalls, applications] = await Promise.all([
      ctx.db.query("crmContacts").withIndex("by_archived", (q) => q.eq("isArchived", false)).take(limit),
      ctx.db.query("crmDeals").withIndex("by_archived", (q) => q.eq("isArchived", false)).take(limit),
      ctx.db.query("crmTasks").withIndex("by_status", (q) => q.eq("status", "pending")).take(limit),
      ctx.db.query("crmDiscoveryCalls").withIndex("by_call_date").order("desc").take(Math.min(limit, 500)),
      ctx.db.query("signupSubmissions").withIndex("by_archived", (q) => q.eq("archived", false)).take(limit),
    ]);

    const activeDeals = deals.filter((deal) => !["closed_won", "closed_lost"].includes(deal.stage));
    const activeTasks = pendingTasks.filter((task) => !task.isArchived);
    const liveApplications = applications.filter((application) => application.status === "transformation_application");

    const counts = contacts.reduce(
      (summary, contact) => {
        const tags = contact.tags.map((tag) => tag.toLowerCase());
        const role = contact.role?.toLowerCase() ?? "";
        const hasSchoolSignal = tags.includes("school-bcba") || role.includes("school") || role.includes("bcba");
        const hasTransformationSignal = tags.some((tag) => tag.includes("transformation"));

        if (contact.marketingConsentStatus === "opted_in") summary.optedIn += 1;
        else if (contact.marketingConsentStatus === "not_requested") summary.consentNotRequested += 1;
        else if (contact.marketingConsentStatus === "unsubscribed") summary.unsubscribed += 1;
        else summary.unknownConsent += 1;

        if (contact.role) summary.knownRole += 1;
        if (contact.organization) summary.knownOrganization += 1;
        if (!contact.lastContactedAt) summary.neverContacted += 1;
        if (hasSchoolSignal) summary.schoolBcbaSignals += 1;
        if (hasTransformationSignal) summary.transformationSignals += 1;
        if (contact.status === "qualified") summary.qualified += 1;
        if (contact.status === "customer") summary.customers += 1;
        return summary;
      },
      {
        optedIn: 0,
        consentNotRequested: 0,
        unknownConsent: 0,
        unsubscribed: 0,
        knownRole: 0,
        knownOrganization: 0,
        neverContacted: 0,
        schoolBcbaSignals: 0,
        transformationSignals: 0,
        qualified: 0,
        customers: 0,
      },
    );

    return {
      generatedAt: new Date().toISOString(),
      truncated: contacts.length === limit || deals.length === limit || pendingTasks.length === limit || applications.length === limit,
      contacts: {
        active: contacts.length,
        ...counts,
      },
      pipeline: {
        activeDeals: activeDeals.length,
        activeDealValue: activeDeals.reduce((total, deal) => total + deal.value, 0),
        pendingFollowUps: activeTasks.length,
        overdueFollowUps: activeTasks.filter((task) => task.dueDate < today).length,
        strongFitCalls: discoveryCalls.filter((call) => call.fitAssessment === "strong_fit" || call.fitAssessment === "perfect_fit").length,
        applications: liveApplications.length,
      },
    };
  },
});
