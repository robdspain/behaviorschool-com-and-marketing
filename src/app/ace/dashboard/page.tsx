'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ComplianceScoreWidget } from '@/components/ace/ComplianceScoreWidget';
import { CertificationCountdown } from '@/components/ace/CertificationCountdown';
import { EventApprovalCard } from '@/components/ace/EventApprovalCard';
import {
  AlertTriangle,
  Award,
  Building2,
  CalendarCheck,
  Clock,
  FileWarning,
  LayoutDashboard,
  MessageSquareWarning,
  RefreshCw,
  ScrollText,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DashboardData {
  certificationStatus: {
    coordinatorName: string;
    credentialType: string;
    credentialNumber: string | null;
    certificationExpires: number | null;
    daysUntilExpiration: number | null;
    isVerified: boolean;
    severity: string;
  };
  providerInfo: {
    id: string;
    name: string;
    type: string;
    bacbNumber: string | null;
    status: 'Active' | 'Grace Period' | 'Lapsed';
    isActive: boolean;
    expirationDate: number | null;
    daysUntilRenewal: number | null;
    canRenew: boolean;
    canPublishEvents: boolean;
    canIssueCertificates: boolean;
  };
  pendingEvents: Array<{
    _id: string;
    title: string;
    description?: string;
    startDate: number;
    endDate?: number;
    totalCeus: number;
    ceCategory: string;
    modality: string;
    eventType?: string;
    learningObjectives?: string[];
    instructorQualificationsSummary?: string;
    instructorAffiliations?: string;
    conflictsOfInterest?: string;
    maxParticipants?: number;
    fee?: number;
    location?: string;
  }>;
  complianceScore: {
    score: number;
    deductions: Array<{
      reason: string;
      points: number;
      count: number;
    }>;
  };
  overdueItems: {
    certificates: Array<{
      eventId: string;
      eventTitle: string;
      eventDate: number;
      pendingCount: number;
      deadline: number;
      daysOverdue: number;
    }>;
    feedbackReviews: Array<{
      eventId: string;
      eventTitle: string;
      eventDate: number;
      deadline: number;
      daysOverdue: number;
    }>;
    complaints: Array<{
      complaintId: string;
      submitterName: string;
      submittedAt: number;
      status: string;
      deadline: number;
      daysOverdue: number;
    }>;
    totalOverdue: number;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    subtitle: string;
    timestamp: number;
  }>;
  stats: {
    totalEvents: number;
    activeEvents: number;
    totalRegistrations: number;
    totalCertificates: number;
    totalCEUsIssued: number;
    pendingApprovals: number;
  };
}

// ---------------------------------------------------------------------------
// Status colors for Provider
// ---------------------------------------------------------------------------
const providerStatusConfig: Record<
  string,
  { className: string; dotClass: string }
> = {
  Active: {
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  'Grace Period': {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotClass: 'bg-yellow-500',
  },
  Lapsed: {
    className: 'bg-red-100 text-red-800 border-red-200',
    dotClass: 'bg-red-500',
  },
};

// ---------------------------------------------------------------------------
// Helper: format relative time
// ---------------------------------------------------------------------------
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------
export default function CoordinatorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);

  // Get provider_id from URL search params
  const [providerId, setProviderId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProviderId(params.get('provider_id') || '');
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!providerId) {
      setLoading(false);
      setError('No provider_id specified. Add ?provider_id=<id> to the URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ace/dashboard?provider_id=${encodeURIComponent(providerId)}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      fetchDashboard();
    }
  }, [providerId, fetchDashboard]);

  // -- Event Approval Handlers --
  const handleApprove = async (eventId: string) => {
    setApprovalLoading(eventId);
    try {
      const response = await fetch(`/api/ace/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const result = await response.json();
      if (result.success) {
        // Refresh dashboard data
        await fetchDashboard();
      }
    } catch (err) {
      console.error('Error approving event:', err);
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleReject = async (eventId: string) => {
    setApprovalLoading(eventId);
    try {
      const response = await fetch(`/api/ace/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchDashboard();
      }
    } catch (err) {
      console.error('Error rejecting event:', err);
    } finally {
      setApprovalLoading(null);
    }
  };

  // -- Loading State --
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-8 w-8 rounded" />
            <div>
              <Skeleton className="h-7 w-64 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-lg lg:col-span-2" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // -- Error State --
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Unable to Load Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={fetchDashboard}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const {
    certificationStatus,
    providerInfo,
    pendingEvents,
    complianceScore,
    overdueItems,
    recentActivity,
    stats,
  } = data;

  const statusConfig = providerStatusConfig[providerInfo.status] || {
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    dotClass: 'bg-gray-500',
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1F4D3F] text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Coordinator Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                ACE CEU Provider Management
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboard}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats Overview Cards                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck className="h-4 w-4 text-[#1F4D3F]" />
                <span className="text-xs text-muted-foreground">
                  Total Events
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalEvents}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.activeEvents}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">
                  Registrations
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalRegistrations}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <ScrollText className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-xs text-muted-foreground">
                  Certificates
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalCertificates}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">
                  CEUs Issued
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalCEUsIssued}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-muted-foreground">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.pendingApprovals}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Dashboard Grid                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================================== */}
          {/* Left Column (2/3 width)                                        */}
          {/* ============================================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* -- Credential Verification & Provider Status Row -- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Credential Verification */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#1F4D3F]" />
                    Credential Verification
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {certificationStatus.coordinatorName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificationStatus.certificationExpires ? (
                    <CertificationCountdown
                      expirationDate={certificationStatus.certificationExpires}
                      label={`BCBA Certification ${certificationStatus.credentialNumber ? `(${certificationStatus.credentialNumber})` : ''}`}
                    />
                  ) : (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          No certification date on file
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        Please update your BCBA certification details.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Provider Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#1F4D3F]" />
                    Provider Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {providerInfo.bacbNumber
                      ? `BACB #${providerInfo.bacbNumber}`
                      : 'Provider ID pending'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {providerInfo.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={statusConfig.className}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`}
                      />
                      {providerInfo.status}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Days Until Renewal
                      </span>
                      <span className="font-medium">
                        {providerInfo.daysUntilRenewal !== null
                          ? providerInfo.daysUntilRenewal > 0
                            ? `${providerInfo.daysUntilRenewal} days`
                            : 'Overdue'
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Publish Events
                      </span>
                      {providerInfo.canPublishEvents ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Issue Certificates
                      </span>
                      {providerInfo.canIssueCertificates ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {providerInfo.canRenew && (
                    <Button
                      size="sm"
                      className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Renew Provider Status
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* -- Event Approval Queue -- */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-[#1F4D3F]" />
                      Event Approval Queue
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {pendingEvents.length > 0
                        ? `${pendingEvents.length} event${pendingEvents.length !== 1 ? 's' : ''} awaiting review`
                        : 'No events pending approval'}
                    </CardDescription>
                  </div>
                  {pendingEvents.length > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                      {pendingEvents.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      All caught up! No events need approval.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pendingEvents.map((event) => (
                      <EventApprovalCard
                        key={event._id}
                        event={event}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isLoading={approvalLoading === event._id}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* -- Overdue Items -- */}
            {overdueItems.totalOverdue > 0 && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    Overdue Items
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {overdueItems.totalOverdue} item
                    {overdueItems.totalOverdue !== 1 ? 's' : ''} require
                    immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overdue Certificates */}
                  {overdueItems.certificates.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileWarning className="h-4 w-4 text-red-500" />
                        <h4 className="text-sm font-medium text-foreground">
                          Certificates Past 45-Day Deadline
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {overdueItems.certificates.map((cert) => (
                          <div
                            key={cert.eventId}
                            className="flex items-center justify-between rounded-md border border-red-100 bg-red-50/50 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {cert.eventTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {cert.pendingCount} pending certificate
                                {cert.pendingCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 border-red-300 text-xs"
                            >
                              {cert.daysOverdue} days overdue
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overdue Feedback Reviews */}
                  {overdueItems.feedbackReviews.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquareWarning className="h-4 w-4 text-orange-500" />
                        <h4 className="text-sm font-medium text-foreground">
                          Feedback Reviews Past 45-Day Deadline
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {overdueItems.feedbackReviews.map((fb) => (
                          <div
                            key={fb.eventId}
                            className="flex items-center justify-between rounded-md border border-orange-100 bg-orange-50/50 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {fb.eventTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Event:{' '}
                                {new Date(fb.eventDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-800 border-orange-300 text-xs"
                            >
                              {fb.daysOverdue} days overdue
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overdue Complaint Responses */}
                  {overdueItems.complaints.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <h4 className="text-sm font-medium text-foreground">
                          Complaint Responses Past 45-Day Deadline
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {overdueItems.complaints.map((complaint) => (
                          <div
                            key={complaint.complaintId}
                            className="flex items-center justify-between rounded-md border border-red-100 bg-red-50/50 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Complaint from {complaint.submitterName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Submitted:{' '}
                                {new Date(
                                  complaint.submittedAt
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 border-red-300 text-xs"
                            >
                              {complaint.daysOverdue} days overdue
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ============================================================== */}
          {/* Right Column (1/3 width)                                       */}
          {/* ============================================================== */}
          <div className="space-y-6">
            {/* -- Compliance Score Widget -- */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#1F4D3F]" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComplianceScoreWidget
                  score={complianceScore.score}
                  label="Overall Compliance"
                  className="mb-4"
                />

                {complianceScore.deductions.length > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <p className="text-xs font-medium text-muted-foreground pt-2">
                      Deductions
                    </p>
                    {complianceScore.deductions.map((deduction, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {deduction.reason}{' '}
                          {deduction.count > 1 ? `(x${deduction.count})` : ''}
                        </span>
                        <span className="font-medium text-red-600">
                          -{deduction.points * deduction.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {complianceScore.deductions.length === 0 && (
                  <div className="text-center pt-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      No deductions -- full compliance!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* -- Recent Activity Feed -- */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#1F4D3F]" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-6">
                    <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      No recent activity to show
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-0.5">
                          {item.type === 'certificate_issued' && (
                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Award className="h-3 w-3 text-emerald-600" />
                            </div>
                          )}
                          {item.type === 'registration' && (
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                          {item.type === 'quiz_completed' && (
                            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-purple-600" />
                            </div>
                          )}
                          {!['certificate_issued', 'registration', 'quiz_completed'].includes(item.type) && (
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <Activity className="h-3 w-3 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.subtitle}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                            {formatRelativeTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
