"use client"

import { useState } from "react"
import EmployerLayout from "@/components/employer/EmployerLayout"
import EmployerHeader from "@/components/employer/EmployerHeader"

// Mock data - replace with API call
const mockApplicants = [
     {
          id: 1,
          name: "Jake Gyll",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 5.0,
          hiringStage: "Interview",
          appliedDate: "13 July, 2021",
          jobRole: "Designer",
     },
     {
          id: 2,
          name: "Guy Hawkins",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 5.0,
          hiringStage: "Interview",
          appliedDate: "13 July, 2021",
          jobRole: "JavaScript Dev",
     },
     {
          id: 3,
          name: "Cyndy Lillibridge",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.5,
          hiringStage: "Shortlisted",
          appliedDate: "12 July, 2021",
          jobRole: "Golang Uev",
     },
     {
          id: 4,
          name: "Rodolfo Goode",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 3.75,
          hiringStage: "Declined",
          appliedDate: "11 July, 2021",
          jobRole: ".NET Dev",
     },
     {
          id: 5,
          name: "Leif Floyd",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.8,
          hiringStage: "Hired",
          appliedDate: "11 July, 2021",
          jobRole: "Graphic Design",
     },
     {
          id: 6,
          name: "Jonny Wilson",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.6,
          hiringStage: "Hired",
          appliedDate: "9 July, 2021",
          jobRole: "Designer",
     },
     {
          id: 7,
          name: "Jerome Bell",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.0,
          hiringStage: "Interviewed",
          appliedDate: "5 July, 2021",
          jobRole: "Designer",
     },
     {
          id: 8,
          name: "Eleanor Pena",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 3.5,
          hiringStage: "Declined",
          appliedDate: "5 July, 2021",
          jobRole: "Designer",
     },
     {
          id: 9,
          name: "Darrell Steward",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.2,
          hiringStage: "Shortlisted",
          appliedDate: "3 July, 2021",
          jobRole: "Designer",
     },
     {
          id: 10,
          name: "Floyd Miles",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 4.1,
          hiringStage: "Interviewed",
          appliedDate: "1 July, 2021",
          jobRole: "Designer",
     },
]

export default function AllApplicantsPage() {
     const [applicants, setApplicants] = useState(mockApplicants)
     const [view, setView] = useState<"table" | "pipeline">("table")
     const [searchQuery, setSearchQuery] = useState("")
     const [currentPage, setCurrentPage] = useState(1)
     const [itemsPerPage, setItemsPerPage] = useState(10)

     // API integration placeholders
     const handleSearch = (query: string) => {
          console.log("[v0] Search applicants:", query)
          // TODO: Implement API call to search applicants
     }

     const handleFilter = () => {
          console.log("[v0] Filter applicants")
          // TODO: Implement filter functionality
     }

     const handleViewApplication = (applicantId: number) => {
          console.log("[v0] View application:", applicantId)
          // TODO: Navigate to applicant details page
          window.location.href = `/employer/applicants/${applicantId}`
     }

     const getStageColor = (stage: string) => {
          switch (stage.toLowerCase()) {
               case "interview":
               case "interviewed":
                    return "bg-yellow-50 text-yellow-600 border-yellow-200"
               case "shortlisted":
                    return "bg-blue-50 text-blue-600 border-blue-200"
               case "declined":
                    return "bg-red-50 text-red-600 border-red-200"
               case "hired":
                    return "bg-green-50 text-green-600 border-green-200"
               default:
                    return "bg-gray-50 text-gray-600 border-gray-200"
          }
     }

     return (
          <EmployerLayout>
               <EmployerHeader title="Total Applicants : 19" />

               <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm">
                         {/* Header Controls */}
                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
                              <div className="flex items-center gap-4 flex-1">
                                   {/* Search */}
                                   <div className="relative flex-1 max-w-md">
                                        <svg
                                             className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                        >
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                             />
                                        </svg>
                                        <input
                                             type="text"
                                             placeholder="Search Applicants"
                                             value={searchQuery}
                                             onChange={(e) => {
                                                  setSearchQuery(e.target.value)
                                                  handleSearch(e.target.value)
                                             }}
                                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                   </div>

                                   {/* Filter */}
                                   <button
                                        onClick={handleFilter}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                   >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                             />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Filter</span>
                                   </button>
                              </div>

                              {/* View Toggle */}
                              <div className="flex items-center gap-2">
                                   <button
                                        onClick={() => setView("pipeline")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === "pipeline" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                                             }`}
                                   >
                                        Pipeline View
                                   </button>
                                   <button
                                        onClick={() => setView("table")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === "table" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                                             }`}
                                   >
                                        Table View
                                   </button>
                              </div>
                         </div>

                         {/* Table */}
                         <div className="overflow-x-auto">
                              <table className="w-full">
                                   <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                             <th className="px-6 py-3 text-left">
                                                  <input type="checkbox" className="rounded border-gray-300" />
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Full Name
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Score
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Hiring Stage
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Applied Date
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Job Role
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  <div className="flex items-center gap-2">
                                                       Action
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </div>
                                             </th>
                                             <th className="px-6 py-3"></th>
                                        </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200">
                                        {applicants.map((applicant) => (
                                             <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                                                  <td className="px-6 py-4">
                                                       <input type="checkbox" className="rounded border-gray-300" />
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="flex items-center gap-3">
                                                            <img
                                                                 src={applicant.avatar || "/placeholder.svg"}
                                                                 alt={applicant.name}
                                                                 className="w-10 h-10 rounded-full"
                                                            />
                                                            <span className="text-sm font-medium text-gray-900">{applicant.name}</span>
                                                       </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-gray-900">{applicant.score}</span>
                                                       </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span
                                                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStageColor(
                                                                 applicant.hiringStage,
                                                            )}`}
                                                       >
                                                            {applicant.hiringStage}
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.appliedDate}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.jobRole}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <button
                                                            onClick={() => handleViewApplication(applicant.id)}
                                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                                       >
                                                            See Application
                                                       </button>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                                       <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                       </button>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>

                         {/* Pagination */}
                         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                   <span className="text-sm text-gray-600">View</span>
                                   <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                   >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                   </select>
                                   <span className="text-sm text-gray-600">Applicants per page</span>
                              </div>

                              <div className="flex items-center gap-2">
                                   <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                   >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                   </button>
                                   <button className="w-8 h-8 bg-blue-600 text-white rounded font-medium">{currentPage}</button>
                                   <button className="w-8 h-8 hover:bg-gray-100 rounded font-medium text-gray-600">2</button>
                                   <button
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                   >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </EmployerLayout>
     )
}
