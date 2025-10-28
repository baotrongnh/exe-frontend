"use client";

import { useEffect, useState } from "react";
import { adminDashboardApi } from "@/lib/admin-dashboard-api";
import type { RevenueData, RevenueParams } from "@/types/admin";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueManagementPage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [params, setParams] = useState<RevenueParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  useEffect(() => {
    setMounted(true);
    fetchRevenue();
  }, [params]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDashboardApi.getRevenue(params);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load revenue data");
      }
    } catch (err: any) {
      console.error("Error fetching revenue:", err);
      setError(err.response?.data?.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handlePageChange = (newPage: number) => {
    setParams({ ...params, page: newPage });
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRevenue}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" suppressHydrationWarning>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
        <p className="text-gray-600 mt-1">
          View and analyze revenue transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.total_revenue || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data?.summary?.transaction_count || 0} transactions
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.average_amount || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Min Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.min_amount || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Max Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.max_amount || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Days Active</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.revenue_by_day?.length || 0}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={
              data?.revenue_by_day?.map((item) => ({
                date: new Date(item.date).toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                }),
                revenue: parseFloat(item.daily_revenue),
                count: parseInt(item.daily_count),
              })) || []
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === "revenue") {
                  return [formatCurrency(value), "Revenue"];
                }
                return [value, "Transactions"];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={2}
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={transaction.id}>
                      {transaction.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">
                      {transaction.wallet_code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)} {transaction.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.job ? (
                      <div>
                        <div className="font-medium">
                          {transaction.job.title}
                        </div>
                        <div className="text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              transaction.job.status === "active"
                                ? "bg-green-100 text-green-800"
                                : transaction.job.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.job.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((params.page || 1) - 1) * (params.limit || 20) + 1} to{" "}
            {Math.min(
              (params.page || 1) * (params.limit || 20),
              data?.pagination.total || 0
            )}{" "}
            of {data?.pagination.total} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange((params.page || 1) - 1)}
              disabled={params.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange((params.page || 1) + 1)}
              disabled={params.page === data?.pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
