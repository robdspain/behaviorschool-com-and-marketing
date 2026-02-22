'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  MessageSquareWarning,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Mail,
  Phone,
  User,
  CalendarDays,
  ExternalLink,
  Shield,
} from 'lucide-react';

interface ComplaintDetail {
  _id: string;
  providerId: string;
  eventId?: string;
  submitterName: string;
  submitterEmail: string;
  submitterBacbId?: string;
  submitterPhone?: string;
  complaintText: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'escalated_to_bacb';
  resolutionNotes?: string;
  resolvedAt?: number;
  resolvedBy?: string;
  submittedAt: number;
  createdAt: number;
  updatedAt: number;
  event?: {
    _id: string;
    title: string;
    startDate: number;
  } | null;
  responseDueDate: number;
  daysUntilResponseDue: number;
  isOverdue: boolean;
}

function StatusBadge({
  status,
  large,
}: {
  status: string;
  large?: boolean;
}) {
  const config: Record<
    string,
    { bg: string; icon: React.ReactNode; label: string }
  > = {
    submitted: {
      bg: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Submitted',
    },
    under_review: {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Eye className="mr-1 h-3 w-3" />,
      label: 'Under Review',
    },
    resolved: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: 'Resolved',
    },
    escalated_to_bacb: {
      bg: 'bg-red-100 text-red-800 border-red-200',
      icon: <ArrowUpRight className="mr-1 h-3 w-3" />,
      label: 'Escalated to BACB',
    },
  };

  const c = config[status] || config.submitted;

  return (
    <Badge className={`${c.bg} ${large ? 'text-sm px-3 py-1' : ''}`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
];

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolution form
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Escalation dialog
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [escalateNotes, setEscalateNotes] = useState('');
  const [escalating, setEscalating] = useState(false);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        setLoading(true);
        const response = await fetch(`/api/ace/complaints/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch complaint');
        }

        setComplaint(data.data);
        setNewStatus(data.data.status);
        setResolutionNotes(data.data.resolutionNotes || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === complaint?.status) return;
    setUpdating(true);

    try {
      const response = await fetch(`/api/ace/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolution_notes: resolutionNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update complaint');
      }

      // Refresh complaint data
      setComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as ComplaintDetail['status'],
              resolutionNotes: resolutionNotes || prev.resolutionNotes,
              resolvedAt:
                newStatus === 'resolved' ? Date.now() : prev.resolvedAt,
            }
          : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleEscalate = async () => {
    setEscalating(true);

    try {
      const response = await fetch(`/api/ace/complaints/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution_notes: escalateNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to escalate complaint');
      }

      // Refresh complaint data
      setComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: 'escalated_to_bacb',
              resolvedAt: Date.now(),
              resolutionNotes:
                escalateNotes ||
                'Escalated to BACB - Notice of Alleged Violation (NAV) process initiated.',
            }
          : null
      );
      setEscalateDialogOpen(false);
      setEscalateNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to escalate');
    } finally {
      setEscalating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-lg font-semibold mb-2">
              Complaint Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The complaint could not be loaded.'}
            </p>
            <Button
              onClick={() => router.push('/ace/complaints')}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isClosed =
    complaint.status === 'resolved' ||
    complaint.status === 'escalated_to_bacb';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/ace/complaints')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  <MessageSquareWarning className="h-7 w-7" />
                  Complaint Detail
                </h1>
                <p className="mt-1 text-green-100">
                  Submitted by {complaint.submitterName}
                </p>
              </div>
            </div>
            <StatusBadge status={complaint.status} large />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquareWarning className="h-5 w-5 text-[#1F4D3F]" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Submitter Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {complaint.submitterName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm">{complaint.submitterEmail}</p>
                    </div>
                  </div>
                  {complaint.submitterPhone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Phone
                        </p>
                        <p className="text-sm">
                          {complaint.submitterPhone}
                        </p>
                      </div>
                    </div>
                  )}
                  {complaint.submitterBacbId && (
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          BACB ID
                        </p>
                        <p className="font-mono text-sm">
                          {complaint.submitterBacbId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Reference */}
                {complaint.event && (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Related Event
                    </p>
                    <p className="font-medium">{complaint.event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        complaint.event.startDate
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Complaint Text */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Complaint Description
                  </p>
                  <div className="p-4 bg-gray-50 rounded-lg border whitespace-pre-wrap text-sm">
                    {complaint.complaintText}
                  </div>
                </div>

                {/* Submission Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Submitted on{' '}
                  {new Date(complaint.submittedAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resolution Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#1F4D3F]" />
                  Resolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isClosed && complaint.resolutionNotes && (
                  <div
                    className={`p-4 rounded-lg border ${
                      complaint.status === 'escalated_to_bacb'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {complaint.status === 'escalated_to_bacb'
                        ? 'Escalation Notes'
                        : 'Resolution Notes'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">
                      {complaint.resolutionNotes}
                    </p>
                    {complaint.resolvedAt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {complaint.status === 'escalated_to_bacb'
                          ? 'Escalated'
                          : 'Resolved'}{' '}
                        on{' '}
                        {new Date(complaint.resolvedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    )}
                  </div>
                )}

                {!isClosed && (
                  <>
                    <div>
                      <label className="text-sm font-medium">
                        Update Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Resolution Notes
                      </label>
                      <Textarea
                        value={resolutionNotes}
                        onChange={(e) =>
                          setResolutionNotes(e.target.value)
                        }
                        placeholder="Enter notes about the resolution or investigation findings..."
                        className="mt-1"
                        rows={5}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={
                        updating || newStatus === complaint.status
                      }
                      className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Escalation Section */}
            {!isClosed && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <ArrowUpRight className="h-5 w-5" />
                    BACB Escalation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Notice of Alleged Violation (NAV):</strong>{' '}
                      Escalating to the BACB will initiate the formal
                      complaint process. This should only be done when the
                      complaint cannot be resolved at the provider level.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Submitters may also file directly with the BACB:
                    </p>
                    <a
                      href="https://www.bacb.com/ethics-information/reporting-to-the-bacb/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#1F4D3F] hover:underline"
                    >
                      BACB Reporting Process
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Button
                    onClick={() => setEscalateDialogOpen(true)}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalate to BACB
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 45-Day Deadline */}
            <Card
              className={
                complaint.isOverdue ? 'border-red-300 bg-red-50' : ''
              }
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#1F4D3F]" />
                  45-Day Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Response Due
                    </p>
                    <p className="font-semibold">
                      {new Date(
                        complaint.responseDueDate
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {isClosed ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-800 font-medium">
                        Complaint has been{' '}
                        {complaint.status === 'escalated_to_bacb'
                          ? 'escalated'
                          : 'resolved'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Submitted</span>
                          <span>45 days</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              complaint.isOverdue
                                ? 'bg-red-500'
                                : complaint.daysUntilResponseDue <= 7
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min(100, ((45 - complaint.daysUntilResponseDue) / 45) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className={`text-center p-2 rounded-lg ${
                          complaint.isOverdue
                            ? 'bg-red-100 text-red-800'
                            : complaint.daysUntilResponseDue <= 7
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <p className="font-bold text-lg">
                          {complaint.isOverdue
                            ? `${Math.abs(complaint.daysUntilResponseDue)} days overdue`
                            : `${complaint.daysUntilResponseDue} days remaining`}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Submitted */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          complaint.submittedAt
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div className="ml-4 border-l-2 border-gray-200 h-3" />

                  {/* Under Review */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        complaint.status !== 'submitted'
                          ? 'bg-amber-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Eye
                        className={`h-4 w-4 ${
                          complaint.status !== 'submitted'
                            ? 'text-amber-700'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          complaint.status === 'submitted'
                            ? 'text-gray-400'
                            : ''
                        }`}
                      >
                        Under Review
                      </p>
                    </div>
                    {complaint.status !== 'submitted' && (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>

                  <div className="ml-4 border-l-2 border-gray-200 h-3" />

                  {/* Resolution */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        complaint.status === 'resolved'
                          ? 'bg-emerald-100'
                          : complaint.status === 'escalated_to_bacb'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                      }`}
                    >
                      {complaint.status === 'escalated_to_bacb' ? (
                        <ArrowUpRight className="h-4 w-4 text-red-700" />
                      ) : (
                        <CheckCircle
                          className={`h-4 w-4 ${
                            complaint.status === 'resolved'
                              ? 'text-emerald-700'
                              : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          !isClosed ? 'text-gray-400' : ''
                        }`}
                      >
                        {complaint.status === 'escalated_to_bacb'
                          ? 'Escalated to BACB'
                          : 'Resolved'}
                      </p>
                      {complaint.resolvedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            complaint.resolvedAt
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                    {isClosed && (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Escalation Dialog */}
      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Escalate to BACB
            </DialogTitle>
            <DialogDescription>
              This action will mark this complaint as escalated to the BACB
              and initiate the Notice of Alleged Violation (NAV) process.
              This should only be done when the complaint cannot be resolved
              at the provider level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Once escalated, this action
                cannot be undone. The BACB will be notified and the
                complainant will be informed of the escalation.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">
                Escalation Notes (Optional)
              </label>
              <Textarea
                value={escalateNotes}
                onChange={(e) => setEscalateNotes(e.target.value)}
                placeholder="Enter any notes about the escalation rationale..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEscalateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEscalate}
              disabled={escalating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {escalating ? 'Escalating...' : 'Confirm Escalation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
