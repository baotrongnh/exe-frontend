import axios from 'axios'
import { supabase } from './supabase'

// Base URL cho API backend
const API_BASE_URL = 'http://14.169.93.37:3003/api/v1'

// Tạo axios instance
const apiClient = axios.create({
     baseURL: API_BASE_URL,
     headers: {
          'Content-Type': 'application/json',
     },
})

// Interceptor để tự động thêm access token vào header
apiClient.interceptors.request.use(
     async (config) => {
          try {
               const { data: { session } } = await supabase.auth.getSession()
               console.log('Session check:', {
                    hasSession: !!session,
                    hasAccessToken: !!session?.access_token,
                    tokenPreview: session?.access_token ? session.access_token.substring(0, 20) + '...' : 'none'
               })

               if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`
                    console.log('Adding auth token to request:', config.url, 'Token length:', session.access_token.length)
               } else {
                    console.warn('No auth token available for request:', config.url)
                    // You might want to throw an error here or redirect to login
                    console.warn('User might not be authenticated')
               }
          } catch (error) {
               console.error('Error getting session:', error)
          }

          return config
     },
     (error) => {
          console.error('Request interceptor error:', error)
          return Promise.reject(error)
     }
)

// Interceptor để xử lý response errors
apiClient.interceptors.response.use(
     (response) => {
          console.log('API Response successful:', response.config.url, response.status)
          return response
     },
     (error) => {
          console.error('API Error:', {
               url: error.config?.url,
               method: error.config?.method,
               status: error.response?.status,
               statusText: error.response?.statusText,
               data: error.response?.data,
               message: error.message
          })

          if (error.response?.status === 401 || error.response?.status === 403) {
               // Token hết hạn hoặc không hợp lệ
               console.error('Authentication failed - token invalid or missing')
               // Check if it's specifically a "No token provided" error
               if (error.response?.data?.message === "No token provided!") {
                    console.error('No token was sent with the request')
               }
               // Có thể redirect đến trang login tại đây nếu cần
          }
          return Promise.reject(error)
     }
)// API functions
export const api = {
     // Jobs APIs
     jobs: {
          getAll: async (params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get('/jobs', { params })
               return response.data
          },

          getById: async (id: string | number) => {
               const response = await apiClient.get(`/jobs/${id}`)
               return response.data
          },

          create: async (jobData: Record<string, unknown>) => {
               const response = await apiClient.post('/jobs', jobData)
               return response.data
          },

          update: async (id: string | number, jobData: Record<string, unknown>) => {
               const response = await apiClient.put(`/jobs/${id}`, jobData)
               return response.data
          },

          delete: async (id: string | number) => {
               const response = await apiClient.delete(`/jobs/${id}`)
               return response.data
          },
     },

     // CVs APIs
     cvs: {
          // Get all user CVs
          getAll: async () => {
               const response = await apiClient.get('/cvs')
               return response.data
          },

          // Get CV by ID
          getById: async (id: string | number) => {
               const response = await apiClient.get(`/cvs/${id}`)
               return response.data
          },

          // Upload new CV
          upload: async (cvData: { cv: File; name: string; description: string }) => {
               const formData = new FormData()
               formData.append('cv', cvData.cv)
               formData.append('name', cvData.name)
               formData.append('description', cvData.description)

               const response = await apiClient.post('/cvs', formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               })
               return response.data
          },

          // Update CV (edit name, description, or replace file)
          update: async (id: string | number, cvData: { cv?: File; name?: string; description?: string }) => {
               const formData = new FormData()

               if (cvData.cv) {
                    formData.append('cv', cvData.cv)
               }
               if (cvData.name) {
                    formData.append('name', cvData.name)
               }
               if (cvData.description) {
                    formData.append('description', cvData.description)
               }

               const response = await apiClient.patch(`/cvs/${id}`, formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               })
               return response.data
          },

          // Delete CV
          delete: async (id: string | number) => {
               const response = await apiClient.delete(`/cvs/${id}`)
               return response.data
          },

          // Download CV
          download: async (id: string | number) => {
               const response = await apiClient.get(`/cvs/${id}/download`, {
                    responseType: 'blob',
               })
               return response.data
          },

          // Get CV preview URL with authentication
          getPreviewUrl: async (id: string | number) => {
               try {
                    const blob = await apiClient.get(`/cvs/${id}/download`, {
                         responseType: 'blob',
                    })
                    return URL.createObjectURL(blob.data)
               } catch (error) {
                    console.error('Error creating preview URL:', error)
                    return null
               }
          },

          // Get direct API URL (for reference only, requires auth header)
          getDirectUrl: (id: string | number) => {
               return `${API_BASE_URL}/cvs/${id}/download`
          },
     },

     // Thêm các API khác tại đây khi cần
     // Ví dụ:
     // users: {
     //   getProfile: async () => {
     //     const response = await apiClient.get('/users/profile')
     //     return response.data
     //   },
     // },
}

// Export apiClient cho trường hợp muốn custom call
export default apiClient
