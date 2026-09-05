import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { startTransformationNurture } from "@/lib/transformation-nurture";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const THURSDAY_CAPACITY_LABELS: Record<string, string> = {
  yes_all_sessions: "Yes — can attend all six live sessions",
  yes_most_sessions: "Yes — can attend most sessions and will make up any miss",
  unsure: "Unsure — schedule may conflict",
  no: "No — cannot commit to Thursday 6–8 PM Pacific Time",
};

const PAYER_LABELS: Record<string, string> = {
  self: "Self-pay",
  district_po: "District purchase order / invoice",
  unsure: "Not sure yet",
};

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
  payer: string;
  systemToRebuild: string;
}) {
  const thursdayLabel = THURSDAY_CAPACITY_LABELS[args.thursdayCapacity] || args.thursdayCapacity;
  const payerLabel = PAYER_LABELS[args.payer] || args.payer;
  return [
    `Thursday 6–8 PM Pacific Time capacity: ${thursdayLabel}`,
    `Payer: ${payerLabel}`,
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
    const role = cleanString(body?.currentRole, 160);
    const whyJoin = cleanString(body?.whyJoin, 2000);
    const thursdayCapacity = cleanString(body?.thursdayCapacity, 80);
    const payer = cleanString(body?.payer, 80);
    const systemToRebuild = cleanString(body?.systemToRebuild, 1000);
    const bcbaCertNumber = cleanString(body?.bcbaCertNumber, 120) || undefined;
    const marketingConsent = body?.marketingConsent === true;

    if (
      !fullName ||
      !emailPattern.test(email) ||
      !role ||
      !whyJoin ||
      !thursdayCapacity ||
      !payer ||
      !systemToRebuild
    ) {
      return NextResponse.json({ error: "Complete each required field with a valid email address." }, { status: 400 });
    }

    if (!THURSDAY_CAPACITY_LABELS[thursdayCapacity] || !PAYER_LABELS[payer]) {
      return NextResponse.json({ error: "Choose a valid attendance and payer option." }, { status: 400 });
    }

    const currentChallenges = buildApplicantContext({
      whyJoin,
      thursdayCapacity,
      payer,
      systemToRebuild,
    });

    const { firstName, lastName } = splitName(fullName);
    const attribution = parseAttribution(body?.attribution);
    const client = getConvexClient();

    // The dedicated application mutation provides the complete CRM audit trail.
    // Keep submission available while an older Convex deployment is catching up.
    let applicationContactId: string | undefined;
    let usedLegacyCrmFallback = false;
    try {
      const application = await client.mutation(api.crm.recordTransformationApplication, {
        firstName,
        lastName,
        email,
        role,
        bcbaCertNumber,
        currentChallenges,
        marketingConsent,
        attribution,
      });
      applicationContactId = application.contactId;
    } catch (applicationError) {
      console.error("Transformation application CRM mutation error:", applicationError);
      applicationContactId = await client.mutation(api.crm.upsertContact, {
        firstName,
        lastName,
        email,
        role,
        leadSource: "transformation_application",
        status: "lead",
        tags: ["transformation-program", "transformation-application", "school-bcba-program"],
        notes: `Transformation Program application\nBCBA certification number: ${bcbaCertNumber || "Not provided"}\n\n${currentChallenges}`,
      });
      usedLegacyCrmFallback = true;
    }

    await Promise.all([
      client.mutation(api.submissions.createSignupSubmission, {
        firstName,
        lastName,
        email,
        role,
        currentChallenges,
        bcbaCertNumber,
        status: "transformation_application",
      }),
      client.mutation(api.analytics.createConversionEvent, {
        eventType: "course_inquiry",
        eventName: "transformation_application_submitted",
        sourcePage: "/transformation-program",
        resourceName: "School BCBA Transformation Program",
        additionalData: {
          consentedToProgramUpdates: marketingConsent,
          attribution,
          thursdayCapacity,
          payer,
        },
      }),
    ]);

    if (marketingConsent && !usedLegacyCrmFallback) {
      await startTransformationNurture({
        email,
        firstName,
        lastName,
        role,
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
