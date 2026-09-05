"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  Megaphone,
  Presentation,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    name: "Study",
    items: [
      { name: "Study marketing", href: "/admin/behavior-study-tools-marketing", icon: Megaphone },
      { name: "Study tools nurture", href: "/admin/behavior-study-tools", icon: BookOpen },
      { name: "Weekly Research Brief", href: "/admin/newsletter", icon: Send },
    ],
  },
  {
    name: "Transformation",
    items: [
      { name: "Transformation funnel", href: "/admin/transformation-marketing", icon: BarChart3 },
      { name: "CRM", href: "/admin/crm", icon: Users },
      { name: "Discovery calls", href: "/admin/crm/discovery-calls", icon: ClipboardList },
      { name: "Checkout access", href: "/admin/checkout-access", icon: ShieldCheck },
      { name: "Submissions", href: "/admin/submissions", icon: FileText },
      { name: "School BCBA survey", href: "/admin/school-bcba-survey", icon: Search },
    ],
  },
  {
    name: "Content",
    items: [
      { name: "Blog", href: "/admin/content", icon: FileText },
      { name: "Content calendar", href: "/admin/content-calendar", icon: CalendarDays },
      { name: "Email marketing", href: "/admin/email-marketing", icon: Mail },
      { name: "Email templates", href: "/admin/email-templates", icon: Mail },
      { name: "Videos", href: "/admin/videos", icon: BookOpen },
      { name: "Presentations", href: "/admin/presentations", icon: Presentation },
      { name: "Publishing standards", href: "/admin/publishing-standards", icon: ShieldCheck },
    ],
  },
  {
    name: "Support",
    items: [{ name: "Support inbox", href: "/admin/support", icon: LifeBuoy }],
  },
  {
    name: "Ops",
    items: [
      { name: "ACE", href: "/admin/ace", icon: ClipboardList },
      { name: "Masterclass", href: "/admin/masterclass", icon: BookOpen },
      { name: "Sitemap", href: "/admin/sitemap", icon: Layers },
    ],
  },
];

function isItemActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg border-2 font-medium transition-colors ${
        collapsed ? "mx-auto h-10 w-10 justify-center px-0" : "px-3 py-2.5"
      } ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"
      }`}
      title={collapsed ? item.name : undefined}
    >
      <item.icon className={`h-5 w-5 flex-none ${active ? "text-emerald-700" : "text-slate-500"}`} />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.name}</span>}
      {!collapsed && active && <ChevronRight className="h-4 w-4 flex-none text-emerald-700" />}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    const frame = window.requestAnimationFrame(() => {
      setCollapsed(window.localStorage.getItem("admin_sidebar_collapsed") === "1");
      updateViewport();
    });
    mediaQuery.addEventListener("change", updateViewport);
    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0");
    window.dispatchEvent(new CustomEvent("admin-sidebar-toggle", { detail: { collapsed } }));
  }, [collapsed]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const sidebarCollapsed = collapsed && isDesktop;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
        className="fixed left-4 top-4 z-50 rounded-lg border-2 border-slate-200 bg-white p-2 shadow-lg lg:hidden"
        aria-label={isMobileMenuOpen ? "Close admin menu" : "Open admin menu"}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
      </button>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r-2 border-slate-200 bg-white transition-[width,transform] duration-300 ease-in-out lg:translate-x-0 ${
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        } ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b-2 border-slate-200 p-4">
            <Link href="/" className="block min-w-0 truncate" title="Behavior School">
              {sidebarCollapsed ? (
                <span className="mx-auto block h-7 w-7 rounded bg-emerald-100 ring-1 ring-emerald-200" />
              ) : (
                <>
                  <span className="block truncate text-xl font-bold text-slate-900">Behavior School</span>
                  <span className="mt-1 block text-sm text-slate-600">Admin</span>
                </>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-200 hover:bg-slate-50 lg:inline-flex"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`h-5 w-5 ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>

          <nav className={`flex-1 overflow-y-auto ${sidebarCollapsed ? "px-2 py-4" : "p-4"}`} aria-label="Admin navigation">
            <div className={sidebarCollapsed ? "flex flex-col items-center gap-3" : "space-y-5"}>
              <SidebarLink
                item={{ name: "Admin home", href: "/admin", icon: BarChart3 }}
                active={isItemActive(pathname, "/admin")}
                collapsed={sidebarCollapsed}
                onClick={closeMobileMenu}
              />

              {navigation.map((group) => (
                <div key={group.name} className={sidebarCollapsed ? "contents" : "space-y-1"}>
                  {!sidebarCollapsed && (
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {group.name}
                    </p>
                  )}
                  <div className={sidebarCollapsed ? "contents" : "space-y-1"}>
                    {group.items.map((item) => (
                      <SidebarLink
                        key={item.href}
                        item={item}
                        active={isItemActive(pathname, item.href)}
                        collapsed={sidebarCollapsed}
                        onClick={closeMobileMenu}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="border-t-2 border-slate-200 p-4">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/admin/logout";
              }}
              className={`flex w-full items-center rounded-lg border-2 border-transparent py-2.5 font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 ${
                sidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"
              }`}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
