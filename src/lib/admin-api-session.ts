import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidAdminSessionToken } from "@/lib/adminSession";

const COOKIE_NAME = "bs_admin_auth";

export async function requireAdminApiSession() {
  const cookieStore = await cookies();
  const authenticated = cookieStore
    .getAll(COOKIE_NAME)
    .some((cookie) => isValidAdminSessionToken(cookie.value));

  if (authenticated) return null;

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
