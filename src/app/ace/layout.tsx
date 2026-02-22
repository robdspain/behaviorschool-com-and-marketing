'use client';

import { useState } from 'react';
import { AceSidebar } from '@/components/ace/AceSidebar';
import { AceHeader } from '@/components/ace/AceHeader';

export default function AceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // In a real app, providerStatus would come from an auth/session context
  const providerStatus: 'active' | 'lapsed' = 'active';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <AceSidebar
        providerStatus={providerStatus}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AceHeader providerStatus={providerStatus} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
