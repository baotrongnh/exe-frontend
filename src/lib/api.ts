import axios, { AxiosError } from "axios";
import { supabase } from "./supabase";

// Base URL cho API backend
const API_BASE_URL = "http://14.169.93.37:3003"; // Backend API base URL
const CV_API_BASE_URL = "http://14.169.93.37:3003/api/";

// Tạo axios instance cho general API
const apiClient = axios.create({
     baseURL: API_BASE_URL,
     headers: {
          "Content-Type": "application/json",
     },
});

// Tạo axios instance riêng cho CV API
const cvApiClient = axios.create({
     baseURL: CV_API_BASE_URL,
     headers: {
          "Content-Type": "application/json",
     },
});

// Interceptor để tự động thêm access token vào header cho general API
apiClient.interceptors.request.use(
     async (config) => {
          try {
               const {
                    data: { session },
               } = await supabase.auth.getSession();
               console.log("Session check:", {
                    hasSession: !!session,
                    hasAccessToken: !!session?.access_token,
                    tokenPreview: session?.access_token ? session.access_token.substring(0, 20) + "..." : "none",
               });

               if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                    console.log("Adding auth token to request:", config.url, "Token length:", session.access_token.length);
               } else {
                    console.warn("No auth token available for request:", config.url);
                    // You might want to throw an error here or redirect to login
                    console.warn("User might not be authenticated");
               }
          } catch (error) {
               console.error("Error getting session:", error);
          }

          return config;
     },
     (error) => {
          console.error("Request interceptor error:", error);
          return Promise.reject(error);
     }
);

// Interceptor để tự động thêm access token vào header cho CV API
cvApiClient.interceptors.request.use(
     async (config) => {
          try {
               const {
                    data: { session },
               } = await supabase.auth.getSession();
               console.log("CV API Session check:", {
                    hasSession: !!session,
                    hasAccessToken: !!session?.access_token,
                    tokenPreview: session?.access_token ? session.access_token.substring(0, 20) + "..." : "none",
               });

               if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                    console.log("Adding auth token to CV API request:", config.url, "Token length:", session.access_token.length);
               } else {
                    console.warn("No auth token available for CV API request:", config.url);
                    console.warn("User might not be authenticated for CV API");
               }
          } catch (error) {
               console.error("Error getting session for CV API:", error);
          }

          return config;
     },
     (error) => {
          console.error("CV API Request interceptor error:", error);
          return Promise.reject(error);
     }
);

// Interceptor để xử lý response errors cho general API
apiClient.interceptors.response.use(
     (response) => {
          console.log("API Response successful:", response.config.url, response.status);
          return response;
     },
     (error) => {
          console.error("API Error:", {
               url: error.config?.url,
               method: error.config?.method,
               status: error.response?.status,
               statusText: error.response?.statusText,
               data: error.response?.data,
               message: error.message,
          });

          if (error.response?.status === 401 || error.response?.status === 403) {
               // Token hết hạn hoặc không hợp lệ
               console.error("Authentication failed - token invalid or missing");
               // Check if it's specifically a "No token provided" error
               if (error.response?.data?.message === "No token provided!") {
                    console.error("No token was sent with the request");
               }
               // Có thể redirect đến trang login tại đây nếu cần
          }
          return Promise.reject(error);
     }
);

// Interceptor để xử lý response errors cho CV API
cvApiClient.interceptors.response.use(
     (response) => {
          console.log("CV API Response successful:", response.config.url, response.status);
          return response;
     },
     (error) => {
          console.error("CV API Error:", {
               url: error.config?.url,
               method: error.config?.method,
               status: error.response?.status,
               statusText: error.response?.statusText,
               data: error.response?.data,
               message: error.message,
          });

          if (error.response?.status === 401 || error.response?.status === 403) {
               // Token hết hạn hoặc không hợp lệ
               console.error("CV API Authentication failed - token invalid or missing");
               // Check if it's specifically a "No token provided" error
               if (error.response?.data?.message === "No token provided!") {
                    console.error("No token was sent with the CV API request");
               }
          }
          return Promise.reject(error);
     }
); // API functions
export const api = {
     // Jobs APIs
     jobs: {
          getAll: async (params?: { page?: number; limit?: number; search?: string; title?: string }) => {
               const response = await apiClient.get("/api/jobs", { params });
               return response.data;
          },

          getById: async (id: string | number) => {
               const response = await apiClient.get(`/api/jobs/${id}`);
               return response.data;
          },

          create: async (jobData: Record<string, unknown>) => {
               const response = await apiClient.post("/api/jobs", jobData);
               return response.data;
          },

          update: async (id: string | number, jobData: Record<string, unknown>) => {
               const response = await apiClient.put(`/api/jobs/${id}`, jobData);
               return response.data;
          },

          delete: async (id: string | number) => {
               const response = await apiClient.delete(`/api/jobs/${id}`);
               return response.data;
          },

          // Get jobs posted by current employer
          getMyJobs: async (params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get("/api/jobs/my-jobs", { params });
               return response.data;
          },
     },

     // Applications APIs
     applications: {
          getAll: async (params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get("/api/applications", { params });
               return response.data;
          },

          apply: async (jobId: string) => {
               const response = await apiClient.post(`/api/applications/${jobId}`);
               return response.data;
          },

          // Get applications for a specific job (employer only)
          getJobApplications: async (jobId: string, params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get(`/api/jobs/${jobId}/applications`, { params });
               return response.data;
          },
     },

     // CVs APIs
     cvs: {
          // Get all user CVs
          getAll: async () => {
               const response = await apiClient.get("/api/cvs");
               return response.data;
          },

          // Get CV by ID
          getById: async (id: string | number) => {
               const response = await apiClient.get(`/api/cvs/${id}`);
               return response.data;
          },
          // Upload new CV
          upload: async (cvData: { cv: File; name: string; description: string }) => {
               console.log("API: Starting CV upload...");
               console.log("Upload data:", {
                    fileName: cvData.cv.name,
                    fileSize: cvData.cv.size,
                    fileType: cvData.cv.type,
                    name: cvData.name,
                    description: cvData.description,
               });

               const formData = new FormData();
               formData.append("cv", cvData.cv);
               formData.append("name", cvData.name);
               formData.append("description", cvData.description);

               console.log("FormData entries:");
               for (const [key, value] of formData.entries()) {
                    console.log(key, value instanceof File ? `File: ${value.name}` : value);
               }

               try {
                    console.log("Sending upload request to:", "/cvs");
                    const response = await cvApiClient.post("/cvs", formData, {
                         headers: {
                              "Content-Type": "multipart/form-data",
                         },
                    });

                    console.log("Upload response:", response.data);
                    return response.data;
               } catch (error) {
                    console.error("Upload API error:", error);
                    if (error instanceof Error && "response" in error) {
                         const axiosError = error as AxiosError;
                         console.error("Error response:", axiosError.response?.data);
                         console.error("Error status:", axiosError.response?.status);
                    }
                    throw error;
               }
          },
          // Delete CV
          delete: async (id: string | number) => {
               const response = await cvApiClient.delete(`/cvs/${id}`);
               return response.data;
          },

          // Download CV
          download: async (id: string | number) => {
               try {
                    const response = await cvApiClient.get(`/cvs/${id}/download`, {
                         responseType: "blob",
                    });
                    return response.data;
               } catch (error) {
                    console.error("Error downloading CV:", error);
                    if (error instanceof Error && "response" in error) {
                         const axiosError = error as AxiosError;
                         if (axiosError.response?.status === 500) {
                              throw new Error("CV file not found on server. Please re-upload your CV.");
                         }
                    }
                    throw error;
               }
          },

          // Get CV preview URL with authentication
          getPreviewUrl: async (id: string | number) => {
               try {
                    const blob = await cvApiClient.get(`/cvs/${id}/download`, {
                         responseType: "blob",
                    });
                    return URL.createObjectURL(blob.data);
               } catch (error) {
                    console.error("Error creating preview URL:", error);
                    if (error instanceof Error && "response" in error) {
                         const axiosError = error as AxiosError;
                         if (axiosError.response?.status === 500) {
                              console.warn(`CV file ${id} not found on server`);
                         }
                    }
                    return null;
               }
          },

          // Get direct API URL (for reference only, requires auth header)
          getDirectUrl: (id: string | number) => {
               return `${CV_API_BASE_URL}/cvs/${id}/download`;
          },
     },

     // Employer APIs
     employer: {
          // Register as employer
          register: async (employerData: { company_name: string; company_website?: string; company_logo?: string; company_description?: string; industry?: string; company_size?: string }) => {
               const response = await apiClient.post("/api/employer/register", employerData);
               return response.data;
          },

          // Get current user's employer profile
          getProfile: async () => {
               const response = await apiClient.get("/api/employer/profile");
               return response.data;
          },

          // Update employer profile
          updateProfile: async (employerData: { company_name?: string; company_website?: string; company_logo?: string; company_description?: string; industry?: string; company_size?: string }) => {
               const response = await apiClient.put("/api/employer/profile", employerData);
               return response.data;
          },

          // Get list of verified employers (public)
          getVerifiedEmployers: async (params?: { page?: number; limit?: number }) => {
               const response = await apiClient.get("/api/employers", { params });
               return response.data;
          },

          // Get employer by ID (public)
          getById: async (id: string) => {
               const response = await apiClient.get(`/api/employers/${id}`);
               return response.data;
          },
     },

     // Admin APIs
     admin: {
          // Verify employer profile
          verifyEmployer: async (id: string, isVerified: boolean) => {
               const response = await apiClient.patch(`/admin/employers/${id}/verify`, {
                    is_verified: isVerified,
               });
               return response.data;
          },
     },

     // Conversations APIs (Chat Feature)
     conversations: {
          // Get all conversations for the authenticated user
          getAll: async () => {
               const response = await apiClient.get("/conversations");
               return response.data;
          },

          // Create a new conversation
          create: async (data: { freelancerId: string; jobId?: string }) => {
               const response = await apiClient.post("/conversations", data);
               return response.data;
          },

          // Get messages in a conversation
          getMessages: async (conversationId: string, params?: { limit?: number; offset?: number }) => {
               const response = await apiClient.get(`/conversations/${conversationId}/messages`, { params });
               return response.data;
          },

          // Send a message in a conversation
          sendMessage: async (
               conversationId: string,
               data: {
                    content: string;
                    messageType?: "text" | "image" | "file" | "system";
                    fileUrl?: string;
               }
          ) => {
               const response = await apiClient.post(`/conversations/${conversationId}/messages`, data);
               return response.data;
          },

          // Mark messages as read
          markAsRead: async (conversationId: string) => {
               const response = await apiClient.patch(`/conversations/${conversationId}/read`);
               return response.data;
          },

          // Get unread message count
          getUnreadCount: async () => {
               const response = await apiClient.get("/conversations/unread-count");
               return response.data;
          },
     },
};
// Export apiClient cho trường hợp muốn custom call
export default apiClient;
