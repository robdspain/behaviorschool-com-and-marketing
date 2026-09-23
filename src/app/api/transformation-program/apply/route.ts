import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { startTransformationNurture } from "@/lib/transformation-nurture";
import {
  buildStoredRole,
  describeCashFields,
  isRoleCategory,
  isUrgencyWindow,
  mapPayerToPaymentPath,
  type PaymentPath,
  type RoleCategory,
  type UrgencyWindow,
} from "@/lib/transformation-cash-fields";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const THURSDAY_CAPACITY_LABELS: Record<string, string> = {
  yes_all_sessions: "Yes — can attend all six live sessions",
  yes_most_sessions: "Yes — can attend most sessions and will make up any miss",
  unsure: "Unsure — schedule may conflict",
  no: "No — cannot commit to Thursday 6–8 PM Pacific Time",
};

const APPLICATION_TAGS = [
  "transformation-program",
  "transformation-application",
  "school-bcba-program",
  "pipe_a_apply",
];

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function splitName(name: string) {
  const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
  return { firstName: firstName || "", lastName: rest.join(" ") };
}

function parseAttribution(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const allowed = ["source", "medium", "campaign", "term", "content", "landingPage"];
  const attribution = Object.fromEntries(
    allowed
      .map((key) => [key, cleanString(raw[key], 200)])
      .filter(([, entry]) => Boolean(entry)),
  );
  return Object.keys(attribution).length > 0 ? attribution : undefined;
}

function buildApplicantContext(args: {
  whyJoin: string;
  thursdayCapacity: string;
  employer: string;
  roleCategory: RoleCategory;
  roleTitle: string;
  paymentPath: PaymentPath;
  urgencyWindow: UrgencyWindow;
  systemToRebuild: string;
}) {
  const thursdayLabel = THURSDAY_CAPACITY_LABELS[args.thursdayCapacity] || args.thursdayCapacity;
  return [
    ...describeCashFields({
      employer: args.employer,
      roleCategory: args.roleCategory,
      roleTitle: args.roleTitle,
      paymentPath: args.paymentPath,
      urgencyWindow: args.urgencyWindow,
    }),
    `Thursday 6–8 PM Pacific Time capacity: ${thursdayLabel}`,
    `System to rebuild: ${args.systemToRebuild}`,
    "",
    "Applicant context:",
    args.whyJoin,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = cleanString(body?.fullName, 160);
    const email = cleanString(body?.email, 320).toLowerCase();
    const employer = cleanString(body?.employer, 200);
    const roleTitle = cleanString(body?.currentRole, 160);
    const roleCategoryInput = cleanString(body?.roleCategory, 40);
    const whyJoin = cleanString(body?.whyJoin, 2000);
    const thursdayCapacity = cleanString(body?.thursdayCapacity, 80);
    const payerInput = cleanString(body?.paymentPath || body?.payer, 80);
    const urgencyInput = cleanString(body?.urgencyWindow, 40);
    const systemToRebuild = cleanString(body?.systemToRebuild, 1000);
    const bcbaCertNumber = cleanString(body?.bcbaCertNumber, 120) || undefined;
    const marketingConsent = body?.marketingConsent === true;
    const paymentPath = mapPayerToPaymentPath(payerInput);

    if (
      !fullName ||
      !emailPattern.test(email) ||
      !employer ||
      !isRoleCategory(roleCategoryInput) ||
      !paymentPath ||
      !isUrgencyWindow(urgencyInput) ||
      !whyJoin ||
      !thursdayCapacity ||
      !systemToRebuild
    ) {
      return NextResponse.json({ error: "Complete each required field with a valid email address." }, { status: 400 });
    }

    if (!THURSDAY_CAPACITY_LABELS[thursdayCapacity]) {
      return NextResponse.json({ error: "Choose a valid attendance option." }, { status: 400 });
    }

    const roleCategory: RoleCategory = roleCategoryInput;
    const urgencyWindow: UrgencyWindow = urgencyInput;
    const storedRole = buildStoredRole(roleCategory, roleTitle);
    const currentChallenges = buildApplicantContext({
      whyJoin,
      thursdayCapacity,
      employer,
      roleCategory,
      roleTitle,
      paymentPath,
      urgencyWindow,
      systemToRebuild,
    });

    const { firstName, lastName } = splitName(fullName);
    const attribution = parseAttribution(body?.attribution);
    const client = getConvexClient();
    const cashFields = {
      employer,
      roleCategory,
      paymentPath,
      urgencyWindow,
    };

    // The dedicated application mutation provides the complete CRM audit trail.
    // Keep submission available while an older Convex deployment is catching up.
    let applicationContactId: string | undefined;
    let usedLegacyCrmFallback = false;
    try {
      const application = await client.mutation(api.crm.recordTransformationApplication, {
        firstName,
        lastName,
        email,
        role: storedRole,
        bcbaCertNumber,
        currentChallenges,
        marketingConsent,
        attribution,
        ...cashFields,
      });
      applicationContactId = application.contactId;
    } catch (applicationError) {
      console.error("Transformation application CRM mutation error:", applicationError);
      const legacyNotes = `Transformation Program application\nBCBA certification number: ${bcbaCertNumber || "Not provided"}\n\n${currentChallenges}`;
      const legacyContact = {
        firstName,
        lastName,
        email,
        role: storedRole,
        organization: employer,
        leadSource: "transformation_application",
        status: "lead",
        tags: APPLICATION_TAGS,
        notes: legacyNotes,
      };
      try {
        applicationContactId = await client.mutation(api.crm.upsertContact, {
          ...legacyContact,
          ...cashFields,
        });
      } catch (cashFallbackError) {
        console.error("Transformation application CRM cash-field fallback error:", cashFallbackError);
        applicationContactId = await client.mutation(api.crm.upsertContact, legacyContact);
      }
      usedLegacyCrmFallback = true;
    }

    const submissionBase = {
      firstName,
      lastName,
      email,
      role: storedRole,
      organization: employer,
      currentChallenges,
      bcbaCertNumber,
      status: "transformation_application",
    };
    const analyticsBase = {
      eventType: "course_inquiry",
      sourcePage: "/transformation-program",
      resourceName: "School BCBA Transformation Program",
    };

    await Promise.all([
      (async () => {
        try {
          await client.mutation(api.submissions.createSignupSubmission, {
            ...submissionBase,
            ...cashFields,
          });
        } catch (submissionError) {
          console.error("Transformation application submission cash-field error:", submissionError);
          await client.mutation(api.submissions.createSignupSubmission, submissionBase);
        }
      })(),
      client.mutation(api.analytics.createConversionEvent, {
        ...analyticsBase,
        eventName: "transformation_application_submitted",
        additionalData: {
          consentedToProgramUpdates: marketingConsent,
          attribution,
          thursdayCapacity,
          payer: paymentPath,
          employer,
          role: roleCategory,
          payment_path: paymentPath,
          urgency_window: urgencyWindow,
        },
      }),
      client.mutation(api.analytics.createConversionEvent, {
        eventType: "transformation_apply",
        eventName: "transformation_apply_submitted",
        sourcePage: "/transformation-program",
        resourceName: "School BCBA Transformation Program",
        additionalData: {
          employer,
          role: roleCategory,
          payment_path: paymentPath,
          urgency_window: urgencyWindow,
        },
      }),
    ]);

    if (marketingConsent && !usedLegacyCrmFallback) {
      await startTransformationNurture({
        email,
        firstName,
        lastName,
        role: storedRole,
        source: "transformation_application",
        tags: ["transformation-application", "marketing-consent"],
        notes: "Applicant explicitly opted in to program updates.",
        metadata: { attribution, applicationContactId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Transformation application error:", error);
    return NextResponse.json({ error: "Unable to submit your application right now. Please try again shortly." }, { status: 500 });
  }
}
