'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { isAuthorizedAdmin } from '@/lib/admin-config'
import { Shield, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Script from 'next/script'

// Declare google global
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          renderButton: (element: HTMLElement, options: GoogleButtonConfiguration) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: { credential: string }) => void;
  auto_select?: boolean;
}

interface GoogleButtonConfiguration {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
}

function LoginPageContent() {
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('Access denied. Only authorized administrators can access this panel.')

      // Clear all Supabase session data to prevent redirect loop
      fetch('/api/admin/auth/logout', { method: 'POST' })
        .then(() => {
          // Also clear any client-side storage
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
            // Clear all cookies
            document.cookie.split(";").forEach((c) => {
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
          }
        })
        .catch(err => console.error('Logout error:', err))
    }
    setCheckingAuth(false)
  }, [searchParams])

  const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      setLoading(true)
      setError('')

      const decoded = decodeJWT(response.credential)
      const email = decoded.email

      console.log('Google Sign-In successful:', email)

      // Check if email is authorized
      if (!isAuthorizedAdmin(email)) {
        setError(`Access denied for ${email}. Only authorized administrators can access this panel.`)
        setLoading(false)
        return
      }

      // Store session via API route (sets HttpOnly cookie)
      const sessionResponse = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: decoded.name,
          picture: decoded.picture,
          exp: decoded.exp,
          token: response.credential
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session')
      }

      // Redirect to admin
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push('/admin')
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to process Google sign-in. Please try again.')
      setLoading(false)
    }
  }

  const initializeGoogleSignIn = () => {
    if (window.google && !googleLoaded) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      })

      const buttonDiv = document.getElementById('google-signin-button')
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '320',
        })
      }

      setGoogleLoaded(true)
    }
  }

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
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initializeGoogleSignIn}
        strategy="afterInteractive"
      />
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
              {/* Google Sign-In Button */}
              <div className="flex justify-center">
                <div id="google-signin-button"></div>
              </div>

              {loading && (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2" />
                  <span className="text-sm text-slate-600">Signing in...</span>
                </div>
              )}

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
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
