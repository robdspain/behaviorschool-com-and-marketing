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
  Award,
  ArrowLeft,
  Download,
  Mail,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Eye,
  Copy,
} from 'lucide-react';
import {
  generateCertificateHTML,
  downloadCertificatePDF,
  previewCertificate,
} from '@/lib/ace/certificate-generator';
import type { CertificateData } from '@/lib/ace/certificate-generator';

interface CertificateDetail {
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
  revokedBy?: string;
  revocationReason?: string;
  createdAt: number;
}

function StatusBadge({
  status,
}: {
  status: 'pending' | 'issued' | 'revoked';
}) {
  const config: Record<
    string,
    { bg: string; icon: React.ReactNode; label: string }
  > = {
    pending: {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Pending',
    },
    issued: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: 'Issued',
    },
    revoked: {
      bg: 'bg-red-100 text-red-800 border-red-200',
      icon: <XCircle className="mr-1 h-3 w-3" />,
      label: 'Revoked',
    },
  };

  const c = config[status];

  return (
    <Badge className={`${c.bg} text-sm px-3 py-1`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [certificate, setCertificate] = useState<CertificateDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        setLoading(true);
        const response = await fetch(`/api/ace/certificates/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch certificate');
        }

        setCertificate(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const getCertificateData = (): CertificateData | null => {
    if (!certificate) return null;
    return {
      certificateNumber: certificate.certificateNumber,
      participantName: certificate.participantName,
      participantEmail: certificate.participantEmail,
      bacbNumber: certificate.participantBacbId,
      eventTitle: certificate.eventTitle,
      eventDate: certificate.eventDate,
      instructorName: certificate.instructorName,
      instructorCredentials: 'Board Certified Behavior Analyst',
      totalCeus: certificate.totalCeus,
      ceCategory:
        certificate.ceCategory.charAt(0).toUpperCase() +
        certificate.ceCategory.slice(1),
      providerName: certificate.providerName || 'Behavior School',
      providerNumber: certificate.providerNumber,
      issuedDate: certificate.issuedAt
        ? new Date(certificate.issuedAt).toISOString()
        : new Date().toISOString(),
    };
  };

  const handlePreview = () => {
    const data = getCertificateData();
    if (!data) return;
    const html = generateCertificateHTML(data);
    previewCertificate(html);
  };

  const handleDownload = () => {
    const data = getCertificateData();
    if (!data) return;
    const html = generateCertificateHTML(data);
    downloadCertificatePDF(
      html,
      `certificate-${certificate?.certificateNumber}.pdf`
    );
  };

  const handleRevoke = async () => {
    if (!revokeReason.trim()) return;
    setRevoking(true);

    try {
      const response = await fetch(`/api/ace/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revoke',
          reason: revokeReason,
          revokedBy: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke certificate');
      }

      // Refresh certificate data
      setCertificate((prev) =>
        prev
          ? {
              ...prev,
              status: 'revoked',
              revokedAt: Date.now(),
              revocationReason: revokeReason,
            }
          : null
      );
      setRevokeDialogOpen(false);
      setRevokeReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke');
    } finally {
      setRevoking(false);
    }
  };

  const handleResendEmail = () => {
    // Placeholder for email resend
    alert(
      `Resend certificate email to ${certificate?.participantEmail} - This would trigger an email send.`
    );
  };

  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/ace/certificates/verify?number=${certificate?.certificateNumber}`
      : '';

  const handleCopyVerificationUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
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

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-lg font-semibold mb-2">
              Certificate Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The certificate could not be loaded.'}
            </p>
            <Button
              onClick={() => router.push('/ace/certificates')}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Certificates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const eventDate = new Date(certificate.eventDate);
  const issuedDate = certificate.issuedAt
    ? new Date(certificate.issuedAt)
    : null;
  const daysSinceEvent = Math.floor(
    (Date.now() - eventDate.getTime()) / (24 * 60 * 60 * 1000)
  );
  const daysToIssue =
    issuedDate
      ? Math.floor(
          (issuedDate.getTime() - eventDate.getTime()) / (24 * 60 * 60 * 1000)
        )
      : null;

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
                onClick={() => router.push('/ace/certificates')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  <Award className="h-7 w-7" />
                  Certificate {certificate.certificateNumber}
                </h1>
                <p className="mt-1 text-green-100">
                  {certificate.participantName}
                </p>
              </div>
            </div>
            <StatusBadge status={certificate.status} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Certificate Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-[#1F4D3F]" />
                Certificate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Certificate Number
                  </p>
                  <p className="font-mono font-semibold">
                    {certificate.certificateNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={certificate.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Participant Name
                  </p>
                  <p className="font-medium">{certificate.participantName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Participant Email
                  </p>
                  <p className="text-sm">{certificate.participantEmail}</p>
                </div>
                {certificate.participantBacbId && (
                  <div>
                    <p className="text-sm text-muted-foreground">BACB ID</p>
                    <p className="font-mono">
                      {certificate.participantBacbId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Event</p>
                  <p className="font-medium">{certificate.eventTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p>
                    {eventDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p>{certificate.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CEUs Earned</p>
                  <p className="text-lg font-bold text-[#1F4D3F]">
                    {certificate.totalCeus.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{certificate.ceCategory}</p>
                </div>
                {certificate.providerName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p>{certificate.providerName}</p>
                  </div>
                )}
                {certificate.providerNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Provider Number
                    </p>
                    <p className="font-mono">{certificate.providerNumber}</p>
                  </div>
                )}
              </div>

              {/* Revocation info */}
              {certificate.status === 'revoked' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Certificate Revoked
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-red-800">
                    <p>
                      <strong>Revoked:</strong>{' '}
                      {certificate.revokedAt
                        ? new Date(certificate.revokedAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'Unknown'}
                    </p>
                    {certificate.revocationReason && (
                      <p>
                        <strong>Reason:</strong>{' '}
                        {certificate.revocationReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issuance Timeline & Actions */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#1F4D3F]" />
                  Issuance Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Event completion */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Event Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {eventDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Connecting line */}
                  <div className="ml-4 border-l-2 border-gray-200 h-4" />

                  {/* Issued date */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        issuedDate
                          ? 'bg-emerald-100'
                          : daysSinceEvent > 45
                            ? 'bg-red-100'
                            : 'bg-amber-100'
                      }`}
                    >
                      {issuedDate ? (
                        <CheckCircle className="h-4 w-4 text-emerald-700" />
                      ) : daysSinceEvent > 45 ? (
                        <AlertTriangle className="h-4 w-4 text-red-700" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {issuedDate
                          ? 'Certificate Issued'
                          : 'Pending Issuance'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {issuedDate
                          ? issuedDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : `${daysSinceEvent} days since event`}
                      </p>
                    </div>
                    {daysToIssue !== null && (
                      <Badge
                        className={
                          daysToIssue <= 45
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {daysToIssue}d to issue
                      </Badge>
                    )}
                  </div>

                  {/* 45-day compliance */}
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
                    <p className="text-sm font-medium text-gray-700">
                      45-Day Compliance Deadline
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        eventDate.getTime() + 45 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {!issuedDate && daysSinceEvent > 45 && (
                      <p className="mt-1 text-xs text-red-700 font-semibold">
                        OVERDUE by {daysSinceEvent - 45} days
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handlePreview}
                  className="w-full bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Certificate
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  disabled={certificate.status === 'revoked'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Email
                </Button>
                {certificate.status !== 'revoked' && (
                  <Button
                    onClick={() => setRevokeDialogOpen(true)}
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Revoke Certificate
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Verification URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-[#1F4D3F]" />
                  Verification URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-gray-100 p-2 rounded border overflow-hidden text-ellipsis">
                    {verificationUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyVerificationUrl}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Copied to clipboard
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certificate Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#1F4D3F]" />
              Certificate Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <div
                className="w-full"
                style={{ aspectRatio: '11/8.5' }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const data = getCertificateData();
                    if (!data) return '<p>No certificate data available</p>';
                    const html = generateCertificateHTML(data);
                    // Extract just the body content for inline preview
                    const bodyMatch = html.match(
                      /<body[^>]*>([\s\S]*)<\/body>/
                    );
                    const styleMatch = html.match(
                      /<style[^>]*>([\s\S]*?)<\/style>/
                    );
                    return `<style>${styleMatch?.[1] || ''} body { width: 100%; height: 100%; }</style>${bodyMatch?.[1] || ''}`;
                  })(),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Revoke Certificate
            </DialogTitle>
            <DialogDescription>
              This action will permanently revoke certificate{' '}
              <strong>{certificate.certificateNumber}</strong> for{' '}
              <strong>{certificate.participantName}</strong>. The certificate
              will be marked as invalid in the verification system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Revocation Reason *</label>
              <Textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Enter the reason for revoking this certificate..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRevoke}
              disabled={!revokeReason.trim() || revoking}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {revoking ? 'Revoking...' : 'Revoke Certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
