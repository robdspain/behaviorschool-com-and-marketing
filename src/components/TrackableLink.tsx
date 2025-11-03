"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  buttonName: string;
  buttonLocation: string;
  // Optional additional data to enrich analytics
  additionalData?: Record<string, unknown>;
};

export function TrackableLink({ href, children, className, buttonName, buttonLocation, additionalData }: Props) {
  const { trackButtonClick } = useAnalytics();

  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackButtonClick(buttonName, buttonLocation, { href, ...additionalData })}
    >
      {children}
    </Link>
  );
}

