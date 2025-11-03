"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import type { ReactNode } from "react";

export default function TrackedOutboundLink({
  href,
  children,
  className,
  eventName = "outbound_click",
  location,
  variant,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  eventName?: string;
  location: string;
  variant?: string | number;
}) {
  const { trackButtonClick } = useAnalytics();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackButtonClick(eventName, location, { href, variant })}
    >
      {children}
    </a>
  );
}

