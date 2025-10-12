"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, Search } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

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
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/submissions', { credentials: 'include' });
      if (!res.ok) {
        console.error('Failed to load submissions', await res.text());
        setSubmissions([]);
        return;
      }
      const json = await res.json();
      setSubmissions(json.submissions || []);
    } catch (err) {
      console.error('Exception fetching submissions:', err);
    } finally {
      setLoading(false);
    }
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
