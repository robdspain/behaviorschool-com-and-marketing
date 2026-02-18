import { NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const school = searchParams.get("school");
  const hash = searchParams.get("hash");
  if (!school || !hash) {
    return NextResponse.json({ error: "Missing school or hash" }, { status: 400 });
  }

  const convex = getConvexClient();
  const schoolRecord: any = await convex.query("ferpa:getSchoolBySlug", { slug: school });
  if (!schoolRecord || schoolRecord.teamKeyHash !== hash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const docs = await convex.query("ferpa:listIepGoalDocs", { schoolId: schoolRecord._id });
  return NextResponse.json({ docs });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { schoolSlug, teamKeyHash, email, role, title, payload, payloadVersion } = body || {};
  if (!schoolSlug || !teamKeyHash || !email || !role || !title || !payload) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const convex = getConvexClient();
  const schoolRecord: any = await convex.query("ferpa:getSchoolBySlug", { slug: schoolSlug });
  if (!schoolRecord || schoolRecord.teamKeyHash !== teamKeyHash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await convex.mutation("ferpa:upsertMember", {
    schoolId: schoolRecord._id,
    email,
    role,
  });

  const doc = await convex.mutation("ferpa:createIepGoalDoc", {
    schoolId: schoolRecord._id,
    title,
    createdBy: email,
    payload,
    payloadVersion: payloadVersion || 1,
  });

  return NextResponse.json({ doc });
}
