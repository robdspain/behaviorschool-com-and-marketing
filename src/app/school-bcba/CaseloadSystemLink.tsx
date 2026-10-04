"use client";

import { withUtm } from "@/components/content/ProgramCta";

const linkClass =
  "inline-block max-w-full min-h-11 py-2 font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

export function CaseloadSystemLink() {
  return (
    <a
      href={withUtm("/transformation-program", "school-bcba")}
      data-cta="program-soft"
      data-cta-page="school-bcba"
      className={linkClass}
    >
      Build this as a system for your whole caseload
    </a>
  );
}
