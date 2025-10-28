"use client";

import { useEffect, useState } from "react";
import { adminDashboardApi } from "@/lib/admin-dashboard-api";
import type { DashboardOverview } from "@/types/admin";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<
    "today" | "week" | "month" | "year" | "all"
  >("week");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOverview();
  }, [period]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDashboardApi.getOverview({ period });
      if (response.success) {
        setOverview(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard overview:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOverview}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: formatNumber(overview?.users?.total_users || 0),
      change: `${overview?.users?.active_this_period || 0} active`,
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      subtitle: `${overview?.users?.freelancers || 0} freelancers, ${
        overview?.users?.employers || 0
      } employers`,
    },
    {
      title: "Revenue",
      value: formatCurrency(overview?.revenue?.total || 0),
      change: `${overview?.revenue?.transactions_count || 0} transactions`,
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      subtitle: `Avg: ${formatCurrency(
        overview?.revenue?.average_per_transaction || 0
      )}`,
    },
    {
      title: "Pending Jobs",
      value: formatNumber(overview?.jobs?.pending || 0),
      change: `${overview?.jobs?.total || 0} total jobs`,
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      subtitle: `${overview?.jobs?.active || 0} active`,
    },
    {
      title: "Reviews",
      value: formatNumber(overview?.reviews?.total || 0),
      change: `${
        typeof overview?.reviews?.average_rating === "number"
          ? overview.reviews.average_rating.toFixed(1)
          : overview?.reviews?.average_rating || 0
      }★ avg`,
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      subtitle: `${overview?.reviews.verified || 0} verified`,
    },
  ];

  return (
    <div className="p-8" suppressHydrationWarning>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin</p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {(["today", "week", "month", "year", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.title}</div>
            {stat.subtitle && (
              <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
            )}
          </div>
        ))}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Transactions Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transactions by Type
          </h2>
          <div className="space-y-3">
            {overview?.transactions?.by_type &&
              Object.entries(overview.transactions.by_type).map(
                ([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {type.replace("_", " ")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(count)}
                    </span>
                  </div>
                )
              )}
          </div>
        </div>

        {/* Jobs Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Jobs by Status
          </h2>
          <div className="space-y-3">
            {overview?.jobs && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(overview.jobs.active)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(overview.jobs.pending)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(overview.jobs.completed)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(overview.jobs.rejected)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Users Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Freelancers",
                    value: overview?.users?.freelancers || 0,
                    color: "#3b82f6",
                  },
                  {
                    name: "Employers",
                    value: overview?.users?.employers || 0,
                    color: "#8b5cf6",
                  },
                  {
                    name: "Unverified",
                    value: overview?.users?.unverified || 0,
                    color: "#ef4444",
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  {
                    name: "Freelancers",
                    value: overview?.users?.freelancers || 0,
                    color: "#3b82f6",
                  },
                  {
                    name: "Employers",
                    value: overview?.users?.employers || 0,
                    color: "#8b5cf6",
                  },
                  {
                    name: "Unverified",
                    value: overview?.users?.unverified || 0,
                    color: "#ef4444",
                  },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Types Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transactions by Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                overview?.transactions?.by_type
                  ? [
                      {
                        name: "Job Posts",
                        value: overview.transactions.by_type.job_posts,
                        fill: "#3b82f6",
                      },
                      {
                        name: "Deposits",
                        value: overview.transactions.by_type.deposits,
                        fill: "#10b981",
                      },
                      {
                        name: "Refunds",
                        value: overview.transactions.by_type.refunds,
                        fill: "#f59e0b",
                      },
                      {
                        name: "Withdrawals",
                        value: overview.transactions.by_type.withdrawals,
                        fill: "#ef4444",
                      },
                    ]
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jobs and Applications Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Jobs Status Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Jobs by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                overview?.jobs
                  ? [
                      {
                        name: "Active",
                        value: overview.jobs.active,
                        fill: "#10b981",
                      },
                      {
                        name: "Pending",
                        value: overview.jobs.pending,
                        fill: "#f59e0b",
                      },
                      {
                        name: "Completed",
                        value: overview.jobs.completed,
                        fill: "#3b82f6",
                      },
                      {
                        name: "Rejected",
                        value: overview.jobs.rejected,
                        fill: "#ef4444",
                      },
                    ]
                  : []
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Status Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Applications Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Accepted",
                    value: overview?.applications?.accepted || 0,
                    color: "#10b981",
                  },
                  {
                    name: "Pending",
                    value: overview?.applications?.pending || 0,
                    color: "#f59e0b",
                  },
                  {
                    name: "Rejected",
                    value: overview?.applications?.rejected || 0,
                    color: "#ef4444",
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  {
                    name: "Accepted",
                    value: overview?.applications?.accepted || 0,
                    color: "#10b981",
                  },
                  {
                    name: "Pending",
                    value: overview?.applications?.pending || 0,
                    color: "#f59e0b",
                  },
                  {
                    name: "Rejected",
                    value: overview?.applications?.rejected || 0,
                    color: "#ef4444",
                  },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Unverified Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(overview?.users?.unverified || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(overview?.applications?.total || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Freelancer Reviews</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(overview?.reviews?.by_role?.freelancers || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Employer Reviews</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(overview?.reviews?.by_role?.employers || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
