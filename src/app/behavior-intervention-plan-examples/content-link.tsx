import type { ReactNode } from "react";
import Link from "next/link";

export const CAMPAIGN = "behavior-intervention-plan-examples";

export const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

export function ContentLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}
