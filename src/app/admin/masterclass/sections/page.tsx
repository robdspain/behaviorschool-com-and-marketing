'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Video, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CourseSectionWithQuestionCount, CourseSectionFormData } from '@/lib/masterclass/admin-types';

export default function SectionsAdminPage() {
  const [sections, setSections] = useState<CourseSectionWithQuestionCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<CourseSectionWithQuestionCount | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CourseSectionFormData>({
    title: '',
    description: '',
    video_url: '',
    duration: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/sections');
      const data = await response.json();

      if (data.success) {
        setSections(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: CourseSectionWithQuestionCount) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      description: section.description,
      video_url: section.video_url,
      duration: section.duration,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingSection(null);
    setFormData({
      title: '',
      description: '',
      video_url: '',
      duration: '',
    });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      video_url: '',
      duration: '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        // Create new section
        const response = await fetch('/api/admin/masterclass/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchSections();
          handleCancel();
        }
      } else if (editingSection) {
        // Update existing section
        const response = await fetch(`/api/admin/masterclass/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchSections();
          handleCancel();
        }
      }
    } catch (error) {
      console.error('Failed to save section:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this section? This will also delete all quiz questions for this section.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/masterclass/sections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSections();
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

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
                <h1 className="text-3xl font-bold text-slate-900">Course Sections</h1>
                <p className="text-base text-slate-600 mt-1">
                  Manage section titles, descriptions, and video URLs
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {(isCreating || editingSection) && (
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {isCreating ? 'Create New Section' : 'Edit Section'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g., Ethics in School-Based Practice"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Brief description of what this section covers"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Video URL (Vimeo)
                  </label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="https://vimeo.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., 15 min"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.title || !formData.video_url}
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
                      Save Section
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

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-600">
                    {section.section_number}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(section)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(section.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium">Video:</span>
                      <a
                        href={section.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline truncate"
                      >
                        {section.video_url}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        <span className="font-medium">Duration:</span> {section.duration}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {section.question_count} questions
                      </span>
                      {section.is_active ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && !isCreating && (
            <div className="text-center py-12 bg-white border-2 border-slate-200 rounded-xl">
              <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No sections yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first section</p>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Section
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
