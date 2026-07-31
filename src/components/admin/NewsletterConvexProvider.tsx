"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useMemo, type ReactNode } from "react";

const newsletterConvexUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_URL ||
  "https://modest-malamute-868.convex.cloud";
const newsletterConvex = new ConvexReactClient(newsletterConvexUrl);

export function NewsletterConvexProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  const newsletterAuthState = useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: Boolean(initialToken),
      fetchAccessToken: async () => initialToken ?? null,
    }),
    [initialToken],
  );
  const useNewsletterAuth = useMemo(
    () =>
      function useNewsletterTokenAuth() {
        return newsletterAuthState;
      },
    [newsletterAuthState],
  );

  return (
    <ConvexProviderWithAuth
      client={newsletterConvex}
      useAuth={useNewsletterAuth}
    >
      {children}
    </ConvexProviderWithAuth>
  );
}
