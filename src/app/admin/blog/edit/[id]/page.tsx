"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Eye, 
  Settings,
  Plus,
  Type,
  Quote,
  Image as ImageIcon,
  List,
  Minus,
  Code,
  Upload,
  Trash2
} from "lucide-react";
import Link from "next/link";

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  status: 'draft' | 'published';
  featured: boolean;
  featureImage: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  canonicalUrl: string;
  codeInjectionHead: string;
  codeInjectionFoot: string;
}

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'list' | 'divider' | 'code';
  content: string;
  level?: number; // for headings
  focused: boolean;
}

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '', focused: false }
  ]);
  const [post, setPost] = useState<PostData>({
    id: '',
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    featured: false,
    featureImage: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    author: 'rob-spain',
    canonicalUrl: '',
    codeInjectionHead: '',
    codeInjectionFoot: ''
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`);
      if (response.ok) {
        const data = await response.json();
        const postData = data.post;
        
        setPost({
          id: postData.id,
          title: postData.title,
          content: postData.html || '',
          excerpt: postData.excerpt || '',
          tags: postData.tags?.map((t: { name: string }) => t.name).join(', ') || '',
          status: postData.status,
          featured: postData.featured || false,
          featureImage: postData.feature_image || '',
          slug: postData.slug || '',
          metaTitle: postData.meta_title || '',
          metaDescription: postData.meta_description || '',
          author: postData.primary_author?.slug || 'rob-spain',
          canonicalUrl: postData.canonical_url || '',
          codeInjectionHead: postData.codeinjection_head || '',
          codeInjectionFoot: postData.codeinjection_foot || ''
        });

        // Convert HTML content back to blocks (simplified)
        const contentBlocks = htmlToBlocks(postData.html || '');
        setBlocks(contentBlocks);
      } else {
        console.error('Failed to fetch post');
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  }, [postId, router]);

  // Simple HTML to blocks converter
  const htmlToBlocks = (html: string): Block[] => {
    if (!html) return [{ id: '1', type: 'paragraph', content: '', focused: false }];
    
    const blocks: Block[] = [];
    let blockId = 1;
    
    // Split by common block elements and create blocks
    const sections = html.split(/(<h[1-6].*?>.*?<\/h[1-6]>|<p.*?>.*?<\/p>|<blockquote.*?>.*?<\/blockquote>|<ul.*?>.*?<\/ul>|<hr\/?>)/);
    
    sections.forEach(section => {
      const trimmed = section.trim();
      if (!trimmed) return;
      
      const block: Block = {
        id: blockId.toString(),
        type: 'paragraph',
        content: trimmed.replace(/<[^>]*>/g, ''), // Strip HTML tags
        focused: false
      };
      
      if (trimmed.startsWith('<h1')) block.type = 'heading';
      else if (trimmed.startsWith('<h2')) block.type = 'heading';
      else if (trimmed.startsWith('<h3')) block.type = 'heading';
      else if (trimmed.startsWith('<blockquote')) block.type = 'quote';
      else if (trimmed.startsWith('<ul')) block.type = 'list';
      else if (trimmed.startsWith('<hr')) block.type = 'divider';
      
      blocks.push(block);
      blockId++;
    });
    
    return blocks.length > 0 ? blocks : [{ id: '1', type: 'paragraph', content: '', focused: false }];
  };

  const addBlock = (afterId: string, type: Block['type'] = 'paragraph') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      focused: true,
      level: type === 'heading' ? 2 : undefined
    };

    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks.map(b => ({ ...b, focused: b.id === newBlock.id }));
    });

    setShowBlockMenu(null);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === id ? { ...b, content } : b
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    
    setBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id);
      return filtered.length > 0 ? filtered : [{ id: '1', type: 'paragraph', content: '', focused: false }];
    });
  };

  const generateContent = () => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          return `## ${block.content}`;
        case 'quote':
          return `> ${block.content}`;
        case 'list':
          return `- ${block.content}`;
        case 'divider':
          return '---';
        case 'code':
          return `\`\`\`\n${block.content}\n\`\`\``;
        case 'image':
          return block.content ? `![Image](${block.content})` : '';
        default:
          return block.content;
      }
    }).join('\n\n');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const content = generateContent();
      const response = await fetch('/api/admin/blog/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          content,
          status,
          tags: post.tags.split(',').map(t => t.trim()).filter(Boolean)
        }),
      });
      
      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const error = await response.json();
        console.error('Save failed:', error);
        alert('Failed to save post: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/update?id=${postId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const error = await response.json();
        console.error('Delete failed:', error);
        alert('Failed to delete post: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block && block.content === '') {
        e.preventDefault();
        deleteBlock(blockId);
      }
    }
  };

  const renderBlock = (block: Block) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateBlock(block.id, e.target.value);
    };

    const handleFocus = () => {
      setBlocks(prev => prev.map(b => ({ ...b, focused: b.id === block.id })));
    };

    const baseClasses = `w-full bg-transparent border-none outline-none resize-none placeholder-slate-400 text-slate-900`;

    switch (block.type) {
      case 'heading':
        return (
          <input
            type="text"
            value={block.content}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder="Heading"
            className={`${baseClasses} text-3xl font-bold`}
          />
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-slate-300 pl-6 italic">
            <input
              type="text"
              value={block.content}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder="Quote"
              className={`${baseClasses} text-xl italic`}
            />
          </blockquote>
        );

      case 'list':
        return (
          <div className="flex items-start gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <input
              type="text"
              value={block.content}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder="List item"
              className={`${baseClasses} flex-1`}
            />
          </div>
        );

      case 'divider':
        return (
          <div className="flex items-center justify-center py-6">
            <div className="w-full h-px bg-slate-200"></div>
          </div>
        );

      case 'code':
        return (
          <div className="bg-slate-100 rounded-lg p-4 font-mono">
            <textarea
              value={block.content}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder="Code"
              className={`${baseClasses} bg-transparent font-mono text-sm min-h-[60px]`}
            />
          </div>
        );

      case 'image':
        return (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Click to upload an image</p>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Upload className="w-4 h-4 mr-2 inline" />
              Upload Image
            </button>
          </div>
        );

      default: // paragraph
        return (
          <textarea
            value={block.content}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder="Tell your story..."
            className={`${baseClasses} min-h-[60px] leading-relaxed`}
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <span className="text-sm text-slate-500">
                {post.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {post.status === 'published' && (
                <a
                  href={`https://ghost.behaviorschool.com/${post.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </a>
              )}
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish'}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete post"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Post excerpt..."
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={post.tags}
                  onChange={(e) => setPost(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Options
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-600">Featured post</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <input
          ref={titleRef}
          type="text"
          value={post.title}
          onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Post title"
          className="w-full text-5xl font-bold placeholder-slate-300 border-none outline-none mb-8 leading-tight"
        />

        {/* Content Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="group relative">
              {renderBlock(block)}
              
              {/* Block Actions */}
              <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {blocks.length > 1 && (
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Block Type Menu */}
              {showBlockMenu === block.id && (
                <div className="absolute left-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => addBlock(block.id, 'heading')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Type className="w-4 h-4" />
                      Heading
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'quote')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Quote className="w-4 h-4" />
                      Quote
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'list')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <List className="w-4 h-4" />
                      List
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'code')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Code className="w-4 h-4" />
                      Code
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'divider')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                      Divider
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}