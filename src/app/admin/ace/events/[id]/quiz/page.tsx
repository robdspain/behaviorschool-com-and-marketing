'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AceQuiz, AceQuizQuestion, QuizOption } from '@/lib/ace/types';

export default function EventQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<AceQuiz | null>(null);
  const [questions, setQuestions] = useState<AceQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AceQuizQuestion | null>(null);

  // Question form state
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false' | 'multiple_select'>('multiple_choice');
  const [options, setOptions] = useState<QuizOption[]>([
    { id: 'a', text: '' },
    { id: 'b', text: '' },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(1);

  useEffect(() => {
    fetchQuizData();
  }, [eventId]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      // Create quiz if it doesn&apos;t exist
      const createRes = await fetch('/api/ace/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          title: 'Event Assessment',
          passing_score_percentage: 80,
          randomize_questions: false,
          randomize_options: false,
          show_correct_answers_after_submission: true,
        }),
      });
      const createData = await createRes.json();

      if (createData.success) {
        setQuiz(createData.data);
        // Fetch questions
        const questionsRes = await fetch(`/api/ace/quizzes/${createData.data.id}/questions`);
        const questionsData = await questionsRes.json();
        if (questionsData.success) {
          setQuestions(questionsData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setQuestionType('multiple_choice');
    setOptions([
      { id: 'a', text: '' },
      { id: 'b', text: '' },
    ]);
    setCorrectAnswers([]);
    setExplanation('');
    setPoints(1);
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const handleAddOption = () => {
    const nextId = String.fromCharCode(97 + options.length); // a, b, c, d...
    setOptions([...options, { id: nextId, text: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    // Remove from correct answers if selected
    const removedId = options[index].id;
    setCorrectAnswers(correctAnswers.filter(id => id !== removedId));
  };

  const handleUpdateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const toggleCorrectAnswer = (optionId: string) => {
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      // Single selection
      setCorrectAnswers([optionId]);
    } else {
      // Multiple selection
      if (correctAnswers.includes(optionId)) {
        setCorrectAnswers(correctAnswers.filter(id => id !== optionId));
      } else {
        setCorrectAnswers([...correctAnswers, optionId]);
      }
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quiz) return;

    if (correctAnswers.length === 0) {
      alert('Please select at least one correct answer');
      return;
    }

    try {
      const res = await fetch(`/api/ace/quizzes/${quiz.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: questionText,
          question_type: questionType,
          options,
          correct_answers: correctAnswers,
          explanation: explanation || null,
          points,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions([...questions, data.data]);
        resetForm();
      } else {
        alert(data.error || 'Failed to add question');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  useEffect(() => {
    if (questionType === 'true_false') {
      setOptions([
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ]);
      if (correctAnswers.length === 0) {
        setCorrectAnswers(['true']);
      }
    } else if (questionType === 'multiple_choice' && options.length === 2 && options[0].id === 'true') {
      // Reset from true/false
      setOptions([
        { id: 'a', text: '' },
        { id: 'b', text: '' },
      ]);
      setCorrectAnswers([]);
    }
  }, [questionType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/ace/events/${eventId}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Event
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
              <p className="mt-2 text-gray-600">{questions.length} questions</p>
            </div>
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {showQuestionForm ? 'Cancel' : '+ Add Question'}
            </button>
          </div>
        </div>

        {/* Question Form */}
        {showQuestionForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                  >
                    <option value="multiple_choice">Multiple Choice (Single)</option>
                    <option value="multiple_select">Multiple Select</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options * (Check correct answers)
                </label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center">
                      <input
                        type={questionType === 'multiple_select' ? 'checkbox' : 'radio'}
                        name="correct-answer"
                        checked={correctAnswers.includes(option.id)}
                        onChange={() => toggleCorrectAnswer(option.id)}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        required
                        disabled={questionType === 'true_false'}
                        placeholder={`Option ${option.id.toUpperCase()}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        value={option.text}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                      />
                      {questionType !== 'true_false' && options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {questionType !== 'true_false' && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Question
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">No questions yet. Add your first question to get started.</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {question.question_type.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">{question.points} points</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-3">{question.question_text}</p>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded ${
                            question.correct_answers.includes(option.id)
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-700">{option.id.toUpperCase()}.</span>
                          <span className="text-sm text-gray-900">{option.text}</span>
                          {question.correct_answers.includes(option.id) && (
                            <span className="ml-auto text-xs font-medium text-green-700">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
