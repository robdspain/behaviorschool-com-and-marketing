"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Lock,
  CreditCard,
  Send,
  GraduationCap,
  Layers,
  Presentation
} from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { 
    name: "Masterclass", 
    href: "/admin/masterclass", 
    icon: GraduationCap,
    children: [
      { name: "Design Course", href: "/admin/masterclass/design", icon: GraduationCap },
      { name: "Resources", href: "/admin/masterclass/resources/design", icon: FileText },
    ]
  },
  { 
    name: "Leads", 
    icon: Users,
    children: [
      { name: "Submissions", href: "/admin/submissions", icon: Users },
      { name: "Checkout Access", href: "/admin/checkout-access", icon: Lock },
      { name: "Payment Page", href: "/transformation-program/checkout", icon: CreditCard },
    ]
  },
  { name: "Email Templates", href: "/admin/email-templates", icon: Mail },
  { name: "Newsletter (Listmonk)", href: "/admin/listmonk", icon: Send },
  { name: "Blog", href: "/admin/content", icon: FileText },
  { name: "Presentations", href: "/admin/presentations", icon: Presentation },
  { name: "Sitemap", href: "/admin/sitemap", icon: Layers },
];

function SidebarNavItem({ item, isActive, onClick, collapsed }: { item: NavItem; isActive: (href: string | undefined) => boolean; onClick: () => void; collapsed: boolean }) {
  const initiallyOpen = item.children?.some(child => isActive(child.href)) || false;
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const active = hasChildren
    ? item.children?.some(child => isActive(child.href))
    : isActive(item.href);

  if (collapsed) {
    const target = hasChildren ? (item.children?.[0]?.href || item.href || '#') : (item.href || '#');
    const active = isActive(target);
    return (
      <Link
        href={target}
        onClick={onClick}
        className={`flex items-center justify-center w-10 h-10 rounded-lg mx-auto transition-colors ${active ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200' : 'text-slate-600 hover:bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}
        title={item.name}
      >
        <item.icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
      </Link>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleToggle}
          className={`
            flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl
            font-medium transition-all duration-200
            ${
              active
                ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                : "text-slate-700 hover:bg-slate-50 border-2 border-transparent hover:border-slate-200"
            }
          `}
          title={item.name}
        >
          <div className="flex items-center gap-3">
            <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-600" : "text-slate-500"}`} />
            <span className="flex-1 text-left">{item.name}</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
        </button>
        {isOpen && (
          <div className="pl-8 pt-2 space-y-1">
            {item.children?.map(child => (
              <SidebarNavItem key={child.name} item={child} isActive={isActive} onClick={onClick} collapsed={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        font-medium transition-all duration-200
        ${
          active
            ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
            : "text-slate-700 hover:bg-slate-50 border-2 border-transparent hover:border-slate-200"
        }
      `}
      title={item.name}
    >
      <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-600" : "text-slate-500"}`} />
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
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('admin_sidebar_collapsed') === '1';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_sidebar_collapsed', collapsed ? '1' : '0');
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle', { detail: { collapsed } }));
  }, [collapsed]);

  const isActive = (href: string | undefined) => {
    if (!href) return false;
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
          fixed top-0 left-0 z-40 h-screen ${collapsed ? 'w-20' : 'w-72'}
          bg-white border-r-2 border-slate-200
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b-2 border-slate-200 flex items-center justify-between">
            <Link href="/" className="block truncate" title="Behavior School">
              {!collapsed ? (
                <>
                  <h2 className="text-xl font-bold text-slate-900">Behavior School</h2>
                  <p className="text-sm text-slate-600 mt-1">Admin Dashboard</p>
                </>
              ) : (
                <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-200" />
              )}
            </Link>
            <button
              onClick={() => setCollapsed(v => !v)}
              className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 border-slate-200 hover:bg-slate-50"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-4' : 'p-4'}`}>
            <div className={`${collapsed ? 'flex flex-col items-center gap-3' : 'space-y-1'}`}>
              {navigation.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                  onClick={() => setIsMobileMenuOpen(false)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-slate-200">
            <Link
              href="/auth/signout"
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 border-2 border-transparent hover:border-red-200 transition-all duration-200 font-medium`}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Sign Out</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
