import { NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get("hash");
  const school = searchParams.get("school");
  if (!hash || !school) {
    return NextResponse.json({ error: "Missing school or hash" }, { status: 400 });
  }

  const convex = getConvexClient();
  const schoolRecord: any = await convex.query("ferpa:getSchoolBySlug", { slug: school });
  if (!schoolRecord || schoolRecord.teamKeyHash !== hash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const doc: any = await convex.query("ferpa:getBipDoc", { id: params.id });
  if (!doc || doc.schoolId !== schoolRecord._id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ doc });
}
