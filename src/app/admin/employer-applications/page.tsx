"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EmployerApplicationsPage() {
     const [searchQuery, setSearchQuery] = useState("")
     const [selectedTab, setSelectedTab] = useState("pending")

     const applications = [
          {
               id: 1,
               companyName: "TechCorp Inc.",
               applicantName: "Robert Smith",
               email: "robert@techcorp.com",
               website: "techcorp.com",
               industry: "Technology",
               size: "50-100",
               status: "pending",
               appliedDate: "Mar 15, 2024",
               description: "Leading software development company specializing in AI solutions",
          },
          {
               id: 2,
               companyName: "GreenEnergy Solutions",
               applicantName: "Maria Garcia",
               email: "maria@greenenergy.com",
               website: "greenenergy.com",
               industry: "Energy",
               size: "100-500",
               status: "pending",
               appliedDate: "Mar 14, 2024",
               description: "Renewable energy company focused on solar and wind power",
          },
          {
               id: 3,
               companyName: "HealthPlus Medical",
               applicantName: "Dr. James Wilson",
               email: "james@healthplus.com",
               website: "healthplus.com",
               industry: "Healthcare",
               size: "500+",
               status: "pending",
               appliedDate: "Mar 13, 2024",
               description: "Healthcare provider with multiple clinics across the country",
          },
          {
               id: 4,
               companyName: "FinanceHub",
               applicantName: "Sarah Lee",
               email: "sarah@financehub.com",
               website: "financehub.com",
               industry: "Finance",
               size: "10-50",
               status: "approved",
               appliedDate: "Mar 10, 2024",
               description: "Financial consulting and advisory services",
          },
          {
               id: 5,
               companyName: "EduTech Learning",
               applicantName: "Michael Brown",
               email: "michael@edutech.com",
               website: "edutech.com",
               industry: "Education",
               size: "50-100",
               status: "rejected",
               appliedDate: "Mar 8, 2024",
               description: "Online learning platform for professional development",
          },
     ];

     const filteredApplications = applications.filter(
          (app) =>
               app.status === selectedTab &&
               (app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.applicantName.toLowerCase().includes(searchQuery.toLowerCase())),
     )

     const pendingCount = applications.filter((app) => app.status === "pending").length
     const approvedCount = applications.filter((app) => app.status === "approved").length
     const rejectedCount = applications.filter((app) => app.status === "rejected").length

     return (
          <div className="p-8">
               <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Employer Applications</h1>
                    <p className="text-gray-600 mt-1">Review and approve employer registration requests</p>
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
                         {filteredApplications.map((application) => (
                              <div key={application.id} className="p-6 hover:bg-gray-50">
                                   <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                             <div className="flex items-center gap-3 mb-2">
                                                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                       <span className="text-indigo-600 font-semibold text-lg">{application.companyName.charAt(0)}</span>
                                                  </div>
                                                  <div>
                                                       <h3 className="text-lg font-semibold text-gray-900">{application.companyName}</h3>
                                                       <p className="text-sm text-gray-600">
                                                            {application.applicantName} • {application.email}
                                                       </p>
                                                  </div>
                                             </div>

                                             <p className="text-sm text-gray-700 mb-3">{application.description}</p>

                                             <div className="flex items-center gap-4 text-sm text-gray-600">
                                                  <div className="flex items-center gap-1">
                                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 strokeWidth={2}
                                                                 d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                                            />
                                                       </svg>
                                                       {application.website}
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 strokeWidth={2}
                                                                 d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                            />
                                                       </svg>
                                                       {application.industry}
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 strokeWidth={2}
                                                                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                       </svg>
                                                       {application.size} employees
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
                                                       {application.appliedDate}
                                                  </div>
                                             </div>
                                        </div>

                                        {application.status === "pending" && (
                                             <div className="flex items-center gap-2">
                                                  <Button className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                                                  <Button
                                                       variant="outline"
                                                       className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                                  >
                                                       Reject
                                                  </Button>
                                             </div>
                                        )}

                                        {application.status === "approved" && (
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                  Approved
                                             </span>
                                        )}

                                        {application.status === "rejected" && (
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                  Rejected
                                             </span>
                                        )}
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
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                   />
                              </svg>
                              <p className="text-gray-600">No applications found</p>
                         </div>
                    )}
               </div>
          </div>
     )
}
