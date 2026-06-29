import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

/**
 * IMPORTANT: Configure NEXT_PUBLIC_API_URL in your environment:
 * 
 * Development: .env.development (default: https://localhost:5001)
 * Production: Vercel Dashboard → Settings → Environment Variables
 * 
 * API calls will be made to the configured backend URL.
 * See ENV_SETUP.md for complete setup instructions.
 */

// Log the configured API URL (safe to log - it's public)
if (typeof window !== 'undefined') {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'relative paths (/api)';
  console.log('API Base URL:', apiUrl);
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 → refresh token
let isRedirectingToLogin = false

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    // Only handle genuine 401 responses (not network errors, not 5xx)
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const refreshToken = Cookies.get('refreshToken')
      if (!refreshToken) {
        // No refresh token at all — clear and redirect once
        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
          window.location.href = '/auth/login'
        }
        return Promise.reject(error)
      }

      try {
        const res = await axios.post('/api/auth/refresh', { token: refreshToken })
        const { accessToken, refreshToken: newRefresh } = res.data

        Cookies.set('accessToken',  accessToken,  { expires: 1 })
        Cookies.set('refreshToken', newRefresh,    { expires: 30 })

        original.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(original)
      } catch (refreshError: unknown) {
        // Only force logout if the refresh endpoint itself returned 401/403
        // (truly expired/invalid token), not on network errors
        const refreshStatus = (refreshError as { response?: { status: number } })?.response?.status
        if (refreshStatus === 401 || refreshStatus === 403) {
          if (!isRedirectingToLogin) {
            isRedirectingToLogin = true
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
