"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Download, Mail, RefreshCw, Search } from "lucide-react";

type SurveyResponse = {
  id: string;
  role: string;
  school_setting: string;
  state: string | null;
  years_in_schools: string;
  caseload_range: string;
  schools_served_range: string;
  weekly_hours_range: string;
  workload_rating: string;
  burnout_frequency: string;
  challenge_areas: string[];
  supports_needed: string;
  additional_notes: string | null;
  referral_source: string | null;
  wants_results: boolean;
  consent_to_contact: boolean;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  created_at: string;
};

const labels: Record<string, string> = {
  bcba: "BCBA",
  bcaba: "BCaBA",
  bcba_d: "BCBA-D",
  student_analyst: "Student analyst",
  public_district: "Public district",
  charter_school: "Charter school",
  nonpublic_school: "Nonpublic school",
  private_school: "Private school",
  clinic_school: "Clinic or agency",
  multiple_settings: "Multiple settings",
  "0_1": "0-1 years",
  "2_4": "2-4 years",
  "5_9": "5-9 years",
  "10_plus": "10+ years",
  "0_10": "0-10",
  "11_20": "11-20",
  "21_30": "21-30",
  "31_40": "31-40",
  "41_plus": "41+",
  "4_plus": "4+",
  under_40: "Under 40",
  "40_45": "40-45",
  "46_50": "46-50",
  "51_60": "51-60",
  over_60: "Over 60",
  much_too_high: "Much too high",
  somewhat_too_high: "Somewhat too high",
  about_right: "About right",
  somewhat_too_low: "Somewhat too low",
  much_too_low: "Much too low",
  rarely: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
  daily_or_nearly_daily: "Daily or nearly daily",
  caseload_size: "Caseload size",
  documentation: "Documentation",
  meetings: "Meetings",
  travel_scheduling: "Travel/scheduling",
  crisis_response: "Crisis response",
  staff_buy_in: "Staff buy-in",
  materials_resources: "Materials/resources",
  administrative_tasks: "Administrative tasks",
  role_clarity: "Role clarity",
  not_applicable: "Not applicable",
  other: "Other",
};

function label(value: string | null | undefined) {
  if (!value) return "";
  return labels[value] ?? value;
}

function downloadCsv(rows: SurveyResponse[]) {
  const headers = [
    "submitted_at",
    "role",
    "school_setting",
    "state",
    "years_in_schools",
    "caseload_range",
    "schools_served_range",
    "weekly_hours_range",
    "workload_rating",
    "burnout_frequency",
    "challenge_areas",
    "supports_needed",
    "additional_notes",
    "referral_source",
    "wants_results",
    "consent_to_contact",
    "first_name",
    "last_name",
    "email",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof SurveyResponse];
          const text = Array.isArray(value) ? value.map(label).join("; ") : String(value ?? "");
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "school-bcba-burnout-workload-survey.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminSchoolBcbaSurveyPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/school-bcba-survey", { credentials: "include" });
      if (!response.ok) {
        setResponses([]);
        return;
      }
      const data = await response.json();
      setResponses(data.responses || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "School BCBA Survey | Behavior School Admin";
    fetchResponses();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return responses;
    return responses.filter((response) =>
      [
        response.email,
        response.first_name,
        response.last_name,
        response.state,
        response.referral_source,
        response.supports_needed,
        response.additional_notes,
        label(response.role),
        label(response.school_setting),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [responses, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b-2 border-slate-200 bg-white">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                <ClipboardList className="h-8 w-8 text-emerald-700" aria-hidden="true" />
                School BCBA Survey
              </h1>
              <p className="mt-1 text-base text-slate-600">
                {responses.length} submitted response{responses.length === 1 ? "" : "s"} from the public survey page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchResponses}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => downloadCsv(filtered)}
                disabled={!filtered.length}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search responses..."
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-600">Loading survey responses...</div>
        ) : filtered.length ? (
          <div className="space-y-4">
            {filtered.map((response) => (
              <article key={response.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {[label(response.role), label(response.school_setting), response.state, `${label(response.weekly_hours_range)} hrs/week`]
                        .filter(Boolean)
                        .map((item) => (
                          <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {item}
                          </span>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      Submitted {new Date(response.created_at).toLocaleString()}
                    </p>
                  </div>
                  {response.email ? (
                    <a className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900" href={`mailto:${response.email}`}>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {response.email}
                    </a>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 text-sm md:grid-cols-3">
                  <div>
                    <p className="font-semibold text-slate-900">Workload</p>
                    <p className="mt-1 text-slate-700">{label(response.workload_rating)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Burnout frequency</p>
                    <p className="mt-1 text-slate-700">{label(response.burnout_frequency)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Caseload / sites</p>
                    <p className="mt-1 text-slate-700">
                      {label(response.caseload_range)} students, {label(response.schools_served_range)} sites
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="font-semibold text-slate-900">Top challenges</p>
                  <p className="mt-1 text-sm text-slate-700">{response.challenge_areas.map(label).join(", ")}</p>
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Support needed</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{response.supports_needed}</p>
                </div>
                {response.additional_notes ? (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Additional notes</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{response.additional_notes}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">No survey responses yet.</p>
            <p className="mt-2 text-sm text-slate-600">Responses will appear here after visitors submit the public survey.</p>
          </div>
        )}
      </div>
    </div>
  );
}
