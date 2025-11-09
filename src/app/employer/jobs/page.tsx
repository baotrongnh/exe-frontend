"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/toast";

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  post_cost: string;
  currency: string;
  status: string;
  applications_count: number;
  createdAt: string;
}

export default function MyJobsPage() {
  const router = useRouter();
  const { user, userRole, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "closed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ is_verified: boolean } | null>(null);

  // Check authentication and verification
  useEffect(() => {
    async function checkAccess() {
      if (authLoading) return;

      if (!user || userRole !== "employer") {
        router.push("/employer/dashboard");
        return;
      }

      try {
        const data = await api.employer.getProfile();
        setProfile(data);

        if (!data.is_verified) {
          showToast("Please wait for admin verification to access this page", "error");
          router.push("/employer/dashboard");
        }
      } catch (error) {
        router.push("/employer/dashboard");
      }
    }

    checkAccess();
  }, [user, userRole, authLoading, router, showToast]);

  useEffect(() => {
    async function fetchJobs() {
      if (!profile?.is_verified) return;

      try {
        setLoading(true);
        const response = await api.jobs.getMyJobs();
        setJobs(response.jobs || response.data || []);
      } catch (error) {
        showToast("Failed to load jobs", "error");
      } finally {
        setLoading(false);
      }
    }

    if (profile?.is_verified) {
      fetchJobs();
    }
  }, [profile, showToast]);

  if (authLoading || (user && userRole === "employer" && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredJobs = jobs.filter((job) => activeTab === "all" || job.status === activeTab);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      closed: "bg-gray-100 text-gray-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatBudget = (job: Job) => {
    const cost = parseFloat(job.post_cost);

    // Handle case where post_cost is not provided (NaN or 0)
    if (isNaN(cost) || cost === 0) {
      return "Contact for price";
    }

    if (job.currency === "VND") {
      return `${cost.toLocaleString('vi-VN')} VNĐ`;
    }
    return `$${cost.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Manage your job postings and track applications
            </p>
          </div>
          <Link href="/employer/post-job" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Total Jobs</div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">4</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-green-700">Active Jobs</div>
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">2</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-blue-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-blue-700">Total Applicants</div>
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">118</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-purple-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-purple-700">Total Views</div>
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600">771</div>
          </div>
        </div>

        {/* Tabs and View Toggle */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-2">
              {[
                { key: "all", label: "All", count: jobs.length },
                { key: "active", label: "Active", count: jobs.filter((j) => j.status === "active").length },
                { key: "pending", label: "Pending", count: jobs.filter((j) => j.status === "pending").length },
                { key: "closed", label: "Closed", count: jobs.filter((j) => j.status === "closed").length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "all" | "active" | "pending" | "closed")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap rounded-t-lg ${activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {tab.label}{" "}
                  <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-200">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 font-medium text-lg">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Start by posting your first job</p>
                <Link href="/employer/post-job" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Post New Job
                </Link>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 p-6" : "divide-y divide-gray-100"}>
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`${viewMode === "list" ? "p-6 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent" : "border border-gray-200 rounded-lg p-6"} transition-all duration-200 cursor-pointer group`}
                    onClick={() => router.push(`/employer/jobs/${job.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/employer/jobs/${job.id}`} className="hover:text-indigo-600 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                          </Link>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.job_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatBudget(job)}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-900 font-medium">{job.applications_count || 0}</span>
                        <span className="text-gray-600">applicants</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(job.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/employer/applications?job=${job.id}`}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Applications
                      </Link>
                      <button
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.status === "active" ? "Close" : "Reopen"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
