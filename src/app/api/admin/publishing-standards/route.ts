import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { api, getConvexClient } from "@/lib/convex";
import {
  blogPublishingIdentity,
  checkPublishingRelease,
  publishingApprovalUrl,
} from "@/lib/publishing-standard";

export const dynamic = "force-dynamic";

async function adminOrResponse() {
  const user = await verifyAdminSession();
  return user ?? NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const user = await adminOrResponse();
  if (user instanceof NextResponse) return user;
  try {
    const records = await getConvexClient().query(api.publishingStandards.list, {});
    return NextResponse.json({ ok: true, records });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Publishing records could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await adminOrResponse();
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json() as { operation?: string; [key: string]: unknown };
    const client = getConvexClient();

    if (body.operation === "upsert") {
      const record = await client.mutation(api.publishingStandards.upsert, body.record as Record<string, unknown>);
      return NextResponse.json({ ok: true, record });
    }
    if (body.operation === "approve") {
      const record = await client.mutation(api.publishingStandards.approve, {
        id: body.id,
        approvedBy: user.email,
      });
      return NextResponse.json({ ok: true, record });
    }
    if (body.operation === "revoke") {
      const record = await client.mutation(api.publishingStandards.revoke, { id: body.id });
      return NextResponse.json({ ok: true, record });
    }
    if (body.operation === "check") {
      const identity = body.identity as { site: "behaviorschool" | "robspain"; contentKey: string; contentHash: string; title?: string; contentType?: string; tier?: string };
      const gate = await checkPublishingRelease(identity);
      return NextResponse.json({ ok: true, gate, approvalUrl: publishingApprovalUrl(identity) });
    }
    if (body.operation === "fingerprintBlog") {
      const identity = blogPublishingIdentity(body.content as Record<string, unknown>, String(body.fallbackSlug ?? ""));
      const gate = await checkPublishingRelease(identity);
      return NextResponse.json({ ok: true, identity, gate, approvalUrl: publishingApprovalUrl(identity) });
    }

    return NextResponse.json({ ok: false, error: "Unknown publishing-standard operation." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Publishing-standard operation failed." }, { status: 400 });
  }
}
