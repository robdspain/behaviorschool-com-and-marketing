import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import { CheckCircle, XCircle, Award, Calendar, User, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ certificateNumber: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certificateNumber } = await params;
  return {
    title: `Verify Certificate ${certificateNumber} | Behavior School`,
    description: 'Verify the authenticity of a BACB-approved continuing education certificate from Behavior School.',
  };
}

async function getCertificate(certificateNumber: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_certificates')
    .select(`
      *,
      event:ace_events (
        id,
        title,
        modality,
        ce_category
      )
    `)
    .eq('certificate_number', certificateNumber)
    .eq('status', 'issued')
    .single();

  if (error) return null;
  return data;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certificateNumber } = await params;
  const certificate = await getCertificate(certificateNumber);

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

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Certificate Not Found
            </h1>
            <p className="text-slate-600 mb-4">
              The certificate number <span className="font-mono font-semibold">{certificateNumber}</span> was not found in our records.
            </p>
            <p className="text-sm text-slate-500">
              This could mean the certificate number was entered incorrectly, or the certificate has been revoked.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Verification Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Certificate Verified</span>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-8 text-center text-white">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-75" />
            <h1 className="text-2xl font-bold">Certificate of Completion</h1>
            <p className="text-emerald-100 mt-1">Continuing Education</p>
          </div>

          {/* Certificate Details */}
          <div className="p-8">
            <div className="mb-8">
              <p className="text-sm text-slate-500 text-center mb-1">Certificate Number</p>
              <p className="text-lg font-mono font-semibold text-slate-900 text-center">
                {certificate.certificate_number}
              </p>
            </div>

            <div className="space-y-6">
              {/* Participant */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Awarded To</p>
                  <p className="font-semibold text-slate-900">
                    {certificate.participant_name}
                  </p>
                  {certificate.participant_bacb_id && (
                    <p className="text-sm text-slate-600">
                      BACB #{certificate.participant_bacb_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Event */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Event</p>
                  <p className="font-semibold text-slate-900">
                    {certificate.event_title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {certificate.total_ceus} CEUs • {formatCategory(certificate.ce_category)} Category
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Event Date</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(certificate.event_date)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Issued: {certificate.issued_at ? formatDate(certificate.issued_at) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Provider */}
              <div className="border-t pt-6">
                <p className="text-sm text-slate-500 text-center mb-1">ACE Provider</p>
                <p className="text-center font-semibold text-slate-900">
                  {certificate.provider_name}
                </p>
                {certificate.provider_number && (
                  <p className="text-sm text-slate-600 text-center">
                    Provider #{certificate.provider_number}
                  </p>
                )}
              </div>

              {/* Instructor */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-slate-500 mb-1">Instructor</p>
                <p className="font-medium text-slate-900">
                  {certificate.instructor_name}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 text-center text-sm text-slate-600">
            This certificate is valid for BACB continuing education documentation purposes.
          </div>
        </Card>

        {/* Verification Note */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            This verification page confirms the authenticity of the above certificate.
          </p>
          <p className="mt-1">
            If you have questions, contact{' '}
            <a href="mailto:support@behaviorschool.com" className="text-emerald-600 hover:underline">
              support@behaviorschool.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
