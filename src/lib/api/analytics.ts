import apiClient from './client'

export const analyticsApi = {
  getOverview: async (days = 30, accountIds?: string[]) => {
    const params = new URLSearchParams({ days: String(days) })
    accountIds?.forEach(id => params.append('accountIds', id))
    const res = await apiClient.get(`/api/analytics/overview?${params}`)
    return res.data
  },

  getPostMetrics: async (postId: string, from?: string, to?: string) => {
    const res = await apiClient.get(`/api/analytics/posts/${postId}`, {
      params: { from, to },
    })
    return res.data
  },

  getFollowerGrowth: async (accountId: string, from?: string, to?: string) => {
    const res = await apiClient.get(`/api/analytics/accounts/${accountId}/growth`, {
      params: { from, to },
    })
    return res.data
  },

  getPlatformBreakdown: async (days = 30) => {
    const res = await apiClient.get('/api/analytics/platforms', { params: { days } })
    return res.data
  },
}
