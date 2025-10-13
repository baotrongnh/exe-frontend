"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function JobApprovalsPage() {
     const [searchQuery, setSearchQuery] = useState("")
     const [selectedTab, setSelectedTab] = useState("pending")

     const jobPosts = [
          {
               id: 1,
               title: "Senior Frontend Developer",
               company: "Stripe",
               companyLogo: "S",
               location: "San Francisco, USA",
               type: "Full-Time",
               salary: "$120k - $180k",
               status: "pending",
               postedDate: "Mar 15, 2024",
               description: "We're looking for an experienced frontend developer to join our team...",
               tags: ["React", "TypeScript", "Next.js"],
          },
          {
               id: 2,
               title: "Product Designer",
               company: "Figma",
               companyLogo: "F",
               location: "Remote",
               type: "Full-Time",
               salary: "$100k - $150k",
               status: "pending",
               postedDate: "Mar 14, 2024",
               description: "Join our design team to create beautiful user experiences...",
               tags: ["UI/UX", "Figma", "Design Systems"],
          },
          {
               id: 3,
               title: "Backend Engineer",
               company: "Vercel",
               companyLogo: "V",
               location: "Berlin, Germany",
               type: "Full-Time",
               salary: "$110k - $160k",
               status: "pending",
               postedDate: "Mar 13, 2024",
               description: "Help us build the infrastructure for the modern web...",
               tags: ["Node.js", "PostgreSQL", "AWS"],
          },
          {
               id: 4,
               title: "Marketing Manager",
               company: "Notion",
               companyLogo: "N",
               location: "New York, USA",
               type: "Full-Time",
               salary: "$90k - $130k",
               status: "approved",
               postedDate: "Mar 10, 2024",
               description: "Lead our marketing efforts and grow our brand...",
               tags: ["Marketing", "Strategy", "Content"],
          },
          {
               id: 5,
               title: "Data Scientist",
               company: "OpenAI",
               companyLogo: "O",
               location: "San Francisco, USA",
               type: "Full-Time",
               salary: "$150k - $220k",
               status: "rejected",
               postedDate: "Mar 8, 2024",
               description: "Work on cutting-edge AI and machine learning projects...",
               tags: ["Python", "ML", "AI"],
          },
     ]

     const filteredJobs = jobPosts.filter(
          (job) =>
               job.status === selectedTab &&
               (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchQuery.toLowerCase())),
     )

     const pendingCount = jobPosts.filter((job) => job.status === "pending").length
     const approvedCount = jobPosts.filter((job) => job.status === "approved").length
     const rejectedCount = jobPosts.filter((job) => job.status === "rejected").length

     return (
          <div className="p-8">
               <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Job Post Approvals</h1>
                    <p className="text-gray-600 mt-1">Review and approve job postings from employers</p>
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
                                                       <Button className="bg-green-600 hover:bg-green-700 text-white w-32">Approve</Button>
                                                       <Button
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent w-32"
                                                       >
                                                            Reject
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
