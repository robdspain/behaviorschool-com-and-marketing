'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, Printer, AlertCircle, CheckCircle, Award, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AceCertificate } from '@/lib/ace/types';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participant_id');

  const [certificate, setCertificate] = useState<AceCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (participantId) {
      checkCertificate();
    }
  }, [eventId, participantId]);

  const checkCertificate = async () => {
    setLoading(true);
    try {
      // Check eligibility first
      const eligibilityRes = await fetch(
        `/api/ace/certificates/eligibility?event_id=${eventId}&participant_id=${participantId}`
      );
      const eligibilityData = await eligibilityRes.json();

      if (!eligibilityData.eligible) {
        setError(`Not eligible for certificate: ${eligibilityData.reasons.join(', ')}`);
        return;
      }

      // Try to get existing certificate or generate one
      const certRes = await fetch('/api/ace/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
        }),
      });

      const certData = await certRes.json();

      if (certData.success) {
        setCertificate(certData.data);
      } else if (certData.error?.includes('already issued')) {
        // Fetch existing certificate
        const existingRes = await fetch(
          `/api/ace/certificates?participant_id=${participantId}&event_id=${eventId}`
        );
        const existingData = await existingRes.json();
        if (existingData.data?.[0]) {
          setCertificate(existingData.data[0]);
        }
      } else {
        setError(certData.error || 'Failed to generate certificate');
      }
    } catch (err) {
      setError('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!certificate) return;
    window.open(`/api/ace/certificates/${certificate.id}/html`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Certificate Not Available</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!participantId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-600 mb-6">
            Please access this page from your event confirmation email or participant dashboard.
          </p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Certificate Found</h2>
          <p className="text-slate-600 mb-6">
            Please complete all requirements to receive your certificate.
          </p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Certificate Issued!
          </h1>
          <p className="text-lg text-slate-600">
            Congratulations on completing your continuing education.
          </p>
        </div>

        {/* Certificate Preview Card */}
        <Card className="overflow-hidden mb-8">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-8 text-center text-white">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-75" />
            <h2 className="text-2xl font-bold">Certificate of Completion</h2>
            <p className="text-emerald-100 mt-1">Continuing Education</p>
          </div>

          {/* Certificate Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-slate-500 mb-2">This certifies that</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {certificate.participant_name}
              </p>
              {certificate.participant_bacb_id && (
                <p className="text-slate-600">
                  BACB #{certificate.participant_bacb_id}
                </p>
              )}
            </div>

            <div className="text-center mb-8">
              <p className="text-slate-500 mb-2">has successfully completed</p>
              <p className="text-xl font-semibold text-slate-900 mb-4">
                {certificate.event_title}
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 rounded-lg">
                <span className="text-3xl font-bold text-emerald-700">
                  {certificate.total_ceus}
                </span>
                <span className="text-emerald-700 font-medium">
                  CEUs • {formatCategory(certificate.ce_category)}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Event Date</p>
                <p className="font-medium text-slate-900">
                  {formatDate(certificate.event_date)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Issued Date</p>
                <p className="font-medium text-slate-900">
                  {certificate.issued_at ? formatDate(certificate.issued_at) : 'Today'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Instructor</p>
                <p className="font-medium text-slate-900">
                  {certificate.instructor_name}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Certificate Number</p>
                <p className="font-mono font-medium text-slate-900">
                  {certificate.certificate_number}
                </p>
              </div>
            </div>

            {/* Provider Info */}
            <div className="text-center border-t pt-6">
              <p className="text-slate-500 text-sm mb-1">ACE Provider</p>
              <p className="font-medium text-slate-900">
                {certificate.provider_name}
              </p>
              {certificate.provider_number && (
                <p className="text-sm text-slate-500">
                  Provider #{certificate.provider_number}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePrint}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Certificate
          </Button>
          <Link href={`/api/ace/certificates/${certificate.id}/html`} target="_blank">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Full Certificate
            </Button>
          </Link>
        </div>

        {/* Verification Notice */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            This certificate may be used for BACB continuing education documentation.
          </p>
          <p className="mt-1">
            Verify at: behaviorschool.com/verify/{certificate.certificate_number}
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/events/${eventId}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Event
          </Link>
        </div>
      </div>
    </div>
  );
}
