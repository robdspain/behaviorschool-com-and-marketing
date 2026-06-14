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

  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const frame = window.requestAnimationFrame(() => {
      setCollapsed(localStorage.getItem('admin_sidebar_collapsed') === '1');
    });
    const handler = (e: any) => setCollapsed(!!e?.detail?.collapsed);
    window.addEventListener('admin-sidebar-toggle', handler as any);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('admin-sidebar-toggle', handler as any);
    };
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className={collapsed ? "max-w-full overflow-x-hidden lg:pl-20" : "max-w-full overflow-x-hidden lg:pl-72"}>
        <main className="min-h-screen max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
