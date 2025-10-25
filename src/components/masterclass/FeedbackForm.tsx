'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Star, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackFormProps {
  enrollmentId: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ enrollmentId, onSuccess }: FeedbackFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Overall Ratings
    overall_satisfaction: 0,
    content_quality: 0,
    instructor_effectiveness: 0,
    relevance_to_practice: 0,
    would_recommend: 0,

    // Section Ratings
    section_1_rating: 0,
    section_2_rating: 0,
    section_3_rating: 0,
    section_4_rating: 0,

    // Open-ended
    most_valuable_learning: '',
    suggestions_for_improvement: '',
    topics_for_future_courses: '',
    additional_comments: '',

    // Learning Objectives
    learned_ethics_concepts: false,
    learned_teacher_collaboration: false,
    learned_data_systems: false,
    learned_crisis_management: false,

    // Application
    will_apply_immediately: false,
    will_apply_within_month: false,
    will_share_with_team: false,
  });

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1"
          >
            <Star
              className={`w-7 h-7 sm:w-8 sm:h-8 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="w-full sm:w-auto sm:ml-2 text-xs sm:text-sm font-medium text-slate-600">
            {value === 5 ? 'Excellent' : value === 4 ? 'Very Good' : value === 3 ? 'Good' : value === 2 ? 'Fair' : 'Needs Improvement'}
          </span>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/masterclass/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 md:p-12 text-center"
      >
        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-sm sm:text-base text-slate-600">
          Your feedback has been submitted successfully. It helps us improve future courses.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Course Evaluation</h2>
        <p className="text-sm sm:text-base text-slate-600">
          Your feedback helps us improve. Please take a moment to share your experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Overall Ratings */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b pb-2">Overall Experience</h3>

          <StarRating
            label="Overall Satisfaction"
            value={formData.overall_satisfaction}
            onChange={(v) => setFormData({ ...formData, overall_satisfaction: v })}
          />

          <StarRating
            label="Content Quality"
            value={formData.content_quality}
            onChange={(v) => setFormData({ ...formData, content_quality: v })}
          />

          <StarRating
            label="Instructor Effectiveness"
            value={formData.instructor_effectiveness}
            onChange={(v) => setFormData({ ...formData, instructor_effectiveness: v })}
          />

          <StarRating
            label="Relevance to Your Practice"
            value={formData.relevance_to_practice}
            onChange={(v) => setFormData({ ...formData, relevance_to_practice: v })}
          />

          <StarRating
            label="Would You Recommend This Course?"
            value={formData.would_recommend}
            onChange={(v) => setFormData({ ...formData, would_recommend: v })}
          />
        </div>

        {/* Section Ratings */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b pb-2">Section Ratings</h3>

          <StarRating
            label="Section 1: Ethics in School-Based Practice"
            value={formData.section_1_rating}
            onChange={(v) => setFormData({ ...formData, section_1_rating: v })}
          />

          <StarRating
            label="Section 2: Building Teacher Buy-In"
            value={formData.section_2_rating}
            onChange={(v) => setFormData({ ...formData, section_2_rating: v })}
          />

          <StarRating
            label="Section 3: Data-Driven Decision Making"
            value={formData.section_3_rating}
            onChange={(v) => setFormData({ ...formData, section_3_rating: v })}
          />

          <StarRating
            label="Section 4: Crisis Management Protocols"
            value={formData.section_4_rating}
            onChange={(v) => setFormData({ ...formData, section_4_rating: v })}
          />
        </div>

        {/* Learning Objectives */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b pb-2">Learning Objectives Achieved</h3>
          <p className="text-sm text-slate-600 mb-4">Select all that apply:</p>

          {[
            { key: 'learned_ethics_concepts', label: 'I learned new concepts about ethics in school-based practice' },
            { key: 'learned_teacher_collaboration', label: 'I learned strategies for building teacher collaboration' },
            { key: 'learned_data_systems', label: 'I learned about implementing effective data systems' },
            { key: 'learned_crisis_management', label: 'I learned crisis management protocols' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>

        {/* Application to Practice */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b pb-2">Application to Practice</h3>

          {[
            { key: 'will_apply_immediately', label: 'I plan to apply what I learned immediately' },
            { key: 'will_apply_within_month', label: 'I will apply these concepts within the next month' },
            { key: 'will_share_with_team', label: 'I will share this content with my team' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>

        {/* Open-Ended Questions */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b pb-2">Additional Feedback</h3>

          <div>
            <Label htmlFor="most_valuable" className="text-sm font-medium text-slate-700 mb-2 block">
              What was the most valuable learning for you?
            </Label>
            <textarea
              id="most_valuable"
              value={formData.most_valuable_learning}
              onChange={(e) => setFormData({ ...formData, most_valuable_learning: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Share what resonated most with you..."
            />
          </div>

          <div>
            <Label htmlFor="suggestions" className="text-sm font-medium text-slate-700 mb-2 block">
              Suggestions for Improvement
            </Label>
            <textarea
              id="suggestions"
              value={formData.suggestions_for_improvement}
              onChange={(e) => setFormData({ ...formData, suggestions_for_improvement: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="How can we make this course even better?"
            />
          </div>

          <div>
            <Label htmlFor="future_topics" className="text-sm font-medium text-slate-700 mb-2 block">
              Topics for Future Courses
            </Label>
            <textarea
              id="future_topics"
              value={formData.topics_for_future_courses}
              onChange={(e) => setFormData({ ...formData, topics_for_future_courses: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="What topics would you like to see covered in future courses?"
            />
          </div>

          <div>
            <Label htmlFor="additional" className="text-sm font-medium text-slate-700 mb-2 block">
              Additional Comments
            </Label>
            <textarea
              id="additional"
              value={formData.additional_comments}
              onChange={(e) => setFormData({ ...formData, additional_comments: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Anything else you'd like to share?"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {submitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
