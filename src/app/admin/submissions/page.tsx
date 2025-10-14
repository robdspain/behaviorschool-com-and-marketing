"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Briefcase, Calendar, Search, Archive, ArchiveRestore, Send, Clock } from "lucide-react";

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  current_challenges: string | null;
  status: string;
  submitted_at: string;
  archived: boolean;
  archived_at: string | null;
  archived_by: string | null;
}

interface EmailLog {
  id: string;
  template_name: string;
  subject: string;
  status: string;
  sent_at: string;
  error_message: string | null;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [sendingPaymentLinkId, setSendingPaymentLinkId] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<Record<string, EmailLog[]>>({});
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = 'Form Submissions | Behavior School Admin'

    fetchSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/submissions?show_archived=${showArchived}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        console.error('Failed to load submissions', await res.text());
        setSubmissions([]);
        return;
      }
      const json = await res.json();
      const submissionList = json.submissions || [];
      setSubmissions(submissionList);

      // Fetch email logs for all submissions
      const logsMap: Record<string, EmailLog[]> = {};
      await Promise.all(
        submissionList.map(async (sub: Submission) => {
          try {
            const logsRes = await fetch(`/api/admin/email-logs?email=${encodeURIComponent(sub.email)}`, {
              credentials: 'include'
            });
            if (logsRes.ok) {
              const logsData = await logsRes.json();
              logsMap[sub.email] = logsData.logs || [];
            }
          } catch (err) {
            console.error(`Error fetching logs for ${sub.email}:`, err);
          }
        })
      );
      setEmailLogs(logsMap);
    } catch (err) {
      console.error('Exception fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (id: string, currentlyArchived: boolean) => {
    if (!confirm(currentlyArchived ? 'Restore this submission from archive?' : 'Archive this submission?')) {
      return;
    }

    setArchivingId(id);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, archived: !currentlyArchived }),
      });

      if (!res.ok) {
        throw new Error('Failed to update submission');
      }

      // Refresh submissions list
      await fetchSubmissions();
    } catch (err) {
      console.error('Error archiving submission:', err);
      alert('Failed to update submission. Please try again.');
    } finally {
      setArchivingId(null);
    }
  };

  const sendPaymentLink = async (submission: Submission) => {
    if (!confirm(`Send payment link to ${submission.first_name} ${submission.last_name} (${submission.email})?`)) {
      return;
    }

    setSendingPaymentLinkId(submission.id);
    try {
      const res = await fetch('/api/admin/send-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: submission.email,
          firstName: submission.first_name,
          lastName: submission.last_name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send payment link');
      }

      alert('Payment link sent successfully!');
      // Refresh email logs for this submission
      await fetchSubmissions();
    } catch (err) {
      console.error('Error sending payment link:', err);
      alert(err instanceof Error ? err.message : 'Failed to send payment link. Please try again.');
    } finally {
      setSendingPaymentLinkId(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch =
      sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'enrolled': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Signup Submissions</h1>
            <p className="text-base text-slate-600 mt-1">
              {submissions.length} total application{submissions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="enrolled">Enrolled</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showArchived
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              {showArchived ? 'Viewing Archived' : 'Show Archived'}
            </button>
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-slate-500">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {submission.first_name} {submission.last_name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </span>
                      {submission.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {submission.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {submission.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(submission.submitted_at)}
                    </span>
                  </div>
                </div>

                {submission.current_challenges && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Current Challenges:</p>
                    <p className="text-sm text-slate-600">{submission.current_challenges}</p>
                  </div>
                )}

                {/* Email History */}
                {emailLogs[submission.email] && emailLogs[submission.email].length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedSubmissionId(expandedSubmissionId === submission.id ? null : submission.id)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Email History ({emailLogs[submission.email].length})
                      <span className="text-xs text-slate-500">
                        {expandedSubmissionId === submission.id ? '▼' : '▶'}
                      </span>
                    </button>

                    {expandedSubmissionId === submission.id && (
                      <div className="mt-3 space-y-2">
                        {emailLogs[submission.email]
                          .filter(log => log.template_name === 'transformation_payment_link')
                          .map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-emerald-900">Payment Link Sent</p>
                                <p className="text-xs text-emerald-700 mt-1">
                                  {formatDateTime(log.sent_at)}
                                </p>
                                {log.error_message && (
                                  <p className="text-xs text-red-600 mt-1">Error: {log.error_message}</p>
                                )}
                              </div>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                log.status === 'sent'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => sendPaymentLink(submission)}
                    disabled={sendingPaymentLinkId === submission.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-2 border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingPaymentLinkId === submission.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Payment Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => toggleArchive(submission.id, submission.archived)}
                    disabled={archivingId === submission.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      submission.archived
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-2 border-orange-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {archivingId === submission.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : submission.archived ? (
                      <>
                        <ArchiveRestore className="w-4 h-4" />
                        <span>Restore from Archive</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
