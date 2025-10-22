'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, HelpCircle, Check, X, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  MasterclassQuizQuestion,
  QuizQuestionFormData,
  MasterclassCourseSection,
} from '@/lib/masterclass/admin-types';

export default function QuestionsAdminPage() {
  const [sections, setSections] = useState<MasterclassCourseSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [questions, setQuestions] = useState<MasterclassQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<MasterclassQuizQuestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<QuizQuestionFormData>({
    section_number: 0,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 0,
    explanation: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchQuestions(selectedSection);
    }
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/sections');
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setSections(data.data);
        setSelectedSection(data.data[0].section_number);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (sectionNumber: number) => {
    try {
      const response = await fetch(`/api/admin/masterclass/questions?sectionNumber=${sectionNumber}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingQuestion(null);
    setFormData({
      section_number: selectedSection || 1,
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 0,
      explanation: '',
    });
  };

  const handleEdit = (question: MasterclassQuizQuestion) => {
    setEditingQuestion(question);
    setFormData({
      section_number: question.section_number,
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
    });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        const response = await fetch('/api/admin/masterclass/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok && selectedSection) {
          await fetchQuestions(selectedSection);
          handleCancel();
        }
      } else if (editingQuestion) {
        const response = await fetch(`/api/admin/masterclass/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok && selectedSection) {
          await fetchQuestions(selectedSection);
          handleCancel();
        }
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/admin/masterclass/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok && selectedSection) {
        await fetchQuestions(selectedSection);
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const currentSection = sections.find(s => s.section_number === selectedSection);
  const optionLabels = ['A', 'B', 'C', 'D'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/masterclass">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Quiz Questions</h1>
                <p className="text-base text-slate-600 mt-1">
                  Create and edit quiz questions for each section
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              disabled={!selectedSection}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Section
          </label>
          <div className="relative">
            <select
              value={selectedSection || ''}
              onChange={(e) => setSelectedSection(parseInt(e.target.value))}
              className="w-full md:w-96 px-4 py-3 pr-10 border-2 border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none appearance-none font-medium text-slate-900"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.section_number}>
                  Section {section.section_number}: {section.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingQuestion) && (
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {isCreating ? 'Create New Question' : 'Edit Question'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter the question..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['option_a', 'option_b', 'option_c', 'option_d'].map((key, index) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Option {optionLabels[index]}
                    </label>
                    <input
                      type="text"
                      value={formData[key as keyof QuizQuestionFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      placeholder={`Enter option ${optionLabels[index]}...`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex gap-4">
                  {optionLabels.map((label, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={formData.correct_answer === index}
                        onChange={() => setFormData({ ...formData, correct_answer: index })}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span className="font-medium text-slate-700">Option {label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.question_text || !formData.option_a}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Question
                    </>
                  )}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        {currentSection && (
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-4">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {currentSection.title}
            </h3>
            <p className="text-sm text-slate-600">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-900 leading-relaxed">
                      {question.question_text}
                    </h4>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(question)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(question.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {[question.option_a, question.option_b, question.option_c, question.option_d].map(
                      (option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            question.correct_answer === optIndex
                              ? 'bg-emerald-100 border border-emerald-300 font-medium text-emerald-900'
                              : 'bg-slate-50 border border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-semibold">{optionLabels[optIndex]}:</span> {option}
                        </div>
                      )
                    )}
                  </div>

                  {question.explanation && (
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && !isCreating && selectedSection && (
            <div className="text-center py-12 bg-white border-2 border-slate-200 rounded-xl">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No questions yet</h3>
              <p className="text-slate-600 mb-6">Add questions for this section to test learners</p>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Question
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
