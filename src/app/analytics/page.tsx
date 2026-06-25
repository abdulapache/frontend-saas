'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import apiClient from '@/lib/api/client'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const PLATFORM_COLORS: Record<string, string> = {
  Facebook:  '#1877f2',
  Instagram: '#e1306c',
  Twitter:   '#1da1f2',
  LinkedIn:  '#0077b5',
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)

  // Fetch connected account IDs first
  const { data: accounts = [] } = useQuery<{ id: string }[]>({
    queryKey: ['social-accounts'],
    queryFn:  () => apiClient.get('/api/social-accounts').then(r => r.data),
  })

  const accountIds = accounts.map(a => a.id)

  // Build query string with accountIds array
  const overviewParams = new URLSearchParams({ days: String(days) })
  accountIds.forEach(id => overviewParams.append('accountIds', id))

  const { data: overview } = useQuery({
    queryKey: ['analytics', 'overview', days, accountIds],
    queryFn:  () => apiClient.get(`/api/analytics/overview?${overviewParams}`).then(r => r.data),
    enabled:  true,
  })

  const { data: platforms } = useQuery({
    queryKey: ['analytics', 'platforms', days],
    queryFn:  () => apiClient.get(`/api/analytics/platforms?days=${days}`).then(r => r.data),
  })

  const dailyData  = overview?.dailyStats ?? []
  const topPosts   = overview?.topPosts   ?? []
  const pieData    = (platforms ?? []).map((p: { platform: string; totalLikes: number }) => ({
    name:  p.platform,
    value: p.totalLikes,
  }))

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Track your performance across all platforms</p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  days === d ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Impressions',  value: overview?.totalImpressions?.toLocaleString() ?? '—' },
            { label: 'Reach',        value: overview?.totalReach?.toLocaleString() ?? '—' },
            { label: 'Likes',        value: overview?.totalLikes?.toLocaleString() ?? '—' },
            { label: 'Comments',     value: overview?.totalComments?.toLocaleString() ?? '—' },
            { label: 'Avg. Engagement', value: `${(overview?.avgEngagement ?? 0).toFixed(2)}%` },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Daily Reach Chart */}
          <div className="col-span-2 card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Daily Reach & Likes</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="likes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="reach" stroke="#3b82f6" fill="url(#reach)" strokeWidth={2} name="Reach" />
                <Area type="monotone" dataKey="likes" stroke="#8b5cf6" fill="url(#likes)" strokeWidth={2} name="Likes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Breakdown Pie */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Platform Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry: { name: string }, i: number) => (
                    <Cell key={i} fill={PLATFORM_COLORS[entry.name] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Performance Table */}
        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Platform Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="px-5 py-3 text-gray-500 font-medium">Platform</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Posts</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Likes</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Reach</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(platforms ?? []).map((p: { platform: string; posts: number; totalLikes: number; totalReach: number; avgEngagement: number }) => (
                  <tr key={p.platform} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p.platform] ?? '#94a3b8' }} />
                        <span className="font-medium text-gray-900">{p.platform}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{p.posts}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.totalLikes?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.totalReach?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(p.avgEngagement * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-gray-600">{p.avgEngagement?.toFixed(2)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
