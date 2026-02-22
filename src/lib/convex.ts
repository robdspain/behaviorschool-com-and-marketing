// ============================================================================
// Convex Client Configuration
// ============================================================================
// Server-side and client-side Convex client setup
// ============================================================================

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

// Get Convex URL from environment
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

if (!CONVEX_URL) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set");
}

// Create HTTP client for server-side use
export function getConvexClient() {
  return new ConvexHttpClient(CONVEX_URL);
}

// Export API for type inference
export { api };

// Re-export Id type for convenience
export type { Id } from "../../convex/_generated/dataModel";
