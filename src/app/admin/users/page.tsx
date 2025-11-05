"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminDashboardApi } from "@/lib/admin-dashboard-api"
import type { UsersData } from "@/types/admin"

export default function UsersPage() {
     const [searchQuery, setSearchQuery] = useState("")
     const [usersData, setUsersData] = useState<UsersData | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [currentPage, setCurrentPage] = useState(1)

     const fetchUsers = useCallback(async () => {
          try {
               setLoading(true)
               const response = await adminDashboardApi.getUsers({
                    page: currentPage,
                    limit: 20,
                    search: searchQuery || undefined,
               })
               setUsersData(response.data)
               setError(null)
          } catch (err) {
               console.error("Error fetching users:", err)
               setError("Failed to load users. Please try again.")
          } finally {
               setLoading(false)
          }
     }, [currentPage, searchQuery])

     useEffect(() => {
          fetchUsers()
     }, [fetchUsers])

     const users = usersData?.users || []
     const pagination = usersData?.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          pages: 1,
     }

     // Calculate stats
     const totalUsers = pagination.total
     const activeUsers = users.filter((u) => u.email_confirmed).length
     const jobSeekers = users.filter((u) => !u.role || u.role === "freelancer").length
     const employers = users.filter((u) => u.role === "employer").length

     if (loading) {
          return (
               <div className="p-8 flex items-center justify-center min-h-screen">
                    <div className="text-gray-600">Loading users...</div>
               </div>
          )
     }

     if (error) {
          return (
               <div className="p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                         {error}
                    </div>
               </div>
          )
     }

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
                         <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Active Users</div>
                         <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Freelancer</div>
                         <div className="text-2xl font-bold text-gray-900">{jobSeekers}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                         <div className="text-sm text-gray-600 mb-1">Employers</div>
                         <div className="text-2xl font-bold text-gray-900">{employers}</div>
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
                                             Activity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Actions
                                        </th>
                                   </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                   {users.length === 0 ? (
                                        <tr>
                                             <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                  No users found
                                             </td>
                                        </tr>
                                   ) : (
                                        users.map((user) => (
                                             <tr key={user.id} className="hover:bg-gray-50">
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                 <span className="text-indigo-600 font-semibold text-sm">
                                                                      {user.full_name
                                                                           .split(" ")
                                                                           .map((n) => n[0])
                                                                           .join("")
                                                                           .toUpperCase()
                                                                           .slice(0, 2)}
                                                                 </span>
                                                            </div>
                                                            <div>
                                                                 <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                                                 <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                       </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span className="text-sm text-gray-900">
                                                            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Freelancer"}
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.email_confirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                                 }`}
                                                       >
                                                            {user.email_confirmed ? "Active" : "Pending"}
                                                       </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                       {new Date(user.created_at).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                       })}
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="text-sm text-gray-900">
                                                            {user.activity.jobs_created > 0 && (
                                                                 <div>Jobs: {user.activity.jobs_created}</div>
                                                            )}
                                                            {user.activity.applications_count > 0 && (
                                                                 <div>Apps: {user.activity.applications_count}</div>
                                                            )}
                                                            {user.activity.jobs_created === 0 && user.activity.applications_count === 0 && (
                                                                 <span className="text-gray-400">No activity</span>
                                                            )}
                                                       </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                       <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                                                                 View
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                                                                 Edit
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                                 {user.email_confirmed ? "Suspend" : "Activate"}
                                                            </Button>
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                         <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-700">
                                   Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{" "}
                                   <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                                   <span className="font-medium">{pagination.total}</span> results
                              </div>
                              <div className="flex items-center gap-2">
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page === 1}
                                        onClick={() => setCurrentPage(pagination.page - 1)}
                                   >
                                        Previous
                                   </Button>
                                   {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                             key={page}
                                             variant="outline"
                                             size="sm"
                                             className={
                                                  page === pagination.page
                                                       ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                       : ""
                                             }
                                             onClick={() => setCurrentPage(page)}
                                        >
                                             {page}
                                        </Button>
                                   ))}
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => setCurrentPage(pagination.page + 1)}
                                   >
                                        Next
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
