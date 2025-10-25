'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CertificateIssuerProps {
  eventId: string;
  participantId: string;
  participantName: string;
  onIssued?: () => void;
}

interface Eligibility {
  eligible: boolean;
  reasons: string[];
  requirements: {
    registered: boolean;
    quizPassed: boolean;
    attendanceVerified: boolean;
    feedbackSubmitted: boolean;
  };
}

export function CertificateIssuer({
  eventId,
  participantId,
  participantName,
  onIssued
}: CertificateIssuerProps) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const checkEligibility = async () => {
    setChecking(true);
    setError('');

    try {
      const response = await fetch(
        `/api/ace/certificates/eligibility?event_id=${eventId}&participant_id=${participantId}`
      );
      const data = await response.json();

      if (data.success) {
        setEligibility(data.data);
      } else {
        setError(data.error || 'Failed to check eligibility');
      }
    } catch (err) {
      setError('Failed to check eligibility');
    } finally {
      setChecking(false);
    }
  };

  const issueCertificate = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/ace/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        if (onIssued) {
          onIssued();
        }
      } else {
        setError(data.error || 'Failed to issue certificate');
      }
    } catch (err) {
      setError('Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Check Eligibility Button */}
      {!eligibility && (
        <Button
          variant="outline"
          size="sm"
          onClick={checkEligibility}
          disabled={checking}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          {checking ? 'Checking...' : 'Check Eligibility'}
        </Button>
      )}

      {/* Eligibility Results */}
      {eligibility && (
        <div className={`p-4 rounded-lg border ${
          eligibility.eligible
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {eligibility.eligible ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className={`font-semibold ${
                eligibility.eligible ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {eligibility.eligible
                  ? 'Eligible for Certificate'
                  : 'Not Yet Eligible'}
              </h4>

              {/* Requirements Checklist */}
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  {eligibility.requirements.registered ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>Registered for event</span>
                </li>
                <li className="flex items-center gap-2">
                  {eligibility.requirements.quizPassed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>Quiz passed (if required)</span>
                </li>
                <li className="flex items-center gap-2">
                  {eligibility.requirements.attendanceVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>Attendance verified (if required)</span>
                </li>
                <li className="flex items-center gap-2">
                  {eligibility.requirements.feedbackSubmitted ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-gray-600">Feedback submitted (optional)</span>
                </li>
              </ul>

              {/* Reasons if not eligible */}
              {!eligibility.eligible && eligibility.reasons.length > 0 && (
                <div className="mt-3 text-sm text-yellow-800">
                  <strong>Reasons:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {eligibility.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Issue Certificate Button */}
              {eligibility.eligible && !success && (
                <Button
                  onClick={issueCertificate}
                  disabled={loading}
                  className="mt-3"
                  size="sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  {loading ? 'Issuing...' : 'Issue Certificate'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 text-green-900">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold">Certificate Issued!</p>
              <p className="text-sm text-green-700">
                Certificate has been successfully issued to {participantName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 text-red-900">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
