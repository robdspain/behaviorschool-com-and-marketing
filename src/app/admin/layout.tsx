"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

