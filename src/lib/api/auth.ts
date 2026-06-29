import apiClient from './client'
import Cookies from 'js-cookie'

export interface LoginRequest  { email: string; password: string }
export interface RegisterRequest { firstName: string; lastName: string; email: string; password: string }
export interface AuthResponse {
  accessToken:  string
  refreshToken: string
  expiresAt:    string
  user: {
    id:        string
    email:     string
    firstName: string
    lastName:  string
    avatarUrl: string | null
    roles:     string[]
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, data)
    saveTokens(res.data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, data)
    saveTokens(res.data)
    return res.data
  },

  logout: async () => {
    const token = Cookies.get('refreshToken')
    if (token) {
      try { await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { token }) } catch {}
    }
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  },

  getMe: async () => {
    const res = await apiClient.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`)
    return res.data
  },
}

function saveTokens(auth: AuthResponse) {
  Cookies.set('accessToken',  auth.accessToken,  { expires: 1 })
  Cookies.set('refreshToken', auth.refreshToken, { expires: 30 })
}
