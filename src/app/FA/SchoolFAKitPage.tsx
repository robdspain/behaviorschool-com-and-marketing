"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, Download, Shield } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL,
  SCHOOL_FA_KIT_FORMATS,
  SCHOOL_FA_KIT_PDF_FILENAME,
  SCHOOL_FA_KIT_PDF_PATH,
} from "@/lib/school-fa-kit";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

const ROLES = [
  "BCBA",
  "BCBA-D",
  "BCaBA",
  "RBT",
  "Teacher",
  "School administrator",
  "Graduate student",
  "Other",
] as const;

function startPdfDownload() {
  const link = document.createElement("a");
  link.href = SCHOOL_FA_KIT_PDF_PATH;
  link.download = SCHOOL_FA_KIT_PDF_FILENAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function SchoolFAKitPage() {
  const { trackDownload, trackEmailSignup, trackFormSubmission } = useAnalytics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [faxNumber, setFaxNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSuccess) {
      successHeadingRef.current?.focus();
    }
  }, [isSuccess]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/fba-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          faxNumber,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.download !== true) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Unable to save your email. Please try again.",
        );
      }

      trackFormSubmission("school-fa-starter-kit", true);
      trackEmailSignup("download", email.trim(), { resource: "school-fa-starter-kit" });
      trackDownload(SCHOOL_FA_KIT_PDF_FILENAME, email.trim());
      setIsSuccess(true);
      startPdfDownload();
    } catch (submitError) {
      trackFormSubmission("school-fa-starter-kit", false);
      setError(submitError instanceof Error ? submitError.message : "Unable to save your email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bs-cream)] text-[var(--bs-ink)]">
      <section className="px-4 py-6 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="bs-eyebrow text-[var(--bs-forest)]">Friday, October 9 handout</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            School FA Starter Kit
          </h1>
          <p className="mt-2 text-base leading-relaxed text-[var(--bs-secondary)] sm:hidden">
            The handout for the October 9 session.
          </p>
          <p className="mt-4 hidden text-lg leading-relaxed text-[var(--bs-secondary)] sm:block">
            The handout for the CalABA - Behavior Analysts in Education SIG (BAE) presentation, Functional Behavior
            Assessment in a School Setting. Five formats, with the task analyses,
            printable datasheets, and graph pages from the session.
          </p>

          <div className="mt-4 rounded-xl border border-[var(--bs-hairline)] bg-[var(--bs-paper)] p-4 sm:mt-8 sm:p-8">
            {isSuccess ? (
              <div>
                <h2 ref={successHeadingRef} tabIndex={-1} className="text-2xl font-bold">
                  Your kit is ready
                </h2>
                <p className="mt-2 text-base leading-relaxed text-[var(--bs-secondary)] sm:hidden">
                  The PDF is downloading. Copy the graphing template too.
                </p>
                <p className="mt-2 hidden text-base leading-relaxed text-[var(--bs-secondary)] sm:block">
                  The PDF should start downloading. It includes the task analyses,
                  datasheets, and a blank graph page for each format. The graphing
                  template is a separate Google Sheet. Sign in to Google and make a
                  copy for each student.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row">
                  <a
                    href={SCHOOL_FA_KIT_PDF_PATH}
                    download={SCHOOL_FA_KIT_PDF_FILENAME}
                    className="bs-btn-primary w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-5 w-5" aria-hidden="true" />
                    Download the PDF
                  </a>
                  <a
                    href={SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bs-btn-secondary w-full sm:w-auto"
                  >
                    <BarChart3 className="mr-2 h-5 w-5" aria-hidden="true" />
                    Copy the graphing template
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate={false}>
                <div>
                  <h2 className="text-2xl font-bold">Get the kit</h2>
                  <p className="mt-2 text-base leading-relaxed text-[var(--bs-secondary)] sm:hidden">
                    Name and email. The PDF opens here.
                  </p>
                  <p className="mt-2 hidden text-base leading-relaxed text-[var(--bs-secondary)] sm:block">
                    Enter your name and email. The download opens on this page.
                  </p>
                </div>

                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="fax-number">Fax</label>
                  <input
                    id="fax-number"
                    name="faxNumber"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={faxNumber}
                    onChange={(event) => setFaxNumber(event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label htmlFor="first-name" className="mb-1 block text-sm font-semibold">
                      First name
                    </label>
                    <input
                      id="first-name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      required
                      minLength={2}
                      maxLength={120}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full min-w-0 rounded-lg border border-[var(--bs-control-border)] bg-white px-4 text-base text-[var(--bs-ink)]"
                      style={{ minHeight: "var(--bs-control-min-h)" }}
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="role" className="mb-1 block text-sm font-semibold">
                      Role <span className="font-normal text-[var(--bs-secondary)]">(optional)</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      className="w-full min-w-0 rounded-lg border border-[var(--bs-control-border)] bg-white px-4 text-base text-[var(--bs-ink)]"
                      style={{ minHeight: "var(--bs-control-min-h)" }}
                    >
                      <option value="">Select a role</option>
                      {ROLES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={200}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@school.edu"
                    className="w-full min-w-0 rounded-lg border border-[var(--bs-control-border)] bg-white px-4 text-base text-[var(--bs-ink)]"
                    style={{ minHeight: "var(--bs-control-min-h)" }}
                  />
                </div>

                {error ? (
                  <p role="alert" className="text-sm font-semibold text-red-800">
                    {error}
                  </p>
                ) : null}

                <button type="submit" disabled={isSubmitting} className="bs-btn-primary w-full">
                  <Download className="mr-2 h-5 w-5" aria-hidden="true" />
                  {isSubmitting ? "Saving..." : "Get the free kit"}
                </button>
                <p className="text-sm leading-relaxed text-[var(--bs-secondary)]">
                  Rob will send a short series about the School BCBA Systems
                  Transformation Program. Reply to any note if you want that to stop.
                </p>
              </form>
            )}
          </div>

          <p className="mt-6 text-base leading-relaxed text-[var(--bs-secondary)] sm:hidden">
            The handout for the CalABA - Behavior Analysts in Education SIG (BAE) presentation, Functional Behavior
            Assessment in a School Setting. Five formats, with the task analyses,
            printable datasheets, and graph pages from the session.
          </p>

          <div className="mt-10">
            <h2 className="text-2xl font-bold">What&apos;s inside</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {SCHOOL_FA_KIT_FORMATS.map((format) => (
                <li
                  key={format.title}
                  className="rounded-xl border border-[var(--bs-hairline)] bg-[var(--bs-paper)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bs-forest)]" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">{format.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--bs-secondary)]">{format.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-base leading-relaxed text-[var(--bs-secondary)]">
              Each format has a task analysis, a printable datasheet, and a blank graph
              page in the PDF. The Google Sheet plots Standard, Trial-Based,
              Latency-Based, PFA, and Precursor data.
            </p>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[var(--bs-hairline)] bg-[var(--bs-oak-wash)] p-4 sm:p-5">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bs-forest)]" aria-hidden="true" />
            <p className="text-sm leading-relaxed sm:text-base">
              A qualified behavior analyst should design and supervise the analysis.
              Get team agreement and guardian consent, and write stop criteria before
              any session. This kit is a starting point. It does not replace supervision,
              training, or clinical judgment.
            </p>
          </div>

          <div className="bs-on-dark mt-8 rounded-xl bg-[var(--bs-forest)] p-5 text-[var(--bs-paper)] sm:p-8">
            <h2 className="text-2xl font-bold">Where this goes next</h2>
            <p className="mt-3 text-base leading-relaxed">
              If you want this work built into a system across a caseload, that is what
              the {TRANSFORMATION_PROGRAM.name} is for. {TRANSFORMATION_PROGRAM.cohort.summaryHeadline}.{" "}
              {TRANSFORMATION_PROGRAM.cohort.summaryDetail}.
            </p>
            <Link
              href="/transformation-program"
              className="bs-btn-primary mt-6 w-full sm:w-auto"
            >
              See the Transformation Program
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
