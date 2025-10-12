'use client';

import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/admin`,
      },
    });
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
