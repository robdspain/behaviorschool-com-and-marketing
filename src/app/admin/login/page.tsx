'use client';

import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
