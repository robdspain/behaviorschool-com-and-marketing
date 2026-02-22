'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Award,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  CalendarDays,
} from 'lucide-react';

interface CertificateRecord {
  _id: string;
  certificateNumber: string;
  participantName: string;
  participantEmail: string;
  participantBacbId?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  instructorName: string;
  providerName?: string;
  providerNumber?: string;
  totalCeus: number;
  ceCategory: string;
  status: 'pending' | 'issued' | 'revoked';
  issuedAt?: number;
  revokedAt?: number;
  revocationReason?: string;
  createdAt: number;
  event?: {
    _id: string;
    title: string;
    startDate: number;
    endDate?: number;
    status: string;
  } | null;
}

const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;

function getDaysSinceEvent(eventDate: string): number {
  const event = new Date(eventDate);
  const now = new Date();
  return Math.floor((now.getTime() - event.getTime()) / (24 * 60 * 60 * 1000));
}

function isOverdue(cert: CertificateRecord): boolean {
  if (cert.status !== 'pending') return false;
  return getDaysSinceEvent(cert.eventDate) > 45;
}

function StatusBadge({ status }: { status: 'pending' | 'issued' | 'revoked' }) {
  const variants: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    issued: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    revoked: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="mr-1 h-3 w-3" />,
    issued: <CheckCircle className="mr-1 h-3 w-3" />,
    revoked: <XCircle className="mr-1 h-3 w-3" />,
  };

  return (
    <Badge className={variants[status] || ''}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    async function fetchCertificates() {
      try {
        setLoading(true);
        const response = await fetch('/api/ace/certificates?all=true');

        if (!response.ok) {
          // Fallback: try getAll via a different approach
          const allResponse = await fetch('/api/ace/certificates?event_id=all');
          if (!allResponse.ok) {
            throw new Error('Failed to fetch certificates');
          }
          const data = await allResponse.json();
          setCertificates(data.data || []);
          return;
        }

        const data = await response.json();
        setCertificates(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  const filteredCertificates = useMemo(() => {
    let filtered = certificates;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.participantName.toLowerCase().includes(query) ||
          c.certificateNumber.toLowerCase().includes(query) ||
          c.eventTitle.toLowerCase().includes(query) ||
          (c.participantEmail && c.participantEmail.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      filtered = filtered.filter((c) => {
        const eventTime = new Date(c.eventDate).getTime();
        return eventTime >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000;
      filtered = filtered.filter((c) => {
        const eventTime = new Date(c.eventDate).getTime();
        return eventTime <= to;
      });
    }

    return filtered;
  }, [certificates, searchQuery, statusFilter, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = certificates.length;
    const issued = certificates.filter((c) => c.status === 'issued').length;
    const pending = certificates.filter((c) => c.status === 'pending').length;
    const revoked = certificates.filter((c) => c.status === 'revoked').length;
    const overdue = certificates.filter((c) => isOverdue(c)).length;

    return { total, issued, pending, revoked, overdue };
  }, [certificates]);

  const handleBulkIssue = async () => {
    const pendingCerts = filteredCertificates.filter(
      (c) => c.status === 'pending'
    );
    if (pendingCerts.length === 0) return;

    const confirmed = window.confirm(
      `Issue ${pendingCerts.length} pending certificate(s)?`
    );
    if (!confirmed) return;

    // In a real implementation, this would call a bulk issue endpoint
    alert(
      `Bulk issue for ${pendingCerts.length} certificates would be processed here.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Certificate Management
              </h1>
              <p className="mt-2 text-green-100">
                Track, issue, and manage continuing education certificates
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleBulkIssue}
                className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] font-semibold"
                disabled={stats.pending === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Bulk Issue ({stats.pending})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F4D3F]/10">
                  <Award className="h-5 w-5 text-[#1F4D3F]" />
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {loading ? '-' : stats.issued}
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
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {loading ? '-' : stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <XCircle className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revoked</p>
                  <p className="text-2xl font-bold text-red-700">
                    {loading ? '-' : stats.revoked}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.overdue > 0 ? 'border-red-300 bg-red-50' : ''}>
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
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, certificate number, or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="issued">Issued</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-[150px]"
                  placeholder="From"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-[150px]"
                  placeholder="To"
                />
              </div>
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

        {/* Certificates Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Certificates ({filteredCertificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton />
            ) : filteredCertificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No certificates match your filters'
                    : 'No certificates yet'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Certificates will appear here once issued to participants.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">Participant</th>
                      <th className="pb-3 pr-4">Event</th>
                      <th className="pb-3 pr-4">Certificate #</th>
                      <th className="pb-3 pr-4">CEUs</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Issued</th>
                      <th className="pb-3 pr-4">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificates.map((cert) => {
                      const daysSince = getDaysSinceEvent(cert.eventDate);
                      const overdue = isOverdue(cert);

                      return (
                        <tr
                          key={cert._id}
                          onClick={() =>
                            router.push(`/ace/certificates/${cert._id}`)
                          }
                          className={`cursor-pointer border-b transition-colors hover:bg-muted/50 last:border-0 ${
                            overdue ? 'bg-red-50 hover:bg-red-100' : ''
                          }`}
                        >
                          <td className="py-4 pr-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {cert.participantName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {cert.participantEmail}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <div>
                              <p className="text-sm font-medium">
                                {cert.eventTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(cert.eventDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm font-mono">
                              {cert.certificateNumber}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm font-semibold">
                              {cert.totalCeus.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm capitalize">
                              {cert.ceCategory}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <StatusBadge status={cert.status} />
                          </td>
                          <td className="py-4 pr-4">
                            {cert.issuedAt ? (
                              <span className="text-sm">
                                {new Date(cert.issuedAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                --
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {cert.status === 'pending' ? (
                              <div
                                className={`flex items-center gap-1 text-sm ${
                                  overdue
                                    ? 'text-red-700 font-semibold'
                                    : daysSince > 30
                                      ? 'text-amber-700'
                                      : 'text-gray-600'
                                }`}
                              >
                                {overdue && (
                                  <AlertTriangle className="h-3 w-3" />
                                )}
                                {daysSince}d since event
                              </div>
                            ) : cert.status === 'issued' && cert.issuedAt ? (
                              <span className="text-sm text-gray-500">
                                {Math.floor(
                                  (cert.issuedAt -
                                    new Date(cert.eventDate).getTime()) /
                                    (24 * 60 * 60 * 1000)
                                )}
                                d to issue
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                --
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
