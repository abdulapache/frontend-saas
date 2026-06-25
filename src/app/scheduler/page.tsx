'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { postsApi, Post } from '@/lib/api/posts'
import { useToast } from '@/lib/hooks/useToast'
import { Plus, Calendar, List, Trash2, Edit, Send, Clock, CheckCircle2, FileText, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  Draft:      'bg-gray-100 text-gray-600',
  Scheduled:  'bg-blue-100 text-blue-700',
  Published:  'bg-green-100 text-green-700',
  Failed:     'bg-red-100 text-red-700',
  Publishing: 'bg-yellow-100 text-yellow-700',
}

const PLATFORM_COLORS: Record<string, string> = {
  Facebook:  'bg-blue-100 text-blue-700',
  Instagram: 'bg-pink-100 text-pink-700',
  Twitter:   'bg-sky-100 text-sky-700',
  LinkedIn:  'bg-blue-100 text-blue-800',
}

const TABS = [
  { label: 'All',        value: undefined,      icon: List },
  { label: 'Scheduled',  value: 'Scheduled',    icon: Clock },
  { label: 'Publishing', value: 'Publishing',   icon: Loader2 },
  { label: 'Published',  value: 'Published',    icon: CheckCircle2 },
  { label: 'Draft',      value: 'Draft',        icon: FileText },
  { label: 'Failed',     value: 'Failed',       icon: XCircle },
]

export default function SchedulerPage() {
  const queryClient = useQueryClient()
  const toast       = useToast()
  const [status, setStatus] = useState<string | undefined>('Scheduled')

  const { data, isLoading } = useQuery({
    queryKey: ['posts', status],
    queryFn:  () => postsApi.getAll({ status, pageSize: 50 }),
    // Auto-refresh every 30 seconds so published posts move out of Scheduled automatically
    refetchInterval: 30_000,
  })

  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted.')
    },
    onError: () => toast.error('Failed to delete post.'),
  })

  const publishMutation = useMutation({
    mutationFn: postsApi.publishNow,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post queued for publishing.')
    },
    onError: () => toast.error('Failed to publish post.'),
  })

  const canEdit    = (p: Post) => p.status === 'Draft' || p.status === 'Scheduled'
  const canPublish = (p: Post) => p.status === 'Draft' || p.status === 'Scheduled'

  // Count per status for badge
  const { data: allData } = useQuery({
    queryKey: ['posts', 'all-counts'],
    queryFn:  () => postsApi.getAll({ pageSize: 100 }),
    refetchInterval: 30_000,
  })

  const counts = (allData?.items ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post Scheduler</h1>
            <p className="text-gray-500 text-sm mt-1">Create and schedule posts across all platforms</p>
          </div>
          <Link href="/scheduler/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New Post
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {TABS.map(tab => {
            const active = status === tab.value
            const count  = tab.value ? (counts[tab.value] ?? 0) : allData?.total ?? 0
            return (
              <button
                key={tab.label}
                onClick={() => setStatus(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Post List */}
        <div className="card divide-y divide-gray-50">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading posts...
            </div>
          ) : data?.items.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {status ? `No ${status.toLowerCase()} posts` : 'No posts yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {status === 'Published'
                  ? 'Posts will appear here once they are published.'
                  : 'Create your first post to get started.'}
              </p>
              {status !== 'Published' && (
                <Link href="/scheduler/new" className="btn-primary mt-4 inline-flex items-center gap-2">
                  <Plus size={14} /> Create Post
                </Link>
              )}
            </div>
          ) : (
            data?.items.map((post: Post) => (
              <div key={post.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 group">

                {/* Status indicator */}
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  post.status === 'Published' ? 'bg-green-500' :
                  post.status === 'Scheduled' ? 'bg-blue-500' :
                  post.status === 'Failed'    ? 'bg-red-500'   :
                  post.status === 'Publishing'? 'bg-yellow-500':
                  'bg-gray-300'
                }`} />

                {/* Platform badges */}
                <div className="flex flex-wrap gap-1 flex-shrink-0 pt-0.5 max-w-[100px]">
                  {post.targets.slice(0, 3).map(t => (
                    <span key={t.id} className={`text-xs px-1.5 py-0.5 rounded font-medium ${PLATFORM_COLORS[t.platform] ?? 'bg-gray-100 text-gray-600'}`}>
                      {t.platform}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {post.title && (
                    <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                  )}
                  <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {post.scheduledAt && (
                      <span className={`text-xs flex items-center gap-1 ${
                        post.status === 'Scheduled' && new Date(post.scheduledAt) < new Date()
                          ? 'text-orange-500'
                          : 'text-gray-400'
                      }`}>
                        <Clock size={11} />
                        {post.status === 'Published' ? 'Scheduled for ' : ''}
                        {new Date(post.scheduledAt).toLocaleString()}
                        {post.status === 'Scheduled' && new Date(post.scheduledAt) < new Date() && (
                          <span className="text-orange-500 font-medium ml-1">(overdue)</span>
                        )}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        Published {new Date(post.publishedAt).toLocaleString()}
                      </span>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status badge + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[post.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.status}
                  </span>

                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    {/* Edit — available for Draft and Scheduled */}
                    {canEdit(post) && (
                      <Link
                        href={`/scheduler/edit/${post.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit size={14} />
                      </Link>
                    )}

                    {/* Publish now — available for Draft and Scheduled */}
                    {canPublish(post) && (
                      <button
                        onClick={() => publishMutation.mutate(post.id)}
                        disabled={publishMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Publish now"
                      >
                        <Send size={14} />
                      </button>
                    )}

                    {/* Delete — always available except Publishing */}
                    {post.status !== 'Publishing' && (
                      <button
                        onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(post.id) }}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {data && data.total > 50 && (
          <p className="text-center text-sm text-gray-400">
            Showing 50 of {data.total} posts
          </p>
        )}
      </div>
    </MainLayout>
  )
}
