import axios from "axios";
import { supabase } from "./supabase";

// Base URL cho API backend
const API_BASE_URL = "http://14.169.93.37:3003"; // Backend API base URL

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
          'Content-Type': 'application/json',
     },
})

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
      const formData = new FormData();
      formData.append("cv", cvData.cv);
      formData.append("name", cvData.name);
      formData.append("description", cvData.description);

      const response = await apiClient.post("/api/cvs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    // Update CV (edit name, description, or replace file)
    update: async (id: string | number, cvData: { cv?: File; name?: string; description?: string }) => {
      const formData = new FormData();

      if (cvData.cv) {
        formData.append("cv", cvData.cv);
      }
      if (cvData.name) {
        formData.append("name", cvData.name);
      }
      if (cvData.description) {
        formData.append("description", cvData.description);
      }

      const response = await apiClient.patch(`/api/cvs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    // Delete CV
    delete: async (id: string | number) => {
      const response = await apiClient.delete(`/api/cvs/${id}`);
      return response.data;
    },

    // Download CV
    download: async (id: string | number) => {
      const response = await apiClient.get(`/api/cvs/${id}/download`, {
        responseType: "blob",
      });
      return response.data;
    },

    // Get CV preview URL with authentication
    getPreviewUrl: async (id: string | number) => {
      try {
        const blob = await apiClient.get(`/api/cvs/${id}/download`, {
          responseType: "blob",
        });
        return URL.createObjectURL(blob.data);
      } catch (error) {
        console.error("Error creating preview URL:", error);
        return null;
      }
    },

    // Get direct API URL (for reference only, requires auth header)
    getDirectUrl: (id: string | number) => {
      return `${API_BASE_URL}/api/cvs/${id}/download`;
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
};
// Export apiClient cho trường hợp muốn custom call
export default apiClient;
