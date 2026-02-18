import { NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";

export async function POST(req: Request) {
  const adminKey = process.env.FERPA_ADMIN_KEY;
  const provided = req.headers.get("x-ferpa-admin-key");
  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, name, teamKeyHash } = body || {};
  if (!slug || !name || !teamKeyHash) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const convex = getConvexClient();
  const school = await convex.mutation("ferpa:createSchool", { slug, name, teamKeyHash });
  return NextResponse.json({ school });
}
