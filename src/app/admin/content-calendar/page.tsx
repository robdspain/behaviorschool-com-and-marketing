'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Calendar, Plus, Filter, Grid, List, Video, Clock, TrendingUp, AlertCircle } from 'lucide-react'

interface ContentPost {
  id: string
  title: string
  caption: string | null
  platforms: string[]
  content_type: string
  media_url: string | null
  scheduled_date: string
  timezone: string
  status: string
  tags: string[]
  notes: string | null
  character_counts: Record<string, number>
  created_at: string
  updated_at: string
}

interface PostingRecommendation {
  platform: string
  day_of_week: number
  time_window: string
  priority: string
  reason: string
}

type ViewMode = 'calendar' | 'list' | 'videos'

const PLATFORM_COLORS = {
  Instagram: 'bg-purple-500',
  LinkedIn: 'bg-blue-600',
  Facebook: 'bg-blue-800',
  Twitter: 'bg-sky-400',
  YouTube: 'bg-red-500',
  Email: 'bg-emerald-600'
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const WEEKLY_TEMPLATE = [
  {
    day: 'Monday',
    items: [
      { platform: 'LinkedIn', time: '7-9 AM', description: 'Professional tip or case study' },
      { platform: 'Email', time: '9-11 AM', description: 'Weekly newsletter or update' }
    ]
  },
  {
    day: 'Tuesday',
    items: [
      { platform: 'Instagram', time: '9-11 AM', description: 'Question clip Reel' },
      { platform: 'Twitter', time: '10 AM-12 PM', description: 'Quick tip or poll' }
    ]
  },
  {
    day: 'Wednesday',
    items: [
      { platform: 'YouTube', time: '7-9 AM', description: 'Explainer Short or repurposed Reel' },
      { platform: 'Facebook', time: '10-11 AM', description: 'Blog post share to educator groups' },
      { platform: 'LinkedIn', time: '5-6 PM', description: 'Carousel or document post' }
    ]
  },
  {
    day: 'Thursday',
    items: [
      { platform: 'Instagram', time: '9-11 AM', description: 'Educational Reel or tip' },
      { platform: 'Email', time: '9-11 AM', description: 'Campaign email or resource highlight' }
    ]
  },
  {
    day: 'Friday',
    items: [
      { platform: 'Instagram', time: '2-4 PM', description: 'Fun/engaging/relatable Reel' },
      { platform: 'Twitter', time: '11 AM-1 PM', description: 'Poll or engagement question' },
      { platform: 'Facebook', time: '10-11 AM', description: 'Community question or poll' }
    ]
  },
  {
    day: 'Saturday',
    items: [
      { platform: 'Instagram', time: '10 AM-12 PM', description: 'Evergreen or behind-the-scenes (optional)' },
      { platform: 'YouTube', time: '9 AM-12 PM', description: 'Evergreen Short (optional)' }
    ]
  },
  {
    day: 'Sunday',
    items: [
      { platform: 'All', time: 'Optional', description: 'Rest or evergreen reshare' }
    ]
  }
]

export default function ContentCalendarPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [recommendations, setRecommendations] = useState<PostingRecommendation[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null)
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    content_type: ''
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.title = 'Content Calendar | Behavior School Admin'
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchPosts()
      fetchRecommendations()
    }
    setLoading(false)
  }

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.platform) params.append('platform', filters.platform)
      if (filters.status) params.append('status', filters.status)
      if (filters.content_type) params.append('content_type', filters.content_type)

      const response = await fetch(`/api/admin/content-calendar?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/admin/posting-recommendations')
      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return posts.filter(post => post.scheduled_date.startsWith(dateStr))
  }

  const getCalendarDays = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    while (days.length < 42) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const getRecommendationForPlatformAndDay = (platform: string, dayOfWeek: number) => {
    return recommendations.filter(r => 
      r.platform === platform && 
      r.day_of_week === dayOfWeek &&
      r.priority === 'primary'
    )
  }

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Calendar</h1>
          <p className="text-gray-600">
            Plan and schedule social media posts optimized for BCBA audiences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Posts This Week"
            value={posts.filter(p => {
              const postDate = new Date(p.scheduled_date)
              const now = new Date()
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
              return postDate >= now && postDate <= weekFromNow
            }).length}
            icon={<Calendar className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Scheduled"
            value={posts.filter(p => p.status === 'scheduled').length}
            icon={<Clock className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Drafts"
            value={posts.filter(p => p.status === 'draft').length}
            icon={<AlertCircle className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Platforms Covered"
            value={new Set(posts.flatMap(p => p.platforms)).size}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Weekly Template */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Weekly Template</h2>
            <span className="text-sm text-gray-500">Auto-suggested when scheduling</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_TEMPLATE.map((day) => (
              <div key={day.day} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{day.day}</h3>
                <div className="space-y-2">
                  {day.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded-full ${PLATFORM_COLORS[item.platform as keyof typeof PLATFORM_COLORS] || 'bg-gray-400'}`} />
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          {item.platform} • {item.time}
                        </div>
                        <div className="text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('videos')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'videos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day.slice(0, 3)}
                </div>
              ))}
              
              {getCalendarDays().map((date, index) => {
                const isCurrentMonth = date.getMonth() === selectedMonth.getMonth()
                const dayPosts = getPostsForDate(date)
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.map(post => (
                        <div
                          key={post.id}
                          className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: PLATFORM_COLORS[post.platforms[0] as keyof typeof PLATFORM_COLORS] || '#gray'
                          }}
                          onClick={() => {
                            setEditingPost(post)
                            setShowCreateModal(true)
                          }}
                        >
                          <div className="text-white font-medium truncate">
                            {post.title}
                          </div>
                          <div className="text-white text-xs opacity-90">
                            {new Date(post.scheduled_date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <ContentListView 
            posts={posts} 
            onEdit={(post) => {
              setEditingPost(post)
              setShowCreateModal(true)
            }}
            onRefresh={fetchPosts}
          />
        )}

        {/* Videos View */}
        {viewMode === 'videos' && (
          <VideoGalleryView 
            onSchedule={(videoUrl) => {
              setEditingPost({
                id: '',
                title: '',
                caption: '',
                platforms: ['Instagram'],
                content_type: 'Video Clip',
                media_url: videoUrl,
                scheduled_date: new Date().toISOString(),
                timezone: 'America/Los_Angeles',
                status: 'draft',
                tags: [],
                notes: '',
                character_counts: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              setShowCreateModal(true)
            }}
          />
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <PostCreatorModal
            post={editingPost}
            recommendations={recommendations}
            onClose={() => {
              setShowCreateModal(false)
              setEditingPost(null)
            }}
            onSave={() => {
              setShowCreateModal(false)
              setEditingPost(null)
              fetchPosts()
            }}
          />
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Content List View Component
function ContentListView({ posts, onEdit, onRefresh }: { posts: ContentPost[], onEdit: (post: ContentPost) => void, onRefresh: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Content Pipeline</h2>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No posts scheduled yet. Create your first post!</p>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEdit(post)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.platforms.map(platform => (
                      <span
                        key={platform}
                        className={`px-2 py-1 rounded text-white text-xs ${PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS]}`}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  {post.caption && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.caption}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📅 {new Date(post.scheduled_date).toLocaleDateString()}</span>
                    <span>🕐 {new Date(post.scheduled_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    <span>📊 {post.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.media_url && <Video className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Video Gallery View Component
function VideoGalleryView({ onSchedule }: { onSchedule: (videoUrl: string) => void }) {
  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    // In a real implementation, this would scan the video output directory
    // For now, we'll show a placeholder
    setVideos([])
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Video Preview Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No generated videos found.</p>
            <p className="text-sm mt-2">Videos from bcba-video-generator will appear here.</p>
          </div>
        ) : (
          videos.map((videoUrl, index) => (
            <div key={index} className="border rounded-lg p-4">
              <video src={videoUrl} controls className="w-full rounded mb-2" />
              <button
                onClick={() => onSchedule(videoUrl)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Schedule This
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Post Creator Modal Component
function PostCreatorModal({ 
  post, 
  recommendations, 
  onClose, 
  onSave 
}: { 
  post: ContentPost | null
  recommendations: PostingRecommendation[]
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    caption: post?.caption || '',
    platforms: post?.platforms || [],
    content_type: post?.content_type || 'Video Clip',
    media_url: post?.media_url || '',
    scheduled_date: post?.scheduled_date ? post.scheduled_date.split('T')[0] : new Date().toISOString().split('T')[0],
    scheduled_time: post?.scheduled_date ? new Date(post.scheduled_date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '09:00',
    status: post?.status || 'draft',
    tags: post?.tags || [],
    notes: post?.notes || ''
  })

  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00-08:00` // PST

      const payload = {
        title: formData.title,
        caption: formData.caption,
        platforms: formData.platforms,
        content_type: formData.content_type,
        media_url: formData.media_url,
        scheduled_date: scheduledDateTime,
        timezone: 'America/Los_Angeles',
        status: formData.status,
        tags: formData.tags,
        notes: formData.notes
      }

      const url = post?.id 
        ? `/api/admin/content-calendar/${post.id}`
        : '/api/admin/content-calendar'
      
      const method = post?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (data.success) {
        onSave()
      } else {
        alert('Error saving post: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    } finally {
      setSaving(false)
    }
  }

  const getSuggestedTime = () => {
    if (formData.platforms.length === 0) return null

    const platform = formData.platforms[0]
    const selectedDate = new Date(formData.scheduled_date)
    const dayOfWeek = selectedDate.getDay()

    const recs = recommendations.filter(r => 
      r.platform === platform && 
      r.day_of_week === dayOfWeek &&
      r.priority === 'primary'
    )

    if (recs.length > 0) {
      return recs[0]
    }

    return null
  }

  const suggestedTime = getSuggestedTime()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">
            {post?.id ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., BCBA Exam Question: Reinforcement Schedules"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption/Description</label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Write your post caption..."
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.caption.length} characters
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium mb-2">Platforms *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.keys(PLATFORM_COLORS).map(platform => (
                <label
                  key={platform}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                    formData.platforms.includes(platform) ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, platforms: [...formData.platforms, platform] })
                      } else {
                        setFormData({ ...formData, platforms: formData.platforms.filter(p => p !== platform) })
                      }
                    }}
                    className="rounded"
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Suggested Time Alert */}
          {suggestedTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Optimal Time Suggestion</p>
                  <p className="text-sm text-blue-700">
                    Best time for {formData.platforms[0]}: {suggestedTime.time_window}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{suggestedTime.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Content Type *</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Video Clip">Video Clip</option>
              <option value="Blog Post">Blog Post</option>
              <option value="Carousel">Carousel</option>
              <option value="Text Post">Text Post</option>
              <option value="Story">Story</option>
            </select>
          </div>

          {/* Media URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Media URL</label>
            <input
              type="text"
              value={formData.media_url}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://... or path to video file"
            />
            {formData.media_url && formData.media_url.match(/\.(mp4|webm|mov)$/i) && (
              <video src={formData.media_url} controls className="mt-2 w-full max-w-md rounded" />
            )}
          </div>

          {/* Scheduled Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Scheduled Date *</label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time (PST) *</label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags/Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Exam Prep', 'IEP Tools', 'BCBA Tips', 'Product Updates', 'Testimonials', 'Clinical Skills', 'Career Advice'].map(tag => (
                <label
                  key={tag}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-sm ${
                    formData.tags.includes(tag) ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, tags: [...formData.tags, tag] })
                      } else {
                        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
                      }
                    }}
                    className="rounded"
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Internal notes, ideas, reminders..."
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={saving || !formData.title || formData.platforms.length === 0}
          >
            {saving ? 'Saving...' : (post?.id ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </div>
    </div>
  )
}
