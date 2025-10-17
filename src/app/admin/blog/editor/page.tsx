'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, Eye, ArrowLeft, Image as ImageIcon } from 'lucide-react'

interface Post {
  id?: string
  title: string
  html: string
  excerpt: string
  feature_image: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
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
    meta_description: ''
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
