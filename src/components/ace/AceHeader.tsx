'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AceMobileSidebar } from '@/components/ace/AceSidebar';
import { cn } from '@/lib/utils';
import { Bell, ChevronRight, User } from 'lucide-react';

/**
 * Derive the page title and breadcrumbs from the current pathname.
 */
function usePageMeta() {
  const pathname = usePathname();

  // Map of route segments to display labels
  const labels: Record<string, string> = {
    ace: 'ACE CEU Platform',
    providers: 'Providers',
    events: 'Events',
    instructors: 'Instructors',
    registrations: 'Registrations',
    attendance: 'Attendance',
    quizzes: 'Quizzes',
    certificates: 'Certificates',
    complaints: 'Complaints',
    compliance: 'Compliance',
  };

  const segments = pathname
    .split('/')
    .filter(Boolean);

  // Build breadcrumbs
  const breadcrumbs: { label: string; href: string }[] = [];
  let hrefAccumulator = '';

  for (const seg of segments) {
    hrefAccumulator += `/${seg}`;
    breadcrumbs.push({
      label: labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      href: hrefAccumulator,
    });
  }

  // The page title is the last breadcrumb label
  const title =
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 1].label
      : 'Dashboard';

  return { title, breadcrumbs };
}

interface AceHeaderProps {
  providerStatus?: 'active' | 'lapsed';
}

export function AceHeader({ providerStatus }: AceHeaderProps) {
  const { title, breadcrumbs } = usePageMeta();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
      {/* Mobile menu toggle */}
      <AceMobileSidebar providerStatus={providerStatus} />

      {/* Breadcrumbs & title */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumbs - hidden on small screens */}
        <nav
          className="hidden sm:flex items-center gap-1 text-xs text-gray-500"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-700">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Page title - visible on mobile */}
        <h1 className="text-lg font-semibold text-gray-900 truncate sm:hidden">
          {title}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User avatar placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
          aria-label="User menu"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: '#1F4D3F' }}
          >
            <User className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </header>
  );
}
