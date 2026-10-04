"use client";

import { useEffect, type ReactNode } from "react";
import { trackConversion } from "@/lib/analytics";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

// NewsletterCta is omitted. The Weekly Research Brief signup components do not accept a source prop.

const THURSDAY_COUNT_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

const linkClass =
  "inline-flex min-h-11 items-center rounded-[8px] px-2 text-base font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

const applyClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[#e4b63d] px-5 text-base font-semibold text-[#171f1d] hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] sm:w-auto";

/**
 * Adds SEO UTMs. A hash such as #apply stays after the query string.
 */
export function withUtm(href: string, campaign: string): string {
  const hashStart = href.indexOf("#");
  const hash = hashStart === -1 ? "" : href.slice(hashStart);
  const withoutHash = hashStart === -1 ? href : href.slice(0, hashStart);
  const absolute = /^https?:\/\//i.test(withoutHash);
  const url = new URL(withoutHash, "https://behaviorschool.com");
  url.searchParams.set("utm_source", "behaviorschool");
  url.searchParams.set("utm_medium", "seo-page");
  url.searchParams.set("utm_campaign", campaign);
  if (absolute) {
    return `${url.origin}${url.pathname}${url.search}${hash}`;
  }
  return `${url.pathname}${url.search}${hash}`;
}

function thursdayCountLabel(count: number): string {
  const word = THURSDAY_COUNT_WORDS[count] ?? String(count);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function cohortFactLine(): string {
  const cohort = TRANSFORMATION_PROGRAM.cohort;
  const thursdays = thursdayCountLabel(cohort.sessionDates.length);
  return `${cohort.dateRange}. ${thursdays} Thursdays, ${cohort.sessionTime}. No session ${cohort.skippedDate}. Applications close ${cohort.applicationsCloseLabel}.`;
}

export function SoftProgramCta({
  campaign,
  children,
  linkLabel,
}: {
  campaign: string;
  children: ReactNode;
  linkLabel: string;
}) {
  return (
    <aside className="my-8 rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] px-5 py-4 text-[#171f1d]">
      <p className="text-base leading-7 text-[#365548]">{children}</p>
      <a
        href={withUtm("/transformation-program", campaign)}
        data-cta="program-soft"
        data-cta-page={campaign}
        className={`mt-1 ${linkClass}`}
      >
        {linkLabel}
      </a>
    </aside>
  );
}

export function ProgramCtaBlock({
  campaign,
  heading,
  line,
}: {
  campaign: string;
  heading: string;
  line: string;
}) {
  const headingId = `program-cta-${campaign}`;
  return (
    <section
      aria-labelledby={headingId}
      className="my-12 rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] px-5 py-6 text-[#171f1d] sm:px-8"
    >
      <h2 id={headingId} className="text-2xl font-semibold leading-snug text-[#171f1d]">
        {heading}
      </h2>
      <p className="mt-3 text-base leading-7 text-[#365548]">{line}</p>
      <p className="mt-3 text-base leading-7 text-[#171f1d]">{cohortFactLine()}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={withUtm("/transformation-program#apply", campaign)}
          data-cta="program-apply"
          data-cta-page={campaign}
          className={applyClass}
        >
          Apply
        </a>
        <a
          href={withUtm(TRANSFORMATION_PROGRAM.calendlyUrl, campaign)}
          data-cta="program-fit-call"
          data-cta-page={campaign}
          className={linkClass}
          rel="noopener noreferrer"
        >
          Book a fit call
        </a>
      </div>
    </section>
  );
}

/**
 * Mount once per page. Listens for any anchor with data-cta, including raw HTML in markdown.
 */
export function CtaClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[data-cta]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const ctaId = anchor.getAttribute("data-cta");
      if (!ctaId) return;
      const page = anchor.getAttribute("data-cta-page") ?? "";
      const href = anchor.getAttribute("href") ?? anchor.href;
      trackConversion({
        event_name: "cta_click",
        event_category: "engagement",
        event_label: ctaId,
        custom_parameters: {
          cta_id: ctaId,
          page,
          href,
        },
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
