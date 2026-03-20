import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/** No-op stub for when Supabase isn't configured */
function createStub(): AnyClient {
  const notConfigured = () => Promise.resolve({ data: { session: null, user: null }, error: null })
  const chainable = (): AnyClient => {
    const obj: AnyClient = new Proxy({}, {
      get: () => (..._args: unknown[]) => chainable(),
      apply: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    })
    obj.then = undefined
    return obj
  }
  return {
    from: () => chainable(),
    auth: { 
      getSession: notConfigured, 
      getUser: notConfigured, 
      signOut: notConfigured,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: notConfigured,
      signInWithOtp: notConfigured,
    },
    storage: { from: () => chainable() },
    rpc: notConfigured,
  }
}

/** Lazy Supabase client — returns a no-op stub when env vars are absent or invalid */
export function createClient(): AnyClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Check for missing/placeholder/invalid URLs
  const isInvalid = !url || !key || 
    url.includes('placeholder') || 
    !url.startsWith('https://') ||
    url.length < 20
  
  if (isInvalid) {
    // Only log once per session
    if (typeof window !== 'undefined' && !(window as any).__supabaseStubWarned) {
      console.warn('[supabase-client] Not configured — using stub')
      ;(window as any).__supabaseStubWarned = true
    }
    return createStub()
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
