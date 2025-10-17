'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, Eye, ArrowLeft, Image as ImageIcon, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'

interface Post {
  id?: string
  title: string
  html: string
  excerpt: string
  feature_image: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  og_title?: string
  og_description?: string
  og_image?: string
  updated_at?: string
}

function BlogEditorContent() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const supabase = createClient()

  const [post, setPost] = useState<Post>({
    title: '',
    html: '',
    excerpt: '',
    feature_image: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    og_title: '',
    og_description: '',
    og_image: ''
  })

  const [showSocialPreview, setShowSocialPreview] = useState(false)
  const [autoPostSocial, setAutoPostSocial] = useState({
    twitter: false,
    facebook: false,
    linkedin: false
  })

  useEffect(() => {
    document.title = postId ? 'Edit Post | Admin' : 'New Post | Admin'

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
        if (postId) {
          fetchPost(postId)
        } else {
          setLoading(false)
        }
      }
    }

    checkAuth()
  }, [postId, supabase, router])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`)
      const result = await response.json()

      if (result.success && result.post) {
        setPost({
          id: result.post.id,
          title: result.post.title || '',
          html: result.post.html || '',
          excerpt: result.post.excerpt || '',
          feature_image: result.post.feature_image || '',
          status: result.post.status || 'draft',
          meta_title: result.post.meta_title || '',
          meta_description: result.post.meta_description || '',
          twitter_title: result.post.twitter_title || '',
          twitter_description: result.post.twitter_description || '',
          twitter_image: result.post.twitter_image || '',
          og_title: result.post.og_title || '',
          og_description: result.post.og_description || '',
          og_image: result.post.og_image || '',
          updated_at: result.post.updated_at
        })
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!post.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const statusToSave = newStatus || post.status

      const response = await fetch(
        postId ? `/api/admin/blog/posts/${postId}` : '/api/admin/blog/posts',
        {
          method: postId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...post,
            status: statusToSave
          })
        }
      )

      const result = await response.json()

      if (result.success) {
        // If publishing and auto-post is enabled, trigger social media posting
        if (statusToSave === 'published' && (autoPostSocial.twitter || autoPostSocial.facebook || autoPostSocial.linkedin)) {
          try {
            const postUrl = `https://behaviorschool.com/blog/${result.post?.slug || ''}`
            await fetch('/api/admin/blog/social-post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postUrl,
                title: post.twitter_title || post.title,
                description: post.twitter_description || post.excerpt,
                image: post.twitter_image || post.feature_image,
                platforms: autoPostSocial
              })
            })
          } catch (error) {
            console.error('Error posting to social media:', error)
            // Don't fail the save if social posting fails
          }
        }

        alert(`Post ${postId ? 'updated' : 'created'} successfully!`)
        if (!postId && result.post?.id) {
          router.push(`/admin/blog/editor?id=${result.post.id}`)
        } else if (result.post) {
          setPost(prev => ({
            ...prev,
            id: result.post.id,
            updated_at: result.post.updated_at
          }))
        }
      } else {
        alert(`Failed to ${postId ? 'update' : 'create'} post: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/content')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">
                {postId ? 'Edit Post' : 'New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={post.status}
                onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' })}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              {post.status === 'draft' && (
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Post Title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full text-4xl font-bold border-none focus:outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Feature Image */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Feature Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={post.feature_image}
              onChange={(e) => setPost({ ...post, feature_image: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            {post.feature_image && (
              <div className="mt-4">
                <img src={post.feature_image} alt="Preview" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Excerpt
            </label>
            <textarea
              placeholder="Brief description of your post..."
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content (HTML)
            </label>
            <textarea
              placeholder="Write your post content here (HTML supported)..."
              value={post.html}
              onChange={(e) => setPost({ ...post, html: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  placeholder="SEO title (defaults to post title)"
                  value={post.meta_title}
                  onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  placeholder="SEO description (defaults to excerpt)"
                  value={post.meta_description}
                  onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media Cards */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Social Media Cards
              </h3>
              <button
                onClick={() => setShowSocialPreview(!showSocialPreview)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {showSocialPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {/* Twitter/X Card */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter / X Card
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    placeholder="Defaults to post title (max 70 chars)"
                    value={post.twitter_title}
                    onChange={(e) => setPost({ ...post, twitter_title: e.target.value })}
                    maxLength={70}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">{post.twitter_title?.length || 0}/70 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    placeholder="Defaults to excerpt (max 200 chars)"
                    value={post.twitter_description}
                    onChange={(e) => setPost({ ...post, twitter_description: e.target.value })}
                    maxLength={200}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">{post.twitter_description?.length || 0}/200 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Twitter Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="Defaults to feature image (1200x628px recommended)"
                    value={post.twitter_image}
                    onChange={(e) => setPost({ ...post, twitter_image: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Facebook / Open Graph Card */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook / Open Graph
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    placeholder="Defaults to post title"
                    value={post.og_title}
                    onChange={(e) => setPost({ ...post, og_title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    OG Description
                  </label>
                  <textarea
                    placeholder="Defaults to excerpt"
                    value={post.og_description}
                    onChange={(e) => setPost({ ...post, og_description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="Defaults to feature image (1200x630px recommended)"
                    value={post.og_image}
                    onChange={(e) => setPost({ ...post, og_image: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Auto-Post to Social Media */}
            <div>
              <h4 className="text-md font-semibold text-slate-800 mb-3">
                Auto-Post on Publish
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostSocial.twitter}
                    onChange={(e) => setAutoPostSocial({ ...autoPostSocial, twitter: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-700">Post to Twitter/X when published</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostSocial.facebook}
                    onChange={(e) => setAutoPostSocial({ ...autoPostSocial, facebook: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Post to Facebook when published</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostSocial.linkedin}
                    onChange={(e) => setAutoPostSocial({ ...autoPostSocial, linkedin: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-medium text-slate-700">Post to LinkedIn when published</span>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Note: Social media API keys must be configured in settings for auto-posting to work.
              </p>
            </div>

            {/* Social Preview */}
            {showSocialPreview && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-md font-semibold text-slate-800 mb-4">Preview</h4>
                <div className="space-y-4">
                  {/* Twitter Preview */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-600 mb-2">TWITTER / X</p>
                    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                      {(post.twitter_image || post.feature_image) && (
                        <img
                          src={post.twitter_image || post.feature_image}
                          alt="Twitter preview"
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {post.twitter_title || post.title || 'Post Title'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {post.twitter_description || post.excerpt || 'Post description...'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">behaviorschool.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Facebook Preview */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-600 mb-2">FACEBOOK</p>
                    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
                      {(post.og_image || post.feature_image) && (
                        <img
                          src={post.og_image || post.feature_image}
                          alt="Facebook preview"
                          className="w-full h-52 object-cover"
                        />
                      )}
                      <div className="p-3 bg-slate-100">
                        <p className="text-xs text-slate-500 uppercase">behaviorschool.com</p>
                        <p className="font-semibold text-sm text-slate-900 mt-1">
                          {post.og_title || post.title || 'Post Title'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {post.og_description || post.excerpt || 'Post description...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    }>
      <BlogEditorContent />
    </Suspense>
  )
}
