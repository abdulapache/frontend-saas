'use client'

import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import apiClient from '@/lib/api/client'
import { BarChart2, Calendar, MessageSquare, TrendingUp, ArrowUp, Clock, CheckCircle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, trend, color }: {
  label: string; value: string | number; icon: React.ElementType;
  trend?: string; color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <ArrowUp size={12} />{trend}
        </p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { data: posts } = useQuery({
    queryKey: ['posts', 'overview'],
    queryFn:  () => apiClient.get('/api/posts?pageSize=5').then(r => r.data),
    retry: false,
  })

  const { data: analytics } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn:  () => apiClient.get('/api/analytics/overview?days=30').then(r => r.data),
    retry: false,
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn:  () => apiClient.get('/api/notifications?pageSize=5').then(r => r.data),
    retry: false,
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Scheduled Posts"
            value={posts?.total ?? 0}
            icon={Calendar}
            trend="+12% this week"
            color="bg-blue-500"
          />
          <StatCard
            label="Total Reach"
            value={analytics?.totalReach?.toLocaleString() ?? 0}
            icon={TrendingUp}
            trend="+8% vs last month"
            color="bg-green-500"
          />
          <StatCard
            label="Engagement"
            value={`${(analytics?.avgEngagement ?? 0).toFixed(1)}%`}
            icon={BarChart2}
            color="bg-purple-500"
          />
          <StatCard
            label="Unread Messages"
            value={notifications?.total ?? 0}
            icon={MessageSquare}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="col-span-2 card">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Posts</h2>
              <a href="/scheduler" className="text-xs text-blue-600 hover:text-blue-700">View all</a>
            </div>
            <div className="divide-y divide-gray-50">
              {(posts?.items ?? []).map((post: { id: string; content: string; status: string; scheduledAt: string | null; targets: Array<{ platform: string }> }) => (
                <div key={post.id} className="px-5 py-4 flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    post.status === 'Published' ? 'bg-green-500' :
                    post.status === 'Scheduled' ? 'bg-blue-500' :
                    post.status === 'Failed'    ? 'bg-red-500'   : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{post.content}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {post.targets.map((t: { platform: string }) => t.platform).join(', ')}
                      </span>
                      {post.scheduledAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(post.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    post.status === 'Published' ? 'bg-green-100 text-green-700' :
                    post.status === 'Scheduled' ? 'bg-blue-100 text-blue-700'  :
                    post.status === 'Failed'    ? 'bg-red-100 text-red-700'    :
                    'bg-gray-100 text-gray-600'
                  }`}>{post.status}</span>
                </div>
              ))}
              {(!posts?.items || posts.items.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-8">No posts yet</p>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="card">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {(notifications?.items ?? []).map((n: { id: string; title: string; body: string; isRead: boolean }) => (
                <div key={n.id} className="px-5 py-3.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!notifications?.items || notifications.items.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-8">All caught up!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
