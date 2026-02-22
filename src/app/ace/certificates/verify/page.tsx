'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface VerificationResult {
  valid: boolean;
  message?: string;
  certificate?: {
    number: string;
    participantName: string;
    eventTitle: string;
    eventDate: string;
    totalCeus: number;
    ceCategory: string;
    providerName?: string;
    issuedAt?: number;
    participantBacbId?: string;
  };
  status?: 'issued' | 'revoked';
}

export default function CertificateVerifyPage() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Check for URL parameter on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const number = params.get('number');
      if (number) {
        setCertificateNumber(number);
        handleVerify(number);
      }
    }
  });

  async function handleVerify(number?: string) {
    const certNumber = number || certificateNumber.trim();
    if (!certNumber) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/ace/certificates?number=${encodeURIComponent(certNumber)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      const certificates = data.data || [];

      if (certificates.length === 0) {
        setResult({
          valid: false,
          message: 'No certificate found with this number.',
        });
        return;
      }

      const cert = certificates[0];

      setResult({
        valid: cert.status !== 'revoked',
        certificate: {
          number: cert.certificateNumber || cert.certificate_number,
          participantName: cert.participantName || cert.participant_name,
          eventTitle: cert.eventTitle || cert.event_title,
          eventDate: cert.eventDate || cert.event_date,
          totalCeus: cert.totalCeus || cert.total_ceus,
          ceCategory: cert.ceCategory || cert.ce_category,
          providerName: cert.providerName || cert.provider_name,
          issuedAt: cert.issuedAt || cert.issued_at,
          participantBacbId:
            cert.participantBacbId || cert.participant_bacb_id,
        },
        status: cert.status,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to verify certificate'
      );
    } finally {
      setLoading(false);
    }
  }

  function maskBacbId(bacbId?: string): string {
    if (!bacbId) return '';
    if (bacbId.length <= 4) return '****';
    return '****' + bacbId.slice(-4);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F4D3F] to-[#163829]">
      {/* Header */}
      <div className="pt-12 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]">
            <Shield className="h-7 w-7 text-[#D4AF37]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Certificate Verification
        </h1>
        <p className="mt-2 text-green-200 max-w-lg mx-auto">
          Verify the authenticity of a Behavior School continuing education
          certificate
        </p>
      </div>

      <div className="mx-auto max-w-xl px-4 pb-16">
        {/* Search Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Certificate Number
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Award className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={certificateNumber}
                      onChange={(e) =>
                        setCertificateNumber(e.target.value.toUpperCase())
                      }
                      placeholder="e.g., CE-2026-123456"
                      className="pl-11 h-12 text-lg font-mono"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerify();
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => handleVerify()}
                    disabled={!certificateNumber.trim() || loading}
                    className="h-12 px-6 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Enter the certificate number found on the bottom of your
                  certificate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {searched && result && (
          <Card className="mt-6 shadow-xl border-0 overflow-hidden">
            {/* Status Header */}
            <div
              className={`p-6 ${
                result.valid
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    result.valid ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                >
                  {result.valid ? (
                    <CheckCircle className="h-7 w-7" />
                  ) : (
                    <XCircle className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {result.valid
                      ? 'Valid Certificate'
                      : result.status === 'revoked'
                        ? 'Certificate Revoked'
                        : 'Certificate Not Found'}
                  </h2>
                  <p className="text-sm opacity-90">
                    {result.valid
                      ? 'This certificate has been verified as authentic.'
                      : result.status === 'revoked'
                        ? 'This certificate has been revoked and is no longer valid.'
                        : result.message || 'No certificate matches this number.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            {result.certificate && (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-[#1F4D3F]">
                      Certificate Details
                    </h3>
                    <Badge
                      className={
                        result.valid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {result.valid ? 'Valid' : 'Revoked'}
                    </Badge>
                  </div>

                  <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        Participant
                      </span>
                      <span className="text-sm font-medium">
                        {result.certificate.participantName}
                        {result.certificate.participantBacbId && (
                          <span className="ml-2 text-muted-foreground font-mono text-xs">
                            (BACB: {maskBacbId(result.certificate.participantBacbId)})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        Event
                      </span>
                      <span className="text-sm font-medium text-right max-w-[60%]">
                        {result.certificate.eventTitle}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        CEUs Earned
                      </span>
                      <span className="text-sm font-bold text-[#1F4D3F]">
                        {result.certificate.totalCeus.toFixed(1)} CEUs
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {result.certificate.ceCategory}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        Event Date
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          result.certificate.eventDate
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {result.certificate.issuedAt && (
                      <div className="flex justify-between p-3">
                        <span className="text-sm text-muted-foreground">
                          Issue Date
                        </span>
                        <span className="text-sm font-medium">
                          {new Date(
                            result.certificate.issuedAt
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-muted-foreground">
                        Provider
                      </span>
                      <span className="text-sm font-medium">
                        {result.certificate.providerName || 'Behavior School'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-green-200">
            Powered by{' '}
            <span className="font-semibold text-[#D4AF37]">
              Behavior School
            </span>
          </p>
          <p className="mt-1 text-xs text-green-300/70">
            ACE Approved Continuing Education Provider
          </p>
        </div>
      </div>
    </div>
  );
}
