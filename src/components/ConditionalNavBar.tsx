"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/header";
import { LandingNavBar } from "@/components/header/LandingNavBar";

export function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar completely on these pages
  const hideNavbarPages = ['/bcba-exam-prep'];
  
  // Keep full navbar on these main navigation pages
  const fullNavbarPages = [
    '/community',
    '/products', 
    '/transformation-program',
    '/about',
    '/contact'
  ];
  
  // Admin pages and other special cases also get full navbar
  const keepFullNavbar = fullNavbarPages.includes(pathname) || 
                        pathname.startsWith('/admin') || 
                        pathname.startsWith('/blog') ||
                        pathname === '/';
  
  if (hideNavbarPages.includes(pathname)) {
    return null;
  }
  
  if (keepFullNavbar) {
    return <NavBar />;
  }
  
  // All other pages are landing pages - use minimal navbar
  return <LandingNavBar />;
}