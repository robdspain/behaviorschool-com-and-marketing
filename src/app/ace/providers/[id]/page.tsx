'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  User,
  Shield,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Edit,
  RefreshCw,
  Ban,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
} from 'lucide-react';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface Coordinator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bacbId?: string;
  credentialType?: string;
  isActive: boolean;
}

interface Provider {
  _id: string;
  providerName: string;
  providerType: 'individual' | 'organization';
  bacbProviderNumber?: string;
  coordinatorId: string;
  coordinatorYearsCertified: number;
  coordinatorCertificationDate?: number;
  coordinatorCertificationExpires?: number;
  coordinatorCertificationVerified?: boolean;
  primaryEmail: string;
  primaryPhone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  applicationDate?: number;
  approvalDate?: number;
  expirationDate?: number;
  isActive: boolean;
  applicationFeePaid: boolean;
  applicationFeeAmount?: number;
  applicationFeePaidDate?: number;
  renewalFeePaid: boolean;
  lastRenewalDate?: number;
  nextRenewalDate?: number;
  gracePeriodEndDate?: number;
  lateFeePaid?: boolean;
  lateFeeAmount?: number;
  canPublishEvents?: boolean;
  canIssueCertificates?: boolean;
  lapseStartDate?: number;
  lapseEndDate?: number;
  ein?: string;
  incorporationDocUrl?: string;
  legalEntityVerified?: boolean;
  legalEntityVerifiedAt?: number;
  leadershipAttestationUrl?: string;
  leadershipAttestationDate?: number;
  leadershipName?: string;
  leadershipTitle?: string;
  createdAt: number;
  updatedAt: number;
  coordinator?: Coordinator | null;
}

type ProviderStatus = 'Active' | 'Pending' | 'Lapsed';

function getProviderStatus(provider: Provider): ProviderStatus {
  if (provider.isActive) return 'Active';
  if (!provider.approvalDate) return 'Pending';
  return 'Lapsed';
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function daysUntil(timestamp?: number): number | null {
  if (!timestamp) return null;
  const now = Date.now();
  const diff = timestamp - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// --------------------------------------------------------------------------
// Status Badge
// --------------------------------------------------------------------------

function StatusBadge({ status }: { status: ProviderStatus }) {
  const styles: Record<ProviderStatus, string> = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Lapsed: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons: Record<ProviderStatus, React.ReactNode> = {
    Active: <Shield className="mr-1 h-3 w-3" />,
    Pending: <Clock className="mr-1 h-3 w-3" />,
    Lapsed: <AlertCircle className="mr-1 h-3 w-3" />,
  };

  return (
    <Badge className={`${styles[status]} text-sm px-3 py-1`}>
      {icons[status]}
      {status}
    </Badge>
  );
}

// --------------------------------------------------------------------------
// Loading Skeleton
// --------------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-8 w-[100px] rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Info Row Helper
// --------------------------------------------------------------------------

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium">{value || '--'}</div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Main Component
// --------------------------------------------------------------------------

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProvider();
  }, [id]);

  async function fetchProvider() {
    try {
      setLoading(true);
      const response = await fetch(`/api/ace/providers/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch provider');
      }

      setProvider(data.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!provider) return;
    setActionLoading('approve');
    try {
      const response = await fetch(`/api/ace/providers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await fetchProvider();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSuspend() {
    if (!provider) return;
    setActionLoading('suspend');
    try {
      const response = await fetch(`/api/ace/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: false,
          canPublishEvents: false,
          canIssueCertificates: false,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await fetchProvider();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRenew() {
    if (!provider) return;
    setActionLoading('renew');
    try {
      const response = await fetch('/api/ace/providers/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: id,
          payment_token: 'simulated_token',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await fetchProvider();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to renew');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-[120px] bg-white/20 mb-4" />
            <Skeleton className="h-8 w-[300px] bg-white/20" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/ace/providers')}
              className="mb-4 text-green-100 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Providers
            </Button>
            <h1 className="text-3xl font-bold">Provider Not Found</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!provider) return null;

  const status = getProviderStatus(provider);
  const expirationDays = daysUntil(provider.expirationDate);
  const coordCertDays = daysUntil(provider.coordinatorCertificationExpires);
  const isOrg = provider.providerType === 'organization';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/ace/providers')}
            className="mb-4 text-green-100 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Providers
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                  {isOrg ? (
                    <Building2 className="h-6 w-6" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {provider.providerName}
                  </h1>
                  <p className="mt-1 text-green-100">
                    {provider.bacbProviderNumber
                      ? `BACB Provider #${provider.bacbProviderNumber}`
                      : 'Provider number pending'}
                    {' | '}
                    <span className="capitalize">{provider.providerType}</span>{' '}
                    Provider
                  </p>
                </div>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Expiration Warning */}
        {expirationDays !== null && expirationDays <= 45 && expirationDays > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              Renewal Required Soon
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              This provider&#39;s authorization expires in {expirationDays}{' '}
              days ({formatDate(provider.expirationDate)}). Please renew to
              maintain active status.
            </AlertDescription>
          </Alert>
        )}

        {expirationDays !== null && expirationDays <= 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Provider Expired</AlertTitle>
            <AlertDescription>
              This provider&#39;s authorization expired on{' '}
              {formatDate(provider.expirationDate)}. Renewal with late fee is
              required to reactivate.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/ace/providers/${id}?edit=true`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Provider
          </Button>

          {status === 'Pending' && (
            <Button
              onClick={handleApprove}
              disabled={actionLoading === 'approve'}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {actionLoading === 'approve' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve Provider
            </Button>
          )}

          {status === 'Active' && (
            <>
              <Button
                variant="outline"
                onClick={handleSuspend}
                disabled={actionLoading === 'suspend'}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                {actionLoading === 'suspend' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="mr-2 h-4 w-4" />
                )}
                Suspend
              </Button>
              <Button
                onClick={handleRenew}
                disabled={actionLoading === 'renew'}
                className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030]"
              >
                {actionLoading === 'renew' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Renew Provider
              </Button>
            </>
          )}

          {status === 'Lapsed' && (
            <Button
              onClick={handleRenew}
              disabled={actionLoading === 'renew'}
              className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030]"
            >
              {actionLoading === 'renew' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Reinstate Provider
            </Button>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Provider Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#1F4D3F]" />
                      Provider Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                      <InfoRow
                        label="Provider Name"
                        value={provider.providerName}
                      />
                      <InfoRow
                        label="Provider Type"
                        value={
                          <span className="capitalize">
                            {provider.providerType}
                          </span>
                        }
                      />
                      <InfoRow
                        label="Email"
                        value={provider.primaryEmail}
                        icon={Mail}
                      />
                      <InfoRow
                        label="Phone"
                        value={provider.primaryPhone}
                        icon={Phone}
                      />
                      <InfoRow
                        label="Website"
                        value={
                          provider.website ? (
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1F4D3F] underline"
                            >
                              {provider.website}
                            </a>
                          ) : (
                            '--'
                          )
                        }
                        icon={Globe}
                      />
                      <InfoRow
                        label="BACB Provider Number"
                        value={
                          provider.bacbProviderNumber ? (
                            <span className="font-mono">
                              {provider.bacbProviderNumber}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Pending assignment
                            </span>
                          )
                        }
                        icon={Shield}
                      />
                    </div>

                    {/* Address */}
                    {provider.addressLine1 && (
                      <>
                        <Separator className="my-4" />
                        <InfoRow
                          label="Address"
                          value={
                            <>
                              {provider.addressLine1}
                              {provider.addressLine2 && (
                                <>
                                  <br />
                                  {provider.addressLine2}
                                </>
                              )}
                              <br />
                              {provider.city && `${provider.city}, `}
                              {provider.state} {provider.zipCode}
                              {provider.country && provider.country !== 'US'
                                ? `, ${provider.country}`
                                : ''}
                            </>
                          }
                          icon={MapPin}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Coordinator Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-[#1F4D3F]" />
                      ACE Coordinator
                    </CardTitle>
                    <CardDescription>
                      The designated coordinator overseeing all CE activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {provider.coordinator ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                          <InfoRow
                            label="Name"
                            value={`${provider.coordinator.firstName} ${provider.coordinator.lastName}`}
                          />
                          <InfoRow
                            label="Email"
                            value={provider.coordinator.email}
                            icon={Mail}
                          />
                          <InfoRow
                            label="BACB ID"
                            value={
                              provider.coordinator.bacbId ? (
                                <span className="font-mono">
                                  {provider.coordinator.bacbId}
                                </span>
                              ) : (
                                '--'
                              )
                            }
                          />
                          <InfoRow
                            label="Years Certified"
                            value={provider.coordinatorYearsCertified}
                          />
                        </div>

                        {/* Certification Countdown */}
                        {provider.coordinatorCertificationExpires && (
                          <>
                            <Separator />
                            <div className="rounded-lg bg-muted/50 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    Certification Status
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Expires:{' '}
                                    {formatDate(
                                      provider.coordinatorCertificationExpires
                                    )}
                                  </p>
                                </div>
                                {coordCertDays !== null && (
                                  <div className="text-right">
                                    <p
                                      className={`text-2xl font-bold ${
                                        coordCertDays <= 30
                                          ? 'text-red-600'
                                          : coordCertDays <= 90
                                            ? 'text-amber-600'
                                            : 'text-emerald-600'
                                      }`}
                                    >
                                      {coordCertDays > 0
                                        ? coordCertDays
                                        : 'Expired'}
                                    </p>
                                    {coordCertDays > 0 && (
                                      <p className="text-xs text-muted-foreground">
                                        days remaining
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {provider.coordinatorCertificationVerified && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Certification verified
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No coordinator information available.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Legal Entity Card (organizations only) */}
                {isOrg && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#1F4D3F]" />
                        Legal Entity Verification
                      </CardTitle>
                      <CardDescription>
                        Organization legal entity status and documentation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                          <InfoRow
                            label="EIN"
                            value={
                              provider.ein ? (
                                <span className="font-mono">
                                  {provider.ein}
                                </span>
                              ) : (
                                '--'
                              )
                            }
                          />
                          <InfoRow
                            label="Verification Status"
                            value={
                              provider.legalEntityVerified ? (
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <CheckCircle className="h-4 w-4" />
                                  Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-700">
                                  <Clock className="h-4 w-4" />
                                  Pending Verification
                                </span>
                              )
                            }
                          />
                          {provider.legalEntityVerifiedAt && (
                            <InfoRow
                              label="Verified On"
                              value={formatDate(provider.legalEntityVerifiedAt)}
                              icon={Calendar}
                            />
                          )}
                          <InfoRow
                            label="Incorporation Document"
                            value={
                              provider.incorporationDocUrl ? (
                                <a
                                  href={provider.incorporationDocUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1F4D3F] underline"
                                >
                                  View Document
                                </a>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  Not uploaded
                                </span>
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Leadership Attestation Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#1F4D3F]" />
                      Leadership Attestation
                    </CardTitle>
                    <CardDescription>
                      Attestation from organizational leadership
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                      <InfoRow
                        label="Attestor Name"
                        value={provider.leadershipName}
                      />
                      <InfoRow
                        label="Attestor Title"
                        value={provider.leadershipTitle}
                      />
                      <InfoRow
                        label="Attestation Date"
                        value={formatDate(provider.leadershipAttestationDate)}
                        icon={Calendar}
                      />
                      <InfoRow
                        label="Attestation Document"
                        value={
                          provider.leadershipAttestationUrl ? (
                            <a
                              href={provider.leadershipAttestationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1F4D3F] underline"
                            >
                              View Attestation
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not submitted
                            </span>
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Timeline Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-4 w-4 text-[#1F4D3F]" />
                      Key Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Applied</span>
                      <span className="font-medium">
                        {formatDate(provider.applicationDate)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-medium">
                        {formatDate(provider.approvalDate)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expires</span>
                      <span
                        className={`font-medium ${
                          expirationDays !== null && expirationDays <= 45
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {formatDate(provider.expirationDate)}
                      </span>
                    </div>
                    {expirationDays !== null && expirationDays > 0 && (
                      <>
                        <Separator />
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <p
                            className={`text-2xl font-bold ${
                              expirationDays <= 30
                                ? 'text-red-600'
                                : expirationDays <= 90
                                  ? 'text-amber-600'
                                  : 'text-[#1F4D3F]'
                            }`}
                          >
                            {expirationDays}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            days until expiration
                          </p>
                        </div>
                      </>
                    )}
                    {provider.lastRenewalDate && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last Renewal
                          </span>
                          <span className="font-medium">
                            {formatDate(provider.lastRenewalDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Capabilities Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-[#1F4D3F]" />
                      Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Publish Events</span>
                      {provider.canPublishEvents ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <Ban className="mr-1 h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span>Issue Certificates</span>
                      {provider.canIssueCertificates ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <Ban className="mr-1 h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-[#1F4D3F]" />
                      Record Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>ID</span>
                      <span className="font-mono truncate ml-2 max-w-[160px]">
                        {provider._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>{formatDate(provider.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated</span>
                      <span>{formatDate(provider.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="mt-6 space-y-6">
              {/* Coordinator Certification Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Coordinator Certification Compliance</CardTitle>
                  <CardDescription>
                    The ACE Coordinator must maintain active BCBA certification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Certification Verified
                        </p>
                        <div className="mt-2">
                          {provider.coordinatorCertificationVerified ? (
                            <CheckCircle className="mx-auto h-8 w-8 text-emerald-600" />
                          ) : (
                            <AlertCircle className="mx-auto h-8 w-8 text-amber-600" />
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Years Certified
                        </p>
                        <p className="mt-2 text-2xl font-bold text-[#1F4D3F]">
                          {provider.coordinatorYearsCertified}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Days Until Cert Expiry
                        </p>
                        <p
                          className={`mt-2 text-2xl font-bold ${
                            coordCertDays !== null && coordCertDays <= 30
                              ? 'text-red-600'
                              : coordCertDays !== null && coordCertDays <= 90
                                ? 'text-amber-600'
                                : 'text-[#1F4D3F]'
                          }`}
                        >
                          {coordCertDays !== null
                            ? coordCertDays > 0
                              ? coordCertDays
                              : 'Expired'
                            : '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Entity Compliance (orgs) */}
              {isOrg && (
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Entity Compliance</CardTitle>
                    <CardDescription>
                      Organization providers must maintain verified legal entity
                      status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        {provider.legalEntityVerified ? (
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-amber-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {provider.legalEntityVerified
                              ? 'Legal entity verified'
                              : 'Legal entity verification pending'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {provider.legalEntityVerified
                              ? `Verified on ${formatDate(provider.legalEntityVerifiedAt)}`
                              : 'Documentation submitted, awaiting review'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        {provider.ein ? (
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            EIN: {provider.ein || 'Not provided'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Employer Identification Number
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        {provider.incorporationDocUrl ? (
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-amber-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            Incorporation Document
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {provider.incorporationDocUrl
                              ? 'Document uploaded'
                              : 'Document not yet uploaded'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Leadership Attestation Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Attestation Compliance</CardTitle>
                  <CardDescription>
                    Leadership attestation status and renewal tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      {provider.leadershipAttestationDate ? (
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {provider.leadershipAttestationDate
                            ? 'Attestation on file'
                            : 'Attestation not yet submitted'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {provider.leadershipName
                            ? `Attested by ${provider.leadershipName}${provider.leadershipTitle ? `, ${provider.leadershipTitle}` : ''}`
                            : 'No attestor information available'}
                        </p>
                        {provider.leadershipAttestationDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Date:{' '}
                            {formatDate(provider.leadershipAttestationDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <div className="mt-6 space-y-6">
              {/* Fee Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#1F4D3F]" />
                    Fees & Payments
                  </CardTitle>
                  <CardDescription>
                    Application fees, renewal fees, and payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Application Fee */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Application Fee</p>
                          <p className="text-sm text-muted-foreground">
                            One-time provider application fee
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {formatCurrency(
                              provider.applicationFeeAmount || 400
                            )}
                          </p>
                          {provider.applicationFeePaid ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="mr-1 h-3 w-3" />
                              Unpaid
                            </Badge>
                          )}
                        </div>
                      </div>
                      {provider.applicationFeePaidDate && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Paid on {formatDate(provider.applicationFeePaidDate)}
                        </p>
                      )}
                    </div>

                    {/* Renewal Fee */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Renewal Fee</p>
                          <p className="text-sm text-muted-foreground">
                            Annual provider renewal
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">$400.00</p>
                          {provider.renewalFeePaid ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Current
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="mr-1 h-3 w-3" />
                              Due
                            </Badge>
                          )}
                        </div>
                      </div>
                      {provider.lastRenewalDate && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Last renewed: {formatDate(provider.lastRenewalDate)}
                        </p>
                      )}
                      {provider.nextRenewalDate && (
                        <p className="text-xs text-muted-foreground">
                          Next renewal due:{' '}
                          {formatDate(provider.nextRenewalDate)}
                        </p>
                      )}
                    </div>

                    {/* Late Fee (if applicable) */}
                    {(provider.lateFeePaid ||
                      provider.lateFeeAmount) && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-800">
                              Late Fee
                            </p>
                            <p className="text-sm text-red-600">
                              Applied for past-due renewal
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-800">
                              {formatCurrency(provider.lateFeeAmount || 50)}
                            </p>
                            {provider.lateFeePaid ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Outstanding
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Renewal Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-[#1F4D3F]" />
                    Renewal
                  </CardTitle>
                  <CardDescription>
                    Provider renewal status and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Current Period Expires
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#1F4D3F]">
                          {formatDate(provider.expirationDate)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Days Remaining
                        </p>
                        <p
                          className={`mt-1 text-2xl font-bold ${
                            expirationDays !== null && expirationDays <= 30
                              ? 'text-red-600'
                              : expirationDays !== null &&
                                  expirationDays <= 90
                                ? 'text-amber-600'
                                : 'text-[#1F4D3F]'
                          }`}
                        >
                          {expirationDays !== null
                            ? expirationDays > 0
                              ? expirationDays
                              : 'Expired'
                            : '--'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Grace Period Ends
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          {formatDate(provider.gracePeriodEndDate)}
                        </p>
                      </div>
                    </div>

                    {status === 'Active' && (
                      <Button
                        onClick={handleRenew}
                        disabled={actionLoading === 'renew'}
                        className="w-full bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] h-12 text-base"
                      >
                        {actionLoading === 'renew' ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-5 w-5" />
                        )}
                        Renew Provider - $400.00
                      </Button>
                    )}

                    {status === 'Lapsed' && (
                      <Button
                        onClick={handleRenew}
                        disabled={actionLoading === 'renew'}
                        className="w-full bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] h-12 text-base"
                      >
                        {actionLoading === 'renew' ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-5 w-5" />
                        )}
                        Reinstate Provider - $450.00 (includes late fee)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
