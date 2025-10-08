"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import Link from "next/link"
import { useToast } from "@/components/toast"
import { useRouter } from "next/navigation"

// Type cho Job từ API
interface Job {
     id: string
     owner_id: string
     title: string
     description: string
     job_type: 'FREELANCE' | 'PART_TIME' | 'PROJECT' | 'FULL_TIME'
     budget_type: 'FIXED' | 'HOURLY'
     budget_min: string
     budget_max: string
     currency: string
     experience_level: 'INTERN' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
     deadline: string | null
     status: string
     applications_count: number
     skills_required: string[]
     rejection_reason: string | null
     createdAt: string | null
     updatedAt: string | null
     category_id: string | null
}

interface ApiResponse {
     success: boolean
     data: Job[]
     pagination: {
          total: number
          page: number
          limit: number
          pages: number
     }
}

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
     const [isOpen, setIsOpen] = useState(true)

     return (
          <div className="border-b border-border pb-4 mb-4">
               <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full mb-3">
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
               </button>
               {isOpen && <div className="space-y-2">{children}</div>}
          </div>
     )
}

const FilterCheckbox = ({ label, count }: { label: string; count?: number }) => (
     <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox />
          <span className="text-sm text-muted-foreground group-hover:text-foreground">
               {label} {count !== undefined && `(${count})`}
          </span>
     </label>
)

export default function FindJobsPage() {
     const [jobs, setJobs] = useState<Job[]>([])
     const [allJobs, setAllJobs] = useState<Job[]>([]) // Store all jobs for filtering
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
     const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
     const [searchQuery, setSearchQuery] = useState('')
     const [searchInput, setSearchInput] = useState('')
     const [pagination, setPagination] = useState({
          total: 0,
          page: 1,
          limit: 10,
          pages: 0
     })
     const toast = useToast()
     const router = useRouter()

     useEffect(() => {
          const fetchJobs = async () => {
               try {
                    setLoading(true)
                    // Fetch all jobs without search parameter
                    const response: ApiResponse = await api.jobs.getAll({
                         page: 1,
                         limit: 100 // Fetch more jobs for client-side filtering
                    })
                    console.log('All jobs fetched:', response)
                    setAllJobs(response.data || [])
                    setError(null)
               } catch (err: any) {
                    console.error('Error fetching jobs:', err)
                    setError(err.message || 'Không thể tải dữ liệu jobs')
               } finally {
                    setLoading(false)
               }
          }

          fetchJobs()
     }, []) // Only fetch once on mount

     // Filter jobs based on search query
     useEffect(() => {
          if (!searchQuery) {
               // No search - show all jobs with pagination
               const startIndex = (pagination.page - 1) * pagination.limit
               const endIndex = startIndex + pagination.limit
               const paginatedJobs = allJobs.slice(startIndex, endIndex)
               setJobs(paginatedJobs)
               setPagination(prev => ({
                    ...prev,
                    total: allJobs.length,
                    pages: Math.ceil(allJobs.length / prev.limit)
               }))
          } else {
               // Filter jobs by search query (case-insensitive)
               const filtered = allJobs.filter(job =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase())
               )
               console.log('Filtered jobs:', filtered)

               // Apply pagination to filtered results
               const startIndex = (pagination.page - 1) * pagination.limit
               const endIndex = startIndex + pagination.limit
               const paginatedJobs = filtered.slice(startIndex, endIndex)

               setJobs(paginatedJobs)
               setPagination(prev => ({
                    ...prev,
                    total: filtered.length,
                    pages: Math.ceil(filtered.length / prev.limit)
               }))
          }
     }, [allJobs, searchQuery, pagination.page, pagination.limit])

     // Debounce search input
     useEffect(() => {
          const timer = setTimeout(() => {
               setSearchQuery(searchInput)
               // Reset về trang 1 khi search
               if (searchInput !== searchQuery) {
                    setPagination(prev => ({ ...prev, page: 1 }))
               }
          }, 500) // 500ms debounce

          return () => clearTimeout(timer)
     }, [searchInput])

     // Handle search
     const handleSearch = () => {
          setSearchQuery(searchInput)
          setPagination(prev => ({ ...prev, page: 1 }))
     }

     const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchInput(e.target.value)
     }

     const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
               handleSearch()
          }
     }

     // Handle apply job
     const handleApply = async (jobId: string, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()

          try {
               setApplyingJobId(jobId)
               const response = await api.applications.apply(jobId)

               if (response.success) {
                    toast.showToast('Apply job thành công!', 'success')
                    setAppliedJobs(prev => new Set(prev).add(jobId))
                    // Refresh job list để cập nhật applications_count
                    const jobsResponse: ApiResponse = await api.jobs.getAll({ page: pagination.page, limit: pagination.limit })
                    setJobs(jobsResponse.data || [])
               }
          } catch (err: any) {
               console.error('Error applying job:', err)
               const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi apply job'

               // Kiểm tra nếu cần upload CV
               if (errorMessage === 'You must upload at least one active CV before applying for jobs') {
                    toast.showToast('Bạn cần upload CV trước khi apply job', 'error')
                    setTimeout(() => {
                         router.push('/my-cv')
                    }, 1500)
               } else {
                    toast.showToast(errorMessage, 'error')
               }
          } finally {
               setApplyingJobId(null)
          }
     }

     // Highlight matching text in job title
     const highlightText = (text: string, query: string) => {
          if (!query) return text

          const parts = text.split(new RegExp(`(${query})`, 'gi'))
          return (
               <>
                    {parts.map((part, index) =>
                         part.toLowerCase() === query.toLowerCase() ? (
                              <span key={index} className="font-bold text-primary bg-primary/10 px-1 rounded">
                                   {part}
                              </span>
                         ) : (
                              <span key={index}>{part}</span>
                         )
                    )}
               </>
          )
     }

     // Helper functions
     const getJobTypeBadgeColor = (type: string) => {
          const colors: Record<string, string> = {
               FREELANCE: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
               PART_TIME: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
               PROJECT: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
               FULL_TIME: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
          }
          return colors[type] || 'bg-gray-100 text-gray-700 hover:bg-gray-100'
     }

     const getExperienceLevelBadgeColor = (level: string) => {
          const colors: Record<string, string> = {
               INTERN: 'bg-green-100 text-green-700 hover:bg-green-100',
               JUNIOR: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
               MIDDLE: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
               SENIOR: 'bg-red-100 text-red-700 hover:bg-red-100',
          }
          return colors[level] || 'bg-gray-100 text-gray-700 hover:bg-gray-100'
     }

     const formatBudget = (job: Job) => {
          const min = parseFloat(job.budget_min)
          const max = parseFloat(job.budget_max)

          if (job.currency === 'VND') {
               return `${(min / 1000000).toFixed(1)}tr - ${(max / 1000000).toFixed(1)}tr VNĐ`
          }
          return `$${min} - $${max}`
     }

     const getInitials = (title: string) => {
          return title.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
     }

     const getRandomColor = () => {
          const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-teal-500', 'bg-gray-800', 'bg-cyan-500', 'bg-purple-500']
          return colors[Math.floor(Math.random() * colors.length)]
     }

     return (
          <div className="h-full flex flex-col">
               {/* Header */}
               <header className="bg-card border-b border-border px-8 py-4">
                    <div className="flex items-center justify-between">
                         <h1 className="text-2xl font-bold text-foreground">Find Jobs</h1>
                         <div className="flex items-center gap-3">
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Become Employer</Button>
                              <Button variant="ghost" size="icon">
                                   <Bell className="w-5 h-5" />
                              </Button>
                         </div>
                    </div>
               </header>

               {/* Search Bar */}
               <div className="bg-card border-b border-border px-8 py-6">
                    <div className="flex gap-3">
                         <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input
                                   placeholder="Job title or keyword"
                                   className="pl-10"
                                   value={searchInput}
                                   onChange={handleSearchInputChange}
                                   onKeyPress={handleKeyPress}
                              />
                         </div>
                         <Button
                              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                              onClick={handleSearch}
                         >
                              Search
                         </Button>
                    </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 flex overflow-hidden">
                    {/* Filters Sidebar */}
                    {/* <aside className="w-72 bg-card border-r border-border p-6 overflow-y-auto">
                         <FilterSection title="Type of Employment">
                              <FilterCheckbox label="Part-Time" count={5} />
                              <FilterCheckbox label="Remote" count={2} />
                              <FilterCheckbox label="Internship" count={24} />
                              <FilterCheckbox label="Contract" count={0} />
                         </FilterSection>

                         <FilterSection title="Categories">
                              <FilterCheckbox label="Design" count={24} />
                              <FilterCheckbox label="Sales" count={3} />
                              <FilterCheckbox label="Marketing" count={3} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Business (3)</span>
                              </div>
                              <FilterCheckbox label="Human Resource" count={6} />
                              <FilterCheckbox label="Finance" count={4} />
                              <FilterCheckbox label="Engineering" count={4} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Technology (5)</span>
                              </div>
                         </FilterSection>

                         <FilterSection title="Job Level">
                              <FilterCheckbox label="Entry Level" count={57} />
                              <FilterCheckbox label="Mid Level" count={3} />
                              <FilterCheckbox label="Senior Level" count={5} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Director (12)</span>
                              </div>
                              <FilterCheckbox label="VP or Above" count={8} />
                         </FilterSection>

                         <FilterSection title="Salary Range">
                              <FilterCheckbox label="$700 - $1000" count={4} />
                              <FilterCheckbox label="$100 - $1500" count={6} />
                              <FilterCheckbox label="$1500 - $2000" count={10} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">$3000 or above (4)</span>
                              </div>
                         </FilterSection>
                    </aside> */}

                    {/* Job Listings */}
                    <div className="flex-1 p-8 overflow-y-auto">
                         {/* Results Header */}
                         <div className="flex items-center justify-between mb-6">
                              <div>
                                   <h2 className="text-xl font-bold text-foreground mb-1">
                                        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Jobs'}
                                   </h2>
                                   <p className="text-sm text-muted-foreground">
                                        Showing {jobs.length} of {pagination.total} results
                                        {searchQuery && (
                                             <button
                                                  onClick={() => {
                                                       setSearchInput('')
                                                       setSearchQuery('')
                                                       setPagination(prev => ({ ...prev, page: 1 }))
                                                  }}
                                                  className="ml-2 text-primary hover:underline"
                                             >
                                                  Clear search
                                             </button>
                                        )}
                                   </p>
                              </div>
                         </div>

                         {/* Job Cards */}
                         <div className="space-y-4">
                              {loading && (
                                   <div className="text-center py-10">
                                        <p className="text-muted-foreground">Đang tải...</p>
                                   </div>
                              )}

                              {error && (
                                   <div className="text-center py-10">
                                        <p className="text-red-500">{error}</p>
                                   </div>
                              )}

                              {!loading && !error && jobs.length === 0 && (
                                   <div className="text-center py-10">
                                        <p className="text-muted-foreground">
                                             {searchQuery
                                                  ? `Không tìm thấy công việc nào với từ khóa "${searchQuery}"`
                                                  : 'Không có công việc nào'
                                             }
                                        </p>
                                   </div>
                              )}

                              {!loading && !error && jobs.map((job) => (
                                   <Link key={job.id} href={`/find-jobs/${job.id}`}>
                                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex gap-4">
                                                       <div
                                                            className={`w-14 h-14 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                                                       >
                                                            {getInitials(job.title)}
                                                       </div>
                                                       <div className="flex-1">
                                                            <h3 className="font-semibold text-lg text-foreground mb-1">
                                                                 {highlightText(job.title, searchQuery)}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                 {formatBudget(job)} • {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                                 {job.description}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                 <Badge variant="secondary" className={getJobTypeBadgeColor(job.job_type)}>
                                                                      {job.job_type.replace('_', ' ')}
                                                                 </Badge>
                                                                 <Badge variant="secondary" className={getExperienceLevelBadgeColor(job.experience_level)}>
                                                                      {job.experience_level}
                                                                 </Badge>
                                                                 {job.skills_required?.slice(0, 3).map((skill: string, index: number) => (
                                                                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                                                                           {skill}
                                                                      </Badge>
                                                                 ))}
                                                                 {job.skills_required?.length > 3 && (
                                                                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                                           +{job.skills_required.length - 3} more
                                                                      </Badge>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="text-right flex flex-col gap-2">
                                                       <Button
                                                            className={appliedJobs.has(job.id) ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                                                            onClick={(e) => handleApply(job.id, e)}
                                                            disabled={applyingJobId === job.id || appliedJobs.has(job.id)}
                                                       >
                                                            {applyingJobId === job.id ? 'Applying...' : appliedJobs.has(job.id) ? 'Applied' : 'Apply'}
                                                       </Button>
                                                       <p className="text-xs text-muted-foreground">
                                                            <span className="font-semibold text-foreground">{job.applications_count} applied</span>
                                                       </p>
                                                       {job.deadline && (
                                                            <p className="text-xs text-muted-foreground">
                                                                 Deadline: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>
                                        </Card>
                                   </Link>
                              ))}
                         </div>

                         {/* Pagination */}
                         {pagination.pages > 1 && (
                              <div className="flex items-center justify-center gap-2 mt-8">
                                   <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={pagination.page <= 1}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                   >
                                        <ChevronLeft className="w-4 h-4" />
                                   </Button>

                                   {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                                        <Button
                                             key={pageNum}
                                             variant={pagination.page === pageNum ? "default" : "ghost"}
                                             className={pagination.page === pageNum ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                                             onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                        >
                                             {pageNum}
                                        </Button>
                                   ))}

                                   <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                   >
                                        <ChevronRight className="w-4 h-4" />
                                   </Button>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     )
}
