import apiClient from './client'

export interface AppNotification {
  id:          string
  title:       string
  body:        string
  type:        string
  referenceId: string | null
  isRead:      boolean
  createdAt:   string
}

export interface Message {
  id:               string
  socialAccountId:  string
  platform:         string
  externalId:       string
  senderName:       string | null
  senderProfileUrl: string | null
  content:          string
  isRead:           boolean
  isReplied:        boolean
  assignedToUserId: string | null
  receivedAt:       string
  replies:          MessageReply[]
}

export interface MessageReply {
  id:      string
  userId:  string
  content: string
  sentAt:  string
}

export const notificationsApi = {
  getAll: async (params?: { unreadOnly?: boolean; page?: number; pageSize?: number }) => {
    const res = await apiClient.get('/api/notifications', { params })
    return res.data as { items: AppNotification[]; total: number }
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get('/api/notifications/unread-count')
    return res.data.count
  },

  markAsRead: async (id: string) => {
    await apiClient.put(`/api/notifications/${id}/read`)
  },

  markAllAsRead: async () => {
    await apiClient.put('/api/notifications/read-all')
  },
}

export const messagesApi = {
  getAll: async (params?: { platform?: string; unread?: boolean; page?: number; pageSize?: number }) => {
    const res = await apiClient.get('/api/messages', { params })
    return res.data as { items: Message[]; total: number }
  },

  getById: async (id: string): Promise<Message> => {
    const res = await apiClient.get(`/api/messages/${id}`)
    return res.data
  },

  markAsRead: async (id: string) => {
    await apiClient.put(`/api/messages/${id}/read`)
  },

  reply: async (id: string, content: string): Promise<MessageReply> => {
    const res = await apiClient.post(`/api/messages/${id}/reply`, { content })
    return res.data
  },

  assign: async (id: string, assigneeId: string) => {
    await apiClient.put(`/api/messages/${id}/assign`, { assigneeId })
  },
}
