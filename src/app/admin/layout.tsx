'''"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { isAuthorizedAdmin, DEV_CONFIG } from "@/lib/admin-config";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // For development mode with bypass enabled, skip authentication
        if (DEV_CONFIG.isDevelopmentBypass()) {
          const devUser: User = { 
            id: 'dev-user', 
            email: DEV_CONFIG.DEV_ADMIN_EMAIL,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            confirmation_sent_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            phone_confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          };
          setUser(devUser);
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        if (!supabase) {
          // If Supabase is not configured, show error instead of infinite loading
          console.warn('Supabase is not configured. Admin access requires authentication setup.');
          setLoading(false);
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/admin/login');
          return;
        }

        if (!session) {
          router.push('/admin/login');
          return;
        }

        setUser(session.user);

        // Check if user email is in the authorized admin list
        const userEmail = session.user.email;
        
        if (!isAuthorizedAdmin(userEmail)) {
          console.warn(`Unauthorized admin access attempt by: ${userEmail}`);
          // Redirect to unauthorized page
          router.push('/unauthorized');
          return;
        }

        setIsAdmin(true);

        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();

    // Only set up auth listener when not using development bypass
    if (!DEV_CONFIG.isDevelopmentBypass()) {
      if (!supabase) return;
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsAdmin(false);
            router.push('/admin/login');
          } else if (session) {
            setUser(session.user);
            // Re-check admin status
            if (supabase) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              setIsAdmin(profile?.role === 'admin' || true); // Allow access for now
            }
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [router]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Not Configured</h2>
          <p className="text-slate-600 mb-6">
            Supabase authentication is not configured. Please set up the required environment variables:
          </p>
          <div className="bg-slate-100 rounded-lg p-4 text-left text-sm font-mono mb-6">
            <p className="text-slate-700 mb-2">Required in .env.local:</p>
            <p className="text-slate-600">NEXT_PUBLIC_SUPABASE_URL=your-url</p>
            <p className="text-slate-600">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Login Page
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don&apos;t have permission to access the admin panel.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-transparent shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className.tsx="w-6 h-6 text-emerald-600" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Behavior School Admin</h1>
                <p className="text-sm text-slate-600">Welcome back, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-6">
                <a href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
                  Dashboard
                </a>
                <a href="/admin/blog" className="text-sm text-slate-600 hover:text-slate-900">
                  Blog
                </a>
                <a href="/admin/signups" className="text-sm text-slate-600 hover:text-slate-900">
                  Signups
                </a>
                <a href="/admin/users" className="text-sm text-slate-600 hover:text-slate-900">
                  Users
                </a>
              </nav>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
'''