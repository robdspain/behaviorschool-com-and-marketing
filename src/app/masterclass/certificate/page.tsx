'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Loader2, MailCheck, MailWarning, Trophy } from 'lucide-react';

interface CertificateData {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  completionDate: string;
  ceuCredits: number;
  downloadPath: string;
  emailSent: boolean;
}

export default function MasterclassCertificatePage() {
  const router = useRouter();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('masterclass_enrollment');

    if (!stored) {
      router.push('/masterclass');
      setIsLoading(false);
      return;
    }

    try {
      const data = JSON.parse(stored);
      setStudentEmail(data.email);
      const enrollmentId = data.enrollmentId;

      const fetchCertificate = async () => {
        try {
          const response = await fetch(`/api/masterclass/certificate?enrollmentId=${enrollmentId}`);
          const payload = await response.json();

          if (!payload.success) {
            throw new Error(payload.error || 'Failed to load certificate');
          }

          setCertificate(payload.data as CertificateData);
        } catch (err) {
          console.error('Failed to fetch certificate:', err);
          setError(err instanceof Error ? err.message : 'Unable to load certificate');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCertificate();
    } catch (err) {
      console.error('Invalid enrollment data:', err);
      router.push('/masterclass');
      setIsLoading(false);
    }
  }, [router]);

  const handleDownload = () => {
    if (!certificate) return;
    window.open(certificate.downloadPath, '_blank', 'noopener');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Preparing your certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <MailWarning className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate Unavailable</h1>
          <p className="text-slate-600 mb-6">{error || 'We could not generate your certificate right now. Please try again or contact support.'}</p>
          <Button onClick={() => router.push('/masterclass/course')} variant="outline">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(`${certificate.completionDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Congratulations</p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2 flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Certificate Ready
              </h1>
              <p className="mt-3 text-emerald-50 text-lg">
                {certificate.recipientName}, you&apos;ve successfully completed the masterclass and earned {certificate.ceuCredits} CEU credit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDownload} className="bg-white text-emerald-600 hover:bg-emerald-50" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="secondary" onClick={() => router.push('/masterclass/course')} size="lg">
                Back to Course
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Certificate Details</p>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-slate-500">Course</p>
                <p className="text-lg font-semibold text-slate-900">{certificate.courseTitle}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Completion Date</p>
                <p className="text-lg font-semibold text-slate-900">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Certificate ID</p>
                <p className="text-lg font-mono text-slate-900">{certificate.certificateId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Email Delivery</p>
            {certificate.emailSent ? (
              <div className="flex items-start gap-3">
                <MailCheck className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <p className="text-slate-900 font-semibold">Certificate emailed</p>
                  <p className="text-slate-600 text-sm">
                    We sent a PDF copy to <span className="font-medium">{studentEmail}</span>. Check your inbox or download again anytime.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <MailWarning className="w-5 h-5 text-amber-500 mt-1" />
                <div>
                  <p className="text-slate-900 font-semibold">Download available</p>
                  <p className="text-slate-600 text-sm">
                    We couldn&apos;t send the email automatically. Use the download button above and contact support if you need help.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
