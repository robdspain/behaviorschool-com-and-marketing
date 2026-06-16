"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import type { ReactNode } from "react";

function createConvexClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl || !/^https:\/\/.+\.convex\.cloud$/.test(convexUrl)) return null;

  try {
    return new ConvexReactClient(convexUrl);
  } catch {
    return null;
  }
}

const convex = createConvexClient();

export function Providers({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>;

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
