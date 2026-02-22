'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ace/StatusBadge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  GraduationCap,
  Users,
  ClipboardCheck,
  HelpCircle,
  Award,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/ace', icon: LayoutDashboard },
  { label: 'Providers', href: '/ace/providers', icon: Building2 },
  { label: 'Events', href: '/ace/events', icon: CalendarDays },
  { label: 'Instructors', href: '/ace/instructors', icon: GraduationCap },
  { label: 'Registrations', href: '/ace/registrations', icon: Users },
  { label: 'Attendance', href: '/ace/attendance', icon: ClipboardCheck },
  { label: 'Quizzes', href: '/ace/quizzes', icon: HelpCircle },
  { label: 'Certificates', href: '/ace/certificates', icon: Award },
  { label: 'Complaints', href: '/ace/complaints', icon: AlertTriangle },
  { label: 'Compliance', href: '/ace/compliance', icon: ShieldCheck },
];

interface AceSidebarProps {
  providerStatus?: 'active' | 'lapsed';
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AceSidebar({
  providerStatus = 'active',
  collapsed = false,
  onCollapsedChange,
}: AceSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/ace') return pathname === '/ace';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r bg-white transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/ace" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ backgroundColor: '#1F4D3F' }}
            >
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                ACE CEU
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">Platform</p>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/ace" className="mx-auto">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ backgroundColor: '#1F4D3F' }}
            >
              A
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
              style={active ? { backgroundColor: '#1F4D3F' } : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', active ? 'text-white' : 'text-gray-400')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t p-3 space-y-3">
        {/* Provider Status */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-gray-500">Provider Status</span>
            <StatusBadge status={providerStatus} />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                providerStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'
              )}
              title={`Provider: ${providerStatus}`}
            />
          </div>
        )}

        <Separator />

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="w-full justify-center text-gray-400 hover:text-gray-600"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile sidebar - rendered as an overlay                            */
/* ------------------------------------------------------------------ */

interface MobileSidebarProps {
  providerStatus?: 'active' | 'lapsed';
}

export function AceMobileSidebar({ providerStatus = 'active' }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/ace') return pathname === '/ace';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay + drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <Link
                href="/ace"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: '#1F4D3F' }}
                >
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    ACE CEU
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Platform
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    style={active ? { backgroundColor: '#1F4D3F' } : undefined}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        active ? 'text-white' : 'text-gray-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Provider status */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Provider Status</span>
                <StatusBadge status={providerStatus} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
