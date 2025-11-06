'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, Edit, Trash2, Eye, Calendar, Tag, Search, ExternalLink } from 'lucide-react'

interface GhostPost {
  id: string
  title: string
  slug: string
  html: string
  feature_image: string | null
  published_at: string
  updated_at: string
  excerpt: string | null
  tags: Array<{ name: string; slug: string }>
  status: 'published' | 'draft'
}

export default function ContentPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [posts, setPosts] = useState<GhostPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Set page title
    document.title = 'Content Management | Behavior School Admin'
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
        fetchPosts()
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog/posts')
      const result = await response.json()

      console.log('Fetch posts result:', result) // Debug log

      if (result.success) {
        setPosts(result.posts)
      } else {
        console.error('Failed to fetch posts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const ghostAdminUrl = process.env.NEXT_PUBLIC_GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com'

  // Transform Ghost image URLs to use our proxy with fallback to original
  const transformImageUrl = (url: string | null, useProxy: boolean = true): string | null => {
    if (!url) return null;

    const ghostBase = ghostAdminUrl.replace(/\/$/, '');
    const ghostContentPrefix = `${ghostBase}/content/images/`;

    let transformed = url;

    // Handle protocol-relative URLs
    if (transformed.startsWith('//')) {
      transformed = 'https:' + transformed;
    }

    // Force https
    if (transformed.startsWith('http://')) {
      transformed = transformed.replace(/^http:/, 'https:');
    }

    // If not using proxy, return the direct Ghost URL
    if (!useProxy) {
      return transformed;
    }

    // Transform Ghost content images to proxy path
    if (transformed.startsWith(ghostContentPrefix)) {
      transformed = transformed.replace(ghostBase, '');
    }

    if (transformed.startsWith('/content/images/')) {
      transformed = '/media/ghost' + transformed;
    }

    return transformed;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
              <p className="text-base text-slate-600 mt-1">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
            <Link
              href="/admin/blog/editor"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Edit by URL/Slug + Filters */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quick Edit prominent across full row */}
            <div className="md:col-span-3">
              <EditBySlug />
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  {/* Feature Image */}
                  {post.feature_image && (
                    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={transformImageUrl(post.feature_image, true) || ''}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to direct Ghost URL if proxy fails
                          const directUrl = transformImageUrl(post.feature_image, false);
                          if (directUrl && e.currentTarget.src !== directUrl) {
                            console.warn('Image proxy failed, trying direct URL:', {
                              proxyUrl: e.currentTarget.src,
                              directUrl
                            });
                            e.currentTarget.src = directUrl;
                          } else {
                            // Hide image only if direct URL also fails
                            console.error('Image failed to load:', {
                              proxyUrl: transformImageUrl(post.feature_image, true),
                              directUrl,
                              originalUrl: post.feature_image
                            });
                            e.currentTarget.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-slate-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {post.status === 'published' 
                            ? `Published ${formatDate(post.published_at)}`
                            : `Updated ${formatDate(post.updated_at)}`
                          }
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{post.tags.map(t => t.name).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                      <Link
                        href={`/admin/blog/editor?id=${post.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Post
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Get started by creating your first blog post'}
            </p>
            <a
              href={`${ghostAdminUrl}/ghost/#/editor/post`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Post in Ghost
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Ghost CMS Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Connected to Ghost CMS</h3>
              <p className="text-blue-700 mb-4">
                This page displays posts from your Ghost blog. To create or edit posts, use the Ghost admin interface.
              </p>
              <a
                href={`${ghostAdminUrl}/ghost/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Ghost Admin
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function EditBySlug() {
  const [value, setValue] = useState("")
  const router = useRouter()
  const placeholder = "Paste blog URL or enter slug (e.g., act-matrix...)"

  function extractSlug(input: string): string | null {
    try {
      const trimmed = input.trim()
      if (!trimmed) return null
      // If full URL, parse and take pathname
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const u = new URL(trimmed)
        const parts = u.pathname.split("/").filter(Boolean)
        // Expect /blog/{slug}
        if (parts[0] === 'blog' && parts[1]) return parts[1]
        return parts[parts.length - 1] || null
      }
      // If starts with /, treat as path
      if (trimmed.startsWith('/')) {
        const parts = trimmed.split('/').filter(Boolean)
        if (parts[0] === 'blog' && parts[1]) return parts[1]
        return parts[parts.length - 1] || null
      }
      // Otherwise treat as slug
      return trimmed
    } catch {
      return null
    }
  }

  function go() {
    const slug = extractSlug(value)
    if (!slug) return alert('Please enter a valid blog URL or slug')
    router.push(`/admin/blog/editor?slug=${encodeURIComponent(slug)}`)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Quick Edit by URL/Slug</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={go}
          className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
        >
          Open Editor
        </button>
      </div>
    </div>
  )
}
