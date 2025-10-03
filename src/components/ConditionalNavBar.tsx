"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/header";

export function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar completely on these pages
  const hideNavbarPages = ['/bcba-exam-prep'];
  
  // Also hide navbar on admin pages (they have their own admin header)
  const hideAdminNavbar = pathname.startsWith('/admin');
  
  if (hideNavbarPages.includes(pathname) || hideAdminNavbar) {
    return null;
  }
  
  // Use consistent full navbar across all pages
  return <NavBar />;
}
