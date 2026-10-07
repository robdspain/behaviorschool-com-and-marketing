"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileCheck, Mail, RefreshCw } from "lucide-react";

type W9Status = "pending" | "sent";
type W9AutoSendResult = "sent" | "fallback_no_pdf" | "error";
type StatusFilter = "all" | W9Status;

type W9RequestRow = {
  id: string;
  name: string;
  email: string;
  organization: string;
  createdAt: number;
  status: W9Status;
  sentAt: number | null;
  sentBy: "auto" | "manual" | null;
  sourcePage: string;
  autoSendResult: W9AutoSendResult;
};

const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
];

const autoSendLabels: Record<W9AutoSendResult, string> = {
  sent: "Sent",
  fallback_no_pdf: "PDF not on file",
  error: "Send error",
};

const sentByLabels: Record<"auto" | "manual", string> = {
  auto: "Automatic",
  manual: "Manual",
};

function formatWhen(value: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function replyHref(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent("Behavior School LLC W-9")}`;
}

function statusClass(status: W9Status): string {
  return status === "sent"
    ? "bg-emerald-100 text-emerald-800"
    : "bg-amber-100 text-amber-900";
}

export default function AdminW9RequestsPage() {
  const [requests, setRequests] = useState<W9RequestRow[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState("");

  async function loadRequests(nextFilter: StatusFilter) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (nextFilter !== "all") params.set("status", nextFilter);
      const response = await fetch(`/api/admin/w9-requests?${params.toString()}`, { credentials: "include" });
      const payload = (await response.json().catch(() => ({}))) as { requests?: W9RequestRow[]; error?: string };
      if (!response.ok) {
        setRequests([]);
        setError(payload.error || "Could not load W-9 requests.");
        return;
      }
      const rows = payload.requests || [];
      const hashId = window.location.hash.replace(/^#/, "");
      if (hashId && !rows.some((row) => row.id === hashId)) {
        const focused = await fetch(`/api/admin/w9-requests?id=${encodeURIComponent(hashId)}`, { credentials: "include" });
        if (focused.ok) {
          const focusedPayload = (await focused.json()) as { request?: W9RequestRow };
          if (focusedPayload.request && (nextFilter === "all" || focusedPayload.request.status === nextFilter)) {
            rows.unshift(focusedPayload.request);
          }
        }
      }
      setRequests(rows);
    } catch {
      setRequests([]);
      setError("Could not load W-9 requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "W-9 Requests | Behavior School Admin";
    const syncHash = () => setHighlightedId(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    void loadRequests(filter);
  }, [filter]);

  useEffect(() => {
    if (!highlightedId) return;
    const card = document.getElementById(highlightedId);
    const tableRow = document.getElementById(`row-${highlightedId}`);
    const visible = [card, tableRow].find((node) => node && node.getClientRects().length > 0);
    visible?.scrollIntoView({ block: "center" });
  }, [highlightedId, requests]);

  async function markSent(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setSavingId(id);
    setError("");
    try {
      const response = await fetch("/api/admin/w9-requests", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json().catch(() => ({}))) as { request?: W9RequestRow; error?: string };
      if (!response.ok || !payload.request) {
        setError(payload.error || "Could not mark this request sent.");
        return;
      }
      const updated = payload.request;
      setRequests((current) =>
        current
          .map((row) => (row.id === id ? updated : row))
          .filter((row) => filter === "all" || row.status === filter),
      );
      window.dispatchEvent(new CustomEvent("w9-requests-changed"));
    } catch {
      setError("Could not mark this request sent.");
    } finally {
      setSavingId(null);
    }
  }

  const pendingVisible = requests.filter((row) => row.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b-2 border-slate-200 bg-white">
        <div className="py-6 pl-24 pr-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                <FileCheck className="h-7 w-7 shrink-0 text-emerald-700 sm:h-8 sm:w-8" aria-hidden="true" />
                W-9 Requests
              </h1>
              <p className="mt-1 max-w-2xl text-base text-slate-600">
                Newest first. Requests from the Transformation Program page. Pending means the W-9 still needs to be emailed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadRequests(filter)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Status filter">
            {filters.map((item) => {
              const selected = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold ${
                    selected ? "bg-emerald-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-slate-600">
            {loading ? "Loading" : `${requests.length} shown, ${pendingVisible} pending in this view`}
          </p>
        </div>

        {error ? (
          <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {error}
          </p>
        ) : null}

        {loading ? <p className="text-base text-slate-600">Loading W-9 requests.</p> : null}

        {!loading && !error && requests.length === 0 ? (
          <p className="rounded-xl border-2 border-slate-200 bg-white px-4 py-8 text-base text-slate-700">
            {filter === "all" ? "No W-9 requests yet." : "No requests match this filter."}
          </p>
        ) : null}

        <div className="space-y-3 md:hidden">
          {requests.map((row) => (
            <RequestCard
              key={row.id}
              row={row}
              highlighted={highlightedId === row.id}
              saving={savingId === row.id}
              onMarkSent={markSent}
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border-2 border-slate-200 bg-white md:block">
          <table className="min-w-full text-left text-sm text-slate-800">
            <caption className="sr-only">W-9 requests, newest first</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Requested</th>
                <th scope="col" className="px-4 py-3">Requester</th>
                <th scope="col" className="px-4 py-3">Organization</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Auto-send</th>
                <th scope="col" className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr
                  key={row.id}
                  id={`row-${row.id}`}
                  className={`border-t border-slate-100 ${highlightedId === row.id ? "bg-emerald-50" : ""}`}
                >
                  <td className="px-4 py-4 align-top whitespace-nowrap">{formatWhen(row.createdAt)}</td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold text-slate-900">{row.name}</div>
                    <a className="mt-1 inline-flex min-h-11 items-center text-emerald-800 underline" href={replyHref(row.email)}>
                      {row.email}
                    </a>
                    <div className="mt-1 break-all font-mono text-xs text-slate-500">{row.id}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div>{row.organization}</div>
                    <div className="mt-1 text-xs text-slate-500">{row.sourcePage}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <StatusLine row={row} />
                  </td>
                  <td className="px-4 py-4 align-top">{autoSendLabels[row.autoSendResult]}</td>
                  <td className="px-4 py-4 align-top">
                    <RequestActions row={row} saving={savingId === row.id} onMarkSent={markSent} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusLine({ row }: { row: W9RequestRow }) {
  return (
    <div>
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${statusClass(row.status)}`}>
        {row.status === "sent" ? "Sent" : "Pending"}
      </span>
      <div className="mt-2 text-xs text-slate-600">
        {row.sentAt && row.sentBy ? `${sentByLabels[row.sentBy]} ${formatWhen(row.sentAt)}` : "Not sent"}
      </div>
    </div>
  );
}

function RequestActions({
  row,
  saving,
  onMarkSent,
}: {
  row: W9RequestRow;
  saving: boolean;
  onMarkSent: (event: FormEvent<HTMLFormElement>, id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row">
      <a
        href={replyHref(row.email)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        Reply
      </a>
      {row.status === "pending" ? (
        <form onSubmit={(event) => void onMarkSent(event, row.id)}>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-70"
          >
            {saving ? "Saving" : "Mark sent"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function RequestCard({
  row,
  highlighted,
  saving,
  onMarkSent,
}: {
  row: W9RequestRow;
  highlighted: boolean;
  saving: boolean;
  onMarkSent: (event: FormEvent<HTMLFormElement>, id: string) => void;
}) {
  return (
    <article
      id={row.id}
      className={`scroll-mt-24 rounded-xl border-2 bg-white p-4 ${highlighted ? "border-emerald-500" : "border-slate-200"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{row.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{formatWhen(row.createdAt)}</p>
        </div>
        <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-bold ${statusClass(row.status)}`}>
          {row.status === "sent" ? "Sent" : "Pending"}
        </span>
      </div>
      <dl className="mt-3 space-y-2 text-sm text-slate-800">
        <div>
          <dt className="font-semibold text-slate-500">Work email</dt>
          <dd>
            <a className="inline-flex min-h-11 items-center break-all text-emerald-800 underline" href={replyHref(row.email)}>
              {row.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Organization</dt>
          <dd>{row.organization}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Auto-send</dt>
          <dd>{autoSendLabels[row.autoSendResult]}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Sent</dt>
          <dd>{row.sentAt && row.sentBy ? `${sentByLabels[row.sentBy]} ${formatWhen(row.sentAt)}` : "Not sent"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Source</dt>
          <dd>{row.sourcePage}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Request ID</dt>
          <dd className="break-all font-mono text-xs">{row.id}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <RequestActions row={row} saving={saving} onMarkSent={onMarkSent} />
      </div>
    </article>
  );
}
