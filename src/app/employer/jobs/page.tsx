"use client"

import { useState } from "react"
import EmployerLayout from "@/components/employer/EmployerLayout"
import EmployerHeader from "@/components/employer/EmployerHeader"

// Mock data - replace with API call
const mockJobs = [
     {
          id: 1,
          title: "Social Media Assistant",
          status: "Live",
          datePosted: "20 May 2020",
          dueDate: "24 May 2020",
          jobType: "Fulltime",
          applicants: 10,
          needs: 4,
     },
     {
          id: 2,
          title: "Senior Designer",
          status: "Live",
          datePosted: "16 May 2020",
          dueDate: "24 May 2020",
          jobType: "Fulltime",
          applicants: 1234,
          needs: 0,
     },
     {
          id: 3,
          title: "Visual Designer",
          status: "Live",
          datePosted: "15 May 2020",
          dueDate: "24 May 2020",
          jobType: "Freelance",
          applicants: 2435,
          needs: 4,
     },
     {
          id: 4,
          title: "Data Science",
          status: "Closed",
          datePosted: "13 May 2020",
          dueDate: "24 May 2020",
          jobType: "Freelance",
          applicants: 6234,
          needs: 10,
     },
     {
          id: 5,
          title: "Kotlin Developer",
          status: "Closed",
          datePosted: "12 May 2020",
          dueDate: "24 May 2020",
          jobType: "Fulltime",
          applicants: 12,
          needs: 20,
     },
     {
          id: 6,
          title: "React Developer",
          status: "Closed",
          datePosted: "11 May 2020",
          dueDate: "24 May 2020",
          jobType: "Fulltime",
          applicants: 14,
          needs: 10,
     },
     {
          id: 7,
          title: "Kotlin Developer",
          status: "Closed",
          datePosted: "12 May 2020",
          dueDate: "24 May 2020",
          jobType: "Fulltime",
          applicants: 12,
          needs: 20,
     },
]

export default function JobListingPage() {
     const [jobs, setJobs] = useState(mockJobs)
     const [currentPage, setCurrentPage] = useState(1)
     const [itemsPerPage, setItemsPerPage] = useState(10)

     // API integration placeholder
     const handleFilterJobs = () => {
          console.log("[v0] Filter jobs - connect to API here")
          // TODO: Implement API call to filter jobs
     }

     const handleViewJob = (jobId: number) => {
          console.log("[v0] View job:", jobId)
          // TODO: Navigate to job analytics page
          window.location.href = `/employer/jobs/${jobId}`
     }

     const handleDeleteJob = (jobId: number) => {
          console.log("[v0] Delete job:", jobId)
          // TODO: Implement API call to delete job
     }

     return (
          <EmployerLayout>
               <EmployerHeader
                    title="Job Listing"
                    subtitle="Here is your jobs listing status from July 19 - July 25"
                    dateRange="Jul 19 - Jul 25"
               />

               <div className="p-8">
                    {/* Job List Header */}
                    <div className="bg-white rounded-lg shadow-sm">
                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
                              <h2 className="text-lg font-semibold text-gray-900">Job List</h2>
                              <button
                                   onClick={handleFilterJobs}
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
                                   <span className="text-sm font-medium text-gray-700">Filters</span>
                              </button>
                         </div>

                         {/* Table */}
                         <div className="overflow-x-auto">
                              <table className="w-full">
                                   <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Roles
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Status
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Date Posted
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Due Date
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Job Type
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Applicants
                                             </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Needs
                                             </th>
                                             <th className="px-6 py-3"></th>
                                        </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200">
                                        {jobs.map((job) => (
                                             <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span className="text-sm font-medium text-gray-900">{job.title}</span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span
                                                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${job.status === "Live"
                                                                      ? "bg-green-50 text-green-600 border border-green-200"
                                                                      : "bg-red-50 text-red-600 border border-red-200"
                                                                 }`}
                                                       >
                                                            {job.status}
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.datePosted}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.dueDate}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span
                                                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${job.jobType === "Fulltime"
                                                                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                                      : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                                                 }`}
                                                       >
                                                            {job.jobType}
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applicants}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span className="text-sm text-gray-600">
                                                            {job.needs} / <span className="text-gray-400">10</span>
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                                       <button
                                                            onClick={() => handleViewJob(job.id)}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                                       >
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
