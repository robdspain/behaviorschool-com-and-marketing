import { headers } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  twoFactorEnabled: boolean;
}

/**
 * Get the current authenticated user from the Better Auth server session.
 * Uses the Convex-hosted auth endpoint. Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!siteUrl) return null;

  try {
    const reqHeaders = await headers();
    const res = await fetch(`${siteUrl}/api/auth/get-session`, {
      headers: {
        cookie: reqHeaders.get("cookie") ?? "",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.user?.id) return null;

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name ?? null,
      twoFactorEnabled: Boolean(data.user.twoFactorEnabled),
    };
  } catch {
    return null;
  }
}
