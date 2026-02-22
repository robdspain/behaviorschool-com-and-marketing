'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  MessageSquareWarning,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Eye,
  Filter,
  BarChart3,
} from 'lucide-react';

interface ComplaintRecord {
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
}: {
  status: 'submitted' | 'under_review' | 'resolved' | 'escalated_to_bacb';
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
    <Badge className={c.bg}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-6 w-[100px] rounded-full" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  );
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const response = await fetch('/api/ace/complaints');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch complaints');
        }

        setComplaints(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    let filtered = complaints;

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter((c) => c.status === activeTab);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.submitterName.toLowerCase().includes(query) ||
          c.submitterEmail.toLowerCase().includes(query) ||
          c.complaintText.toLowerCase().includes(query) ||
          (c.event?.title && c.event.title.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [complaints, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(
      (c) => c.status === 'submitted' || c.status === 'under_review'
    ).length;
    const overdue = complaints.filter((c) => c.isOverdue).length;
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const resolvedThisMonth = complaints.filter(
      (c) =>
        c.status === 'resolved' &&
        c.resolvedAt &&
        c.resolvedAt >= thirtyDaysAgo
    ).length;

    return { total, open, overdue, resolvedThisMonth };
  }, [complaints]);

  const tabCounts = useMemo(() => {
    return {
      all: complaints.length,
      submitted: complaints.filter((c) => c.status === 'submitted').length,
      under_review: complaints.filter((c) => c.status === 'under_review')
        .length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
      escalated_to_bacb: complaints.filter(
        (c) => c.status === 'escalated_to_bacb'
      ).length,
    };
  }, [complaints]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Complaint Management
              </h1>
              <p className="mt-2 text-green-100">
                Track and resolve complaints within the 45-day BACB compliance
                window
              </p>
            </div>
            <Button
              onClick={() =>
                window.open('/ace/complaints/submit', '_blank')
              }
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <MessageSquareWarning className="mr-2 h-4 w-4" />
              View Submission Form
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F4D3F]/10">
                  <BarChart3 className="h-5 w-5 text-[#1F4D3F]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-[#1F4D3F]">
                    {loading ? '-' : stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {loading ? '-' : stats.open}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={
              stats.overdue > 0 ? 'border-red-300 bg-red-50' : ''
            }
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    stats.overdue > 0 ? 'bg-red-200' : 'bg-gray-100'
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      stats.overdue > 0 ? 'text-red-700' : 'text-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p
                    className={`text-2xl font-bold ${
                      stats.overdue > 0 ? 'text-red-700' : 'text-gray-500'
                    }`}
                  >
                    {loading ? '-' : stats.overdue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Resolved (30d)
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {loading ? '-' : stats.resolvedThisMonth}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, event, or complaint text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs and Table */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Complaints</CardTitle>
              </div>
              <TabsList className="mt-3">
                <TabsTrigger value="all">
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="submitted">
                  Submitted ({tabCounts.submitted})
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Under Review ({tabCounts.under_review})
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved ({tabCounts.resolved})
                </TabsTrigger>
                <TabsTrigger value="escalated_to_bacb">
                  Escalated ({tabCounts.escalated_to_bacb})
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-4">
              {loading ? (
                <TableSkeleton />
              ) : filteredComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquareWarning className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-muted-foreground">
                    {searchQuery || activeTab !== 'all'
                      ? 'No complaints match your criteria'
                      : 'No complaints yet'}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery || activeTab !== 'all'
                      ? 'Try adjusting your search or filter.'
                      : 'Complaints will appear here when submitted.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                        <th className="pb-3 pr-4">Submitter</th>
                        <th className="pb-3 pr-4">Event</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 pr-4">Submitted</th>
                        <th className="pb-3 pr-4">Deadline</th>
                        <th className="pb-3 pr-4">Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr
                          key={complaint._id}
                          onClick={() =>
                            router.push(`/ace/complaints/${complaint._id}`)
                          }
                          className={`cursor-pointer border-b transition-colors hover:bg-muted/50 last:border-0 ${
                            complaint.isOverdue
                              ? 'bg-red-50 hover:bg-red-100'
                              : ''
                          }`}
                        >
                          <td className="py-4 pr-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {complaint.submitterName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {complaint.submitterEmail}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            {complaint.event ? (
                              <p className="text-sm">
                                {complaint.event.title}
                              </p>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                General
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm">
                              {new Date(
                                complaint.submittedAt
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm">
                              {new Date(
                                complaint.responseDueDate
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            {complaint.status === 'resolved' ||
                            complaint.status === 'escalated_to_bacb' ? (
                              <span className="text-sm text-gray-500">
                                Closed
                              </span>
                            ) : (
                              <div
                                className={`flex items-center gap-1 text-sm ${
                                  complaint.isOverdue
                                    ? 'text-red-700 font-semibold'
                                    : complaint.daysUntilResponseDue <= 7
                                      ? 'text-amber-700'
                                      : 'text-gray-600'
                                }`}
                              >
                                {complaint.isOverdue && (
                                  <AlertTriangle className="h-3 w-3" />
                                )}
                                {complaint.isOverdue
                                  ? `${Math.abs(complaint.daysUntilResponseDue)}d overdue`
                                  : `${complaint.daysUntilResponseDue}d remaining`}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
