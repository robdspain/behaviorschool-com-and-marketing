"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  MailCheck,
  PhoneCall,
  Plus,
} from "lucide-react";

type DiscoveryCall = {
  id: string;
  contact_name: string;
  email: string;
  role: string;
  school_setting_notes: string;
  call_date_time: string;
  fit_assessment: string;
  program_discussed: string;
  payment_option_discussed: string;
  next_step: string;
  checkout_link: string | null;
  follow_up_status: "pending" | "sent" | "not_required";
  task_status: string | null;
  deal_value: number | null;
  deal_stage: string | null;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  schoolSettingNotes: string;
  callDateTime: string;
  fitAssessment: string;
  programDiscussed: string;
  paymentOptionDiscussed: string;
  nextStep: string;
  checkoutLink: string;
};

const checkoutLink = "https://behaviorschool.com/transformation-program/checkout";

function localDateTimeValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

const emptyForm = (): FormState => ({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  schoolSettingNotes: "",
  callDateTime: localDateTimeValue(),
  fitAssessment: "strong_fit",
  programDiscussed: "Transformation Program",
  paymentOptionDiscussed: "both",
  nextStep: "Send checkout follow-up",
  checkoutLink,
});

function label(value: string) {
  return value.replaceAll("_", " ");
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DiscoveryCallsPage() {
  const [calls, setCalls] = useState<DiscoveryCall[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      today: calls.filter((call) => call.call_date_time.slice(0, 10) === today).length,
      pending: calls.filter((call) => call.follow_up_status === "pending").length,
      sent: calls.filter((call) => call.follow_up_status === "sent").length,
      overdue: calls.filter((call) => call.follow_up_status === "pending" && call.call_date_time.slice(0, 10) < today).length,
    };
  }, [calls]);

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    try {
      const response = await fetch("/api/admin/crm/discovery-calls");
      if (!response.ok) throw new Error("Failed to load discovery calls");
      setCalls(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discovery calls");
    } finally {
      setLoading(false);
    }
  }

  async function submitCall(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/crm/discovery-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          callDateTime: new Date(form.callDateTime).toISOString(),
        }),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "Failed to log discovery call");
      }
      setForm(emptyForm());
      await fetchCalls();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log discovery call");
    } finally {
      setSaving(false);
    }
  }

  async function markFollowUpSent(call: DiscoveryCall) {
    setError(null);
    const response = await fetch(`/api/admin/crm/discovery-calls/${call.id}/follow-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: call.email,
        subject: "Transformation Program payment options",
        checkoutLink: call.checkout_link || checkoutLink,
        firstName: call.contact_name.split(" ")[0] || "",
        sentAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.message || "Failed to send follow-up");
      return;
    }

    await fetchCalls();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
          <p className="text-slate-600">Loading discovery calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <Link href="/admin/crm" className="hover:text-slate-900">CRM</Link>
          <ArrowRight className="h-4 w-4" />
          <span>Discovery Calls</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Discovery Calls</h1>
            <p className="mt-1 text-slate-600">Log each call and track checkout follow-up status.</p>
          </div>
          <Link
            href="/admin/crm/tasks"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            <Clock className="h-4 w-4" />
            View Follow-ups
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Today</span>
            <PhoneCall className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.today}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Follow-up Not Sent</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.pending}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Follow-up Sent</span>
            <MailCheck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.sent}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Overdue</span>
            <CalendarClock className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{metrics.overdue}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submitCall} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Log Discovery Call</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-slate-700">
                First name
                <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Last name
                <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Role
              <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Call date and time
              <input required type="datetime-local" value={form.callDateTime} onChange={(e) => setForm({ ...form, callDateTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              School setting notes
              <textarea required rows={3} value={form.schoolSettingNotes} onChange={(e) => setForm({ ...form, schoolSettingNotes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Fit assessment
                <select value={form.fitAssessment} onChange={(e) => setForm({ ...form, fitAssessment: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500">
                  <option value="perfect_fit">Perfect fit</option>
                  <option value="strong_fit">Strong fit</option>
                  <option value="needs_follow_up">Needs follow-up</option>
                  <option value="not_fit">Not fit</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Payment option
                <select value={form.paymentOptionDiscussed} onChange={(e) => setForm({ ...form, paymentOptionDiscussed: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500">
                  <option value="both">Both options</option>
                  <option value="pay_in_full">Pay in full</option>
                  <option value="payment_plan">Three payments</option>
                  <option value="not_discussed">Not discussed</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Program discussed
              <input required value={form.programDiscussed} onChange={(e) => setForm({ ...form, programDiscussed: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Checkout link
              <input required type="url" value={form.checkoutLink} onChange={(e) => setForm({ ...form, checkoutLink: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Next step
              <input required value={form.nextStep} onChange={(e) => setForm({ ...form, nextStep: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Logging..." : "Log Call and Create Follow-up"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Discovery Calls</h2>
          </div>

          {calls.length === 0 ? (
            <div className="p-12 text-center">
              <PhoneCall className="mx-auto mb-4 h-14 w-14 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">No discovery calls logged</h3>
              <p className="text-slate-600">Use the form to create the first tracked call workflow.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {calls.map((call) => (
                <div key={call.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{call.contact_name}</h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                          {label(call.fit_assessment)}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          call.follow_up_status === "sent"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {call.follow_up_status === "sent" ? "Follow-up sent" : "Follow-up not sent"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{call.email}</p>
                      <p className="mt-2 text-sm text-slate-700">{call.role}</p>
                      <p className="mt-1 text-sm text-slate-600">{call.school_setting_notes}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>{formatDateTime(call.call_date_time)}</span>
                        <span>{call.program_discussed}</span>
                        <span className="capitalize">{label(call.payment_option_discussed)}</span>
                        {call.deal_value && <span>${call.deal_value.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      {call.checkout_link && (
                        <a
                          href={call.checkout_link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Open Checkout
                        </a>
                      )}
                      {call.follow_up_status !== "sent" ? (
                        <button
                          onClick={() => markFollowUpSent(call)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          <MailCheck className="h-4 w-4" />
                          Send Email
                        </button>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Logged
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
