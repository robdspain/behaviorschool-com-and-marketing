"use client";

import type { ReactNode } from "react";
import { withUtm } from "@/components/content/ProgramCta";
import { CAMPAIGN, linkClass } from "./content-link";

export function ProgramTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={withUtm(href, CAMPAIGN)}
      data-cta="program-soft"
      data-cta-page={CAMPAIGN}
      className={linkClass}
    >
      {children}
    </a>
  );
}
