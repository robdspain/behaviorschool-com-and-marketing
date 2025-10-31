"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const val = localStorage.getItem('admin_sidebar_collapsed') === '1';
    setCollapsed(val);
    const handler = (e: any) => setCollapsed(!!e?.detail?.collapsed);
    window.addEventListener('admin-sidebar-toggle', handler as any);
    return () => window.removeEventListener('admin-sidebar-toggle', handler as any);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className={collapsed ? "lg:pl-20" : "lg:pl-72"}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
