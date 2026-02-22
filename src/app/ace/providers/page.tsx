'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  User,
  Search,
  Plus,
  Shield,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface ProviderCoordinator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bacbId?: string;
}

interface ProviderRecord {
  _id: string;
  providerName: string;
  providerType: 'individual' | 'organization';
  bacbProviderNumber?: string;
  primaryEmail: string;
  isActive: boolean;
  applicationFeePaid: boolean;
  approvalDate?: number;
  expirationDate?: number;
  applicationDate?: number;
  coordinator?: ProviderCoordinator | null;
}

function getProviderStatus(
  provider: ProviderRecord
): 'Active' | 'Pending' | 'Lapsed' {
  if (provider.isActive) return 'Active';
  if (!provider.approvalDate && !provider.isActive) return 'Pending';
  return 'Lapsed';
}

function StatusBadge({ status }: { status: 'Active' | 'Pending' | 'Lapsed' }) {
  const variants: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Lapsed: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge className={variants[status] || ''}>
      {status === 'Active' && <Shield className="mr-1 h-3 w-3" />}
      {status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
      {status === 'Lapsed' && <AlertCircle className="mr-1 h-3 w-3" />}
      {status}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[180px]" />
          </div>
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export default function ProvidersListPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        const response = await fetch('/api/ace/providers');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch providers');
        }

        setProviders(data.providers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers;
    const query = searchQuery.toLowerCase();
    return providers.filter(
      (p) =>
        p.providerName.toLowerCase().includes(query) ||
        p.primaryEmail.toLowerCase().includes(query) ||
        (p.bacbProviderNumber &&
          p.bacbProviderNumber.toLowerCase().includes(query)) ||
        (p.coordinator &&
          `${p.coordinator.firstName} ${p.coordinator.lastName}`
            .toLowerCase()
            .includes(query))
    );
  }, [providers, searchQuery]);

  const stats = useMemo(() => {
    const active = providers.filter((p) => p.isActive).length;
    const pending = providers.filter(
      (p) => !p.isActive && !p.approvalDate
    ).length;
    const total = providers.length;
    return { active, pending, total };
  }, [providers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                ACE Providers
              </h1>
              <p className="mt-2 text-green-100">
                Manage Authorized Continuing Education provider applications and
                accounts
              </p>
            </div>
            <Button
              onClick={() => router.push('/ace/providers/new')}
              className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Provider Application
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F4D3F]/10">
                  <Building2 className="h-5 w-5 text-[#1F4D3F]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Providers
                  </p>
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
                  <Shield className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {loading ? '-' : stats.active}
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
                  <p className="text-sm text-muted-foreground">
                    Pending Approval
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {loading ? '-' : stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search providers by name, email, BACB number, or coordinator..."
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
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Providers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton />
            ) : filteredProviders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {searchQuery
                    ? 'No providers match your search'
                    : 'No providers yet'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search terms.'
                    : 'Get started by creating a new provider application.'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push('/ace/providers/new')}
                    className="mt-4 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Provider Application
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">Provider</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Coordinator</th>
                      <th className="pb-3 pr-4">BACB Number</th>
                      <th className="pb-3 pr-4">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.map((provider) => {
                      const status = getProviderStatus(provider);
                      return (
                        <tr
                          key={provider._id}
                          onClick={() =>
                            router.push(`/ace/providers/${provider._id}`)
                          }
                          className="cursor-pointer border-b transition-colors hover:bg-muted/50 last:border-0"
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4D3F]/10">
                                {provider.providerType === 'organization' ? (
                                  <Building2 className="h-4 w-4 text-[#1F4D3F]" />
                                ) : (
                                  <User className="h-4 w-4 text-[#1F4D3F]" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {provider.providerName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {provider.primaryEmail}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm capitalize">
                              {provider.providerType}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <StatusBadge status={status} />
                          </td>
                          <td className="py-4 pr-4">
                            {provider.coordinator ? (
                              <div>
                                <p className="text-sm font-medium">
                                  {provider.coordinator.firstName}{' '}
                                  {provider.coordinator.lastName}
                                </p>
                                {provider.coordinator.bacbId && (
                                  <p className="text-xs text-muted-foreground">
                                    BACB: {provider.coordinator.bacbId}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                --
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm font-mono">
                              {provider.bacbProviderNumber || '--'}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            {provider.expirationDate ? (
                              <span className="text-sm">
                                {new Date(
                                  provider.expirationDate
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
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
