"use client";

import { usePathname } from "next/navigation";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function FooterNewsletterSignup() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/subscribe" || pathname === "/blog" || pathname.startsWith("/blog/")) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <NewsletterSignup />
      </div>
    </div>
  );
}
