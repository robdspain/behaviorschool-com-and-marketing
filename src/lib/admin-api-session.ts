import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidAdminSessionToken } from "@/lib/adminSession";

const COOKIE_NAME = "bs_admin_session";

export async function requireAdminApiSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (isValidAdminSessionToken(token)) return null;

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
