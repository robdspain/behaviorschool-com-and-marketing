// ============================================================================
// Convex HTTP Client Stub
// ============================================================================
// BehaviorSchool.com is backed by the Behavior School Website Convex project.
// This URL is the transferred live deployment in that project. Keep the value
// in Netlify and local environment files aligned with the ownership guard.
// We use plain fetch() for server routes, so no Convex SDK client is needed.
// ============================================================================

const CANONICAL_MARKETING_CONVEX_URL = "https://quixotic-fox-157.convex.cloud";

export function getConvexUrl() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_CONVEX_URL ?? CANONICAL_MARKETING_CONVEX_URL;
  }

  return process.env.NEXT_PUBLIC_CONVEX_URL ?? CANONICAL_MARKETING_CONVEX_URL;
}

const CONVEX_URL = getConvexUrl();

/** Minimal HTTP client matching the ConvexHttpClient interface used by ACE routes */
export function getConvexClient() {
  return {
    query: async (
      fn: string,
      args?: Record<string, unknown>,
      options?: { signal?: AbortSignal },
    ) => {
      const res = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fn, args: args ?? {}, format: "json" }),
        signal: options?.signal,
      });
      if (!res.ok) throw new Error(`Convex query failed: ${res.statusText}`);
      const data = await res.json();
      if (data.status === "error") {
        throw new Error(`Convex query failed: ${data.errorMessage || "Unknown Convex error"}`);
      }
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
      if (data.status === "error") {
        throw new Error(`Convex mutation failed: ${data.errorMessage || "Unknown Convex error"}`);
      }
      return data.value;
    },
  };
}

// Generic api path builder — routes use string paths e.g. api.ace.getEvent
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
