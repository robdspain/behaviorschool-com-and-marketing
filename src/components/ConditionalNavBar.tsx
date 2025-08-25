"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/header";

export function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar on these landing pages
  const hideNavbarPages = ['/bcba-exam-prep'];
  
  if (hideNavbarPages.includes(pathname)) {
    return null;
  }
  
  return <NavBar />;
}