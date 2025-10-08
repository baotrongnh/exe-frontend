"use client"

import { useState, useEffect } from "react"
import { X, MoreVertical } from "lucide-react"
import { api } from "@/lib/api"

// Type cho Application từ API
interface Application {
     id: string
     user_id: string
     job_id: string
     cv_id: string
     status: string
     cover_letter: string | null
     createdAt: string
     updatedAt: string
     job: {
          id: string
          title: string
          company?: string
          owner_id: string
     }
}

interface ApiResponse {
     success: boolean
     data: Application[]
     pagination?: {
          total: number
          page: number
          limit: number
          pages: number
     }
}

export default function MyApplicationsPage() {
     const [showBanner, setShowBanner] = useState(true)
     const [applications, setApplications] = useState<Application[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [pagination, setPagination] = useState({
          total: 0,
          page: 1,
          limit: 10,
          pages: 0
     })

     // Fetch applications from API
     useEffect(() => {
          const fetchApplications = async () => {
               try {
                    setLoading(true)
                    const response: ApiResponse = await api.applications.getAll({ page: pagination.page, limit: pagination.limit })
                    console.log('Applications API Response:', response)
                    setApplications(response.data || [])
                    if (response.pagination) {
                         setPagination(response.pagination)
                    }
                    setError(null)
               } catch (err: any) {
                    console.error('Error fetching applications:', err)
                    setError(err.response?.data?.message || 'Không thể tải danh sách applications')
               } finally {
                    setLoading(false)
               }
          }

          fetchApplications()
     }, [pagination.page])

     // Helper functions
     const getStatusColor = (status: string) => {
          const statusMap: Record<string, string> = {
               'PENDING': 'text-orange-600 bg-orange-50 border-orange-200',
               'IN_REVIEW': 'text-orange-600 bg-orange-50 border-orange-200',
               'SHORTLISTED': 'text-emerald-600 bg-emerald-50 border-emerald-200',
               'INTERVIEWING': 'text-yellow-600 bg-yellow-50 border-yellow-200',
               'OFFERED': 'text-indigo-600 bg-indigo-50 border-indigo-200',
               'HIRED': 'text-green-600 bg-green-50 border-green-200',
               'REJECTED': 'text-red-600 bg-red-50 border-red-200',
               'WITHDRAWN': 'text-gray-600 bg-gray-50 border-gray-200',
          }
          return statusMap[status.toUpperCase()] || 'text-gray-600 bg-gray-50 border-gray-200'
     }

     const getInitials = (text: string) => {
          return text
               .split(' ')
               .map(word => word[0])
               .join('')
               .toUpperCase()
               .slice(0, 2)
     }

     const getRandomColor = () => {
          const colors = [
               'bg-emerald-500',
               'bg-cyan-500',
               'bg-red-500',
               'bg-blue-500',
               'bg-indigo-600',
               'bg-purple-500',
               'bg-pink-500',
               'bg-orange-500',
               'bg-gray-900',
          ]
          return colors[Math.floor(Math.random() * colors.length)]
     }

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString('en-GB', {
               day: '2-digit',
               month: 'long',
               year: 'numeric'
          })
     }

     const formatStatus = (status: string) => {
          return status.replace('_', ' ').split(' ').map(word =>
               word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')
     }

     return (
          <div className="min-h-screen bg-gray-50">
               {/* Header */}
               <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                         <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                         <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                              Become Employer
                         </button>
                    </div>
               </div>

               {/* Main Content */}
               <div className="px-8 py-6">
                    {/* Greeting Section */}
                    <div className="mb-6">
                         <h2 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h2>
                         <p className="text-gray-600">Track the status of your job applications.</p>
                    </div>

                    {/* New Feature Banner */}
                    {showBanner && (
                         <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 flex items-start gap-4">
                              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                   </svg>
                              </div>
                              <div className="flex-1">
                                   <h3 className="font-bold text-indigo-900 mb-1">New Feature</h3>
                                   <p className="text-gray-700 text-sm">
                                        You can request a follow-up 7 days after applying for a job if the application status is in review. Only
                                        one follow-up is allowed per job.
                                   </p>
                              </div>
                              <button
                                   onClick={() => setShowBanner(false)}
                                   className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                   <X className="w-5 h-5" />
                              </button>
                         </div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white rounded-lg border border-gray-200 mb-6">
                         <div className="flex items-center border-b border-gray-200 overflow-x-auto">
                              <button
                                   className="px-6 py-4 font-medium whitespace-nowrap transition-colors relative text-indigo-600"
                              >
                                   All ({pagination.total})
                                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                              </button>
                         </div>

                         {/* Applications Table */}
                         <div className="p-6">
                              <div className="mb-6">
                                   <h3 className="text-xl font-bold text-gray-900">Applications History</h3>
                              </div>

                              {/* Table */}
                              <div className="overflow-x-auto">
                                   <table className="w-full">
                                        <thead>
                                             <tr className="border-b border-gray-200">
                                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 w-16">#</th>
                                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Employer Name</th>
                                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Roles</th>
                                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date Applied</th>
                                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                                  <th className="w-16"></th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {loading && (
                                                  <tr>
                                                       <td colSpan={6} className="py-10 text-center text-gray-500">
                                                            Đang tải...
                                                       </td>
                                                  </tr>
                                             )}

                                             {error && (
                                                  <tr>
                                                       <td colSpan={6} className="py-10 text-center text-red-500">
                                                            {error}
                                                       </td>
                                                  </tr>
                                             )}

                                             {!loading && !error && applications.length === 0 && (
                                                  <tr>
                                                       <td colSpan={6} className="py-10 text-center text-gray-500">
                                                            Chưa có application nào
                                                       </td>
                                                  </tr>
                                             )}

                                             {!loading && !error && applications.map((app, index) => {
                                                  const logoColor = getRandomColor()
                                                  const jobTitle = app.job?.title || 'Unknown Job'

                                                  return (
                                                       <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="py-4 px-4 text-gray-900 font-medium">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                                            <td className="py-4 px-4">
                                                                 <div className="flex items-center gap-3">
                                                                      <div
                                                                           className={`w-10 h-10 ${logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                                                                      >
                                                                           {getInitials(jobTitle)}
                                                                      </div>
                                                                      <span className="font-semibold text-gray-900">{jobTitle}</span>
                                                                 </div>
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-900">{jobTitle}</td>
                                                            <td className="py-4 px-4 text-gray-600">{formatDate(app.createdAt)}</td>
                                                            <td className="py-4 px-4">
                                                                 <span
                                                                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}
                                                                 >
                                                                      {formatStatus(app.status)}
                                                                 </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                 <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                                      <MoreVertical className="w-5 h-5" />
                                                                 </button>
                                                            </td>
                                                       </tr>
                                                  )
                                             })}
                                        </tbody>
                                   </table>
                              </div>

                              {/* Pagination */}
                              {pagination.pages > 1 && (
                                   <div className="flex items-center justify-center gap-2 mt-6">
                                        <button
                                             className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                             onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                             disabled={pagination.page <= 1}
                                        >
                                             <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                             </svg>
                                        </button>

                                        {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((pageNum) => (
                                             <button
                                                  key={pageNum}
                                                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                  className={`w-8 h-8 flex items-center justify-center rounded font-medium transition-colors ${pagination.page === pageNum
                                                       ? 'bg-indigo-600 text-white'
                                                       : 'hover:bg-gray-100 text-gray-700'
                                                       }`}
                                             >
                                                  {pageNum}
                                             </button>
                                        ))}

                                        {pagination.pages > 5 && (
                                             <>
                                                  <span className="text-gray-500 px-2">...</span>
                                                  <button
                                                       onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                                                       className={`w-8 h-8 flex items-center justify-center rounded font-medium transition-colors ${pagination.page === pagination.pages
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                  >
                                                       {pagination.pages}
                                                  </button>
                                             </>
                                        )}

                                        <button
                                             className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                             onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                             disabled={pagination.page >= pagination.pages}
                                        >
                                             <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                             </svg>
                                        </button>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     )
}
