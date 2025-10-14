"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EmployerApplicationsPage() {
     const [searchQuery, setSearchQuery] = useState("")
     const [selectedTab, setSelectedTab] = useState("all")

     const applications = [
          {
               id: 1,
               candidateName: "Sarah Johnson",
               email: "sarah.j@email.com",
               position: "Senior Frontend Developer",
               appliedDate: "Mar 15, 2024",
               status: "pending",
               experience: "5 years",
               location: "San Francisco, USA",
               resume: "sarah-johnson-resume.pdf",
               coverLetter: "I am excited to apply for this position...",
          },
          {
               id: 2,
               candidateName: "Michael Chen",
               email: "mchen@email.com",
               position: "Product Designer",
               appliedDate: "Mar 14, 2024",
               status: "shortlisted",
               experience: "4 years",
               location: "New York, USA",
               resume: "michael-chen-resume.pdf",
               coverLetter: "With my background in UX design...",
          },
          {
               id: 3,
               candidateName: "Emily Davis",
               email: "emily.davis@email.com",
               position: "Backend Engineer",
               appliedDate: "Mar 13, 2024",
               status: "interviewing",
               experience: "6 years",
               location: "Austin, USA",
               resume: "emily-davis-resume.pdf",
               coverLetter: "I have extensive experience in Node.js...",
          },
          {
               id: 4,
               candidateName: "David Wilson",
               email: "dwilson@email.com",
               position: "Marketing Manager",
               appliedDate: "Mar 12, 2024",
               status: "offered",
               experience: "7 years",
               location: "Chicago, USA",
               resume: "david-wilson-resume.pdf",
               coverLetter: "I would love to bring my marketing expertise...",
          },
          {
               id: 5,
               candidateName: "Lisa Anderson",
               email: "lisa.a@email.com",
               position: "Data Scientist",
               appliedDate: "Mar 11, 2024",
               status: "rejected",
               experience: "3 years",
               location: "Seattle, USA",
               resume: "lisa-anderson-resume.pdf",
               coverLetter: "My passion for data analysis...",
          },
     ]

     const filteredApplications = applications.filter((app) => {
          const matchesSearch =
               app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               app.position.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesTab = selectedTab === "all" || app.status === selectedTab
          return matchesSearch && matchesTab
     })

     const allCount = applications.length
     const pendingCount = applications.filter((app) => app.status === "pending").length
     const shortlistedCount = applications.filter((app) => app.status === "shortlisted").length
     const interviewingCount = applications.filter((app) => app.status === "interviewing").length
     const offeredCount = applications.filter((app) => app.status === "offered").length
     const rejectedCount = applications.filter((app) => app.status === "rejected").length

     const getStatusColor = (status: string) => {
          switch (status) {
               case "pending":
                    return "bg-blue-100 text-blue-800"
               case "shortlisted":
                    return "bg-green-100 text-green-800"
               case "interviewing":
                    return "bg-yellow-100 text-yellow-800"
               case "offered":
                    return "bg-purple-100 text-purple-800"
               case "rejected":
                    return "bg-red-100 text-red-800"
               default:
                    return "bg-gray-100 text-gray-800"
          }
     }

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
                         <div className="text-sm text-gray-600 mb-1">Offered</div>
                         <div className="text-2xl font-bold text-purple-600">{offeredCount}</div>
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
                                             placeholder="Search applications..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="pl-10"
                                        />
                                   </div>
                              </div>
                              <Button variant="outline" className="gap-2 bg-transparent">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                        />
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
                                   { key: "offered", label: "Offered", count: offeredCount },
                                   { key: "rejected", label: "Rejected", count: rejectedCount },
                              ].map((tab) => (
                                   <button
                                        key={tab.key}
                                        onClick={() => setSelectedTab(tab.key)}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.key
                                                  ? "border-indigo-600 text-indigo-600"
                                                  : "border-transparent text-gray-600 hover:text-gray-900"
                                             }`}
                                   >
                                        {tab.label} ({tab.count})
                                   </button>
                              ))}
                         </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                         {filteredApplications.map((application) => (
                              <div key={application.id} className="p-6 hover:bg-gray-50">
                                   <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                             <div className="flex items-start gap-4 mb-3">
                                                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                       <span className="text-indigo-600 font-semibold text-lg">
                                                            {application.candidateName
                                                                 .split(" ")
                                                                 .map((n) => n[0])
                                                                 .join("")}
                                                       </span>
                                                  </div>
                                                  <div className="flex-1">
                                                       <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.candidateName}</h3>
                                                       <p className="text-sm text-gray-600 mb-2">{application.email}</p>
                                                       <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                           strokeWidth={2}
                                                                           d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                      />
                                                                 </svg>
                                                                 {application.position}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                           strokeWidth={2}
                                                                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                      />
                                                                      <path
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                           strokeWidth={2}
                                                                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                      />
                                                                 </svg>
                                                                 {application.location}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                           strokeWidth={2}
                                                                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                      />
                                                                 </svg>
                                                                 {application.experience} experience
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                           strokeWidth={2}
                                                                           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                      />
                                                                 </svg>
                                                                 Applied {application.appliedDate}
                                                            </div>
                                                       </div>
                                                       <p className="text-sm text-gray-700 mb-3">{application.coverLetter}</p>
                                                       <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeWidth={2}
                                                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                 />
                                                            </svg>
                                                            Download Resume
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                             <span
                                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}
                                             >
                                                  {application.status}
                                             </span>
                                             {application.status === "pending" && (
                                                  <div className="flex flex-col gap-2 mt-2">
                                                       <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-32">
                                                            Shortlist
                                                       </Button>
                                                       <Button size="sm" variant="outline" className="bg-transparent w-32">
                                                            Schedule Interview
                                                       </Button>
                                                       <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent w-32"
                                                       >
                                                            Reject
                                                       </Button>
                                                  </div>
                                             )}
                                             {application.status === "shortlisted" && (
                                                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white w-32 mt-2">
                                                       Schedule Interview
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
                         ))}
                    </div>

                    {filteredApplications.length === 0 && (
                         <div className="p-12 text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                   />
                              </svg>
                              <p className="text-gray-600">No applications found</p>
                         </div>
                    )}
               </div>
          </div>
     )
}
