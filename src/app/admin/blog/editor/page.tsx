'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, Eye, ArrowLeft, Image as ImageIcon, Share2, Twitter, Facebook, Linkedin, Instagram, Tag, Upload, Code, Calendar, Plus, X, Star } from 'lucide-react'
import { RichTextEditor } from '@/components/RichTextEditor'
import { SEOPanel } from '@/components/SEOPanel'

interface GhostTag {
  id: string
  name: string
  slug: string
}

interface Post {
  id?: string
  title: string
  slug?: string
  html: string
  excerpt: string
  feature_image: string
  featured?: boolean
  status: 'draft' | 'published'
  published_at?: string | null
  meta_title: string
  meta_description: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  og_title?: string
  og_description?: string
  og_image?: string
  tags?: Array<{ id: string; name: string; slug: string }>
  codeinjection_head?: string
  codeinjection_foot?: string
  updated_at?: string
}

function BlogEditorContent() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const postSlugParam = searchParams.get('slug')
  const supabase = createClient()

  // Helper function to transform Ghost URLs to use our media proxy
  const transformGhostImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    // If it's a Ghost-hosted image, transform to use our proxy
    // Ghost returns: https://ghost.behaviorschool.com/content/images/...
    // We need: /media/ghost/content/images/...
    if (url.includes('/content/images/')) {
      const pathMatch = url.match(/\/content\/images\/.+$/);
      if (pathMatch) {
        return `/media/ghost${pathMatch[0]}`;
      }
    }

    return url;
  }

  // Helper function to transform proxy URLs back to Ghost URLs for saving
  const transformToGhostUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    // If it's our proxy URL, transform it back to Ghost URL
    // We have: /media/ghost/content/images/...
    // Ghost needs: https://ghost.behaviorschool.com/content/images/...
    if (url.startsWith('/media/ghost/content/images/')) {
      const ghostBase = process.env.NEXT_PUBLIC_GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com';
      return url.replace('/media/ghost', ghostBase);
    }

    return url;
  }

  const [post, setPost] = useState<Post>({
    title: '',
    slug: '',
    html: '',
    excerpt: '',
    feature_image: '',
    featured: false,
    status: 'draft',
    published_at: null,
    meta_title: '',
    meta_description: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    og_title: '',
    og_description: '',
    og_image: '',
    tags: [],
    codeinjection_head: '',
    codeinjection_foot: ''
  })

  const [showSocialPreview, setShowSocialPreview] = useState(false)
  const [autoPostSocial, setAutoPostSocial] = useState({
    twitter: false,
    facebook: false,
    linkedin: false,
    instagram: false
  })

  // Tag management
  const [availableTags, setAvailableTags] = useState<GhostTag[]>([])
  const [showTagModal, setShowTagModal] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagSlug, setNewTagSlug] = useState('')
  const [inlineTagInput, setInlineTagInput] = useState('')
  const [creatingInlineTag, setCreatingInlineTag] = useState(false)

  // Image upload
  const [uploading, setUploading] = useState(false)

  // Editor mode
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual')

  // Scheduling
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  // SEO Panel visibility
  const [showSEOPanel, setShowSEOPanel] = useState(false)

  useEffect(() => {
    document.title = postId ? 'Edit Post | Admin' : 'New Post | Admin'

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
        fetchTags()
        if (postId) {
          fetchPost(postId)
        } else if (postSlugParam) {
          // Lookup by slug and then load by ID for full edit capabilities
          try {
            const lookupResp = await fetch(`/api/admin/blog/posts/by-slug/${encodeURIComponent(postSlugParam)}`)
            const lookupJson = await lookupResp.json()
            if (lookupJson.success && lookupJson.post?.id) {
              await fetchPost(lookupJson.post.id)
              // Update URL to include id for stability
              const url = new URL(window.location.href)
              url.searchParams.set('id', lookupJson.post.id)
              window.history.replaceState({}, '', url.toString())
            } else {
              console.error('Post not found by slug:', lookupJson.error)
              setLoading(false)
              alert('Could not find a post with that slug')
            }
          } catch (e) {
            console.error('Error looking up post by slug', e)
            setLoading(false)
            alert('Failed to look up post by slug')
          }
        } else {
          setLoading(false)
        }
      }
    }

    checkAuth()
  }, [postId, postSlugParam, supabase, router])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/blog/tags')
      const result = await response.json()
      if (result.success) {
        setAvailableTags(result.tags)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const slugifyTag = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `tag-${Date.now()}`
  }

  const createGhostTag = async (name: string, slug?: string) => {
    const payload = {
      name,
      slug: (slug && slug.trim()) || slugifyTag(name),
    }

    const response = await fetch('/api/admin/blog/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    if (!result.success || !result.tag) {
      throw new Error(result.error || 'Failed to create tag')
    }

    setAvailableTags(prev => {
      if (prev.find(tag => tag.id === result.tag.id)) {
        return prev
      }
      return [...prev, result.tag]
    })

    return result.tag as GhostTag
  }

  const handleModalCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      const tag = await createGhostTag(newTagName.trim(), newTagSlug.trim())
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }))
      setNewTagName('')
      setNewTagSlug('')
      setShowTagModal(false)
    } catch (error) {
      console.error('Error creating tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to create tag')
    }
  }

  const handleQuickAddTag = async () => {
    const value = inlineTagInput.trim()
    if (!value) return

    const existing = availableTags.find(tag => tag.name.toLowerCase() === value.toLowerCase())
    if (existing) {
      if (!post.tags?.some(t => t.id === existing.id)) {
        setPost(prev => ({
          ...prev,
          tags: [...(prev.tags || []), existing]
        }))
      }
      setInlineTagInput('')
      return
    }

    try {
      setCreatingInlineTag(true)
      const newTag = await createGhostTag(value)
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }))
      setInlineTagInput('')
    } catch (error) {
      console.error('Error creating tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to create tag')
    } finally {
      setCreatingInlineTag(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/blog/images', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success && result.images && result.images[0]) {
        const imageUrl = transformGhostImageUrl(result.images[0].url)

        // If editing an existing post, we need to refetch to get the latest updated_at
        // Ghost updates the post internally when an image is uploaded
        if (postId) {
          try {
            // Small delay to ensure Ghost has processed the image upload
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const refetchResponse = await fetch(`/api/admin/blog/posts/${postId}`)
            const refetchResult = await refetchResponse.json()
            
            if (refetchResult.success && refetchResult.post) {
              // Update the entire post with fresh data from Ghost
              // but preserve any local edits the user might have made
              setPost(prev => ({
                ...prev,
                feature_image: imageUrl, // Use the new image
                updated_at: refetchResult.post.updated_at, // Fresh timestamp from Ghost
                id: refetchResult.post.id, // Ensure ID is current
              }))
            } else {
              // Fallback: just update the image without timestamp
              setPost(prev => ({ ...prev, feature_image: imageUrl }))
            }
          } catch (refetchError) {
            console.error('Error refetching post after image upload:', refetchError)
            // Fallback: just update the image
            setPost(prev => ({ ...prev, feature_image: imageUrl }))
          }
        } else {
          // New post - just update the image
          setPost(prev => ({ ...prev, feature_image: imageUrl }))
        }
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const insertHtmlTag = (tag: string, closing?: string) => {
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = post.html.substring(start, end)
    const beforeText = post.html.substring(0, start)
    const afterText = post.html.substring(end)

    const newText = closing
      ? `${beforeText}${tag}${selectedText}${closing}${afterText}`
      : `${beforeText}${selectedText}${tag}${afterText}`

    setPost({ ...post, html: newText })
  }

  const fetchPost = async (id: string, silent = false) => {
    if (!silent) setLoading(true)
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`)
      const result = await response.json()

      if (result.success && result.post) {
        setPost({
          id: result.post.id,
          title: result.post.title || '',
          slug: result.post.slug || '',
          html: result.post.html || '',
          excerpt: result.post.excerpt || '',
          feature_image: transformGhostImageUrl(result.post.feature_image),
          featured: result.post.featured || false,
          status: result.post.status || 'draft',
          published_at: result.post.published_at || null,
          meta_title: result.post.meta_title || '',
          meta_description: result.post.meta_description || '',
          twitter_title: result.post.twitter_title || '',
          twitter_description: result.post.twitter_description || '',
          twitter_image: transformGhostImageUrl(result.post.twitter_image),
          og_title: result.post.og_title || '',
          og_description: result.post.og_description || '',
          og_image: transformGhostImageUrl(result.post.og_image),
          tags: result.post.tags || [],
          codeinjection_head: result.post.codeinjection_head || '',
          codeinjection_foot: result.post.codeinjection_foot || '',
          updated_at: result.post.updated_at
        })

        // Set schedule if published_at is in future
        if (result.post.published_at) {
          const pubDate = new Date(result.post.published_at)
          if (pubDate > new Date()) {
            setScheduleDate(pubDate.toISOString().split('T')[0])
            setScheduleTime(pubDate.toTimeString().substring(0, 5))
          }
        }
        
        if (!silent) {
          console.log('Post data refreshed with updated_at:', result.post.updated_at)
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      if (!silent) {
        alert('Failed to load post')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!post.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      // If editing an existing post, fetch the latest version first to get current updated_at
      let latestUpdatedAt = post.updated_at
      if (postId) {
        try {
          const fetchResponse = await fetch(`/api/admin/blog/posts/${postId}`)
          const fetchResult = await fetchResponse.json()
          if (fetchResult.success && fetchResult.post) {
            latestUpdatedAt = fetchResult.post.updated_at
            console.log('Fetched latest updated_at before save:', latestUpdatedAt)
          }
        } catch (fetchError) {
          console.error('Error fetching latest post data:', fetchError)
          // Continue with existing updated_at if fetch fails
        }
      }

      const statusToSave = newStatus || post.status

      // Handle scheduling
      let publishedAt = post.published_at
      if (scheduleDate && scheduleTime && statusToSave === 'published') {
        publishedAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      } else if (statusToSave === 'published' && !publishedAt) {
        publishedAt = new Date().toISOString()
      }

      // Build the payload carefully - only include fields Ghost expects
      // Transform proxy URLs back to Ghost URLs before saving
      const payload: Record<string, unknown> = {
        title: post.title,
        slug: post.slug,
        html: post.html,
        excerpt: post.excerpt,
        feature_image: transformToGhostUrl(post.feature_image),
        featured: post.featured,
        status: statusToSave,
        published_at: publishedAt,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        twitter_title: post.twitter_title,
        twitter_description: post.twitter_description,
        twitter_image: transformToGhostUrl(post.twitter_image),
        og_title: post.og_title,
        og_description: post.og_description,
        og_image: transformToGhostUrl(post.og_image),
        codeinjection_head: post.codeinjection_head,
        codeinjection_foot: post.codeinjection_foot,
        tags: post.tags?.map(t => ({ id: t.id, name: t.name, slug: t.slug }))
      };

      // Only include updated_at for updates (PUT requests)
      if (postId && latestUpdatedAt) {
        payload.updated_at = latestUpdatedAt;
        console.log('Sending updated_at:', latestUpdatedAt);
      }

      const response = await fetch(
        postId ? `/api/admin/blog/posts/${postId}` : '/api/admin/blog/posts',
        {
          method: postId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      const result = await response.json()

      if (result.success) {
        // If publishing and auto-post is enabled, trigger Ghost social sharing
        const hasShareSelection = Object.values(autoPostSocial).some(Boolean)
        if (statusToSave === 'published' && hasShareSelection && result.post?.id) {
          try {
            await fetch('/api/admin/blog/social-post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postId: result.post.id,
                platforms: autoPostSocial,
              })
            })
          } catch (error) {
            console.error('Error triggering social share:', error)
            // Do not block publishing if sharing fails
          }
        }

        // Always refetch the complete post after save to get the latest updated_at from Ghost
        // This prevents 409 conflicts on subsequent saves
        if (result.post?.id) {
          try {
            const refetchResponse = await fetch(`/api/admin/blog/posts/${result.post.id}`)
            const refetchResult = await refetchResponse.json()
            if (refetchResult.success && refetchResult.post) {
              // Update the entire post state with fresh data from Ghost
              setPost({
                id: refetchResult.post.id,
                title: refetchResult.post.title || '',
                slug: refetchResult.post.slug || '',
                html: refetchResult.post.html || '',
                excerpt: refetchResult.post.excerpt || '',
                feature_image: refetchResult.post.feature_image || '',
                featured: refetchResult.post.featured || false,
                status: refetchResult.post.status || 'draft',
                published_at: refetchResult.post.published_at || null,
                meta_title: refetchResult.post.meta_title || '',
                meta_description: refetchResult.post.meta_description || '',
                twitter_title: refetchResult.post.twitter_title || '',
                twitter_description: refetchResult.post.twitter_description || '',
                twitter_image: refetchResult.post.twitter_image || '',
                og_title: refetchResult.post.og_title || '',
                og_description: refetchResult.post.og_description || '',
                og_image: refetchResult.post.og_image || '',
                tags: refetchResult.post.tags || [],
                codeinjection_head: refetchResult.post.codeinjection_head || '',
                codeinjection_foot: refetchResult.post.codeinjection_foot || '',
                updated_at: refetchResult.post.updated_at
              })
              console.log('Post state refreshed with latest data from Ghost')
            }
          } catch (refetchError) {
            console.error('Error refetching post after save:', refetchError)
            // Fallback to using the returned data
            setPost(prev => ({
              ...prev,
              id: result.post.id,
              updated_at: result.post.updated_at
            }))
          }
        }

        alert(`Post ${postId ? 'updated' : 'created'} successfully!`)
        if (!postId && result.post?.id) {
          router.push(`/admin/blog/editor?id=${result.post.id}`)
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
              Feature Image
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={post.feature_image}
                onChange={(e) => setPost({ ...post, feature_image: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <label className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {post.feature_image && (
              <div className="mt-4">
                <img src={post.feature_image} alt="Preview" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          {/* Featured Post Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Star className={`w-5 h-5 ${post.featured ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
              <div>
                <label className="font-semibold text-slate-900 block">
                  Feature this post
                </label>
                <p className="text-xs text-slate-600">
                  Featured posts appear prominently on the blog homepage
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={post.featured}
                onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags?.map((tag) => (
                <span key={tag.id} className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {tag.name}
                  <button
                    onClick={() => setPost({ ...post, tags: post.tags?.filter(t => t.id !== tag.id) })}
                    className="hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    const selectedTag = availableTags.find(t => t.id === e.target.value)
                    if (selectedTag && !post.tags?.find(t => t.id === selectedTag.id)) {
                      setPost({ ...post, tags: [...(post.tags || []), selectedTag] })
                    }
                    e.target.value = ''
                  }}
                  className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select existing tag...</option>
                  {availableTags.filter(t => !post.tags?.find(pt => pt.id === t.id)).map((tag) => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowTagModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Tag
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inlineTagInput}
                  onChange={(e) => setInlineTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleQuickAddTag()
                    }
                  }}
                  placeholder="Type a new tag name..."
                  className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleQuickAddTag}
                  disabled={!inlineTagInput.trim() || creatingInlineTag}
                  className="px-4 py-2 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  {creatingInlineTag ? 'Adding...' : 'Add Tag'}
                </button>
              </div>
            </div>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Content
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorMode('visual')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    editorMode === 'visual'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('html')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                    editorMode === 'html'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  HTML
                </button>
              </div>
            </div>

            {editorMode === 'visual' ? (
              <RichTextEditor
                content={post.html}
                onChange={(html) => setPost({ ...post, html })}
                placeholder="Start writing your post..."
              />
            ) : (
              <textarea
                id="html-editor"
                placeholder="Write your post content here (HTML)..."
                value={post.html}
                onChange={(e) => setPost({ ...post, html: e.target.value })}
                rows={20}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
            )}
          </div>

          {/* Scheduling */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Publication
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              {scheduleDate && scheduleTime
                ? `Post will be published on ${new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}`
                : 'Leave empty to publish immediately'}
            </p>
          </div>

          {/* Code Injection */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Injection
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Post Header (injected into {'<head>'}for this post only)
                </label>
                <textarea
                  placeholder="<!-- Custom CSS, meta tags, etc. -->"
                  value={post.codeinjection_head}
                  onChange={(e) => setPost({ ...post, codeinjection_head: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Post Footer (injected before {'</body>'} for this post only)
                </label>
                <textarea
                  placeholder="<!-- Custom JavaScript, analytics, etc. -->"
                  value={post.codeinjection_foot}
                  onChange={(e) => setPost({ ...post, codeinjection_foot: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">SEO & Optimization</h3>
              <button
                onClick={() => setShowSEOPanel(!showSEOPanel)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {showSEOPanel ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showSEOPanel && (
              <SEOPanel
                title={post.title}
                slug={post.slug || ''}
                excerpt={post.excerpt}
                content={post.html}
                onSlugChange={(newSlug) => setPost({ ...post, slug: newSlug })}
                onExcerptChange={(newExcerpt) => setPost({ ...post, excerpt: newExcerpt })}
              />
            )}
            
            {!showSEOPanel && (
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
            )}
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
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostSocial.instagram}
                    onChange={(e) => setAutoPostSocial({ ...autoPostSocial, instagram: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-medium text-slate-700">Post to Instagram when published</span>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Note: These toggles mirror Ghost’s built-in sharing flow. Make sure the networks are enabled inside Ghost Admin → Settings → Integrations.
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

      {/* Tag Creation Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTagModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Tag</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g. BCBA Exam Prep"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug (optional)
                </label>
                <input
                  type="text"
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(e.target.value)}
                  placeholder="e.g. bcba-exam-prep"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate from name</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTagModal(false)}
                className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalCreateTag}
                disabled={!newTagName.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Create Tag
              </button>
            </div>
          </div>
        </div>
      )}
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
