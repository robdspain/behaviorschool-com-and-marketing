'use client'

import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div>
      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </div>
  )
}