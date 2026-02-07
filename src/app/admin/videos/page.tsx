'use client';

import { useState, useEffect } from 'react';
import type { Video, VideoCategory, VideoSource } from '@/types/video';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load videos on mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/data/videos.json');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      alert('Failed to load videos');
    }
  };

  const handleSave = async (video: Video) => {
    try {
      const updatedVideos = isEditing
        ? videos.map(v => v.id === video.id ? video : v)
        : [...videos, video];

      // Sort by category and order
      updatedVideos.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.order - b.order;
      });

      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos }),
      });

      if (!response.ok) throw new Error('Failed to save');

      await loadVideos();
      setShowForm(false);
      setEditingVideo(null);
      setIsEditing(false);
      alert('Video saved successfully!');
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const updatedVideos = videos.filter(v => v.id !== videoId);

      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos }),
      });

      if (!response.ok) throw new Error('Failed to delete');

      await loadVideos();
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingVideo({
      id: `video-${Date.now()}`,
      slug: '',
      title: '',
      description: '',
      category: 'Exam Prep',
      videoUrl: '',
      videoSource: 'youtube',
      publishedAt: new Date().toISOString(),
      order: videos.length + 1,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleReorder = async (videoId: string, direction: 'up' | 'down') => {
    const videoIndex = videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const video = videos[videoIndex];
    const sameCategoryVideos = videos.filter(v => v.category === video.category);
    const categoryIndex = sameCategoryVideos.findIndex(v => v.id === videoId);

    if (
      (direction === 'up' && categoryIndex === 0) ||
      (direction === 'down' && categoryIndex === sameCategoryVideos.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    const swapVideo = sameCategoryVideos[swapIndex];

    const updatedVideos = videos.map(v => {
      if (v.id === video.id) {
        return { ...v, order: swapVideo.order };
      }
      if (v.id === swapVideo.id) {
        return { ...v, order: video.order };
      }
      return v;
    });

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos }),
      });

      if (!response.ok) throw new Error('Failed to reorder');

      await loadVideos();
    } catch (error) {
      console.error('Error reordering videos:', error);
      alert('Failed to reorder videos');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Videos
        </h1>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Video
        </button>
      </div>

      {/* Video List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {videos.map(video => (
              <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {video.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                    {video.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {video.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {video.videoSource}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {video.order}
                    <button
                      onClick={() => handleReorder(video.id, 'up')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(video.id, 'down')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(video)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Video Form Modal */}
      {showForm && editingVideo && (
        <VideoForm
          video={editingVideo}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingVideo(null);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}

// Video Form Component
interface VideoFormProps {
  video: Video;
  isEditing: boolean;
  onSave: (video: Video) => void;
  onCancel: () => void;
}

function VideoForm({ video, isEditing, onSave, onCancel }: VideoFormProps) {
  const [formData, setFormData] = useState<Video>(video);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from title if not set
    if (!formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      formData.slug = slug;
    }

    onSave(formData);
  };

  const handleChange = (field: keyof Video, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEditing ? 'Edit Video' : 'Add New Video'}
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL path)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => handleChange('slug', e.target.value)}
                placeholder="Auto-generated from title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={e => handleChange('category', e.target.value as VideoCategory)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Exam Prep">Exam Prep</option>
                <option value="School BCBA Tips">School BCBA Tips</option>
                <option value="Tool Tutorials">Tool Tutorials</option>
              </select>
            </div>

            {/* Video Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Source *
              </label>
              <select
                required
                value={formData.videoSource}
                onChange={e => handleChange('videoSource', e.target.value as VideoSource)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="upload">Direct Upload</option>
              </select>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={e => handleChange('videoUrl', e.target.value)}
                placeholder={
                  formData.videoSource === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                  formData.videoSource === 'vimeo' ? 'https://vimeo.com/...' :
                  'https://...'
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl || ''}
                onChange={e => handleChange('thumbnailUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transcript (optional)
              </label>
              <textarea
                rows={4}
                value={formData.transcript || ''}
                onChange={e => handleChange('transcript', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={e => handleChange('order', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
