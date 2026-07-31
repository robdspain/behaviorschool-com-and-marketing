"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const newsletterConvexUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_URL ||
  "https://modest-malamute-868.convex.cloud";
const newsletterConvexSiteUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";

const newsletterConvex = new ConvexReactClient(newsletterConvexUrl);

export const newsletterAuthClient = createAuthClient({
  baseURL: newsletterConvexSiteUrl,
  plugins: [
    convexClient(),
    crossDomainClient({
      storagePrefix: "newsletter-auth",
      disableCache: true,
    }),
  ],
});

export function NewsletterConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider
      client={newsletterConvex}
      authClient={newsletterAuthClient}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}
