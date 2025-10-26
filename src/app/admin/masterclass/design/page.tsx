'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Edit,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase-client';
import type {
  MasterclassCourseSection,
  MasterclassQuizQuestion,
  CourseSectionWithQuestionCount,
  MasterclassCertificateConfig,
} from '@/lib/masterclass/admin-types';

interface SectionWithQuestions extends CourseSectionWithQuestionCount {
  questions: MasterclassQuizQuestion[];
  resources: any[];
  isExpanded?: boolean;
}

function SortableQuestion({ question, sectionNumber, onEdit, onDelete }: {
  question: MasterclassQuizQuestion;
  sectionNumber: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `question-${question.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-500">Question {question.question_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-slate-600 hover:text-emerald-600 transition-colors"
              title="Edit question"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-slate-600 hover:text-red-600 transition-colors"
              title="Delete question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-900 font-medium line-clamp-2">{question.question_text}</p>
        <div className="mt-2 text-xs text-slate-500">
          Correct answer: Option {String.fromCharCode(65 + question.correct_answer)}
        </div>
      </div>
    </div>
  );
}

function SortableSection({ section, onEdit, onDelete, onToggleExpand, onAddQuestion, onAddResource, onEditQuestion, onDeleteQuestion }: {
  section: SectionWithQuestions;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onAddQuestion: () => void;
  onAddResource: () => void;
  onEditQuestion: (question: MasterclassQuizQuestion) => void;
  onDeleteQuestion: (questionId: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `section-${section.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle question reordering within this section
      const oldIndex = section.questions.findIndex(q => `question-${q.id}` === active.id);
      const newIndex = section.questions.findIndex(q => `question-${q.id}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // TODO: Implement question reordering API call
        console.log('Reorder questions:', oldIndex, newIndex);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gradient-to-r from-emerald-50 to-white border-2 border-emerald-200 rounded-xl overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex items-start gap-3 p-6">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-emerald-400 hover:text-emerald-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">
                Section {section.section_number}: {section.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleExpand}
                className="text-slate-600 hover:text-emerald-600 transition-colors"
                title={section.isExpanded ? 'Collapse' : 'Expand'}
              >
                {section.isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={onEdit}
                className="text-slate-600 hover:text-emerald-600 transition-colors"
                title="Edit section"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-slate-600 hover:text-red-600 transition-colors"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{section.description}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span>{section.duration}</span>
            <span>•</span>
            <span>{section.question_count} questions</span>
          </div>
        </div>
      </div>

      {/* Questions (when expanded) */}
      {section.isExpanded && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Quiz Questions</h4>
            <Button
              onClick={onAddQuestion}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
            <Button
              onClick={onAddResource}
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Resource
            </Button>
          </div>

          {section.questions.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={section.questions.map(q => `question-${q.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {section.questions.map((question) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      sectionNumber={section.section_number}
                      onEdit={() => onEditQuestion(question)}
                      onDelete={() => onDeleteQuestion(question.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No questions yet. Add your first question!
            </div>
          )}
        </div>
      )}

      {/* Resources (when expanded) */}
      {section.isExpanded && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Resources</h4>
          </div>

          {section.resources.length > 0 ? (
            <div className="space-y-3">
              {section.resources.map((resource) => (
                <div key={resource.id} className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-900 font-medium hover:text-blue-600">
                      {resource.name}
                    </a>
                  </div>
                  {/* <button
                    onClick={() => onDeleteResource(resource.id)}
                    className="text-slate-600 hover:text-red-600 transition-colors"
                    title="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No resources yet. Add your first resource!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DesignCoursePage() {
  const [sections, setSections] = useState<SectionWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [certificateConfig, setCertificateConfig] = useState<MasterclassCertificateConfig | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resourceSectionId, setResourceSectionId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddResource = (sectionId: number) => {
    setResourceSectionId(sectionId);
    fileInputRef.current?.click();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSectionsWithQuestions();
    fetchCertificateConfig();
  }, []);

  const fetchCertificateConfig = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/certificate');
      const data = await response.json();
      if (data.success) {
        setCertificateConfig(data.data);
        setIntroVideoUrl(data.data.introduction_video_url || '');
      }
    } catch (error) {
      console.error('Failed to fetch certificate config:', error);
    }
  };

  const fetchSectionsWithQuestions = async () => {
    try {
      // Fetch sections
      const sectionsResponse = await fetch('/api/admin/masterclass/sections');
      const sectionsData = await sectionsResponse.json();

      if (sectionsData.success) {
        // Fetch questions for each section
        const sectionsWithQuestions = await Promise.all(
          sectionsData.data.map(async (section: CourseSectionWithQuestionCount) => {
            const questionsResponse = await fetch(
              `/api/admin/masterclass/questions?section=${section.section_number}`
            );
            const questionsData = await questionsResponse.json();

            const resourcesResponse = await fetch(
              `/api/admin/masterclass/resources?section_id=${section.id}`
            );
            const resourcesData = await resourcesResponse.json();

            return {
              ...section,
              questions: questionsData.success ? questionsData.data : [],
              resources: resourcesData.success ? resourcesData.data : [],
              isExpanded: false,
            };
          })
        );

        setSections(sectionsWithQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(s => `section-${s.id}` === active.id);
        const newIndex = items.findIndex(s => `section-${s.id}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const handleSaveIntroVideo = async () => {
    if (!certificateConfig) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/masterclass/certificate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: certificateConfig.id,
          introduction_video_url: introVideoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save intro video URL');
      }
    } catch (error) {
      console.error('Failed to save intro video URL:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadResource = async (sectionId: number, file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const bucketName = 'masterclass-resources';
      const filePath = `public/${sectionId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      const response = await fetch('/api/admin/masterclass/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: sectionId,
          name: file.name,
          url: publicUrlData.publicUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save resource to database');
      }

      alert('Resource uploaded successfully!');
      // Refresh resources for the section
      // I will implement this later.

    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Error uploading resource.');
    } finally {
      setUploading(false);
      setResourceSectionId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save section order
      console.log('Save section order:', sections.map((s, i) => ({ id: s.id, order: i + 1 })));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSaving(false);
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
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-10">
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
                <h1 className="text-3xl font-bold text-slate-900">Design Course</h1>
                <p className="text-base text-slate-600 mt-1">
                  Organize sections and questions with drag & drop
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={saveOrder}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {/* Course Settings */}
        <div className="mb-6 bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Course Settings</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Introduction Video URL (Optional)
            </label>
            <input
              type="url"
              value={introVideoUrl}
              onChange={(e) => setIntroVideoUrl(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              placeholder="https://fast.wistia.net/embed/iframe/..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Wistia embed URL for the course introduction video
            </p>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleSaveIntroVideo}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Intro Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add Section Button */}
        <div className="mb-6">
          <Link href="/admin/masterclass/sections">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Section
            </Button>
          </Link>
        </div>

        {/* Sections List */}
        {sections.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map(s => `section-${s.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onEdit={() => {
                      window.location.href = `/admin/masterclass/sections?edit=${section.id}`;
                    }}
                    onDelete={() => {
                      if (confirm(`Delete section "${section.title}"?`)) {
                        // TODO: Implement delete
                      }
                    }}
                    onToggleExpand={() => toggleSection(section.id)}
                    onAddQuestion={() => {
                      window.location.href = `/admin/masterclass/questions?section=${section.section_number}`;
                    }}
                    onAddResource={() => handleAddResource(section.id)}
                    onEditQuestion={(question) => {
                      window.location.href = `/admin/masterclass/questions?edit=${question.id}`;
                    }}
                    onDeleteQuestion={(questionId) => {
                      if (confirm('Delete this question?')) {
                        // TODO: Implement delete
                      }
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-300 rounded-xl">
            <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No sections yet</h3>
            <p className="text-slate-600 mb-6">Get started by adding your first course section</p>
            <Link href="/admin/masterclass/sections">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Section
              </Button>
            </Link>
          </div>
        )}
      </main>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && resourceSectionId) {
            handleUploadResource(resourceSectionId, e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
