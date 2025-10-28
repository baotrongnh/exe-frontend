"use client";

import { useEffect, useState } from "react";
import { adminDashboardApi } from "@/lib/admin-dashboard-api";
import type { TransactionsData, TransactionsParams } from "@/types/admin";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [params, setParams] = useState<TransactionsParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  useEffect(() => {
    setMounted(true);
    fetchTransactions();
  }, [params]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDashboardApi.getTransactions(params);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load transactions");
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to load transactions");
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

  const handleFilterChange = (key: keyof TransactionsParams, value: any) => {
    setParams({ ...params, [key]: value, page: 1 });
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
            onClick={fetchTransactions}
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
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">
          View and manage all system transactions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={params.type || ""}
              onChange={(e) =>
                handleFilterChange("type", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="JOB_POST">Job Post</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="REFUND">Refund</option>
              <option value="WITHDRAW">Withdraw</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={params.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Amount
            </label>
            <input
              type="number"
              value={params.minAmount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minAmount",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Min amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Amount
            </label>
            <input
              type="number"
              value={params.maxAmount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxAmount",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Max amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {data?.summary_by_type?.map((item) => (
          <div
            key={item.transaction_type}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <p className="text-sm text-gray-600 mb-1 capitalize">
              {item.transaction_type.replace("_", " ")}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(item.total_amount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.count} transactions
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction Types Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={
                  data?.summary_by_type?.map((item, index) => ({
                    name: item.transaction_type.replace("_", " "),
                    value: parseInt(item.count),
                    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
                      index % 4
                    ],
                  })) || []
                }
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.summary_by_type?.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Amount Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Total Amount by Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                data?.summary_by_type?.map((item, index) => ({
                  name: item.transaction_type.replace("_", " "),
                  amount: parseFloat(item.total_amount),
                  fill: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index % 4],
                })) || []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.wallet.wallet_code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.user.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="text-xs">
                      Before: {formatCurrency(transaction.balance_before)}
                    </div>
                    <div className="text-xs font-medium">
                      After: {formatCurrency(transaction.balance_after)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange((params.page || 1) + 1)}
              disabled={params.page === data?.pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
