"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Settings, 
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Submissions", href: "/admin/submissions", icon: Users },
  { name: "Email Templates", href: "/admin/email-templates", icon: Mail },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border-2 border-slate-200 shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-slate-900" />
        ) : (
          <Menu className="w-6 h-6 text-slate-900" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-72
          bg-white border-r-2 border-slate-200
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b-2 border-slate-200">
            <Link href="/" className="block">
              <h2 className="text-xl font-bold text-slate-900">
                Behavior School
              </h2>
              <p className="text-sm text-slate-600 mt-1">Admin Dashboard</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      font-medium transition-all duration-200
                      ${
                        active
                          ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                          : "text-slate-700 hover:bg-slate-50 border-2 border-transparent hover:border-slate-200"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-600" : "text-slate-500"}`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-slate-200">
            <Link
              href="/auth/signout"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 border-2 border-transparent hover:border-red-200 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

