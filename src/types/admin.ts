// Admin Dashboard Types

export interface DashboardOverview {
  revenue: {
    total: number | string;
    transactions_count: number;
    average_per_transaction: number | string;
  };
  platform_revenue?: {
    total_platform_fee: number | string;
    revenue_transactions: number;
    average_fee: number | string;
    total_job_value: number | string;
    total_freelancer_paid: number | string;
  };
  users: {
    total_users: number;
    freelancers: number;
    employers: number;
    unverified: number;
    active_this_period: number;
  };
  transactions: {
    total: number;
    by_type: {
      job_posts: number;
      deposits: number;
      refunds: number;
      withdrawals: number;
    };
  };
  reviews: {
    total: number;
    average_rating: number | string;
    verified?: number;
    by_role: {
      freelancers: number;
      employers: number;
    };
  };
  jobs: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    rejected: number;
  };
  applications: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
  };
  period: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  transaction_type: "JOB_POST" | "DEPOSIT" | "REFUND" | "WITHDRAW";
  amount: string;
  currency: string;
  balance_before: string;
  balance_after: string;
  reference_id: string | null;
  reference_type: "JOB" | "RECHARGE" | null;
  description: string;
  status: "completed" | "pending" | "failed";
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  wallet: {
    user_id: string;
    wallet_code: string;
  };
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

export interface RevenueTransaction {
  id: string;
  amount: string;
  currency: string;
  wallet_code: string;
  user_id: string;
  job: {
    id: string;
    title: string;
    status: string;
  };
  description: string;
  created_at: string;
}

export interface RevenueData {
  transactions: RevenueTransaction[];
  summary: {
    total_revenue: string;
    transaction_count: number;
    average_amount: string;
    min_amount: string;
    max_amount: string;
  };
  revenue_by_day: Array<{
    date: string;
    daily_revenue: string;
    daily_count: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ChartDataPoint {
  time: string;
  revenue: number;
  count: number;
}

export interface RevenueChartData {
  chartData: ChartDataPoint[];
  period: string;
  groupBy: string;
}

export interface UserActivity {
  jobs_created: number;
  applications_count: number;
  reviews_count: number;
}

export interface UserWallet {
  balance: number;
  total_spent: number;
  total_deposited: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role?: "freelancer" | "employer";
  email_confirmed: boolean;
  created_at: string;
  last_sign_in: string;
  wallet: UserWallet | null;
  activity: UserActivity;
}

export interface UsersData {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TransactionsData {
  transactions: Transaction[];
  summary_by_type: Array<{
    transaction_type: string;
    count: string;
    total_amount: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Review {
  id: string;
  user_id: string;
  user_role: "FREELANCER" | "EMPLOYER";
  rating: number;
  comment: string;
  aspects: {
    payment: number;
    support: number;
    job_quality: number;
    user_interface: number;
  };
  completed_jobs_count: number;
  total_earned: string;
  is_verified: boolean;
  is_visible: boolean;
  helpful_count: number;
  admin_response: string | null;
  status: "active" | "hidden" | "flagged";
  created_at: string;
  updated_at: string;
  reviewer: {
    id: string;
    email: string;
    full_name: string;
    role: "FREELANCER" | "EMPLOYER";
  };
}

export interface ReviewsData {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  statistics: {
    average_rating: string;
    employer_review_count: number;
    freelancer_review_count: number;
    rating_distribution: Array<{
      rating: number;
      count: string;
    }>;
  };
}

// Query Parameters Types
export interface OverviewParams {
  period?: "today" | "week" | "month" | "year" | "all";
}

export interface RevenueParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "amount" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

export interface RevenueChartParams {
  period?: "day" | "week" | "month" | "year";
}

export interface UsersParams {
  page?: number;
  limit?: number;
  role?: "freelancer" | "employer";
  verified?: boolean;
  search?: string;
  sortBy?: "created_at" | "balance" | "jobs" | "applications";
  sortOrder?: "ASC" | "DESC";
}

export interface TransactionsParams {
  page?: number;
  limit?: number;
  type?: "JOB_POST" | "DEPOSIT" | "REFUND" | "WITHDRAW";
  status?: "SUCCESS" | "PENDING" | "FAILED";
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: "amount" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

export interface ReviewsParams {
  page?: number;
  limit?: number;
  role?: "freelancer" | "employer";
  rating?: number;
  verified?: boolean;
  status?: "active" | "hidden" | "flagged";
  startDate?: string;
  endDate?: string;
  sortBy?: "rating" | "helpful_count" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
