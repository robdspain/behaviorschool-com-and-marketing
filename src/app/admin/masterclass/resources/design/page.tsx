'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Edit,
  FileText,
  Loader2,
  Save,
  Link as LinkIcon,
  Image as ImageIcon,
  File as FileIcon,
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
import type { MasterclassResource } from '@/lib/masterclass/admin-types';

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-600" />;
  if (fileType.includes('pdf')) return <FileIcon className="w-5 h-5 text-red-600" />;
  if (fileType.includes('link')) return <LinkIcon className="w-5 h-5 text-purple-600" />;
  return <FileIcon className="w-5 h-5 text-slate-600" />;
}

function SortableResource({ resource, onEdit, onDelete }: {
  resource: MasterclassResource;
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
  } = useSortable({ id: `resource-${resource.id}` });

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
            {getFileIcon(resource.file_type)}
            <span className="text-sm font-semibold text-slate-500">Resource ID: {resource.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-slate-600 hover:text-emerald-600 transition-colors"
              title="Edit resource"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-slate-600 hover:text-red-600 transition-colors"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-900 font-medium line-clamp-2">{resource.name}</p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline truncate block mt-1"
        >
          {resource.url}
        </a>
      </div>
    </div>
  );
}

export default function DesignResourcesPage() {
  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/resources');
      const data = await response.json();

      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setResources((items) => {
        const oldIndex = items.findIndex(r => `resource-${r.id}` === active.id);
        const newIndex = items.findIndex(r => `resource-${r.id}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const updatedResources = resources.map((r, i) => ({ ...r, order_index: i + 1 }));
      // TODO: Implement API call to save resource order
      console.log('Save resource order:', updatedResources.map(r => ({ id: r.id, order_index: r.order_index })));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setResources(updatedResources); // Update state with new order_index
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddResource = () => {
    // TODO: Implement modal or new page for adding a resource
    alert('Add Resource functionality not yet implemented.');
  };

  const handleEditResource = (resource: MasterclassResource) => {
    // TODO: Implement modal or new page for editing a resource
    alert(`Edit Resource ID: ${resource.id} functionality not yet implemented.`);
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    // TODO: Implement API call to delete resource
    console.log('Delete resource ID:', resourceId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setResources(prevResources => prevResources.filter(r => r.id !== resourceId));
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
                <h1 className="text-3xl font-bold text-slate-900">Design Resources</h1>
                <p className="text-base text-slate-600 mt-1">
                  Organize and manage course resources with drag & drop
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
        {/* Add Resource Button */}
        <div className="mb-6">
          <Button onClick={handleAddResource} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Resource
          </Button>
        </div>

        {/* Resources List */}
        {resources.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={resources.map(r => `resource-${r.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {resources.map((resource) => (
                  <SortableResource
                    key={resource.id}
                    resource={resource}
                    onEdit={() => handleEditResource(resource)}
                    onDelete={() => handleDeleteResource(resource.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-300 rounded-xl">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No resources yet</h3>
            <p className="text-slate-600 mb-6">Get started by adding your first resource</p>
            <Button onClick={handleAddResource} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Resource
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}