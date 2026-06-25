import apiClient from './client'

export interface SocialAccount {
  id:             string
  platform:       string
  accountName:    string
  accountHandle:  string | null
  profilePicUrl:  string | null
  tokenExpiresAt: string | null
  createdAt:      string
}

export const socialAccountsApi = {
  getAll: async (): Promise<SocialAccount[]> => {
    const res = await apiClient.get('/api/social-accounts')
    return res.data
  },

  getConnectUrl: async (platform: string): Promise<string> => {
    const res = await apiClient.get(`/api/social-accounts/connect/${platform}`)
    return res.data.authUrl
  },

  disconnect: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/social-accounts/${id}`)
  },
}
