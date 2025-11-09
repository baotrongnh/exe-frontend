import axios from "axios";
import { supabase } from "./supabase";
import { API_BASE_URL } from "./api";
import type {
  ApiResponse,
  DashboardOverview,
  OverviewParams,
  RevenueData,
  RevenueParams,
  RevenueChartData,
  RevenueChartParams,
  UsersData,
  UsersParams,
  TransactionsData,
  TransactionsParams,
  ReviewsData,
  ReviewsParams,
} from "@/types/admin";

// Tạo axios instance cho Admin API
const adminApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm admin access token vào header
adminApiClient.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và error
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Admin access required");
    } else if (error.response?.status === 403) {
      console.error("Forbidden - Insufficient permissions");
    }
    return Promise.reject(error);
  }
);

// Helper function để build query string
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Admin Dashboard API Service
 */
export const adminDashboardApi = {
  /**
   * 1. Get Dashboard Overview
   * GET /admin/dashboard/overview
   */
  getOverview: async (
    params?: OverviewParams
  ): Promise<ApiResponse<DashboardOverview>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/overview${queryString}`
    );
    return response.data;
  },

  /**
   * 2. Get Revenue Details
   * GET /admin/dashboard/revenue
   */
  getRevenue: async (
    params?: RevenueParams
  ): Promise<ApiResponse<RevenueData>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/revenue${queryString}`
    );
    return response.data;
  },

  /**
   * 3. Get Revenue Chart Data
   * GET /admin/dashboard/revenue/chart
   */
  getRevenueChart: async (
    params?: RevenueChartParams
  ): Promise<ApiResponse<RevenueChartData>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/revenue/chart${queryString}`
    );
    return response.data;
  },

  /**
   * 4. Get Users Management
   * GET /admin/dashboard/users
   */
  getUsers: async (params?: UsersParams): Promise<ApiResponse<UsersData>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/users${queryString}`
    );
    return response.data;
  },

  /**
   * 5. Get Transactions Log
   * GET /admin/dashboard/transactions
   */
  getTransactions: async (
    params?: TransactionsParams
  ): Promise<ApiResponse<TransactionsData>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/transactions${queryString}`
    );
    return response.data;
  },

  /**
   * 6. Get Reviews Moderation
   * GET /admin/dashboard/reviews
   */
  getReviews: async (
    params?: ReviewsParams
  ): Promise<ApiResponse<ReviewsData>> => {
    const queryString = params ? `?${buildQueryString(params as Record<string, unknown>)}` : "";
    const response = await adminApiClient.get(
      `/admin/dashboard/reviews${queryString}`
    );
    return response.data;
  },
};

/**
 * Export individual functions for convenience
 */
export const {
  getOverview,
  getRevenue,
  getRevenueChart,
  getUsers,
  getTransactions,
  getReviews,
} = adminDashboardApi;

export default adminDashboardApi;
