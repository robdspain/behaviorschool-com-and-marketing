"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { SIMPLE_AUTH_CONFIG } from "@/lib/admin-config";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SimpleAdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('admin-authenticated') === 'true';
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      // Simple password check
      if (password === SIMPLE_AUTH_CONFIG.ADMIN_PASSWORD) {
        // Set authentication flag
        localStorage.setItem('admin-authenticated', 'true');
        localStorage.setItem('admin-email', 'robspain@gmail.com'); // Use first authorized email
        localStorage.setItem('admin-login-time', Date.now().toString());
        
        router.push('/admin');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Admin Access
            </h1>
            <p className="text-slate-600">
              Enter the admin password to access the Behavior School admin panel
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              <span className="font-medium">
                {loading ? "Signing in..." : "Access Admin Panel"}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 mb-4">
              Only authorized administrators can access this panel.
            </p>
            
            <div className="space-y-2">
              <Link
                href="/admin/login"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors block"
              >
                Try OAuth Login Instead
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Behavior School
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
