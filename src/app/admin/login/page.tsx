'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { isAuthorizedAdmin } from '@/lib/admin-config'
import { Button } from '@/components/ui/button'
import { Shield, LogIn, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function LoginPageContent() {
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  // Google-only auth for admin

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('Access denied. Only authorized administrators can access this panel.')
      // Sign out the user if they're not authorized
      supabase.auth.signOut()
    }

    // Check if user is already logged in (but not if coming from unauthorized redirect)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session && session.user?.email) {
        if (isAuthorizedAdmin(session.user.email)) {
          // Only redirect if not coming from an error
          const errorParam = searchParams.get('error')
          if (!errorParam) {
            router.push('/admin')
            return
          }
        } else {
          // Authenticated but not authorized
          setError('Access denied. Only authorized administrators can access this panel.')
          supabase.auth.signOut()
        }
      }
      setCheckingAuth(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && session.user?.email) {
        if (isAuthorizedAdmin(session.user.email)) {
          router.push('/admin')
        } else {
          setError('Access denied. Only authorized administrators can access this panel.')
          supabase.auth.signOut()
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase, searchParams])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('Login error:', error)
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  // Simple auth path disabled (Google-only requirement)

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the Behavior School admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 text-base"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Continue with Google
                  </>
                )}
              </Button>
            }
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Only authorized administrators can access this panel
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support contact removed per request */}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
