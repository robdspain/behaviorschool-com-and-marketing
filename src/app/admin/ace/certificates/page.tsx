'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, XCircle, FileText, Award } from 'lucide-react';
import type { AceCertificate } from '@/lib/ace/types';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<AceCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/ace/certificates');
      const data = await response.json();
      if (data.success) {
        setCertificates(data.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (certificateId: string) => {
    // Open certificate HTML in new window for download/print
    window.open(`/api/ace/certificates/${certificateId}/html`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
            <p className="text-slate-600 mt-1">Manage and download CE certificates</p>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Award className="w-5 h-5" />
            <span className="font-medium">{certificates.length} Total Issued</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Issued This Month</p>
                <p className="text-2xl font-bold text-slate-900">
                  {certificates.filter(c => {
                    if (!c.issued_at) return false;
                    const issued = new Date(c.issued_at);
                    const now = new Date();
                    return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total CEUs Issued</p>
                <p className="text-2xl font-bold text-slate-900">
                  {certificates.reduce((sum, cert) => sum + cert.total_ceus, 0).toFixed(1)}
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unique Participants</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(certificates.map(c => c.participant_id)).size}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <Card className="p-12 text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No certificates issued yet</h3>
            <p className="text-slate-600">Certificates will appear here once participants complete events.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {certificate.participant_name}
                      </h3>
                      <Badge variant={certificate.status === 'issued' ? 'default' : 'secondary'}>
                        {certificate.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-slate-600">Event</p>
                        <p className="font-medium text-slate-900">{certificate.event_title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Certificate #</p>
                        <p className="font-medium text-slate-900 font-mono text-sm">
                          {certificate.certificate_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">CEUs</p>
                        <p className="font-medium text-slate-900">{certificate.total_ceus} CEUs</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Issued</p>
                        <p className="font-medium text-slate-900">
                          {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {certificate.participant_bacb_id && (
                      <div className="mt-3 text-sm text-slate-600">
                        BACB #: {certificate.participant_bacb_id}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCertificate(certificate.id)}
                    className="ml-4"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
