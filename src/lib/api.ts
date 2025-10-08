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
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.access_token) {
               config.headers.Authorization = `Bearer ${session.access_token}`
          }

          return config
     },
     (error) => {
          return Promise.reject(error)
     }
)

// Interceptor để xử lý response errors
apiClient.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response?.status === 401) {
               // Token hết hạn hoặc không hợp lệ
               console.error('Unauthorized access - redirecting to login')
               // Có thể redirect đến trang login tại đây nếu cần
          }
          return Promise.reject(error)
     }
)

// API functions
export const api = {
     // Jobs APIs
     jobs: {
          getAll: async (params?: { page?: number; limit?: number; search?: string; title?: string }) => {
               const response = await apiClient.get('/jobs', { params })
               return response.data
          },

          getById: async (id: string | number) => {
               const response = await apiClient.get(`/jobs/${id}`)
               return response.data
          },

          create: async (jobData: any) => {
               const response = await apiClient.post('/jobs', jobData)
               return response.data
          },

          update: async (id: string | number, jobData: any) => {
               const response = await apiClient.put(`/jobs/${id}`, jobData)
               return response.data
          },

          delete: async (id: string | number) => {
               const response = await apiClient.delete(`/jobs/${id}`)
               return response.data
          },
     },

     // Applications APIs
     applications: {
          getAll: async (params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get('/applications', { params })
               return response.data
          },

          apply: async (jobId: string) => {
               const response = await apiClient.post(`/applications/${jobId}`)
               return response.data
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
