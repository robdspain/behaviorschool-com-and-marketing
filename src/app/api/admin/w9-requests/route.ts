export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { api, getConvexClient } from "@/lib/convex";

type W9RequestDoc = {
  _id: string;
  name: string;
  email: string;
  organization: string;
  createdAt: number;
  status: "pending" | "sent";
  sentAt?: number;
  sentBy?: "auto" | "manual";
  sourcePage: string;
  autoSendResult: "sent" | "fallback_no_pdf" | "error";
};

function toRow(request: W9RequestDoc) {
  return {
    id: request._id,
    name: request.name,
    email: request.email,
    organization: request.organization,
    createdAt: request.createdAt,
    status: request.status,
    sentAt: request.sentAt ?? null,
    sentBy: request.sentBy ?? null,
    sourcePage: request.sourcePage,
    autoSendResult: request.autoSendResult,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown";
}

function adminJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function isSchemaGap(error: unknown): boolean {
  return /w9Requests|could not find table|not found in the schema|schema/i.test(errorMessage(error));
}

const ACCESS_KEY_MESSAGE =
  "Set W9_ADMIN_ACCESS_KEY on Netlify and in the Convex dashboard before W-9 requests can be listed.";

function adminAccessKey(): string | null {
  const key = process.env.W9_ADMIN_ACCESS_KEY?.trim();
  return key ? key : null;
}

async function requireAdmin() {
  const admin = await verifyAdminSession();
  if (!admin) return adminJson({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const client = getConvexClient();
  const accessKey = adminAccessKey();

  try {
    if (searchParams.get("view") === "count") {
      if (!accessKey) return adminJson({ pendingCount: 0, capped: false });
      try {
        const count = await client.query(api.w9Requests.pendingCount, { accessKey });
        const pendingCount = typeof count?.pendingCount === "number" ? count.pendingCount : 0;
        return adminJson({
          pendingCount,
          capped: Boolean(count?.capped),
        });
      } catch (error) {
        if (isSchemaGap(error) || /not configured|Unauthorized/i.test(errorMessage(error))) {
          return adminJson({ pendingCount: 0, capped: false });
        }
        throw error;
      }
    }

    if (!accessKey) {
      return adminJson({ error: ACCESS_KEY_MESSAGE }, { status: 503 });
    }

    const id = searchParams.get("id");
    if (id) {
      try {
        const record = await client.query(api.w9Requests.get, { accessKey, id });
        if (!record) return adminJson({ error: "W-9 request not found." }, { status: 404 });
        return adminJson({ request: toRow(record as W9RequestDoc) });
      } catch (error) {
        console.error("W-9 request lookup failed", errorMessage(error));
        return adminJson({ error: "W-9 request not found." }, { status: 404 });
      }
    }

    const statusParam = searchParams.get("status");
    if (statusParam && statusParam !== "pending" && statusParam !== "sent") {
      return adminJson({ error: "Status filter must be pending or sent." }, { status: 400 });
    }

    const records = await client.query(api.w9Requests.list, {
      accessKey,
      ...(statusParam ? { status: statusParam } : {}),
      limit: 200,
    });

    return adminJson({
      requests: ((records || []) as W9RequestDoc[]).map(toRow),
    });
  } catch (error) {
    console.error("W-9 request list failed", errorMessage(error));
    if (/not configured/i.test(errorMessage(error))) {
      return adminJson({ error: ACCESS_KEY_MESSAGE }, { status: 503 });
    }
    if (isSchemaGap(error)) {
      return adminJson(
        { error: "W-9 requests are not available until the Convex schema is deployed." },
        { status: 503 },
      );
    }
    return adminJson({ error: "Could not load W-9 requests." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJson({ error: "Request ID is required." }, { status: 400 });
  }

  const id = body && typeof body === "object" && "id" in body ? (body as { id?: unknown }).id : undefined;
  if (typeof id !== "string" || id.length < 8 || id.length > 128) {
    return adminJson({ error: "Request ID is required." }, { status: 400 });
  }

  try {
    const accessKey = adminAccessKey();
    if (!accessKey) return adminJson({ error: ACCESS_KEY_MESSAGE }, { status: 503 });

    const updated = await getConvexClient().mutation(api.w9Requests.markSent, { accessKey, id });
    return adminJson({ request: toRow(updated as W9RequestDoc) });
  } catch (error) {
    const message = errorMessage(error);
    console.error("W-9 mark sent failed", message);
    if (/not configured/i.test(message)) {
      return adminJson({ error: ACCESS_KEY_MESSAGE }, { status: 503 });
    }
    if (/W-9 request not found/i.test(message)) {
      return adminJson({ error: "W-9 request not found." }, { status: 404 });
    }
    if (isSchemaGap(error)) {
      return adminJson(
        { error: "W-9 requests are not available until the Convex schema is deployed." },
        { status: 503 },
      );
    }
    return adminJson({ error: "Could not mark this request sent." }, { status: 500 });
  }
}
