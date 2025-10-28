"use client";

import { useEffect, useState } from "react";
import { adminDashboardApi } from "@/lib/admin-dashboard-api";
import type { ReviewsData, ReviewsParams } from "@/types/admin";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ReviewsPage() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [params, setParams] = useState<ReviewsParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  useEffect(() => {
    setMounted(true);
    fetchReviews();
  }, [params]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDashboardApi.getReviews(params);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load reviews");
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleFilterChange = (key: keyof ReviewsParams, value: any) => {
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
            onClick={fetchReviews}
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
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-600 mt-1">
          Moderate and manage platform reviews
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.statistics?.totalReviews || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {data?.statistics?.averageRating?.toFixed(1) || 0}
            </p>
            <span className="text-yellow-400">★</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {data?.statistics?.verified || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Freelancer</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.statistics?.byRole?.freelancer || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Employer</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.statistics?.byRole?.employer || 0}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                data?.statistics?.ratingDistribution
                  ? [
                      {
                        rating: "5 Stars",
                        count: data.statistics.ratingDistribution["5"] || 0,
                        fill: "#10b981",
                      },
                      {
                        rating: "4 Stars",
                        count: data.statistics.ratingDistribution["4"] || 0,
                        fill: "#84cc16",
                      },
                      {
                        rating: "3 Stars",
                        count: data.statistics.ratingDistribution["3"] || 0,
                        fill: "#f59e0b",
                      },
                      {
                        rating: "2 Stars",
                        count: data.statistics.ratingDistribution["2"] || 0,
                        fill: "#f97316",
                      },
                      {
                        rating: "1 Star",
                        count: data.statistics.ratingDistribution["1"] || 0,
                        fill: "#ef4444",
                      },
                    ]
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reviews by Role Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Reviews by Role
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Freelancer",
                    value: data?.statistics?.byRole?.freelancer || 0,
                    color: "#3b82f6",
                  },
                  {
                    name: "Employer",
                    value: data?.statistics?.byRole?.employer || 0,
                    color: "#8b5cf6",
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.name}: ${entry.value} (${(
                    (entry.value /
                      ((data?.statistics?.byRole?.freelancer || 0) +
                        (data?.statistics?.byRole?.employer || 0))) *
                    100
                  ).toFixed(1)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  {
                    name: "Freelancer",
                    value: data?.statistics?.byRole?.freelancer || 0,
                    color: "#3b82f6",
                  },
                  {
                    name: "Employer",
                    value: data?.statistics?.byRole?.employer || 0,
                    color: "#8b5cf6",
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

      {/* Verified vs Unverified Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Verification Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              {
                name: "Verified",
                count: data?.statistics?.verified || 0,
                fill: "#10b981",
              },
              {
                name: "Unverified",
                count: data?.statistics?.unverified || 0,
                fill: "#ef4444",
              },
            ]}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={params.role || ""}
              onChange={(e) =>
                handleFilterChange("role", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="freelancer">Freelancer</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={params.rating || ""}
              onChange={(e) =>
                handleFilterChange(
                  "rating",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verified
            </label>
            <select
              value={
                params.verified === undefined
                  ? ""
                  : params.verified
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                handleFilterChange(
                  "verified",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
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
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {data?.reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.title}
                  </h3>
                  {review.is_verified_user && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      review.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : review.status === "hidden"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
                {renderStars(review.rating)}
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{formatDate(review.createdAt)}</div>
                <div className="mt-1">👍 {review.helpful_count}</div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Aspect Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-1">Ease of Use</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {review.aspect_ratings.ease_of_use}
                  </span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Job Quality</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {review.aspect_ratings.job_quality}
                  </span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Support</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {review.aspect_ratings.support}
                  </span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {review.aspect_ratings.payment}
                  </span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">
                {review.role}
              </span>
              <span>{review.user.name}</span>
              <span className="text-gray-400">•</span>
              <span>{review.user.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
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
            disabled={params.page === data?.pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
