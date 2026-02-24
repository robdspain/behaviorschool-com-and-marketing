import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/** Lazy Supabase client — returns a no-op stub at build time when env vars are absent */
export function createClient(): AnyClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!url || !key) {
    console.warn('[supabase-client] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set — using stub')
    // Return a no-op stub so module-level instantiation never throws at build time
    const notConfigured = () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'NOT_CONFIGURED' } })
    const chainable = (): AnyClient => {
      const obj: AnyClient = new Proxy({}, {
        get: () => (..._args: unknown[]) => chainable(),
        apply: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      })
      obj.then = undefined  // not a Promise itself
      return obj
    }
    return {
      from: () => chainable(),
      auth: { getSession: notConfigured, getUser: notConfigured, signOut: notConfigured },
      storage: { from: () => chainable() },
      rpc: notConfigured,
    }
  }

  try {
    return createBrowserClient(url, key, {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
      }
    })
  } catch (err) {
    console.error('[supabase-client] Failed to create client:', err)
    return { from: () => ({ select: () => Promise.resolve({ data: null, error: err }) }) }
  }
}
