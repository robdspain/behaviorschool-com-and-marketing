'use client';

import { useEffect, useState, useCallback, type CSSProperties } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import type {
  MasterclassCourseSection,
  MasterclassQuizQuestion,
  MasterclassResource,
  CourseSectionWithQuestionCount,
} from '@/lib/masterclass/admin-types';



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

function SortableSection({ section, allQuestions, onEdit, onDelete, onToggleExpand, onAddQuestion, onEditQuestion, onDeleteQuestion }: {
  section: MasterclassCourseSection;
  allQuestions: MasterclassQuizQuestion[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onAddQuestion: () => void;
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

  const sectionQuestions = section.questionIds.map(qId => allQuestions.find(q => q.id === qId)).filter(Boolean) as MasterclassQuizQuestion[];

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
            <span>{sectionQuestions.length} questions</span>
          </div>
        </div>
      </div>

      {/* Quick actions instead of embedding quiz list */}
      {section.isExpanded && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {sectionQuestions.length} quiz question{sectionQuestions.length === 1 ? '' : 's'} in this section
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onAddQuestion} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-1" /> Manage Questions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesignCoursePage() {
  const [sections, setSections] = useState<MasterclassCourseSection[]>([]);
  const [questions, setQuestions] = useState<MasterclassQuizQuestion[]>([]);
  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingResources, setSavingResources] = useState(false);
  const [quizBlocks, setQuizBlocks] = useState<{ sectionId: number; section_number: number; title: string; questionCount: number }[]>([]);
  const [savingQuizBlocks, setSavingQuizBlocks] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSectionsWithQuestions();
    fetchResources();
  }, []);

  const fetchSectionsWithQuestions = async () => {
    try {
      // Fetch sections
      const sectionsResponse = await fetch('/api/admin/masterclass/sections');
      const sectionsData = await sectionsResponse.json();

      if (sectionsData.success) {
        let allQuestions: MasterclassQuizQuestion[] = [];
        const sectionsWithQuestionIds = await Promise.all(
          sectionsData.data.map(async (section: MasterclassCourseSection) => {
            const questionsResponse = await fetch(
              `/api/admin/masterclass/questions?section=${section.section_number}`
            );
            const questionsData = await questionsResponse.json();

            if (questionsData.success) {
              allQuestions = [...allQuestions, ...questionsData.data];
            }

            return {
              ...section,
              questionIds: questionsData.success ? questionsData.data.map((q: MasterclassQuizQuestion) => q.id) : [],
              isExpanded: false,
            };
          })
        );

        setSections(sectionsWithQuestionIds);
        setQuestions(allQuestions);

        // Build quiz blocks separate from sections UI
        const built = sectionsWithQuestionIds.map((s) => ({
          sectionId: s.id,
          section_number: s.section_number,
          title: s.title,
          questionCount: s.questionIds.length,
        }));

        // Apply saved order from localStorage if present
        try {
          const saved = localStorage.getItem('masterclass_quiz_block_order');
          if (saved) {
            const order = JSON.parse(saved) as number[]; // array of sectionId
            built.sort((a, b) => order.indexOf(a.sectionId) - order.indexOf(b.sectionId));
          }
        } catch {}
        setQuizBlocks(built);
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/admin/masterclass/resources');
      const data = await res.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Dragging a section
    if (active.id.toString().startsWith('section-') && over.id.toString().startsWith('section-')) {
      setSections((items) => {
        const oldIndex = items.findIndex(s => `section-${s.id}` === active.id);
        const newIndex = items.findIndex(s => `section-${s.id}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }

    // Dragging a question
    if (active.id.toString().startsWith('question-')) {
      const activeQuestionId = parseInt(active.id.toString().replace('question-', ''));
      const overId = over.id.toString();

      // Dragging a question to another question (reordering within or between sections)
      if (overId.startsWith('question-')) {
        const overQuestionId = parseInt(overId.replace('question-', ''));

        setSections(prevSections => {
          const newSections = prevSections.map(section => ({ ...section, questionIds: [...section.questionIds] }));

          let activeSectionId: number | undefined;
          let overSectionId: number | undefined;

          // Find the section of the active question
          for (const section of newSections) {
            if (section.questionIds.includes(activeQuestionId)) {
              activeSectionId = section.id;
              break;
            }
          }

          // Find the section of the over question
          for (const section of newSections) {
            if (section.questionIds.includes(overQuestionId)) {
              overSectionId = section.id;
              break;
            }
          }

          if (activeSectionId === undefined || overSectionId === undefined) {
            return prevSections; // Should not happen
          }

          // If dragging within the same section
          if (activeSectionId === overSectionId) {
            const sectionIndex = newSections.findIndex(s => s.id === activeSectionId);
            const oldIndex = newSections[sectionIndex].questionIds.indexOf(activeQuestionId);
            const newIndex = newSections[sectionIndex].questionIds.indexOf(overQuestionId);
            newSections[sectionIndex].questionIds = arrayMove(newSections[sectionIndex].questionIds, oldIndex, newIndex);
          } else {
            // If dragging to a different section
            const oldSectionIndex = newSections.findIndex(s => s.id === activeSectionId);
            const newSectionIndex = newSections.findIndex(s => s.id === overSectionId);

            // Remove from old section
            newSections[oldSectionIndex].questionIds = newSections[oldSectionIndex].questionIds.filter(id => id !== activeQuestionId);

            // Add to new section at the correct position
            const newIndex = newSections[newSectionIndex].questionIds.indexOf(overQuestionId);
            newSections[newSectionIndex].questionIds.splice(newIndex, 0, activeQuestionId);
          }

          return newSections;
        });
      }

      // Dragging a question to a section (empty or not) - add to end of section
      else if (overId.startsWith('section-')) {
        const overSectionId = parseInt(overId.replace('section-', ''));

        setSections(prevSections => {
          const newSections = prevSections.map(section => ({ ...section, questionIds: [...section.questionIds] }));

          let activeSectionId: number | undefined;

          // Find the section of the active question
          for (const section of newSections) {
            if (section.questionIds.includes(activeQuestionId)) {
              activeSectionId = section.id;
              break;
            }
          }

          if (activeSectionId === undefined) {
            return prevSections; // Should not happen
          }

          // Remove from old section if it's not the same as the target section
          if (activeSectionId !== overSectionId) {
            const oldSectionIndex = newSections.findIndex(s => s.id === activeSectionId);
            newSections[oldSectionIndex].questionIds = newSections[oldSectionIndex].questionIds.filter(id => id !== activeQuestionId);
          }

          // Add to the end of the new section if it's not already there
          const newSectionIndex = newSections.findIndex(s => s.id === overSectionId);
          if (!newSections[newSectionIndex].questionIds.includes(activeQuestionId)) {
            newSections[newSectionIndex].questionIds.push(activeQuestionId);
          }

          return newSections;
        });
      }
    }
  };

  const handleResourceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    setResources((items) => {
      const oldIndex = items.findIndex(r => `resource-${r.id}` === String(active.id));
      const newIndex = items.findIndex(r => `resource-${r.id}` === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }
      return items;
    });
  };

  const handleQuizBlocksDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    setQuizBlocks((items) => {
      const oldIndex = items.findIndex(q => `quiz-${q.sectionId}` === String(active.id));
      const newIndex = items.findIndex(q => `quiz-${q.sectionId}` === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }
      return items;
    });
  };

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
    ));
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

  const saveResourcesOrder = async () => {
    setSavingResources(true);
    try {
      const idsInOrder = resources.map(r => r.id);
      const res = await fetch('/api/admin/masterclass/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idsInOrder }),
      });
      if (!res.ok) {
        console.error('Failed to save resource order');
      }
    } catch (error) {
      console.error('Failed to save resource order:', error);
    } finally {
      setSavingResources(false);
    }
  };

  const saveQuizBlocksOrder = async () => {
    setSavingQuizBlocks(true);
    try {
      const order = quizBlocks.map(q => q.sectionId);
      localStorage.setItem('masterclass_quiz_block_order', JSON.stringify(order));
    } catch (e) {
      console.error('Failed to save quiz blocks order:', e);
    } finally {
      setSavingQuizBlocks(false);
    }
  };

  const addResource = async () => {
    const name = window.prompt('Resource name');
    if (!name) return;
    const url = window.prompt('Resource URL');
    if (!url) return;
    // Quick file_type inference
    const ext = (url.split('.').pop() || '').toLowerCase();
    const file_type = ['pdf','doc','docx','png','jpg','jpeg','webp'].includes(ext) ? ext : 'link';
    try {
      const res = await fetch('/api/admin/masterclass/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, file_type, section_id: null, order_index: (resources[resources.length-1]?.order_index || 0) + 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setResources(prev => [...prev, data.data]);
      }
    } catch (error) {
      console.error('Failed to add resource:', error);
    }
  };

  const deleteResource = async (id: number) => {
    if (!confirm('Delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/masterclass/resources?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResources(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
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
              <Button variant="outline" onClick={addResource} className="gap-2">
                <Plus className="w-4 h-4" /> Add Resource
              </Button>
              <Link href="/admin/masterclass/questions">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Quiz Questions
                </Button>
              </Link>
              <Link href="/masterclass/course" prefetch={false}>
                <Button variant="outline" className="gap-2">
                  Preview Course
                </Button>
              </Link>
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
        {/* Resources Blocks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-900">Resources</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={addResource} className="gap-2">
                <Plus className="w-4 h-4" /> Add Resource
              </Button>
              <Button onClick={saveResourcesOrder} disabled={savingResources} className="gap-2">
                {savingResources ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Resources Order
                  </>
                )}
              </Button>
            </div>
          </div>

          {resources.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleResourceDragEnd}
            >
              <SortableContext
                items={resources.map(r => `resource-${r.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {resources.map((r) => (
                    <ResourceBlock
                      key={r.id}
                      resource={r}
                      sections={sections}
                      onDelete={() => deleteResource(r.id)}
                      onUpdate={(updated) => setResources(prev => prev.map(x => x.id === updated.id ? updated : x))}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-500">
              No resources yet. Click “Add Resource” to create one.
            </div>
          )}
        </div>

        {/* Quiz Blocks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-900">Quiz Questions</h2>
            <div className="flex items-center gap-2">
              <Link href="/admin/masterclass/questions">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Quiz Questions
                </Button>
              </Link>
              <Button onClick={saveQuizBlocksOrder} disabled={savingQuizBlocks} className="gap-2">
                {savingQuizBlocks ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Quiz Order
                  </>
                )}
              </Button>
            </div>
          </div>

          {quizBlocks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleQuizBlocksDragEnd}
            >
              <SortableContext
                items={quizBlocks.map(q => `quiz-${q.sectionId}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {quizBlocks.map((q) => (
                    <QuizBlock
                      key={q.sectionId}
                      block={q}
                      onManage={() => { window.location.href = `/admin/masterclass/questions?section=${q.section_number}`; }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-500">
              No quiz questions yet. Click “Add Quiz Questions” to create some.
            </div>
          )}
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
              items={[
                ...sections.map(s => `section-${s.id}`),
                ...questions.map(q => `question-${q.id}`),
              ]}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    allQuestions={questions}
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
    </div>
  );
}

function ResourceBlock({ resource, sections, onDelete, onUpdate }: { resource: MasterclassResource; sections: MasterclassCourseSection[]; onDelete: () => void; onUpdate: (updated: MasterclassResource) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `resource-${resource.id}` });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: resource.name,
    url: resource.url,
    file_type: resource.file_type,
    section_id: resource.section_id ?? null as number | null,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/masterclass/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, ...form }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'Failed to update resource');
      onUpdate(data.data);
      setOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
      >
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Resource</span>
              <h4 className="text-sm font-semibold text-slate-900 truncate">{resource.name}</h4>
            </div>
            <div className="flex items-center gap-2">
              <a href={resource.url} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-700 text-sm underline">
                Open
              </a>
              <button
                onClick={() => setOpen(true)}
                className="text-slate-600 hover:text-emerald-700"
                title="Edit resource"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-slate-600 hover:text-red-600"
                title="Delete resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 break-all">{resource.url}</p>
          {resource.section_id && (
            <p className="mt-1 text-xs text-slate-500">Section: {sections.find(s => s.id === resource.section_id)?.title || '—'}</p>
          )}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File Type</label>
              <input
                value={form.file_type}
                onChange={e => setForm({ ...form, file_type: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="pdf, docx, link, ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Attach to Section</label>
              <select
                value={form.section_id ?? ''}
                onChange={e => setForm({ ...form, section_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Unassigned</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.section_number}. {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function QuizBlock({ block, onManage }: { block: { sectionId: number; section_number: number; title: string; questionCount: number }; onManage: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `quiz-${block.sectionId}` });
  const style: CSSProperties = {
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
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">Quiz</span>
            <h4 className="text-sm font-semibold text-slate-900 truncate">Section {block.section_number}: {block.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onManage} className="text-slate-600 hover:text-emerald-700" title="Manage questions">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500">{block.questionCount} questions</p>
      </div>
    </div>
  );
}
