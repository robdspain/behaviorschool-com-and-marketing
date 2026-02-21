'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participant_id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState<{ title: string } | null>(null);

  const [formData, setFormData] = useState({
    overallRating: 0,
    instructorRating: 0,
    contentRating: 0,
    relevanceRating: 0,
    comments: '',
    suggestions: '',
    wouldRecommend: true,
    applicationPlan: '',
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/ace/events/${eventId}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      }
    } catch (err) {
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/ace/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500 self-center">
          {value > 0 ? `${value}/5` : 'Click to rate'}
        </span>
      </div>
    </div>
  );

  if (!participantId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-600 mb-6">
            Please access this feedback form from your event confirmation email.
          </p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-600 mb-6">
            Your feedback has been submitted successfully.
            Your certificate is now available for download.
          </p>
          <Link href={`/events/${eventId}/certificate?participant_id=${participantId}`}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-3">
              Get Your Certificate
            </Button>
          </Link>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline" className="w-full">
              Back to Event
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Event Feedback
            </h1>
            {event && (
              <p className="text-slate-600">{event.title}</p>
            )}
            <p className="text-sm text-slate-500 mt-2">
              Your feedback helps us improve our continuing education offerings.
              This form must be completed to receive your certificate.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <StarRating
              label="Overall Event Rating *"
              value={formData.overallRating}
              onChange={(val) => setFormData({ ...formData, overallRating: val })}
            />

            <StarRating
              label="Instructor Effectiveness *"
              value={formData.instructorRating}
              onChange={(val) => setFormData({ ...formData, instructorRating: val })}
            />

            <StarRating
              label="Content Quality *"
              value={formData.contentRating}
              onChange={(val) => setFormData({ ...formData, contentRating: val })}
            />

            <StarRating
              label="Relevance to Your Practice *"
              value={formData.relevanceRating}
              onChange={(val) => setFormData({ ...formData, relevanceRating: val })}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How do you plan to apply what you learned? *
              </label>
              <textarea
                required
                rows={3}
                value={formData.applicationPlan}
                onChange={(e) => setFormData({ ...formData, applicationPlan: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe how you will apply these concepts in your work..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Share any thoughts about the event..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Suggestions for Improvement (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.suggestions}
                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="How could we improve this event?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Would you recommend this event to colleagues?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recommend"
                    checked={formData.wouldRecommend}
                    onChange={() => setFormData({ ...formData, wouldRecommend: true })}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recommend"
                    checked={!formData.wouldRecommend}
                    onChange={() => setFormData({ ...formData, wouldRecommend: false })}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={
                  submitting ||
                  !formData.overallRating ||
                  !formData.instructorRating ||
                  !formData.contentRating ||
                  !formData.relevanceRating ||
                  !formData.applicationPlan
                }
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback & Get Certificate'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-4 text-center">
          <Link
            href={`/events/${eventId}`}
            className="text-slate-600 hover:text-emerald-600"
          >
            ← Back to Event
          </Link>
        </div>
      </div>
    </div>
  );
}
