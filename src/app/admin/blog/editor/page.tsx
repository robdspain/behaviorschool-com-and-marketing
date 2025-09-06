"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Settings,
  Plus,
  Type,
  Quote,
  Image as ImageIcon,
  List,
  Minus,
  Code,
  Upload
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  status: 'draft' | 'published';
  featured: boolean;
  featureImage: string;
}

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'list' | 'divider' | 'code';
  content: string;
  level?: number; // for headings
  focused: boolean;
}

export default function GhostEditor() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '', focused: false }
  ]);
  const [post, setPost] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    featured: false,
    featureImage: ''
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null);

  useEffect(() => {
    // Focus title on load
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

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
      if (filtered.length === 0) {
        return [{ id: Date.now().toString(), type: 'paragraph', content: '', focused: true }];
      }
      return filtered;
    });
  };

  const focusBlock = (id: string) => {
    setBlocks(prev => prev.map(b => ({ ...b, focused: b.id === id })));
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block && block.content === '' && blocks.length > 1) {
        e.preventDefault();
        deleteBlock(blockId);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateBlock(blockId, result.images[0].url);
      } else {
        console.error('Upload failed');
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  const generateContent = () => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          const level = block.level || 2;
          return `${'#'.repeat(level)} ${block.content}`;
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
      const response = await fetch('/api/admin/blog/create', {
        method: 'POST',
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
        alert('Failed to save post: ' + error.message);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const renderBlock = (block: Block) => {
    const baseClasses = "w-full bg-transparent border-none outline-none resize-none text-slate-900 placeholder-slate-400";
    
    const handleFocus = () => focusBlock(block.id);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      updateBlock(block.id, e.target.value);

    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
          <HeadingTag className="text-3xl font-bold leading-tight">
            <input
              type="text"
              value={block.content}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder="Heading"
              className={`${baseClasses} text-3xl font-bold`}
            />
          </HeadingTag>
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
            {block.content ? (
              <div className="relative">
                <Image 
                  src={block.content} 
                  alt="Uploaded image" 
                  className="max-w-full h-auto rounded-lg mx-auto"
                  width={800} // You might need to adjust these values
                  height={600} // based on your image sizes
                />
                <button
                  onClick={() => updateBlock(block.id, '')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Click to upload an image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, block.id)}
                  className="hidden"
                  id={`image-upload-${block.id}`}
                />
                <label
                  htmlFor={`image-upload-${block.id}`}
                  className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </label>
              </>
            )}
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
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving || !post.title.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <input
            ref={titleRef}
            type="text"
            placeholder="Post title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full text-5xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none bg-transparent leading-tight"
          />
        </div>

        {/* Content Blocks */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="group relative">
              {/* Block Menu Button */}
              <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Block Content */}
              <div className={`${block.focused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} rounded-lg transition-all`}>
                {renderBlock(block)}
              </div>

              {/* Block Menu */}
              {showBlockMenu === block.id && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => addBlock(block.id, 'paragraph')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Paragraph"
                    >
                      <Type className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'heading')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Heading"
                    >
                      <Type className="w-5 h-5 mx-auto font-bold" />
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'quote')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Quote"
                    >
                      <Quote className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'list')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="List"
                    >
                      <List className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    <button
                      onClick={() => addBlock(block.id, 'image')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Image"
                    >
                      <ImageIcon className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'code')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Code"
                    >
                      <Code className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => addBlock(block.id, 'divider')}
                      className="p-3 hover:bg-slate-100 rounded-lg text-center"
                      title="Divider"
                    >
                      <Minus className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Post settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Feature Image Section */}
              <div className="border-b border-slate-200 pb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Feature Image
                </label>
                {post.featureImage ? (
                  <div className="relative">
                    <Image 
                      src={post.featureImage} 
                      alt="Feature" 
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      width={320} // Adjust as needed
                      height={128} // Adjust as needed
                    />
                    <button
                      onClick={() => setPost({ ...post, featureImage: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">Upload feature image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="feature-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, upload to your storage service
                          const url = URL.createObjectURL(file);
                          setPost({ ...post, featureImage: url });
                        }
                      }}
                    />
                    <label
                      htmlFor="feature-image"
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Choose file
                    </label>
                  </div>
                )}
              </div>

              {/* Basic Settings */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Basic Settings</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex items-center text-sm">
                      <span className="text-slate-500 bg-slate-50 px-3 py-2 border border-r-0 border-slate-200 rounded-l-lg">
                        /blog/
                      </span>
                      <input
                        type="text"
                        placeholder="post-url-slug"
                        className="flex-1 border border-slate-200 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      placeholder="Optional excerpt for previews..."
                      value={post.excerpt}
                      onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                      className="w-full h-20 text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {post.excerpt.length}/300 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="BCBA, education, behavior-analysis"
                      value={post.tags}
                      onChange={(e) => setPost({ ...post, tags: e.target.value })}
                      className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Publishing</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Visibility
                    </label>
                    <select className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="public">Public</option>
                      <option value="members">Members only</option>
                      <option value="paid">Paid members only</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Leave empty to publish immediately
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={post.featured}
                        onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Feature this post</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-6">
                      Featured posts appear at the top of your blog
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO & Social */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">SEO & Social</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder="Custom title for search engines"
                      className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended: 70 characters or less
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      placeholder="Custom description for search engines and social media"
                      className="w-full h-16 text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended: 156 characters or less
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Social Image
                    </label>
                    <div className="text-xs text-slate-500 mb-2">
                      Custom image for social media shares (optional)
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced */}
              <div className="pb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Advanced</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Author
                    </label>
                    <select className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="rob-spain">Rob Spain</option>
                      <option value="behavior-school">Behavior School</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/original-post"
                      className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      For republished content only
                    </p>
                  </div>

                  <div>
                    <details className="group">
                      <summary className="text-sm font-medium text-slate-700 cursor-pointer list-none">
                        <span className="flex items-center justify-between">
                          Code Injection
                          <span className="text-slate-400 group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </span>
                      </summary>
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Post Header
                          </label>
                          <textarea
                            placeholder="<style>...</style> or <script>...</script>"
                            className="w-full h-16 text-xs font-mono border border-slate-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Post Footer
                          </label>
                          <textarea
                            placeholder="<script>...</script>"
                            className="w-full h-16 text-xs font-mono border border-slate-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}