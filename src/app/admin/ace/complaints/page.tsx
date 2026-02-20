'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  ExternalLink,
  Loader2,
  Plus,
} from 'lucide-react';
import type { AceComplaint, AceComplaintStatus } from '@/lib/ace/types';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<AceComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<AceComplaint | null>(null);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/admin/ace/complaints');
      const data = await response.json();
      if (data.data) {
        setComplaints(data.data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AceComplaintStatus) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated_to_bacb': return 'bg-red-100 text-red-800';
    }
  };

  const getDaysUntilDue = (complaint: AceComplaint) => {
    if (!complaint.response_due_date) return null;
    const today = new Date();
    const dueDate = new Date(complaint.response_due_date);
    const days = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return c.is_overdue;
    if (filter === 'pending') return c.status === 'submitted' || c.status === 'under_review';
    if (filter === 'resolved') return c.status === 'resolved' || c.status === 'escalated_to_bacb';
    return true;
  });

  const overdueCount = complaints.filter(c => c.is_overdue).length;
  const pendingCount = complaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Complaint Management</h1>
              <p className="text-slate-600">Review and resolve complaints within 45 days</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Complaints</p>
                <p className="text-3xl font-bold text-slate-900">{complaints.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
          </Card>

          <Card className={`p-6 ${overdueCount > 0 ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800 font-semibold">Overdue (&gt;45 days)</p>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <Card className="p-6 mb-8 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 text-lg mb-2">
                  ⚠️ Overdue Complaints Require Immediate Action
                </h3>
                <p className="text-red-800 mb-3">
                  <strong>{overdueCount} complaint(s)</strong> have exceeded the 45-day response deadline.
                  BACB requires written responses within 45 days of submission.
                </p>
                <p className="text-sm text-red-700">
                  Participants have been notified of their right to file a Notice of Alleged Violation (NAV) with BACB.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'overdue', 'pending', 'resolved'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f && f === 'overdue' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'overdue' && overdueCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">{overdueCount}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No complaints found</h3>
            <p className="text-slate-600">
              {filter === 'all' 
                ? 'No complaints have been submitted yet.' 
                : `No ${filter} complaints.`}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => {
              const daysUntilDue = getDaysUntilDue(complaint);
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
              const isCritical = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 7;

              return (
                <Card
                  key={complaint.id}
                  className={`p-6 ${isOverdue ? 'bg-red-50 border-red-200' : isCritical ? 'bg-amber-50 border-amber-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                        {isOverdue && (
                          <Badge className="bg-red-600 text-white">
                            <XCircle className="w-3 h-3 mr-1" />
                            {Math.abs(daysUntilDue!)} days overdue
                          </Badge>
                        )}
                        {!isOverdue && isCritical && (
                          <Badge className="bg-amber-600 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {daysUntilDue} days remaining
                          </Badge>
                        )}
                        {complaint.nav_escalation_notified && (
                          <Badge variant="outline" className="border-red-300 text-red-700">
                            NAV Notice Sent
                          </Badge>
                        )}
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Complaint from {complaint.submitter_name}
                        </h3>
                        <p className="text-slate-600 line-clamp-2">{complaint.complaint_text}</p>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Submitter</p>
                          <p className="font-medium text-slate-900">{complaint.submitter_email}</p>
                          {complaint.submitter_bacb_id && (
                            <p className="text-slate-500">BACB: {complaint.submitter_bacb_id}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-slate-500">Submitted</p>
                          <p className="font-medium text-slate-900">
                            {new Date(complaint.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Response Due</p>
                          <p className={`font-medium ${isOverdue ? 'text-red-700' : isCritical ? 'text-amber-700' : 'text-slate-900'}`}>
                            {complaint.response_due_date 
                              ? new Date(complaint.response_due_date).toLocaleDateString()
                              : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Resolved</p>
                          <p className="font-medium text-slate-900">
                            {complaint.resolved_at 
                              ? new Date(complaint.resolved_at).toLocaleDateString()
                              : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {complaint.status === 'resolved' ? 'View' : 'Respond'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Response Modal */}
        {selectedComplaint && (
          <ComplaintResponseModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onSuccess={() => {
              setSelectedComplaint(null);
              fetchComplaints();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Complaint Response Modal
function ComplaintResponseModal({
  complaint,
  onClose,
  onSuccess,
}: {
  complaint: AceComplaint;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<AceComplaintStatus>(complaint.status);
  const [resolutionNotes, setResolutionNotes] = useState(complaint.resolution_notes || '');
  const [notifyNAV, setNotifyNAV] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/ace/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint_id: complaint.id,
          status,
          resolution_notes: resolutionNotes,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
          nav_escalation_notified: notifyNAV || complaint.nav_escalation_notified,
          nav_escalation_notified_at: notifyNAV ? new Date().toISOString() : complaint.nav_escalation_notified_at,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Complaint Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {/* Complaint Details */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Submitter</p>
              <p className="font-medium text-slate-900">{complaint.submitter_name}</p>
              <p className="text-sm text-slate-600">{complaint.submitter_email}</p>
              {complaint.submitter_phone && (
                <p className="text-sm text-slate-600">{complaint.submitter_phone}</p>
              )}
              {complaint.submitter_bacb_id && (
                <p className="text-sm text-slate-600">BACB: {complaint.submitter_bacb_id}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">Timeline</p>
              <p className="text-slate-900">
                Submitted: {new Date(complaint.submitted_at).toLocaleDateString()}
              </p>
              <p className="text-slate-900">
                Response Due: {complaint.response_due_date 
                  ? new Date(complaint.response_due_date).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Complaint</p>
            <p className="text-slate-900 whitespace-pre-wrap">{complaint.complaint_text}</p>
          </div>
        </div>

        {/* NAV Rights Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            BACB NAV Escalation (2026 Requirement)
          </h4>
          <p className="text-sm text-blue-800 mb-3">
            Participants must be informed of their right to file a Notice of Alleged Violation (NAV)
            with BACB if their complaint is not resolved satisfactorily.
          </p>
          {!complaint.nav_escalation_notified && status !== 'resolved' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="navNotify"
                checked={notifyNAV}
                onChange={e => setNotifyNAV(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="navNotify" className="text-sm text-blue-900">
                Send NAV rights notification to participant
              </label>
            </div>
          )}
          {complaint.nav_escalation_notified && (
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              NAV notification sent on {complaint.nav_escalation_notified_at 
                ? new Date(complaint.nav_escalation_notified_at).toLocaleDateString()
                : 'Unknown date'}
            </p>
          )}
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status *
            </label>
            <select
              required
              value={status}
              onChange={e => setStatus(e.target.value as AceComplaintStatus)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="submitted">Submitted (New)</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="escalated_to_bacb">Escalated to BACB</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resolution Notes / Response *
            </label>
            <textarea
              required
              rows={6}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Document your investigation, findings, and resolution..."
            />
            <p className="text-xs text-slate-500 mt-1">
              This will be recorded for audit purposes. Provide a written response to the complainant.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {status === 'resolved' ? 'Resolve & Send Response' : 'Update Complaint'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
