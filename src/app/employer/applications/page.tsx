"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/components/toast";
import {
  Users,
  Clock,
  CircleCheck,
  XCircle,
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  Briefcase,
  Calendar,
  DollarSign,
  Timer,
  Check,
  X,
  Loader2
} from "lucide-react";

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string | null;
  proposed_rate: number | null;
  proposed_timeline: string | null;
  portfolio_links: string[];
  status: "pending" | "accepted" | "rejected";
  employer_notes: string | null;
  rejection_reason: string | null;
  createdAt: string;
  updatedAt: string;
  freelancerId: string | null;
  // Populated fields
  job?: {
    id: string;
    title: string;
  };
  user: {
    full_name: string;
    cv: {
      id: string;
      name: string;
      file_name: string;
    };
  };
}

export default function EmployerApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ is_verified: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which button is loading

  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Check authentication and verification status
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.employer.getProfile();

        if (response && response.id) {
          setProfile(response);

          if (!response.is_verified) {
            toast.showToast("You need to be verified to view applications", "warning");
            router.push("/employer/dashboard");
          }
        } else {
          toast.showToast("Failed to fetch profile", "error");
        }
      } catch {
        toast.showToast("Failed to fetch profile", "error");
      }
    };

    fetchProfile();
  }, [user, router]);

  // Fetch all applications for all jobs
  useEffect(() => {
    if (!profile?.is_verified) {
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);

        const jobsResponse = await api.jobs.getMyJobs();

        if (jobsResponse.success && jobsResponse.data) {
          const allApplications: Application[] = [];

          for (const job of jobsResponse.data) {
            try {
              const appResponse = await api.applications.getJobApplications(job.id);

              if (appResponse.success && appResponse.data) {
                const appsWithJob = appResponse.data.map((app: Application) => ({
                  ...app,
                  job: {
                    id: job.id,
                    title: job.title,
                  },
                }));
                allApplications.push(...appsWithJob);
              }
            } catch {
              // Continue fetching other applications
            }
          }

          setApplications(allApplications);
        }
      } catch {
        toast.showToast("Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [profile]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Helper function to download CV
  const handleDownloadCV = async (cvId: string, fileName: string) => {
    try {
      const blob = await api.cvs.download(cvId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.showToast("Failed to download CV", "error");
    }
  };

  // Handle Accept Application
  const handleAccept = async (applicationId: string) => {
    try {
      setActionLoading(`accept-${applicationId}`);

      await api.applications.accept(applicationId, 'Application accepted');

      toast.showToast("Application accepted successfully!", "success");

      // Refresh applications
      const jobsResponse = await api.jobs.getMyJobs();
      if (jobsResponse.success && jobsResponse.data) {
        const allApplications: Application[] = [];
        for (const job of jobsResponse.data) {
          try {
            const appResponse = await api.applications.getJobApplications(job.id);
            if (appResponse.success && appResponse.data) {
              const appsWithJob = appResponse.data.map((app: Application) => ({
                ...app,
                job: { id: job.id, title: job.title },
              }));
              allApplications.push(...appsWithJob);
            }
          } catch (error) {
            console.error(`Error fetching applications for job ${job.id}:`, error);
          }
        }
        setApplications(allApplications);
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.showToast("Failed to accept application. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject Application
  const handleReject = async (applicationId: string) => {
    try {
      setActionLoading(`reject-${applicationId}`);

      await api.applications.reject(applicationId, 'Application rejected');

      toast.showToast("Application rejected.", "success");

      // Refresh applications
      const jobsResponse = await api.jobs.getMyJobs();
      if (jobsResponse.success && jobsResponse.data) {
        const allApplications: Application[] = [];
        for (const job of jobsResponse.data) {
          try {
            const appResponse = await api.applications.getJobApplications(job.id);
            if (appResponse.success && appResponse.data) {
              const appsWithJob = appResponse.data.map((app: Application) => ({
                ...app,
                job: { id: job.id, title: job.title },
              }));
              allApplications.push(...appsWithJob);
            }
          } catch (error) {
            console.error(`Error fetching applications for job ${job.id}:`, error);
          }
        }
        setApplications(allApplications);
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.showToast("Failed to reject application. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Schedule Interview - Create conversation with applicant
  const handleScheduleInterview = async (applicationId: string, freelancerId: string, jobId: string) => {
    try {
      setActionLoading(`interview-${applicationId}`);

      const payload = {
        freelancerId: freelancerId,
        jobId: jobId
      };

      await api.conversations.create(payload);

      toast.showToast("Interview scheduled! A conversation has been created.", "success");

    } catch {
      toast.showToast("Failed to schedule interview. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Check if a job has an accepted application
  const jobHasAcceptedApplication = (jobId: string) => {
    return applications.some((app) => app.job_id === jobId && app.status === "accepted");
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.user?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (app.job?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || app.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const allCount = applications.length;
  const pendingCount = applications.filter((app) => app.status === "pending").length;
  const acceptedCount = applications.filter((app) => app.status === "accepted").length;
  const rejectedCount = applications.filter((app) => app.status === "rejected").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Applications</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Review and manage candidate applications
              </p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5 cursor-pointer" onClick={() => setSelectedTab("all")}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">All Applications</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{allCount}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-blue-200 p-5 cursor-pointer" onClick={() => setSelectedTab("pending")}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-blue-700">Pending</div>
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{pendingCount}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-purple-200 p-5 cursor-pointer" onClick={() => setSelectedTab("accepted")}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-purple-700">Accepted</div>
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <CircleCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600">{acceptedCount}</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-red-200 p-5 cursor-pointer" onClick={() => setSelectedTab("rejected")}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-red-700">Rejected</div>
              <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or job title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-300 shadow-sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-2">
              {[
                { key: "all", label: "All", count: allCount },
                { key: "pending", label: "Pending", count: pendingCount },
                { key: "accepted", label: "Accepted", count: acceptedCount },
                { key: "rejected", label: "Rejected", count: rejectedCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap rounded-t-lg ${selectedTab === tab.key
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {tab.label} <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-200">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-16 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                <p className="text-gray-600 mt-6 text-lg font-medium">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-6">There are no applications matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTab("all");
                  }}
                  className="bg-white hover:bg-gray-50"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                            <span className="text-white font-bold text-lg">
                              {(application.user?.full_name || "Unknown")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {application.user?.full_name || "Unknown"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {application.user?.cv?.name || "No CV"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                              <Briefcase className="w-4 h-4 text-indigo-600" />
                              <span className="font-medium">{application.job?.title || "Position"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Applied {formatDate(application.createdAt)}
                            </div>
                          </div>
                          {application.cover_letter && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                              <p className="text-sm text-gray-700 line-clamp-2">{application.cover_letter}</p>
                            </div>
                          )}
                          {application.proposed_rate && (
                            <div className="flex items-center gap-4 text-sm mb-3">
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-700">${application.proposed_rate}</span>
                              </div>
                              {application.proposed_timeline && (
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                                  <Timer className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-blue-700">{application.proposed_timeline}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {application.user?.cv && (
                            <button
                              onClick={() => handleDownloadCV(application.user.cv.id, application.user.cv.file_name)}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 hover:gap-3 transition-all bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg"
                            >
                              <Download className="w-4 h-4" />
                              Download Resume
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      {application.status === "pending" && !jobHasAcceptedApplication(application.job_id) && (
                        <div className="flex flex-col gap-2 mt-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white w-32"
                            onClick={() => handleAccept(application.id)}
                            disabled={actionLoading === `accept-${application.id}`}
                          >
                            {actionLoading === `accept-${application.id}` ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent w-32"
                            onClick={() => handleScheduleInterview(
                              application.id,
                              application.applicant_id,
                              application.job_id
                            )}
                            disabled={actionLoading === `interview-${application.id}`}
                          >
                            {actionLoading === `interview-${application.id}` ? "Creating..." : "Schedule Interview"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent w-32"
                            onClick={() => handleReject(application.id)}
                            disabled={actionLoading === `reject-${application.id}`}
                          >
                            {actionLoading === `reject-${application.id}` ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      {application.status === "pending" && jobHasAcceptedApplication(application.job_id) && (
                        <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                          <p className="text-xs text-yellow-800 font-medium">
                            Another candidate has been accepted for this position
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
