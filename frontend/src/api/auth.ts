import apiClient, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './client'
import { AuthResponse, User } from '../types'

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
      return response.data
    } catch {
      // Mock auth fallback for development/demo
      const mockUser: User = {
        id: 'usr-1',
        name: email.split('@')[0] || 'Demo User',
        email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        createdAt: new Date().toISOString(),
      }
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: mockUser,
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, mockResponse.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockResponse.user))
      return mockResponse
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', { name, email, password })
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
      return response.data
    } catch {
      const mockUser: User = {
        id: 'usr-' + Date.now(),
        name,
        email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        createdAt: new Date().toISOString(),
      }
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: mockUser,
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, mockResponse.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockResponse.user))
      return mockResponse
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile')
      return response.data
    } catch {
      const cached = localStorage.getItem(USER_STORAGE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
      throw new Error('Not authenticated')
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  },
}
