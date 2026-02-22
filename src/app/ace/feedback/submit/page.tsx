'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubmitFeedbackPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event_id') || '';
  const participantId = searchParams.get('participant_id') || '';

  const [formData, setFormData] = useState({
    overallRating: 0,
    instructorRating: 0,
    contentRating: 0,
    relevanceRating: 0,
    comments: '',
    suggestions: '',
    wouldRecommend: true,
    applicationPlan: '',
    disclosuresClear: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!eventId || !participantId) {
      setError('Missing event or participant information. Please use the link from your confirmation email.');
      return;
    }

    if (formData.overallRating === 0 || formData.instructorRating === 0 || formData.contentRating === 0) {
      setError('Please provide all required ratings.');
      return;
    }

    setSubmitting(true);
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
        setError(data.error || 'Failed to submit feedback.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    const [hover, setHover] = useState(0);
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hover || value)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {(hover || value) > 0 && (
            <span className="ml-2 text-sm text-gray-600">{labels[hover || value]}</span>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. Your input helps us improve our continuing education events.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can now download your certificate if all other requirements have been met.
          </p>
          <a
            href={`/ace/certificates/verify`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F4D3F] text-white rounded-lg hover:bg-[#1F4D3F]/90 transition-colors"
          >
            View My Certificate
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg border">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-[#1F4D3F] to-[#2a6b56]">
          <h1 className="text-xl font-bold text-white">Event Feedback</h1>
          <p className="text-white/80 text-sm mt-1">
            Please share your experience. Your feedback is required to receive your certificate.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Standard BACB Feedback Questions */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Ratings</h2>

            <StarRating
              label="Rate the overall quality of this event"
              value={formData.overallRating}
              onChange={(v) => setFormData({ ...formData, overallRating: v })}
            />

            <StarRating
              label="Did the event meet the stated learning objectives?"
              value={formData.relevanceRating}
              onChange={(v) => setFormData({ ...formData, relevanceRating: v })}
            />

            <StarRating
              label="Rate the instructor's knowledge and presentation"
              value={formData.instructorRating}
              onChange={(v) => setFormData({ ...formData, instructorRating: v })}
            />

            <StarRating
              label="Rate the content quality and relevance"
              value={formData.contentRating}
              onChange={(v) => setFormData({ ...formData, contentRating: v })}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Written Feedback</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What was most valuable about this event?
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                placeholder="Share what you found most helpful..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What could be improved?
              </label>
              <textarea
                value={formData.suggestions}
                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                placeholder="Your suggestions for improvement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How do you plan to apply what you learned? (optional)
              </label>
              <textarea
                value={formData.applicationPlan}
                onChange={(e) => setFormData({ ...formData, applicationPlan: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                placeholder="Describe how you'll use this in practice..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Questions</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Were all disclosures clearly communicated?
              </label>
              <div className="flex gap-4">
                {['Yes', 'No', 'Unsure'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="disclosuresClear"
                      value={option.toLowerCase()}
                      checked={formData.disclosuresClear === option.toLowerCase()}
                      onChange={(e) => setFormData({ ...formData, disclosuresClear: e.target.value })}
                      className="text-[#1F4D3F] focus:ring-[#1F4D3F]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you recommend this event to a colleague?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wouldRecommend"
                    checked={formData.wouldRecommend === true}
                    onChange={() => setFormData({ ...formData, wouldRecommend: true })}
                    className="text-[#1F4D3F] focus:ring-[#1F4D3F]"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wouldRecommend"
                    checked={formData.wouldRecommend === false}
                    onChange={() => setFormData({ ...formData, wouldRecommend: false })}
                    className="text-[#1F4D3F] focus:ring-[#1F4D3F]"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1F4D3F] text-white rounded-lg hover:bg-[#1F4D3F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Feedback must be submitted within 2 weeks of event completion.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
