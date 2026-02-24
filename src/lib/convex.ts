// ============================================================================
// Convex Client Configuration
// ============================================================================
// HTTP client for calling Convex actions/queries from Next.js API routes.
// NOTE: This repo has no local Convex deployment — we use a generic client
// to call the behaviorschool-app Convex deployment via NEXT_PUBLIC_CONVEX_URL.
// ============================================================================

import { ConvexHttpClient } from "convex/browser";

// Get Convex URL from environment
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

if (!CONVEX_URL) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set");
}

// Create HTTP client for server-side use
export function getConvexClient() {
  return new ConvexHttpClient(CONVEX_URL);
}

// Generic api stub — routes call convex via string paths e.g. "ace:getEvent"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api: Record<string, any> = new Proxy({}, {
  get(_, module: string) {
    return new Proxy({}, {
      get(_, fn: string) {
        return `${module}:${fn}`;
      }
    });
  }
});

// Generic Id type
export type Id<T extends string = string> = string & { readonly _tableName: T };
