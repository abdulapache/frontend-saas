import apiClient from './client'

export interface PostMedia {
  id:        string
  mediaUrl:  string
  mediaType: string
  sortOrder: number
}

export interface PostTarget {
  id:             string
  socialAccountId: string
  platform:       string
  status:         string
  platformPostId: string | null
  errorMessage:   string | null
}

export interface Post {
  id:          string
  userId:      string
  title:       string | null
  content:     string
  status:      string
  scheduledAt: string | null
  publishedAt: string | null
  tags:        string[]
  targets:     PostTarget[]
  media:       PostMedia[]
  createdAt:   string
}

export interface CreatePostData {
  content:          string
  title?:           string
  scheduledAt?:     string
  socialAccountIds: string[]
  platforms:        string[]
  tags?:            string[]
  mediaItems?:      PostMedia[]
  requiresApproval?: boolean
}

export const postsApi = {
  create: async (data: CreatePostData): Promise<Post> => {
    const res = await apiClient.post<Post>('/api/posts', data)
    return res.data
  },

  getAll: async (params?: {
    status?:   string
    page?:     number
    pageSize?: number
  }) => {
    const res = await apiClient.get('/api/posts', { params })
    return res.data as { items: Post[]; total: number; page: number; pageSize: number }
  },

  getById: async (id: string): Promise<Post> => {
    const res = await apiClient.get<Post>(`/api/posts/${id}`)
    return res.data
  },

  update: async (id: string, data: Partial<CreatePostData>): Promise<Post> => {
    const res = await apiClient.put<Post>(`/api/posts/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`)
  },

  publishNow: async (id: string): Promise<Post> => {
    const res = await apiClient.post<Post>(`/api/posts/${id}/publish`)
    return res.data
  },

  getCalendar: async (from: string, to: string): Promise<Post[]> => {
    const res = await apiClient.get<Post[]>('/api/posts/calendar', { params: { from, to } })
    return res.data
  },

  bulkUpload: async (file: File, socialAccountIds: string[], platforms: string[]) => {
    const formData = new FormData()
    formData.append('file', file)
    socialAccountIds.forEach(id => formData.append('socialAccountIds', id))
    platforms.forEach(p => formData.append('platforms', p))
    const res = await apiClient.post('/api/posts/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },
}
