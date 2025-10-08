"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Grid3x3, List, MapPin, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

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
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [pagination, setPagination] = useState({
          total: 0,
          page: 1,
          limit: 10,
          pages: 0
     })

     useEffect(() => {
          const fetchJobs = async () => {
               try {
                    setLoading(true)
                    const response: ApiResponse = await api.jobs.getAll({ page: pagination.page, limit: pagination.limit })
                    setJobs(response.data || [])
                    setPagination(response.pagination)
                    setError(null)
               } catch (err: any) {
                    console.error('Error fetching jobs:', err)
                    setError(err.message || 'Không thể tải dữ liệu jobs')
               } finally {
                    setLoading(false)
               }
          }

          fetchJobs()
     }, [pagination.page])

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
                    <div className="flex gap-3 mb-4">
                         <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input placeholder="Job title or keyword" className="pl-10" />
                         </div>
                         <div className="w-80 relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input placeholder="Thành phố Hồ Chí Minh, Việt Nam" className="pl-10" />
                         </div>
                         <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Search</Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <span>Popular:</span>
                         <span>UI Designer, UX Researcher, Android, Admin</span>
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
                                   <h2 className="text-xl font-bold text-foreground mb-1">All Jobs</h2>
                                   <p className="text-sm text-muted-foreground">
                                        Showing {jobs.length} of {pagination.total} results
                                   </p>
                              </div>
                              <div className="flex items-center gap-3">
                                   <span className="text-sm text-muted-foreground">Sort by:</span>
                                   <Button variant="outline" className="gap-2 bg-transparent">
                                        Most relevant
                                        <ChevronDown className="w-4 h-4" />
                                   </Button>
                                   <div className="flex gap-1 ml-2">
                                        <Button variant="ghost" size="icon">
                                             <Grid3x3 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                             <List className="w-5 h-5 text-primary" />
                                        </Button>
                                   </div>
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
                                        <p className="text-muted-foreground">Không có công việc nào</p>
                                   </div>
                              )}

                              {!loading && !error && jobs.map((job) => (
                                   <Card key={job.id} className="p-6">
                                        <div className="flex items-start justify-between">
                                             <div className="flex gap-4">
                                                  <div
                                                       className={`w-14 h-14 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                                                  >
                                                       {getInitials(job.title)}
                                                  </div>
                                                  <div className="flex-1">
                                                       <h3 className="font-semibold text-lg text-foreground mb-1">{job.title}</h3>
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
                                                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply</Button>
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
