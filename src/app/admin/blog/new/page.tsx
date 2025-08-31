"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Globe, 
  Calendar, 
  Tag, 
  Image as ImageIcon,
  Bold,
  Italic,
  Link2,
  List,
  Quote,
  Minus,
  Type,
  Plus,
  Settings,
  ChevronDown,
  X
} from "lucide-react";
import Link from "next/link";

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  status: 'draft' | 'published';
  featured: boolean;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    featured: false
  });

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status,
          tags: post.tags.split(',').map(t => t.trim()).filter(Boolean)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/admin/blog');
      } else {
        const error = await response.json();
        alert('Failed to save post: ' + error.message);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        newCursorPos = selectedText ? end + 4 : start + 2;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        newCursorPos = selectedText ? end + 2 : start + 1;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        newCursorPos = selectedText ? start + selectedText.length + 3 : start + 1;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'quote text'}`;
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'list':
        formattedText = `- ${selectedText || 'list item'}`;
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'heading':
        formattedText = `## ${selectedText || 'heading'}`;
        newCursorPos = selectedText ? end + 3 : start + 3;
        break;
      case 'divider':
        formattedText = '---';
        newCursorPos = start + 3;
        break;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setPost({ ...post, content: newContent });
    
    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">New Blog Post</h1>
                <p className="text-sm text-slate-500">Draft • Not published</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving || !post.title.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Globe className="w-4 h-4 mr-2 inline" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Post title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full text-4xl font-bold text-slate-900 placeholder-slate-400 border-none outline-none resize-none bg-transparent"
            autoFocus
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 mb-6 p-2 bg-slate-50 rounded-lg border">
          <button
            onClick={() => insertFormatting('heading')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Heading"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('bold')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('italic')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('link')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('quote')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('list')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('divider')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Content Editor */}
        <div className="mb-8">
          <textarea
            id="content-editor"
            placeholder="Tell your story..."
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full h-96 text-lg text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg p-4 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-sm text-slate-500 mt-2">
            Use Markdown formatting: **bold**, *italic*, [links](url), > quotes, - lists
          </p>
        </div>

        {/* Post Settings */}
        <div className="space-y-6 bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900">Post Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Excerpt
            </label>
            <textarea
              placeholder="Optional excerpt for the post preview..."
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              className="w-full h-20 text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <input
              type="text"
              placeholder="Comma-separated tags (e.g., Technology, Tutorial, Tips)"
              value={post.tags}
              onChange={(e) => setPost({ ...post, tags: e.target.value })}
              className="w-full text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={post.featured}
                onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Feature this post</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}