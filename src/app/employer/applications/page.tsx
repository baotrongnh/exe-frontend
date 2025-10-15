"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string | null;
  proposed_rate: number | null;
  proposed_timeline: string | null;
  portfolio_links: string[];
  status: "pending" | "shortlisted" | "interviewing" | "accepted" | "rejected";
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

  // Check authentication and verification status
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.employer.getProfile();
        console.log("Profile response:", response); // Debug log

        // API trả về trực tiếp profile object, không có wrapper
        if (response && response.id) {
          console.log("Setting profile:", response); // Debug log
          setProfile(response);

          if (!response.is_verified) {
            alert("You need to be verified to view applications");
            router.push("/employer/dashboard");
          }
        } else {
          console.error("Invalid profile response:", response);
          alert("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [user, router]);

  // Fetch all applications for all jobs
  useEffect(() => {
    if (!profile?.is_verified) {
      return;
    }

    console.log("Fetching applications..."); // Debug log

    const fetchApplications = async () => {
      try {
        setLoading(true);

        // First, get all jobs
        const jobsResponse = await api.jobs.getMyJobs();

        console.log("Jobs " + JSON.stringify(jobsResponse));

        if (jobsResponse.success && jobsResponse.data) {
          // Then fetch applications for each job
          const allApplications: Application[] = [];

          for (const job of jobsResponse.data) {
            try {
              const appResponse = await api.applications.getJobApplications(job.id);

              console.log("Appli " + JSON.stringify(appResponse));

              if (appResponse.success && appResponse.data) {
                // Add job info to each application
                const appsWithJob = appResponse.data.map((app: Application) => ({
                  ...app,
                  job: {
                    id: job.id,
                    title: job.title,
                  },
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
        console.error("Error fetching applications:", error);
        alert("Failed to load applications");
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
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV");
    }
  };

  // Handle Schedule Interview - Create conversation with applicant
  const handleScheduleInterview = async (applicationId: string, freelancerId: string, jobId: string) => {
    try {
      setActionLoading(`interview-${applicationId}`);
      
      console.log("=== Schedule Interview ===");
      console.log("Application ID:", applicationId);
      console.log("Freelancer ID:", freelancerId);
      console.log("Job ID:", jobId);

      const payload = {
        freelancerId: freelancerId,
        jobId: jobId
      };

      console.log("Payload to send:", payload);

      const response = await api.conversations.create(payload);
      
      console.log("Conversation created successfully:", response);
      
      alert("Interview scheduled! A conversation has been created.");
      
      // Optionally navigate to the conversation page
      // router.push(`/employer/messages?conversation=${response.data.id}`);
      
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.user?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (app.job?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || app.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const allCount = applications.length;
  const pendingCount = applications.filter((app) => app.status === "pending").length;
  const shortlistedCount = applications.filter((app) => app.status === "shortlisted").length;
  const interviewingCount = applications.filter((app) => app.status === "interviewing").length;
  const acceptedCount = applications.filter((app) => app.status === "accepted").length;
  const rejectedCount = applications.filter((app) => app.status === "rejected").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">All</div>
          <div className="text-2xl font-bold text-gray-900">{allCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Shortlisted</div>
          <div className="text-2xl font-bold text-green-600">{shortlistedCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Interviewing</div>
          <div className="text-2xl font-bold text-yellow-600">{interviewingCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Accepted</div>
          <div className="text-2xl font-bold text-purple-600">{acceptedCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input type="text" placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
            {[
              { key: "all", label: "All", count: allCount },
              { key: "pending", label: "Pending", count: pendingCount },
              { key: "shortlisted", label: "Shortlisted", count: shortlistedCount },
              { key: "interviewing", label: "Interviewing", count: interviewingCount },
              { key: "accepted", label: "Accepted", count: acceptedCount },
              { key: "rejected", label: "Rejected", count: rejectedCount },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setSelectedTab(tab.key)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-4">Loading applications...</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-semibold text-lg">
                          {(application.user?.full_name || "Unknown")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.user?.full_name || "Unknown"}</h3>
                        <p className="text-sm text-gray-600 mb-2">CV: {application.user?.cv?.name || "No CV"}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {application.job?.title || "Position"}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Applied {formatDate(application.createdAt)}
                          </div>
                        </div>
                        {application.cover_letter && <p className="text-sm text-gray-700 mb-3">{application.cover_letter}</p>}
                        {application.proposed_rate && (
                          <p className="text-sm text-gray-600 mb-2">
                            Proposed Rate: ${application.proposed_rate}
                            {application.proposed_timeline && ` - Timeline: ${application.proposed_timeline}`}
                          </p>
                        )}
                        {application.user?.cv && (
                          <button onClick={() => handleDownloadCV(application.user.cv.id, application.user.cv.file_name)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Resume ({application.user.cv.file_name})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>{application.status}</span>
                    {application.status === "pending" && (
                      <div className="flex flex-col gap-2 mt-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-32">
                          Shortlist
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
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent w-32">
                          Reject
                        </Button>
                      </div>
                    )}
                    {application.status === "shortlisted" && (
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-32 mt-2"
                        onClick={() => handleScheduleInterview(
                          application.id,
                          application.applicant_id,
                          application.job_id
                        )}
                        disabled={actionLoading === `interview-${application.id}`}
                      >
                        {actionLoading === `interview-${application.id}` ? "Creating..." : "Schedule Interview"}
                      </Button>
                    )}
                    {application.status === "interviewing" && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white w-32 mt-2">
                        Make Offer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredApplications.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
