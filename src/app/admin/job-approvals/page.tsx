"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient, { api } from "@/lib/api"
import { useToast } from "@/components/toast"

interface JobPost {
     id: string
     owner_id: string
     title: string
     description: string
     image_url: string | null
     job_type: string
     budget_type: string
     post_cost: string
     currency: string
     experience_level: string
     deadline: string | null
     status: string
     applications_count: number
     skills_required: string[]
     rejection_reason: string | null
     created_at: string
     updated_at: string
     category_id: string | null
}

interface JobPostDisplay {
     id: string | number
     title: string
     company: string
     companyLogo: string
     location: string
     type: string
     salary: string
     status: string
     postedDate: string
     description: string
     tags: string[]
     post_cost: string
     currency: string
}

export default function JobApprovalsPage() {
     const [searchQuery, setSearchQuery] = useState("")
     const [selectedTab, setSelectedTab] = useState("pending")
     const [jobPosts, setJobPosts] = useState<JobPostDisplay[]>([])
     const [loading, setLoading] = useState(true)
     const [actionLoading, setActionLoading] = useState<string | null>(null) // Track which job is being processed
     const toast = useToast()

     useEffect(() => {
          fetchPendingJobs()
     }, [])

     const transformJobData = (job: JobPost): JobPostDisplay => {
          // Format salary from post_cost
          const cost = parseFloat(job.post_cost)

          // Handle case where post_cost is not provided (NaN or 0)
          let salary = "Contact for price"
          if (!isNaN(cost) && cost > 0) {
               if (job.currency === "VND") {
                    salary = `${(cost / 1000000).toFixed(1)}tr VNĐ`
               } else {
                    salary = `$${cost.toFixed(2)}`
               }
          }

          // Get company logo (first letter of owner_id for now, or could fetch from employer profile)
          const companyLogo = job.title.charAt(0).toUpperCase()

          // Format date
          const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
               year: 'numeric'
          })

          return {
               id: job.id,
               title: job.title,
               company: "Company", // TODO: Fetch from employer profile using owner_id
               companyLogo: companyLogo,
               location: "Remote", // TODO: Add location field to API
               type: job.job_type.replace('_', '-'),
               salary: salary,
               status: job.status,
               postedDate: postedDate,
               description: job.description,
               tags: job.skills_required,
               post_cost: job.post_cost,
               currency: job.currency
          }
     }

     const fetchPendingJobs = async () => {
          try {
               setLoading(true)

               // Try to fetch from /api/admin/jobs/pending first
               // If it fails, fallback to /api/jobs and filter by status
               let response
               try {
                    response = await apiClient.get("/api/admin/jobs/pending")
               } catch (adminError) {
                    console.log("Admin endpoint failed, using /api/jobs instead")
                    response = await apiClient.get("/api/jobs")
               }

               console.log("=== API Response ===")
               console.log("Full response:", response.data)

               const jobs: JobPost[] = response.data.data || response.data
               const transformedJobs = jobs.map(transformJobData)

               setJobPosts(transformedJobs)
          } catch (error) {
               console.error("Error fetching pending jobs:", error)
               setJobPosts([])
          } finally {
               setLoading(false)
          }
     }

     const handleApprove = async (jobId: string | number) => {
          try {
               setActionLoading(jobId.toString())
               console.log("Approving job:", jobId)

               const response = await api.admin.reviewJob(jobId.toString(), "active")

               console.log("Approve response:", response)

               // Update local state - remove from pending or update status
               setJobPosts(prevJobs =>
                    prevJobs.map(job =>
                         job.id === jobId
                              ? { ...job, status: "active" }
                              : job
                    )
               )

               // Show success message (you can add toast notification here)
               toast.showToast("Job approved successfully!", "success")

               // Refresh the list
               await fetchPendingJobs()
          } catch (error) {
               console.error("Error approving job:", error)
               toast.showToast("Failed to approve job. Please try again.", "error")
          } finally {
               setActionLoading(null)
          }
     }

     const handleReject = async (jobId: string | number) => {
          try {
               setActionLoading(jobId.toString())
               console.log("Rejecting job:", jobId)

               const response = await api.admin.reviewJob(jobId.toString(), "rejected")

               console.log("Reject response:", response)

               // Update local state
               setJobPosts(prevJobs =>
                    prevJobs.map(job =>
                         job.id === jobId
                              ? { ...job, status: "rejected" }
                              : job
                    )
               )

               // Show success message
               toast.showToast("Job rejected successfully!", "success")

               // Refresh the list
               await fetchPendingJobs()
          } catch (error) {
               console.error("Error rejecting job:", error)
               toast.showToast("Failed to reject job. Please try again.", "error")
          } finally {
               setActionLoading(null)
          }
     }

     const filteredJobs = jobPosts.filter(
          (job) =>
               job.status === selectedTab &&
               (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchQuery.toLowerCase())),
     )

     const pendingCount = jobPosts.filter((job) => job.status === "pending").length
     const approvedCount = jobPosts.filter((job) => job.status === "approved").length
     const rejectedCount = jobPosts.filter((job) => job.status === "rejected").length

     if (loading) {
          return (
               <div className="p-8 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                         <p className="text-gray-600">Loading jobs...</p>
                    </div>
               </div>
          )
     }

     return (
          <div className="p-8">
               <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Job Post Approvals</h1>
                    <p className="text-gray-600 mt-1">Review and approve job postings from employers</p>
                    <Button onClick={fetchPendingJobs} className="mt-4" variant="outline">
                         Refresh Data
                    </Button>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Pending Review</div>
                         <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Approved</div>
                         <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Rejected</div>
                         <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                    </div>
               </div>

               {/* Job Posts List */}
               <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                         <div className="flex items-center justify-between gap-4 mb-4">
                              <div className="flex-1 max-w-md">
                                   <div className="relative">
                                        <svg
                                             className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             stroke="currentColor"
                                        >
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                             />
                                        </svg>
                                        <Input
                                             type="text"
                                             placeholder="Search job posts..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="pl-10"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Tabs */}
                         <div className="flex items-center gap-1 border-b border-gray-200">
                              <button
                                   onClick={() => setSelectedTab("pending")}
                                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selectedTab === "pending"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                        }`}
                              >
                                   Pending ({pendingCount})
                              </button>
                              <button
                                   onClick={() => setSelectedTab("approved")}
                                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selectedTab === "approved"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                        }`}
                              >
                                   Approved ({approvedCount})
                              </button>
                              <button
                                   onClick={() => setSelectedTab("rejected")}
                                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selectedTab === "rejected"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                        }`}
                              >
                                   Rejected ({rejectedCount})
                              </button>
                         </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                         {filteredJobs.map((job) => (
                              <div key={job.id} className="p-6 hover:bg-gray-50">
                                   <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                             <div className="flex items-start gap-4 mb-3">
                                                  <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                       <span className="text-indigo-600 font-semibold text-xl">{job.companyLogo}</span>
                                                  </div>
                                                  <div className="flex-1">
                                                       <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                                                       <p className="text-sm text-gray-600 mb-2">
                                                            {job.company} • {job.location}
                                                       </p>
                                                       <div className="flex items-center gap-2 mb-3">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                 {job.type}
                                                            </span>
                                                            <span className="text-sm text-gray-600">{job.salary}</span>
                                                       </div>
                                                       <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                                                       <div className="flex items-center gap-2">
                                                            {job.tags.map((tag) => (
                                                                 <span
                                                                      key={tag}
                                                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                                                                 >
                                                                      {tag}
                                                                 </span>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="flex items-center gap-4 text-sm text-gray-600 ml-[72px]">
                                                  <div className="flex items-center gap-1">
                                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 strokeWidth={2}
                                                                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                       </svg>
                                                       Posted {job.postedDate}
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                             {job.status === "pending" && (
                                                  <>
                                                       <Button
                                                            className="bg-green-600 hover:bg-green-700 text-white w-32"
                                                            onClick={() => handleApprove(job.id)}
                                                            disabled={actionLoading === job.id.toString()}
                                                       >
                                                            {actionLoading === job.id.toString() ? "Processing..." : "Approve"}
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent w-32"
                                                            onClick={() => handleReject(job.id)}
                                                            disabled={actionLoading === job.id.toString()}
                                                       >
                                                            {actionLoading === job.id.toString() ? "Processing..." : "Reject"}
                                                       </Button>
                                                       <Button variant="outline" className="bg-transparent w-32">
                                                            View Details
                                                       </Button>
                                                  </>
                                             )}

                                             {job.status === "approved" && (
                                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                       Approved
                                                  </span>
                                             )}

                                             {job.status === "rejected" && (
                                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                       Rejected
                                                  </span>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>

                    {filteredJobs.length === 0 && (
                         <div className="p-12 text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                   />
                              </svg>
                              <p className="text-gray-600">No job posts found</p>
                         </div>
                    )}
               </div>
          </div>
     )
}
