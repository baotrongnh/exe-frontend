"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsersPage() {
     const [searchQuery, setSearchQuery] = useState("")

     const users = [
          {
               id: 1,
               name: "Jake Gyll",
               email: "jakegyll@email.com",
               role: "Job Seeker",
               status: "Active",
               joinDate: "Jan 15, 2024",
               applications: 12,
          },
          {
               id: 2,
               name: "Sarah Johnson",
               email: "sarah.j@email.com",
               role: "Job Seeker",
               status: "Active",
               joinDate: "Feb 3, 2024",
               applications: 8,
          },
          {
               id: 3,
               name: "Michael Chen",
               email: "mchen@email.com",
               role: "Employer",
               status: "Active",
               joinDate: "Dec 20, 2023",
               applications: 0,
          },
          {
               id: 4,
               name: "Emily Davis",
               email: "emily.davis@email.com",
               role: "Job Seeker",
               status: "Suspended",
               joinDate: "Mar 10, 2024",
               applications: 3,
          },
          {
               id: 5,
               name: "David Wilson",
               email: "dwilson@email.com",
               role: "Employer",
               status: "Active",
               joinDate: "Jan 5, 2024",
               applications: 0,
          },
          {
               id: 6,
               name: "Lisa Anderson",
               email: "lisa.a@email.com",
               role: "Job Seeker",
               status: "Active",
               joinDate: "Feb 28, 2024",
               applications: 15,
          },
     ]

     const filteredUsers = users.filter(
          (user) =>
               user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(searchQuery.toLowerCase()),
     )

     return (
          <div className="p-8">
               <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage all registered users on the platform</p>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Total Users</div>
                         <div className="text-2xl font-bold text-gray-900">2,543</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Active Users</div>
                         <div className="text-2xl font-bold text-green-600">2,401</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Job Seekers</div>
                         <div className="text-2xl font-bold text-gray-900">2,198</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Employers</div>
                         <div className="text-2xl font-bold text-gray-900">345</div>
                    </div>
               </div>

               {/* Users Table */}
               <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                         <div className="flex items-center justify-between gap-4">
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
                                             placeholder="Search users..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="pl-10"
                                        />
                                   </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                                   <Button variant="outline" className="gap-2 bg-transparent">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                             />
                                        </svg>
                                        Export
                                   </Button>
                              </div>
                         </div>
                    </div>

                    <div className="overflow-x-auto">
                         <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                   <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Join Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Applications
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Actions
                                        </th>
                                   </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                   {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center gap-3">
                                                       <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                            <span className="text-indigo-600 font-semibold text-sm">
                                                                 {user.name
                                                                      .split(" ")
                                                                      .map((n) => n[0])
                                                                      .join("")}
                                                            </span>
                                                       </div>
                                                       <div>
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                       </div>
                                                  </div>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                  <span className="text-sm text-gray-900">{user.role}</span>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                  <span
                                                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            }`}
                                                  >
                                                       {user.status}
                                                  </span>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.applications}</td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                  <div className="flex items-center gap-2">
                                                       <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                                                            View
                                                       </Button>
                                                       <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                                                            Edit
                                                       </Button>
                                                       <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                            {user.status === "Active" ? "Suspend" : "Activate"}
                                                       </Button>
                                                  </div>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                         <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-700">
                                   Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{" "}
                                   <span className="font-medium">2,543</span> results
                              </div>
                              <div className="flex items-center gap-2">
                                   <Button variant="outline" size="sm" disabled>
                                        Previous
                                   </Button>
                                   <Button variant="outline" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        1
                                   </Button>
                                   <Button variant="outline" size="sm">
                                        2
                                   </Button>
                                   <Button variant="outline" size="sm">
                                        3
                                   </Button>
                                   <Button variant="outline" size="sm">
                                        Next
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
