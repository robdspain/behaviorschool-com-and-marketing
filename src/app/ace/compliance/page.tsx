'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComplianceScoreWidget } from '@/components/ace/ComplianceScoreWidget';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Download,
  Calendar,
  Archive,
  BarChart,
  RefreshCw,
  ChevronRight,
  Clock,
  Award,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Building2,
} from 'lucide-react';

// Hardcoded provider ID for demo - in production this comes from auth context
const DEMO_PROVIDER_ID = 'demo_provider';

interface ComplianceScore {
  score: number;
  deductions: Array<{ reason: string; points: number; count: number }>;
  level: string;
  calculatedAt: number;
}

interface OverdueCertificate {
  eventId: string;
  eventTitle: string;
  eventDate: number;
  pendingCount: number;
  deadline: number;
  daysOverdue: number;
}

interface OverdueFeedback {
  eventId: string;
  eventTitle: string;
  eventDate: number;
  feedbackCount: number;
  deadline: number;
  daysOverdue: number;
}

interface OverdueComplaint {
  complaintId: string;
  submitterName: string;
  submitterEmail: string;
  complaintText: string;
  submittedAt: number;
  status: string;
  deadline: number;
  daysOverdue: number;
}

interface OverdueItems {
  certificates: OverdueCertificate[];
  feedback: OverdueFeedback[];
  complaints: OverdueComplaint[];
  totalOverdue: number;
}

interface ProviderInfo {
  id: string;
  name: string;
  type: string;
  bacbNumber: string;
  status: string;
  isActive: boolean;
  expirationDate: number | null;
  daysUntilRenewal: number | null;
  canPublishEvents: boolean;
  canIssueCertificates: boolean;
}

interface CertificationStatus {
  coordinatorName: string;
  credentialType: string;
  credentialNumber: string;
  certificationExpires: number | null;
  daysUntilExpiration: number | null;
  isVerified: boolean;
  severity: string;
}

interface RetentionEvent {
  eventId: string;
  eventTitle: string;
  eventDate: number;
  eventEndDate: number;
  eventStatus: string;
  retentionDeadline: number;
  daysUntilArchive: number;
  retentionStatus: string;
  documents: Record<string, boolean>;
  completionPercentage: number;
  completedDocs: number;
  totalDocs: number;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function ComplianceDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data from /api/ace/dashboard
  const [complianceScore, setComplianceScore] = useState<ComplianceScore | null>(null);
  const [overdueItems, setOverdueItems] = useState<OverdueItems | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [certificationStatus, setCertificationStatus] = useState<CertificationStatus | null>(null);
  const [retentionEvents, setRetentionEvents] = useState<RetentionEvent[]>([]);

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      // Fetch dashboard data which includes compliance score and overdue items
      const dashboardRes = await fetch(
        `/api/ace/dashboard?provider_id=${DEMO_PROVIDER_ID}`
      );

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        if (dashboardData.success && dashboardData.data) {
          const d = dashboardData.data;
          setComplianceScore(d.complianceScore);
          setOverdueItems(d.overdueItems);
          setProviderInfo(d.providerInfo);
          setCertificationStatus(d.certificationStatus);
        }
      }

      // Also try fetching overdue items separately for more detailed data
      const overdueRes = await fetch(
        `/api/ace/compliance/overdue?provider_id=${DEMO_PROVIDER_ID}`
      );

      if (overdueRes.ok) {
        const overdueData = await overdueRes.json();
        if (overdueData.success && overdueData.data) {
          setOverdueItems(overdueData.data);
        }
      }

      // Try to fetch compliance score separately for deduction details
      const scoreRes = await fetch(
        `/api/ace/compliance/score?provider_id=${DEMO_PROVIDER_ID}`
      );

      if (scoreRes.ok) {
        const scoreData = await scoreRes.json();
        if (scoreData.success && scoreData.data) {
          setComplianceScore(scoreData.data);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching compliance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load compliance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const score = complianceScore?.score ?? 0;
  const deductions = complianceScore?.deductions ?? [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Audit & Compliance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor compliance score, overdue items, and document retention
            status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
            onClick={() => router.push('/ace/compliance/reports')}
          >
            <BarChart className="h-4 w-4" />
            Generate Report
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => router.push('/ace/compliance/retention')}
          >
            <Archive className="h-4 w-4" />
            Retention
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                {error} - Showing placeholder data. Connect your provider to
                see live compliance data.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-8">
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      ) : (
        <>
          {/* Row 1: Compliance Score + Provider Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compliance Score Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#1F4D3F]" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4 pb-6">
                <ComplianceScoreWidget score={score} />

                {/* Deductions Breakdown */}
                {deductions.length > 0 && (
                  <div className="mt-6 w-full space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Deductions
                    </p>
                    {deductions.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border-b border-gray-100 pb-1"
                      >
                        <span className="text-gray-600 truncate mr-2">
                          {d.reason}
                        </span>
                        <span className="text-red-600 font-medium whitespace-nowrap">
                          -{d.points * d.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {deductions.length === 0 && (
                  <div className="mt-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                    <p className="text-sm text-emerald-700 font-medium">
                      No deductions - Perfect compliance!
                    </p>
                  </div>
                )}

                {complianceScore?.calculatedAt && (
                  <p className="text-xs text-gray-400 mt-4">
                    Last updated: {formatDate(complianceScore.calculatedAt)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Provider Status */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#1F4D3F]" />
                  Provider Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Provider Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Provider
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {providerInfo?.name || 'Not configured'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-500">BACB Number</p>
                        <p className="text-sm font-mono font-medium">
                          {providerInfo?.bacbNumber || '--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <Badge
                          className={
                            providerInfo?.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : providerInfo?.status === 'Grace Period'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }
                        >
                          {providerInfo?.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    {providerInfo?.expirationDate && (
                      <div>
                        <p className="text-xs text-gray-500">Expiration</p>
                        <p className="text-sm">
                          {formatDate(providerInfo.expirationDate)}
                          {providerInfo.daysUntilRenewal !== null && (
                            <span
                              className={`ml-2 text-xs font-medium ${
                                providerInfo.daysUntilRenewal <= 30
                                  ? 'text-red-600'
                                  : providerInfo.daysUntilRenewal <= 90
                                    ? 'text-amber-600'
                                    : 'text-gray-500'
                              }`}
                            >
                              ({providerInfo.daysUntilRenewal} days)
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Coordinator Certification */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        ACE Coordinator
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium">
                          {certificationStatus?.coordinatorName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Credential</p>
                        <p className="text-sm font-medium uppercase">
                          {certificationStatus?.credentialType || '--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Verified</p>
                        {certificationStatus?.isVerified ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    {certificationStatus?.certificationExpires && (
                      <div>
                        <p className="text-xs text-gray-500">
                          Certification Expires
                        </p>
                        <p className="text-sm">
                          {formatDate(certificationStatus.certificationExpires)}
                          {certificationStatus.daysUntilExpiration !== null && (
                            <span
                              className={`ml-2 text-xs font-medium ${
                                certificationStatus.severity === 'critical'
                                  ? 'text-red-600'
                                  : certificationStatus.severity === 'warning'
                                    ? 'text-amber-600'
                                    : 'text-gray-500'
                              }`}
                            >
                              (
                              {certificationStatus.daysUntilExpiration <= 0
                                ? 'EXPIRED'
                                : `${certificationStatus.daysUntilExpiration} days`}
                              )
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {certificationStatus?.severity === 'critical' && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-xs text-red-700 font-medium">
                          Coordinator credentials need immediate attention
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Overdue Items */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Overdue Items
                  {overdueItems && overdueItems.totalOverdue > 0 && (
                    <Badge className="bg-red-100 text-red-800 ml-2">
                      {overdueItems.totalOverdue}
                    </Badge>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="certificates">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="certificates" className="gap-1.5">
                    <Award className="h-4 w-4" />
                    Certificates
                    {overdueItems &&
                      overdueItems.certificates.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-red-100 text-red-700 text-xs h-5 min-w-5 flex items-center justify-center"
                        >
                          {overdueItems.certificates.length}
                        </Badge>
                      )}
                  </TabsTrigger>
                  <TabsTrigger value="feedback" className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Feedback
                    {overdueItems && overdueItems.feedback.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-red-100 text-red-700 text-xs h-5 min-w-5 flex items-center justify-center"
                      >
                        {overdueItems.feedback.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="complaints" className="gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Complaints
                    {overdueItems &&
                      overdueItems.complaints.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-red-100 text-red-700 text-xs h-5 min-w-5 flex items-center justify-center"
                        >
                          {overdueItems.complaints.length}
                        </Badge>
                      )}
                  </TabsTrigger>
                </TabsList>

                {/* Certificates Tab */}
                <TabsContent value="certificates" className="mt-4">
                  {!overdueItems ||
                  overdueItems.certificates.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        No overdue certificates
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {overdueItems.certificates.map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() =>
                            router.push(`/ace/events`)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                              <Award className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {cert.eventTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                Event date: {formatDate(cert.eventDate)} |{' '}
                                {cert.pendingCount} pending certificate(s)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-red-100 text-red-800">
                              {cert.daysOverdue} days overdue
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback" className="mt-4">
                  {!overdueItems ||
                  overdueItems.feedback.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        No overdue feedback reviews
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {overdueItems.feedback.map((fb, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() =>
                            router.push(`/ace/events`)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                              <MessageSquare className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {fb.eventTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                Event date: {formatDate(fb.eventDate)} |{' '}
                                {fb.feedbackCount} response(s) to review
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-amber-100 text-amber-800">
                              {fb.daysOverdue} days overdue
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Complaints Tab */}
                <TabsContent value="complaints" className="mt-4">
                  {!overdueItems ||
                  overdueItems.complaints.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        No overdue complaint responses
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {overdueItems.complaints.map((complaint, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() =>
                            router.push(`/ace/complaints`)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Complaint from {complaint.submitterName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Submitted:{' '}
                                {formatDate(complaint.submittedAt)} |
                                Status: {complaint.status}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                {complaint.complaintText}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-red-100 text-red-800">
                              {complaint.daysOverdue} days overdue
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Row 3: Document Retention Preview + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Retention Preview */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Archive className="h-5 w-5 text-[#1F4D3F]" />
                    Document Retention
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-[#1F4D3F]"
                    onClick={() => router.push('/ace/compliance/retention')}
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {retentionEvents.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Archive className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No events with retention data yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Completed events will appear here with their 3-year
                      retention status
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {retentionEvents.slice(0, 5).map((event) => (
                      <div
                        key={event.eventId}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              event.retentionStatus === 'active'
                                ? 'bg-emerald-500'
                                : event.retentionStatus === 'due_soon'
                                  ? 'bg-amber-500'
                                  : event.retentionStatus === 'past_due'
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {event.eventTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              Retention until:{' '}
                              {formatDate(event.retentionDeadline)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Documents
                            </p>
                            <p className="text-sm font-medium">
                              {event.completedDocs}/{event.totalDocs}
                            </p>
                          </div>
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor:
                                event.completionPercentage === 100
                                  ? '#dcfce7'
                                  : event.completionPercentage >= 75
                                    ? '#fef9c3'
                                    : '#fef2f2',
                              color:
                                event.completionPercentage === 100
                                  ? '#166534'
                                  : event.completionPercentage >= 75
                                    ? '#854d0e'
                                    : '#991b1b',
                            }}
                          >
                            {event.completionPercentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start gap-3 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                  onClick={() => router.push('/ace/compliance/reports')}
                >
                  <BarChart className="h-4 w-4" />
                  Generate Audit Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/ace/compliance/export', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          provider_id: DEMO_PROVIDER_ID,
                          report_type: 'full_audit',
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        const blob = new Blob(
                          [JSON.stringify(data.data, null, 2)],
                          { type: 'application/json' }
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `audit-report-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    } catch (err) {
                      console.error('Export failed:', err);
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                  />
                  Refresh Compliance Score
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => router.push('/ace/compliance/retention')}
                >
                  <Archive className="h-4 w-4" />
                  Manage Retention
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => router.push('/ace/events')}
                >
                  <Calendar className="h-4 w-4" />
                  View Events
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => router.push('/ace/certificates')}
                >
                  <FileCheck className="h-4 w-4" />
                  Manage Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
