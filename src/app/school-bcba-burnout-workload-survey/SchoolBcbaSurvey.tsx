"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Linkedin,
  LockKeyhole,
  Mail,
  Share2,
} from "lucide-react";

type ActivityKey =
  | "directStudentSupport"
  | "documentation"
  | "meetingsConsultation"
  | "assessments"
  | "staffTraining"
  | "travelScheduling"
  | "crisisResponse"
  | "other";

type FormState = {
  role: string;
  roleOther: string;
  schoolSetting: string;
  schoolSettingOther: string;
  state: string;
  yearsInSchools: string;
  caseloadRange: string;
  schoolsServedRange: string;
  weeklyHoursRange: string;
  workloadRating: string;
  burnoutFrequency: string;
  activityAllocation: Record<ActivityKey, string>;
  challengeAreas: string[];
  supportsNeeded: string;
  additionalNotes: string;
  referralSource: string;
  wantsResults: boolean;
  consentToContact: boolean;
  firstName: string;
  lastName: string;
  email: string;
};

const initialForm: FormState = {
  role: "",
  roleOther: "",
  schoolSetting: "",
  schoolSettingOther: "",
  state: "",
  yearsInSchools: "",
  caseloadRange: "",
  schoolsServedRange: "",
  weeklyHoursRange: "",
  workloadRating: "",
  burnoutFrequency: "",
  activityAllocation: {
    directStudentSupport: "",
    documentation: "",
    meetingsConsultation: "",
    assessments: "",
    staffTraining: "",
    travelScheduling: "",
    crisisResponse: "",
    other: "",
  },
  challengeAreas: [],
  supportsNeeded: "",
  additionalNotes: "",
  referralSource: "",
  wantsResults: false,
  consentToContact: false,
  firstName: "",
  lastName: "",
  email: "",
};

const shareUrl = "https://behaviorschool.com/school-bcba-burnout-workload-survey";
const shareText =
  "School BCBAs: Behavior School is collecting 2026 burnout and workload survey responses. Add your experience and share it with another school-based behavior analyst.";

const roleOptions = [
  ["bcba", "BCBA"],
  ["bcaba", "BCaBA"],
  ["bcba_d", "BCBA-D"],
  ["student_analyst", "Student analyst or trainee"],
  ["other", "Other"],
];

const settingOptions = [
  ["public_district", "Public school district"],
  ["charter_school", "Charter school"],
  ["nonpublic_school", "Nonpublic school"],
  ["private_school", "Private school"],
  ["clinic_school", "Clinic or agency serving schools"],
  ["multiple_settings", "Multiple school settings"],
  ["other", "Other"],
];

const rangeOptions = {
  years: [
    ["0_1", "0-1 years"],
    ["2_4", "2-4 years"],
    ["5_9", "5-9 years"],
    ["10_plus", "10+ years"],
  ],
  caseload: [
    ["0_10", "0-10 students"],
    ["11_20", "11-20 students"],
    ["21_30", "21-30 students"],
    ["31_40", "31-40 students"],
    ["41_plus", "41+ students"],
    ["not_applicable", "Not applicable"],
  ],
  schoolsServed: [
    ["1", "1 school"],
    ["2", "2 schools"],
    ["3", "3 schools"],
    ["4_plus", "4+ schools"],
    ["not_applicable", "Not applicable"],
  ],
  weeklyHours: [
    ["under_40", "Under 40"],
    ["40_45", "40-45"],
    ["46_50", "46-50"],
    ["51_60", "51-60"],
    ["over_60", "Over 60"],
  ],
  workload: [
    ["much_too_high", "Much too high"],
    ["somewhat_too_high", "Somewhat too high"],
    ["about_right", "About right"],
    ["somewhat_too_low", "Somewhat too low"],
    ["much_too_low", "Much too low"],
  ],
  burnout: [
    ["rarely", "Rarely"],
    ["sometimes", "Sometimes"],
    ["often", "Often"],
    ["daily_or_nearly_daily", "Daily or nearly daily"],
  ],
  allocation: [
    ["0_10", "0-10%"],
    ["11_25", "11-25%"],
    ["26_40", "26-40%"],
    ["41_60", "41-60%"],
    ["61_plus", "61%+"],
    ["not_applicable", "Not applicable"],
  ],
};

const activityRows: Array<[ActivityKey, string]> = [
  ["directStudentSupport", "Direct student support or instruction"],
  ["documentation", "Documentation, paperwork, and data reporting"],
  ["meetingsConsultation", "IEP meetings, staffing, and consultation"],
  ["assessments", "Assessments and report writing"],
  ["staffTraining", "Staff training, coaching, or supervision"],
  ["travelScheduling", "Travel, scheduling, and coordination"],
  ["crisisResponse", "Crisis response or urgent behavior support"],
  ["other", "Other work"],
];

const challengeOptions = [
  ["caseload_size", "Caseload size"],
  ["documentation", "Documentation or paperwork"],
  ["meetings", "Meetings"],
  ["travel_scheduling", "Travel or scheduling"],
  ["crisis_response", "Crisis response"],
  ["staff_buy_in", "Staff buy-in or implementation support"],
  ["materials_resources", "Materials or resources"],
  ["administrative_tasks", "Administrative tasks"],
  ["role_clarity", "Role clarity"],
  ["other", "Other"],
];

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  required = true,
}: {
  id: string;
  label: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-sm font-semibold text-slate-900">{label}</span>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
      >
        <option value="">Select one</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-sm font-semibold text-slate-900">{label}</span>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function ShareButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
    >
      {children}
    </a>
  );
}

export function SchoolBcbaSurvey() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("Copy link");

  const encodedShareUrl = useMemo(() => encodeURIComponent(shareUrl), []);
  const encodedShareText = useMemo(() => encodeURIComponent(shareText), []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateActivity = (key: ActivityKey, value: string) => {
    setForm((previous) => ({
      ...previous,
      activityAllocation: {
        ...previous.activityAllocation,
        [key]: value,
      },
    }));
  };

  const toggleChallenge = (value: string) => {
    setForm((previous) => {
      const selected = previous.challengeAreas.includes(value);
      if (selected) {
        return {
          ...previous,
          challengeAreas: previous.challengeAreas.filter((item) => item !== value),
        };
      }
      if (previous.challengeAreas.length >= 3) {
        return previous;
      }
      return {
        ...previous,
        challengeAreas: [...previous.challengeAreas, value],
      };
    });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy link"), 1800);
  };

  const submitSurvey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.challengeAreas.length) {
      setError("Choose up to three workload challenges before submitting.");
      return;
    }

    if (form.supportsNeeded.trim().length < 10) {
      setError("Add a short note about the support or changes that would help.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/school-bcba-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to save this survey response.");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to save this survey response.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white pt-28 text-slate-950">
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="border-b border-slate-200 pb-12">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-emerald-950 sm:text-5xl">
              Thank you for contributing.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Your response helps document the workload, burnout, and support needs of school-based behavior analysts.
            </p>
          </div>

          <div className="mt-10 grid gap-6 rounded-md border border-slate-200 bg-slate-50 p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Share the survey</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Send it to another school-based BCBA, school behavior analyst, or district team that should be included.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ShareButton href={`https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`}>
                X / Twitter
              </ShareButton>
              <ShareButton href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}>
                Facebook
              </ShareButton>
              <ShareButton href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </ShareButton>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                <Clipboard className="h-4 w-4" aria-hidden="true" />
                {copyState}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-950 to-emerald-900 pt-28 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              2026 School BCBA Burnout & Workload Survey
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50 sm:text-xl">
              Help document the real workload of school-based behavior analysts.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-100">
              The goal is to make this the largest school BCBA workload survey possible by gathering real responses from the field.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#survey"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-bold text-emerald-950 shadow-sm transition hover:bg-emerald-50"
              >
                Contribute your experience
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-200 px-6 py-3 text-base font-bold text-white transition hover:bg-emerald-800"
              >
                <Share2 className="h-5 w-5" aria-hidden="true" />
                Share the survey
              </button>
            </div>
            <p className="mt-7 max-w-2xl text-sm leading-6 text-emerald-100">
              No testimonials, no fake outcomes, no invented numbers. The survey only uses responses submitted by visitors.
            </p>
          </div>

          <div className="rounded-md border border-white/15 bg-white p-6 text-slate-950 shadow-2xl">
            <p className="text-sm font-semibold text-slate-600">Survey preview</p>
            <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
              <div>
                <p className="text-sm font-bold">1. What best describes your current role?</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {["BCBA", "BCaBA", "BCBA-D", "Other"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-slate-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">2. What school setting do you primarily work in?</p>
                <div className="mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500">Select one</div>
              </div>
              <div>
                <p className="text-sm font-bold">3. How many total students are on your caseload?</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                  {["0-10", "11-20", "21-30", "31+"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-slate-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-800">
            <LockKeyhole className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">Privacy and use</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              The workload survey can be submitted without name or email. Contact fields are optional and are only used if you ask to receive results or follow-up.
            </p>
          </div>
        </div>
      </section>

      <section id="survey" className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-9">
          <h2 className="text-3xl font-bold text-slate-950">Contribute your experience</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            Your responses are used in aggregate to understand workload, burnout, and support needs among school-based behavior analysts.
          </p>
        </div>

        <form onSubmit={submitSurvey} className="space-y-10">
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField id="role" label="What best describes your current role?" value={form.role} options={roleOptions} onChange={(value) => update("role", value)} />
            <SelectField id="setting" label="What type of school setting do you primarily work in?" value={form.schoolSetting} options={settingOptions} onChange={(value) => update("schoolSetting", value)} />
            {form.role === "other" ? (
              <TextInput id="roleOther" label="Role: other" value={form.roleOther} onChange={(value) => update("roleOther", value)} required />
            ) : null}
            {form.schoolSetting === "other" ? (
              <TextInput id="settingOther" label="Setting: other" value={form.schoolSettingOther} onChange={(value) => update("schoolSettingOther", value)} required />
            ) : null}
            <TextInput id="state" label="State or region" value={form.state} onChange={(value) => update("state", value)} placeholder="Optional" />
            <SelectField id="years" label="How many years have you worked in schools?" value={form.yearsInSchools} options={rangeOptions.years} onChange={(value) => update("yearsInSchools", value)} />
            <SelectField id="caseload" label="How many students are on your caseload?" value={form.caseloadRange} options={rangeOptions.caseload} onChange={(value) => update("caseloadRange", value)} />
            <SelectField id="schoolsServed" label="How many school sites do you support?" value={form.schoolsServedRange} options={rangeOptions.schoolsServed} onChange={(value) => update("schoolsServedRange", value)} />
            <SelectField id="weeklyHours" label="About how many hours do you work in a typical week?" value={form.weeklyHoursRange} options={rangeOptions.weeklyHours} onChange={(value) => update("weeklyHoursRange", value)} />
            <SelectField id="workloadRating" label="How would you rate your current workload?" value={form.workloadRating} options={rangeOptions.workload} onChange={(value) => update("workloadRating", value)} />
            <SelectField id="burnoutFrequency" label="How often do you feel burned out by school-based work?" value={form.burnoutFrequency} options={rangeOptions.burnout} onChange={(value) => update("burnoutFrequency", value)} />
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-slate-950">Time allocation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Estimate the percentage of your work time spent in each activity. Rough estimates are fine.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activityRows.map(([key, label]) => (
                <SelectField
                  key={key}
                  id={key}
                  label={label}
                  value={form.activityAllocation[key]}
                  options={rangeOptions.allocation}
                  onChange={(value) => updateActivity(key, value)}
                  required={false}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-slate-950">Workload pressure points</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">Select up to three areas that are most challenging right now.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {challengeOptions.map(([value, label]) => {
                const checked = form.challengeAreas.includes(value);
                const disabled = !checked && form.challengeAreas.length >= 3;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium transition ${
                      checked
                        ? "border-emerald-700 bg-emerald-50 text-emerald-950"
                        : "border-slate-200 bg-white text-slate-800"
                    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-emerald-300"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleChallenge(value)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <label className="block" htmlFor="supportsNeeded">
              <span className="block text-xl font-bold text-slate-950">
                What support or changes would most improve your ability to do high-quality work in schools?
              </span>
              <textarea
                id="supportsNeeded"
                required
                minLength={10}
                value={form.supportsNeeded}
                onChange={(event) => update("supportsNeeded", event.target.value)}
                className="mt-4 min-h-32 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Write a few sentences or bullet points."
              />
            </label>
            <label className="mt-5 block" htmlFor="additionalNotes">
              <span className="block text-sm font-semibold text-slate-900">Anything else you want included in the 2026 workload picture?</span>
              <textarea
                id="additionalNotes"
                value={form.additionalNotes}
                onChange={(event) => update("additionalNotes", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="grid gap-6 rounded-md border border-slate-200 bg-slate-50 p-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Optional contact</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Leave this blank to submit the survey without contact information.
              </p>
              <div className="mt-5 space-y-3">
                <label className="flex items-start gap-3 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.wantsResults}
                    onChange={(event) => update("wantsResults", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  Send me the survey results when they are available.
                </label>
                <label className="flex items-start gap-3 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.consentToContact}
                    onChange={(event) => update("consentToContact", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  You may contact me about my response.
                </label>
              </div>
            </div>
            <div className="grid gap-4">
              <TextInput id="firstName" label="First name" value={form.firstName} onChange={(value) => update("firstName", value)} required={form.consentToContact} />
              <TextInput id="lastName" label="Last name" value={form.lastName} onChange={(value) => update("lastName", value)} />
              <TextInput id="email" label="Email" value={form.email} onChange={(value) => update("email", value)} type="email" required={form.wantsResults || form.consentToContact} />
              <TextInput id="referralSource" label="Where did you find this survey?" value={form.referralSource} onChange={(value) => update("referralSource", value)} placeholder="Optional: LinkedIn, Facebook, email, colleague..." />
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit survey"}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="inline-flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact fields are optional unless you request results or follow-up.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
