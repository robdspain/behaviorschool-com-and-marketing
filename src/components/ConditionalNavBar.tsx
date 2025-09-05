"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/header";
import { LandingNavBar } from "@/components/header/LandingNavBar";

export function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar completely on these pages
  const hideNavbarPages = ['/bcba-exam-prep'];
  
  // Use minimal landing page navbar on these pages
  const landingPages = [
    '/school-based-bcba',
    '/bcba-study-fluency', 
    '/bcba-mock-practice-test'
  ];
  
  if (hideNavbarPages.includes(pathname)) {
    return null;
  }
  
  if (landingPages.includes(pathname)) {
    return <LandingNavBar />;
  }
  
  return <NavBar />;
}