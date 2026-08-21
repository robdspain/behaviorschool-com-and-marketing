import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { startTransformationNurture } from "@/lib/transformation-nurture";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = cleanString(body?.fullName, 160);
    const email = cleanString(body?.email, 320).toLowerCase();
    const role = cleanString(body?.currentRole, 160);
    const currentChallenges = cleanString(body?.whyJoin, 2000);
    const bcbaCertNumber = cleanString(body?.bcbaCertNumber, 120) || undefined;
    const marketingConsent = body?.marketingConsent === true;

    if (!fullName || !emailPattern.test(email) || !role || !currentChallenges) {
      return NextResponse.json({ error: "Complete each required field with a valid email address." }, { status: 400 });
    }

    const { firstName, lastName } = splitName(fullName);
    const attribution = parseAttribution(body?.attribution);
    const client = getConvexClient();

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
        },
      }),
    ]);

    if (marketingConsent) {
      await startTransformationNurture({
        email,
        firstName,
        lastName,
        role,
        source: "transformation_application",
        tags: ["transformation-application", "marketing-consent"],
        notes: "Applicant explicitly opted in to program updates.",
        metadata: { attribution, applicationContactId: application.contactId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Transformation application error:", error);
    return NextResponse.json({ error: "Unable to submit your application right now. Please try again shortly." }, { status: 500 });
  }
}
