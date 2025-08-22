"use client";

import Link from "next/link";
import { Shield, Database, Mail, Users } from "lucide-react";

interface SimpleAdminLayoutProps {
  children: React.ReactNode;
}

export default function SimpleAdminLayout({ children }: SimpleAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/admin/signups"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                Signups
              </Link>
              <Link 
                href="/admin/email-templates"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Templates
              </Link>
              <Link 
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Back to Site
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Connected to Supabase</span>
            </div>
            <div>
              Behavior School Admin • Environment: {process.env.NODE_ENV}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}