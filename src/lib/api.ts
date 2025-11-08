import axios, { AxiosError } from "axios";
import { supabase } from "./supabase";

// Base URL cho API backend
export const API_BASE_URL = "https://exe201-sgk6.onrender.com"; // Backend API base URL

// Tạo axios instance cho tất cả API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
        tokenPreview: session?.access_token
          ? session.access_token.substring(0, 20) + "..."
          : "none",
      });

      if (session?.access_token) {
        // Set authorization header - config.headers should already exist from axios
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log(
          "Adding auth token to request:",
          config.url,
          "Token length:",
          session.access_token.length
        );
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

// Interceptor để xử lý response errors cho API
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "API Response successful:",
      response.config.url,
      response.status
    );
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

// API functions
export const api = {
  // Jobs APIs
  jobs: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      title?: string;
    }) => {
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
    getJobApplications: async (
      jobId: string,
      params?: { page?: number; limit?: number }
    ) => {
      const response = await apiClient.get(`/api/jobs/${jobId}/applications`, {
        params,
      });
      return response.data;
    },

    // Accept an application (employer only)
    accept: async (applicationId: string, employerNotes?: string) => {
      const response = await apiClient.put(
        `/api/applications/${applicationId}/status`,
        {
          status: "accepted",
          employer_notes: employerNotes || "Application accepted",
        }
      );
      return response.data;
    },

    // Reject an application (employer only)
    reject: async (applicationId: string, employerNotes?: string) => {
      const response = await apiClient.put(
        `/api/applications/${applicationId}/status`,
        {
          status: "rejected",
          employer_notes: employerNotes || "Application rejected",
        }
      );
      return response.data;
    },

    // Complete an application (close the job)
    complete: async (applicationId: string) => {
      const response = await apiClient.post(`/api/applications/${applicationId}/complete`);
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
        const response = await apiClient.post("/api/cvs", formData, {
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
      const response = await apiClient.delete(`/api/cvs/${id}`);
      return response.data;
    },

    // Download CV
    download: async (id: string | number) => {
      try {
        const response = await apiClient.get(`/api/cvs/${id}/download`, {
          responseType: "blob",
        });
        return response.data;
      } catch (error) {
        console.error("Error downloading CV:", error);
        if (error instanceof Error && "response" in error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 500) {
            throw new Error(
              "CV file not found on server. Please re-upload your CV."
            );
          }
        }
        throw error;
      }
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
      return `${API_BASE_URL}/api/cvs/${id}/download`;
    },
  },

  // Employer APIs
  employer: {
    // Register as employer
    register: async (employerData: {
      company_name: string;
      company_website?: string;
      company_logo?: string;
      company_description?: string;
      industry?: string;
      company_size?: string;
    }) => {
      const response = await apiClient.post(
        "/api/employer/register",
        employerData
      );
      return response.data;
    },

    // Get current user's employer profile
    getProfile: async () => {
      const response = await apiClient.get("/api/employer/profile");
      return response.data;
    },

    // Update employer profile
    updateProfile: async (employerData: {
      company_name?: string;
      company_website?: string;
      company_logo?: string;
      company_description?: string;
      industry?: string;
      company_size?: string;
    }) => {
      const response = await apiClient.put(
        "/api/employer/profile",
        employerData
      );
      return response.data;
    },

    // Get list of verified employers (public)
    getVerifiedEmployers: async (params?: {
      page?: number;
      limit?: number;
    }) => {
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

    // Review job (approve/reject)
    reviewJob: async (jobId: string, status: "active" | "rejected") => {
      const response = await apiClient.put(`api/admin/jobs/${jobId}/review`, {
        status: status,
      });
      return response.data;
    },
  },

  // Wallet APIs
  wallet: {
    // Create new wallet
    create: async (data?: { currency?: string; initial_balance?: number }) => {
      const response = await apiClient.post("/api/wallet/create", data || {});
      return response;
    },

    // Get wallet info
    get: async () => {
      const response = await apiClient.get("/api/wallet");
      return response.data;
    },

    // Get wallet balance
    getBalance: async () => {
      const response = await apiClient.get("/api/wallet/balance");
      return response.data;
    },

    // Get wallet transactions
    getTransactions: async (params?: {
      page?: number;
      limit?: number;
      type?: "deposit" | "withdraw" | "payment" | "refund";
      startDate?: string;
      endDate?: string;
    }) => {
      const response = await apiClient.get("/api/wallet/transactions", {
        params,
      });
      return response.data;
    },

    // Deposit money
    deposit: async (data: {
      amount: number;
      method: string;
      description?: string;
    }) => {
      const response = await apiClient.post("/api/wallet/deposit", data);
      return response.data;
    },

    // Withdraw money
    withdraw: async (data: {
      amount: number;
      method: string;
      description?: string;
    }) => {
      const response = await apiClient.post("/api/wallet/withdraw", data);
      return response.data;
    },

    // Get QR code for deposit
    getCode: async () => {
      const response = await apiClient.get("/api/wallet/code");
      return response.data;
    },

    // Check payment status
    checkPayment: async (code: string) => {
      const response = await apiClient.post(`/api/wallet/recharge`, { code });
      return response.data;
    },
  },

  // Conversations APIs (Chat Feature)
  conversations: {
    // Get all conversations for the authenticated user
    getAll: async () => {
      const response = await apiClient.get("/api/conversations");
      return response.data;
    },

    // Create a new conversation
    create: async (data: { freelancerId: string; jobId?: string }) => {
      const response = await apiClient.post("/api/conversations", data);
      return response.data;
    },

    // Get messages in a conversation
    getMessages: async (
      conversationId: string,
      params?: { limit?: number; offset?: number }
    ) => {
      const response = await apiClient.get(
        `/api/conversations/${conversationId}/messages`,
        { params }
      );
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
      const response = await apiClient.post(
        `/api/conversations/${conversationId}/messages`,
        data
      );
      return response.data;
    },

    // Mark messages as read
    markAsRead: async (conversationId: string) => {
      const response = await apiClient.patch(
        `/api/conversations/${conversationId}/read`
      );
      return response.data;
    },

    // Get unread message count
    getUnreadCount: async () => {
      const response = await apiClient.get("/api/conversations/unread-count");
      return response.data;
    },
  },

  // Video Call APIs
  videoCall: {
    // Create a new video call session
    create: async (data?: { room_name?: string }) => {
      const response = await apiClient.post(
        "/api/video/calls",
        data || {}
      );
      return response.data;
    },

    // Join an existing call
    join: async (callId: string) => {
      const response = await apiClient.post(
        `/api/video/calls/${callId}/join`
      );
      return response.data;
    },

    // End a call
    end: async (callId: string) => {
      const response = await apiClient.post(
        `/api/video/calls/${callId}/end`
      );
      return response.data;
    },

    // Get call details
    get: async (callId: string) => {
      const response = await apiClient.get(
        `/api/video/calls/${callId}`
      );
      return response.data;
    },
  },

  // Deliverables APIs
  deliverables: {
    // Get all deliverables (for employer - all jobs)
    getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
      const response = await apiClient.get("/api/deliverables", { params });
      return response.data;
    },

    // Get deliverables for a specific job
    getByJob: async (jobId: string, params?: { page?: number; limit?: number }) => {
      const response = await apiClient.get(`/api/jobs/${jobId}/deliverables`, { params });
      return response.data;
    },

    // Get a specific deliverable
    getById: async (id: string) => {
      const response = await apiClient.get(`/api/deliverables/${id}`);
      return response.data;
    },

    // Submit a deliverable (freelancer)
    submit: async (data: {
      job_id: string;
      title: string;
      description: string;
      files: File[];
    }) => {
      const formData = new FormData();
      formData.append("job_id", data.job_id);
      formData.append("title", data.title);
      formData.append("description", data.description);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post("/api/deliverables", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    // Approve a deliverable (employer)
    approve: async (id: string) => {
      const response = await apiClient.patch(`/api/deliverables/${id}/approve`);
      return response.data;
    },

    // Reject a deliverable (employer)
    reject: async (id: string, data: { reason: string }) => {
      const response = await apiClient.patch(`/api/deliverables/${id}/reject`, data);
      return response.data;
    },

    // Request revision (employer)
    requestRevision: async (id: string, data: { notes: string }) => {
      const response = await apiClient.patch(`/api/deliverables/${id}/revision`, data);
      return response.data;
    },

    // Download deliverable file
    downloadFile: async (id: string, fileName: string) => {
      const response = await apiClient.get(`/api/deliverables/${id}/files/${fileName}`, {
        responseType: "blob",
      });
      return response.data;
    },
  },

  // Job Products APIs
  jobProducts: {
    // Upload job product with Firebase Storage
    // Files are automatically uploaded to Firebase Storage and stored as public URLs
    // Maximum 10 files per upload, 25MB per file
    // Supported formats: PDF, DOC, DOCX, XLS, XLSX, ZIP, JPG, PNG, GIF, TXT
    upload: async (data: {
      job_id: string;
      title: string;
      description?: string;
      files: File[];
    }) => {
      console.log("Job Products Upload - Starting Firebase upload with data:", {
        job_id: data.job_id,
        title: data.title,
        description: data.description,
        fileCount: data.files.length,
        files: data.files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

      // Validate file count
      if (data.files.length > 10) {
        throw new Error("Maximum 10 files allowed per upload");
      }

      // Validate file sizes
      const maxSize = 25 * 1024 * 1024; // 25MB
      for (const file of data.files) {
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds 25MB limit`);
        }
      }

      const formData = new FormData();
      formData.append("job_id", data.job_id);
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      try {
        // Don't set Content-Type manually - let browser set it with boundary
        console.log("Sending POST request to /api/job-products (Firebase Storage)");
        const response = await apiClient.post("/api/job-products", formData);
        console.log("Job Products Upload - Success (Firebase URLs):", response.data);
        // Response structure:
        // {
        //   success: true,
        //   message: "Job product uploaded successfully to Firebase",
        //   data: {
        //     id: "...",
        //     job_id: "...",
        //     applicant_id: "...",
        //     title: "...",
        //     description: "...",
        //     files: ["https://storage.googleapis.com/.../file1.pdf", ...],
        //     status: "pending",
        //     created_at: "..."
        //   }
        // }
        return response.data;
      } catch (error) {
        console.error("Job Products Upload - Error:", error);
        if (error instanceof Error && "response" in error) {
          const axiosError = error as AxiosError;
          console.error("Error response:", axiosError.response?.data);
          console.error("Error status:", axiosError.response?.status);
          console.error("Error headers:", axiosError.response?.headers);
        }
        throw error;
      }
    },

    // Get user's own products with pagination
    getAll: async (params?: {
      page?: number;
      limit?: number;
      status?: "pending" | "rejected" | "approved";
      job_id?: string;
      sort?: string;
      order?: "ASC" | "DESC";
    }) => {
      const response = await apiClient.get("/api/job-products", { params });
      // Response structure:
      // {
      //   success: true,
      //   data: {
      //     products: [
      //       {
      //         id: "...",
      //         job_id: "...",
      //         applicant_id: "...",
      //         title: "...",
      //         description: "...",
      //         files: [
      //           { name: "file.pdf", path: "https://...", size: 12345, mimetype: "application/pdf" }
      //         ],
      //         status: "pending",
      //         rejection_reason: null,
      //         reviewed_at: null,
      //         reviewed_by: null,
      //         created_at: "...",
      //         updated_at: "..."
      //       }
      //     ],
      //     pagination: { total: 10, page: 1, limit: 10, pages: 1 }
      //   }
      // }
      return response.data;
    },

    // Get a specific product
    getById: async (id: string) => {
      const response = await apiClient.get(`/api/job-products/${id}`);
      return response.data;
    },

    // Delete job product (pending only)
    delete: async (id: string) => {
      const response = await apiClient.delete(`/api/job-products/${id}`);
      return response.data;
    },

    // Download product file
    // Backend now serves file directly with proper headers (status 200)
    // Returns the download URL for the file
    downloadFile: async (id: string, fileIndex: number): Promise<string> => {
      console.log("=== DOWNLOAD FILE START ===");
      console.log("Product ID:", id);
      console.log("File Index:", fileIndex);

      // Simply return the API endpoint URL
      // The backend will handle the file download directly
      const downloadUrl = `${API_BASE_URL}/api/job-products/${id}/files/${fileIndex}`;
      console.log("Download URL:", downloadUrl);

      return downloadUrl;
    },

    // Get all products for a specific job (employer only)
    getByJob: async (
      jobId: string,
      params?: {
        page?: number;
        limit?: number;
        status?: "pending" | "rejected" | "approved";
        sort?: string;
        order?: "ASC" | "DESC";
      }
    ) => {
      const response = await apiClient.get(`/api/job-products/by-job/${jobId}`, { params });
      return response.data;
    },

    // Review a product (employer only)
    review: async (id: string, data: {
      status: "approved" | "rejected";
      rejection_reason?: string;
    }) => {
      const response = await apiClient.patch(`/api/job-products/${id}/review`, data);
      return response.data;
    },
  },
};
// Export apiClient cho trường hợp muốn custom call
export default apiClient;
