import axios, { AxiosError } from 'axios'
import { supabase } from './supabase'

// Base URL cho API backend
const API_BASE_URL = 'https://exe201-sgk6.onrender.com/api/v1'
const CV_API_BASE_URL = 'http://14.169.93.37:3003/api/v1'

// Tạo axios instance cho general API
const apiClient = axios.create({
     baseURL: API_BASE_URL,
     headers: {
          'Content-Type': 'application/json',
     },
})

// Tạo axios instance riêng cho CV API
const cvApiClient = axios.create({
     baseURL: CV_API_BASE_URL,
     headers: {
          'Content-Type': 'application/json',
     },
})

// Interceptor để tự động thêm access token vào header cho general API
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

// Interceptor để tự động thêm access token vào header cho CV API
cvApiClient.interceptors.request.use(
     async (config) => {
          try {
               const { data: { session } } = await supabase.auth.getSession()
               console.log('CV API Session check:', {
                    hasSession: !!session,
                    hasAccessToken: !!session?.access_token,
                    tokenPreview: session?.access_token ? session.access_token.substring(0, 20) + '...' : 'none'
               })

               if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`
                    console.log('Adding auth token to CV API request:', config.url, 'Token length:', session.access_token.length)
               } else {
                    console.warn('No auth token available for CV API request:', config.url)
                    console.warn('User might not be authenticated for CV API')
               }
          } catch (error) {
               console.error('Error getting session for CV API:', error)
          }

          return config
     },
     (error) => {
          console.error('CV API Request interceptor error:', error)
          return Promise.reject(error)
     }
)

// Interceptor để xử lý response errors cho general API
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
)

// Interceptor để xử lý response errors cho CV API
cvApiClient.interceptors.response.use(
     (response) => {
          console.log('CV API Response successful:', response.config.url, response.status)
          return response
     },
     (error) => {
          console.error('CV API Error:', {
               url: error.config?.url,
               method: error.config?.method,
               status: error.response?.status,
               statusText: error.response?.statusText,
               data: error.response?.data,
               message: error.message
          })

          if (error.response?.status === 401 || error.response?.status === 403) {
               // Token hết hạn hoặc không hợp lệ
               console.error('CV API Authentication failed - token invalid or missing')
               // Check if it's specifically a "No token provided" error
               if (error.response?.data?.message === "No token provided!") {
                    console.error('No token was sent with the CV API request')
               }
          }
          return Promise.reject(error)
     }
)// API functions
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

     // CVs APIs
     cvs: {
          // Get all user CVs
          getAll: async () => {
               try {
                    console.log("CV loading started...")
                    const response = await cvApiClient.get('/cvs')
                    console.log("CV loading completed!")
                    return response.data
               } catch (error) {
                    console.error('Error loading CVs:', error)
                    // Return empty array or handle gracefully
                    if (error instanceof Error && 'response' in error) {
                         const axiosError = error as AxiosError
                         if (axiosError.response?.status === 500) {
                              console.warn('Server error loading CVs - some files may be missing')
                              return { data: [], message: 'Some CVs may be unavailable due to server issues' }
                         }
                    }
                    throw error
               }
          },

          // Get CV by ID
          getById: async (id: string | number) => {
               try {
                    const response = await cvApiClient.get(`/cvs/${id}`)
                    console.log("CV loading...")
                    return response.data
               } catch (error) {
                    console.error('Error loading CV:', error)
                    if (error instanceof Error && 'response' in error) {
                         const axiosError = error as AxiosError
                         if (axiosError.response?.status === 500) {
                              console.warn(`CV ${id} file may be missing on server`)
                         }
                    }
                    throw error
               }
          },

          // Upload new CV
          upload: async (cvData: { cv: File; name: string; description: string }) => {
               console.log('API: Starting CV upload...')
               console.log('Upload data:', {
                    fileName: cvData.cv.name,
                    fileSize: cvData.cv.size,
                    fileType: cvData.cv.type,
                    name: cvData.name,
                    description: cvData.description
               })

               const formData = new FormData()
               formData.append('cv', cvData.cv)
               formData.append('name', cvData.name)
               formData.append('description', cvData.description)

               console.log('FormData entries:')
               for (const [key, value] of formData.entries()) {
                    console.log(key, value instanceof File ? `File: ${value.name}` : value)
               }

               try {
                    console.log('Sending upload request to:', '/cvs')
                    const response = await cvApiClient.post('/cvs', formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                         },
                    })

                    console.log('Upload response:', response.data)
                    return response.data
               } catch (error) {
                    console.error('Upload API error:', error)
                    if (error instanceof Error && 'response' in error) {
                         const axiosError = error as AxiosError
                         console.error('Error response:', axiosError.response?.data)
                         console.error('Error status:', axiosError.response?.status)
                    }
                    throw error
               }
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

               const response = await cvApiClient.patch(`/cvs/${id}`, formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               })
               return response.data
          },

          // Delete CV
          delete: async (id: string | number) => {
               const response = await cvApiClient.delete(`/cvs/${id}`)
               return response.data
          },

          // Download CV
          download: async (id: string | number) => {
               try {
                    const response = await cvApiClient.get(`/cvs/${id}/download`, {
                         responseType: 'blob',
                    })
                    return response.data
               } catch (error) {
                    console.error('Error downloading CV:', error)
                    if (error instanceof Error && 'response' in error) {
                         const axiosError = error as AxiosError
                         if (axiosError.response?.status === 500) {
                              throw new Error('CV file not found on server. Please re-upload your CV.')
                         }
                    }
                    throw error
               }
          },

          // Get CV preview URL with authentication
          getPreviewUrl: async (id: string | number) => {
               try {
                    const blob = await cvApiClient.get(`/cvs/${id}/download`, {
                         responseType: 'blob',
                    })
                    return URL.createObjectURL(blob.data)
               } catch (error) {
                    console.error('Error creating preview URL:', error)
                    if (error instanceof Error && 'response' in error) {
                         const axiosError = error as AxiosError
                         if (axiosError.response?.status === 500) {
                              console.warn(`CV file ${id} not found on server`)
                         }
                    }
                    return null
               }
          },

          // Get direct API URL (for reference only, requires auth header)
          getDirectUrl: (id: string | number) => {
               return `${CV_API_BASE_URL}/cvs/${id}/download`
          },
     },

     // Conversations APIs (Chat Feature)
     conversations: {
          // Get all conversations for the authenticated user
          getAll: async () => {
               const response = await apiClient.get('/conversations')
               return response.data
          },

          // Create a new conversation
          create: async (data: { freelancerId: string; jobId?: string }) => {
               const response = await apiClient.post('/conversations', data)
               return response.data
          },

          // Get messages in a conversation
          getMessages: async (conversationId: string, params?: { limit?: number; offset?: number }) => {
               const response = await apiClient.get(`/conversations/${conversationId}/messages`, { params })
               return response.data
          },

          // Send a message in a conversation
          sendMessage: async (conversationId: string, data: {
               content: string;
               messageType?: 'text' | 'image' | 'file' | 'system';
               fileUrl?: string
          }) => {
               const response = await apiClient.post(`/conversations/${conversationId}/messages`, data)
               return response.data
          },

          // Mark messages as read
          markAsRead: async (conversationId: string) => {
               const response = await apiClient.patch(`/conversations/${conversationId}/read`)
               return response.data
          },

          // Get unread message count
          getUnreadCount: async () => {
               const response = await apiClient.get('/conversations/unread-count')
               return response.data
          },
     },

     // Users APIs (robust fallback system)
     users: {
          // Get user by ID with multiple fallback strategies
          getById: async (userId: string) => {
               console.log(`Fetching user data for ID: ${userId}`)

               try {
                    // First try to get from Supabase auth if it's the current user
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session?.user?.id === userId) {
                         console.log('Returning current user data from Supabase auth')
                         return {
                              data: {
                                   id: session.user.id,
                                   name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Current User',
                                   email: session.user.email || '',
                                   avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                              }
                         }
                    }

                    console.log(`User ${userId} is not the current user, trying alternative sources...`)

                    // For other users, try multiple fallback strategies
                    // Strategy 1: Try different external API endpoints
                    const possibleEndpoints = [
                         `/user/${userId}`,
                         `/users/${userId}`,
                         `/user/profile/${userId}`,
                         `/profile/${userId}`
                    ]

                    for (const endpoint of possibleEndpoints) {
                         try {
                              console.log(`Trying external API endpoint: ${endpoint}`)
                              const response = await cvApiClient.get(endpoint)
                              if (response.data) {
                                   console.log(`Successfully fetched user from ${endpoint}`)
                                   const userData = response.data.data || response.data
                                   return {
                                        data: {
                                             id: userData.id || userId,
                                             name: userData.name || userData.full_name || userData.username || 'User',
                                             email: userData.email || '',
                                             avatar_url: userData.avatar_url || userData.picture || userData.photo || null
                                        }
                                   }
                              }
                         } catch (apiError) {
                              const axiosError = apiError as AxiosError
                              console.log(`Endpoint ${endpoint} failed:`, axiosError?.response?.status)
                              continue
                         }
                    }

                    console.log(`All API endpoints failed for user ${userId}, using fallback`)
                    // Final fallback: return a user object with readable ID
                    return {
                         data: {
                              id: userId,
                              name: `User ${userId.substring(0, 8)}...`,
                              email: '',
                              avatar_url: null
                         }
                    }

               } catch (error) {
                    console.error(`Error fetching user ${userId}:`, error)
                    return {
                         data: {
                              id: userId,
                              name: `User ${userId.substring(0, 8)}...`,
                              email: '',
                              avatar_url: null
                         }
                    }
               }
          },

          // Get multiple users by IDs with improved fallback
          getByIds: async (userIds: string[]) => {
               console.log(`Fetching ${userIds.length} users:`, userIds)

               try {
                    const { data: { session } } = await supabase.auth.getSession()
                    const currentUserId = session?.user?.id

                    const results: Array<{
                         id: string
                         name: string
                         email: string
                         avatar_url: string | null
                    }> = []

                    // Add current user data if requested
                    if (userIds.includes(currentUserId!) && session?.user) {
                         console.log('Adding current user data to batch results')
                         results.push({
                              id: session.user.id,
                              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Current User',
                              email: session.user.email || '',
                              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                         })
                    }

                    // For other users, fetch individually with fallbacks
                    const otherUserIds = userIds.filter(id => id !== currentUserId)
                    if (otherUserIds.length > 0) {
                         console.log(`Fetching ${otherUserIds.length} other users individually`)

                         const userPromises = otherUserIds.map(async (id) => {
                              try {
                                   const userResponse = await api.users.getById(id)
                                   return userResponse.data
                              } catch (error) {
                                   console.error(`Failed to fetch user ${id}:`, error)
                                   return {
                                        id,
                                        name: `User ${id.substring(0, 8)}...`,
                                        email: '',
                                        avatar_url: null
                                   }
                              }
                         })

                         const otherUsers = await Promise.all(userPromises)
                         results.push(...otherUsers)
                    }

                    console.log(`Successfully fetched ${results.length} users`)
                    return results

               } catch (error) {
                    console.error('Error fetching multiple users:', error)
                    return userIds.map(id => ({
                         id,
                         name: `User ${id.substring(0, 8)}...`,
                         email: '',
                         avatar_url: null
                    }))
               }
          },

          // Get current user data from Supabase
          getCurrentUser: async () => {
               try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session?.user) {
                         return {
                              data: {
                                   id: session.user.id,
                                   name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Current User',
                                   email: session.user.email || '',
                                   avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                              }
                         }
                    }
                    return { data: null }
               } catch (error) {
                    console.error('Error fetching current user from Supabase:', error)
                    return { data: null }
               }
          }
     }
}
// Export apiClient cho trường hợp muốn custom call
export default apiClient
