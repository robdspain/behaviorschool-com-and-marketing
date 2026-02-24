// ============================================================================
// Convex HTTP Client Stub
// ============================================================================
// This marketing site (behaviorschool.com) has no Convex backend of its own.
// The ACE API routes proxy to the behaviorschool-app Convex deployment.
// We use plain fetch() for HTTP calls — no convex SDK needed here.
// ============================================================================

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

if (!CONVEX_URL) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set — ACE API routes will not function");
}

/** Minimal HTTP client matching the ConvexHttpClient interface used by ACE routes */
export function getConvexClient() {
  return {
    query: async (fn: string, args?: Record<string, unknown>) => {
      const res = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fn, args: args ?? {}, format: "json" }),
      });
      if (!res.ok) throw new Error(`Convex query failed: ${res.statusText}`);
      const data = await res.json();
      return data.value;
    },
    mutation: async (fn: string, args?: Record<string, unknown>) => {
      const res = await fetch(`${CONVEX_URL}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fn, args: args ?? {}, format: "json" }),
      });
      if (!res.ok) throw new Error(`Convex mutation failed: ${res.statusText}`);
      const data = await res.json();
      return data.value;
    },
  };
}

// Generic api path builder — routes use string paths e.g. api.ace.getEvent
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api: Record<string, any> = new Proxy({}, {
  get(_, module: string) {
    return new Proxy({}, {
      get(_, fn: string) {
        return `${module}:${fn}`;
      },
    });
  },
});

export type Id<T extends string = string> = string & { readonly _tableName: T };
