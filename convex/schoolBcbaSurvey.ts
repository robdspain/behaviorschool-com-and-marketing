import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

async function getContactByEmailLower(ctx: any, emailLower: string) {
  return ctx.db
    .query("crmContacts")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", emailLower))
    .first();
}

function mergeTags(existing: string[], additions: string[]) {
  return Array.from(new Set([...existing, ...additions]));
}

const activityAllocation = v.object({
  directStudentSupport: v.optional(v.string()),
  documentation: v.optional(v.string()),
  meetingsConsultation: v.optional(v.string()),
  assessments: v.optional(v.string()),
  staffTraining: v.optional(v.string()),
  travelScheduling: v.optional(v.string()),
  crisisResponse: v.optional(v.string()),
  other: v.optional(v.string()),
});

export const createResponse = mutation({
  args: {
    surveySlug: v.string(),
    role: v.string(),
    roleOther: v.optional(v.string()),
    schoolSetting: v.string(),
    schoolSettingOther: v.optional(v.string()),
    state: v.optional(v.string()),
    yearsInSchools: v.string(),
    caseloadRange: v.string(),
    schoolsServedRange: v.string(),
    weeklyHoursRange: v.string(),
    workloadRating: v.string(),
    burnoutFrequency: v.string(),
    activityAllocation,
    challengeAreas: v.array(v.string()),
    supportsNeeded: v.string(),
    additionalNotes: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    wantsResults: v.boolean(),
    consentToContact: v.boolean(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const email = args.email?.trim();
    const emailLower = email ? normalizeEmail(email) : undefined;

    const responseId = await ctx.db.insert("schoolBcbaSurveyResponses", {
      surveySlug: args.surveySlug,
      role: args.role,
      roleOther: args.roleOther?.trim() || undefined,
      schoolSetting: args.schoolSetting,
      schoolSettingOther: args.schoolSettingOther?.trim() || undefined,
      state: args.state?.trim() || undefined,
      yearsInSchools: args.yearsInSchools,
      caseloadRange: args.caseloadRange,
      schoolsServedRange: args.schoolsServedRange,
      weeklyHoursRange: args.weeklyHoursRange,
      workloadRating: args.workloadRating,
      burnoutFrequency: args.burnoutFrequency,
      activityAllocation: args.activityAllocation,
      challengeAreas: args.challengeAreas,
      supportsNeeded: args.supportsNeeded.trim(),
      additionalNotes: args.additionalNotes?.trim() || undefined,
      referralSource: args.referralSource?.trim() || undefined,
      wantsResults: args.wantsResults,
      consentToContact: args.consentToContact,
      firstName: args.firstName?.trim() || undefined,
      lastName: args.lastName?.trim() || undefined,
      email,
      emailLower,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (args.consentToContact && emailLower && args.firstName?.trim()) {
      const tags = ["school-bcba-survey", "2026-burnout-workload-survey"];
      const existing = await getContactByEmailLower(ctx, emailLower);
      const notes = compact({
        latestSurveyResponseId: String(responseId),
        surveySlug: args.surveySlug,
        wantsSurveyResults: args.wantsResults,
      });

      if (existing) {
        await ctx.db.patch(existing._id, {
          firstName: args.firstName.trim(),
          lastName: args.lastName?.trim() ?? existing.lastName,
          email,
          role: args.role,
          leadSource: existing.leadSource ?? "school_bcba_survey",
          tags: mergeTags(existing.tags, tags),
          notes: existing.notes
            ? `${existing.notes}\n\nSurvey follow-up: ${JSON.stringify(notes)}`
            : `Survey follow-up: ${JSON.stringify(notes)}`,
          isArchived: false,
          updatedAt: timestamp,
        });
      } else {
        await ctx.db.insert("crmContacts", {
          firstName: args.firstName.trim(),
          lastName: args.lastName?.trim() ?? "",
          email: email!,
          emailLower,
          role: args.role,
          status: "lead",
          leadSource: "school_bcba_survey",
          tags,
          notes: `Survey follow-up: ${JSON.stringify(notes)}`,
          leadScore: 0,
          priority: "medium",
          revenue: 0,
          isArchived: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    }

    return responseId;
  },
});

export const listResponses = query({
  args: {
    surveySlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    const rows = args.surveySlug
      ? await ctx.db
          .query("schoolBcbaSurveyResponses")
          .withIndex("by_survey_slug", (q) => q.eq("surveySlug", args.surveySlug!))
          .collect()
      : await ctx.db.query("schoolBcbaSurveyResponses").collect();

    return rows
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },
});
