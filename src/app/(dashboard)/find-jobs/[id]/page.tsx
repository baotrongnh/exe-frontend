"use client"

import { ArrowLeft, Bell, Share2, Check, Briefcase, DollarSign, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/toast"
import { ProductUploadSection } from "./components/ProductUploadSection"

// Type cho Job Detail
interface JobDetail {
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
     data: JobDetail
}

export default function JobDetailPage() {
     const params = useParams()
     const jobId = params.id as string
     const router = useRouter()
     const toast = useToast()

     const [job, setJob] = useState<JobDetail | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [applying, setApplying] = useState(false)
     const [applied, setApplied] = useState(false)

     useEffect(() => {
          const fetchData = async () => {
               try {
                    setLoading(true)
                    const response: ApiResponse = await api.jobs.getById(jobId)
                    setJob(response.data)

                    // Check if user has already applied to this job
                    try {
                         const applicationsResponse = await api.applications.getAll()
                         if (applicationsResponse.success && applicationsResponse.data) {
                              const hasApplied = applicationsResponse.data.some(
                                   (app: { job_id: string }) => app.job_id === jobId
                              )
                              setApplied(hasApplied)
                         }
                    } catch (appErr) {
                         console.error('Error checking application status:', appErr)
                         // Continue even if check fails
                    }

                    setError(null)
               } catch (err: unknown) {
                    console.error('Error fetching job detail:', err)
                    const errorMessage = err instanceof Error ? err.message : 'Không thể tải chi tiết công việc'
                    setError(errorMessage)
               } finally {
                    setLoading(false)
               }
          }

          if (jobId) {
               fetchData()
          }
     }, [jobId])

     // Handle apply job
     const handleApply = async () => {
          try {
               setApplying(true)
               const response = await api.applications.apply(jobId)

               if (response.success) {
                    toast.showToast('Apply job thành công!', 'success')
                    setApplied(true)
                    // Refresh job detail để cập nhật applications_count
                    const jobResponse: ApiResponse = await api.jobs.getById(jobId)
                    setJob(jobResponse.data)
               }
          } catch (err: unknown) {
               console.error('Error applying job:', err)
               const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Có lỗi xảy ra khi apply job'

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
               setApplying(false)
          }
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

     const formatBudget = (job: JobDetail) => {
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

     if (loading) {
          return (
               <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                         <p className="text-muted-foreground">Đang tải...</p>
                    </div>
               </div>
          )
     }

     if (error || !job) {
          return (
               <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                         <p className="text-red-500 mb-4">{error || 'Không tìm thấy công việc'}</p>
                         <Link href="/find-jobs">
                              <Button>Quay lại danh sách</Button>
                         </Link>
                    </div>
               </div>
          )
     }

     return (
          <div className="h-full flex flex-col">
               {/* Header */}
               <header className="bg-card border-b border-border px-8 py-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                              <Link href="/find-jobs">
                                   <Button variant="ghost" size="icon">
                                        <ArrowLeft className="w-5 h-5" />
                                   </Button>
                              </Link>
                              <h1 className="text-2xl font-bold text-foreground">Job Description</h1>
                         </div>
                         <div className="flex items-center gap-3">
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Become Employer</Button>
                              <Button variant="ghost" size="icon">
                                   <Bell className="w-5 h-5" />
                              </Button>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                         <div className="grid grid-cols-3 gap-8">
                              {/* Left Column - Main Content */}
                              <div className="col-span-2 space-y-8">
                                   {/* Job Header */}
                                   <Card className="p-6">
                                        <div className="flex items-start justify-between">
                                             <div className="flex gap-4">
                                                  <div
                                                       className={`w-16 h-16 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
                                                  >
                                                       {getInitials(job.title)}
                                                  </div>
                                                  <div>
                                                       <h2 className="text-2xl font-bold text-foreground mb-2">{job.title}</h2>
                                                       <div className="flex items-center gap-3 text-muted-foreground mb-3">
                                                            <div className="flex items-center gap-1">
                                                                 <Briefcase className="w-4 h-4" />
                                                                 <span>{job.job_type.replace('_', ' ')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                 <DollarSign className="w-4 h-4" />
                                                                 <span>{formatBudget(job)}</span>
                                                            </div>
                                                       </div>
                                                       <div className="flex flex-wrap gap-2">
                                                            <Badge variant="secondary" className={getJobTypeBadgeColor(job.job_type)}>
                                                                 {job.job_type.replace('_', ' ')}
                                                            </Badge>
                                                            <Badge variant="secondary" className={getExperienceLevelBadgeColor(job.experience_level)}>
                                                                 {job.experience_level}
                                                            </Badge>
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                                 {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                                            </Badge>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="flex gap-2">
                                                  <Button variant="outline" size="icon">
                                                       <Share2 className="w-5 h-5" />
                                                  </Button>
                                                  {applied ? (
                                                       <Button
                                                            className="bg-green-600 hover:bg-green-700 text-white px-8 cursor-default"
                                                            disabled
                                                       >
                                                            <Check className="w-5 h-5 mr-2" />
                                                            Applied
                                                       </Button>
                                                  ) : (
                                                       <Button
                                                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                                                            onClick={handleApply}
                                                            disabled={applying}
                                                       >
                                                            {applying ? 'Applying...' : 'Apply'}
                                                       </Button>
                                                  )}
                                             </div>
                                        </div>
                                   </Card>

                                   {/* Description */}
                                   <div>
                                        <h3 className="text-xl font-bold text-foreground mb-4">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                                   </div>

                                   {/* Required Skills */}
                                   {job.skills_required && job.skills_required.length > 0 && (
                                        <div>
                                             <h3 className="text-xl font-bold text-foreground mb-4">Required Skills</h3>
                                             <div className="grid grid-cols-2 gap-3">
                                                  {job.skills_required.map((skill, index) => (
                                                       <div key={index} className="flex gap-3 items-start">
                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                 <Check className="w-3 h-3 text-emerald-600" />
                                                            </div>
                                                            <span className="text-muted-foreground">{skill}</span>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   )}

                                   {/* Job Information Card */}
                                   <Card className="p-6">
                                        <h3 className="text-xl font-bold text-foreground mb-4">Job Information</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                             <div className="flex items-start gap-3">
                                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                       <Briefcase className="w-5 h-5 text-primary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-muted-foreground mb-1">Job Type</p>
                                                       <p className="font-semibold text-foreground">{job.job_type.replace('_', ' ')}</p>
                                                  </div>
                                             </div>

                                             <div className="flex items-start gap-3">
                                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                       <DollarSign className="w-5 h-5 text-primary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-muted-foreground mb-1">Budget Type</p>
                                                       <p className="font-semibold text-foreground">{job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}</p>
                                                  </div>
                                             </div>

                                             <div className="flex items-start gap-3">
                                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                       <Calendar className="w-5 h-5 text-primary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-muted-foreground mb-1">Experience Level</p>
                                                       <p className="font-semibold text-foreground">{job.experience_level}</p>
                                                  </div>
                                             </div>

                                             <div className="flex items-start gap-3">
                                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                       <Clock className="w-5 h-5 text-primary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-muted-foreground mb-1">Status</p>
                                                       <p className="font-semibold text-foreground capitalize">{job.status}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </Card>

                                   {/* Product Upload Section - Only shown if user has applied */}
                                   {applied && (
                                        <div>
                                             <h3 className="text-xl font-bold text-foreground mb-4">Products Uploaded</h3>
                                             <ProductUploadSection jobId={jobId} />
                                        </div>
                                   )}
                              </div>

                              {/* Right Column - Sidebar */}
                              <div className="space-y-6">
                                   <div className="sticky top-3 space-y-3">
                                        {/* About this role */}
                                        <Card className="p-6">
                                             <h3 className="text-lg font-bold text-foreground mb-4">About this role</h3>
                                             <div className="space-y-4">
                                                  <div>
                                                       <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-muted-foreground">
                                                                 <span className="font-semibold text-foreground">{job.applications_count}</span> applied
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div className="space-y-3 pt-2 border-t">
                                                       {job.deadline && (
                                                            <div className="flex justify-between items-start">
                                                                 <span className="text-sm text-muted-foreground">Deadline</span>
                                                                 <span className="text-sm font-semibold text-foreground text-right">
                                                                      {new Date(job.deadline).toLocaleDateString('vi-VN', {
                                                                           day: '2-digit',
                                                                           month: 'long',
                                                                           year: 'numeric'
                                                                      })}
                                                                 </span>
                                                            </div>
                                                       )}
                                                       {job.createdAt && (
                                                            <div className="flex justify-between items-start">
                                                                 <span className="text-sm text-muted-foreground">Posted On</span>
                                                                 <span className="text-sm font-semibold text-foreground text-right">
                                                                      {new Date(job.createdAt).toLocaleDateString('vi-VN', {
                                                                           day: '2-digit',
                                                                           month: 'long',
                                                                           year: 'numeric'
                                                                      })}
                                                                 </span>
                                                            </div>
                                                       )}
                                                       {job.updatedAt && (
                                                            <div className="flex justify-between items-start">
                                                                 <span className="text-sm text-muted-foreground">Last Updated</span>
                                                                 <span className="text-sm font-semibold text-foreground text-right">
                                                                      {new Date(job.updatedAt).toLocaleDateString('vi-VN', {
                                                                           day: '2-digit',
                                                                           month: 'long',
                                                                           year: 'numeric'
                                                                      })}
                                                                 </span>
                                                            </div>
                                                       )}
                                                       <div className="flex justify-between items-start">
                                                            <span className="text-sm text-muted-foreground">Job Type</span>
                                                            <span className="text-sm font-semibold text-foreground">{job.job_type.replace('_', ' ')}</span>
                                                       </div>
                                                       <div className="flex justify-between items-start">
                                                            <span className="text-sm text-muted-foreground">Salary</span>
                                                            <span className="text-sm font-semibold text-foreground text-right">{formatBudget(job)}</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </Card>

                                        {/* Budget Details */}
                                        <Card className="p-6">
                                             <h3 className="text-lg font-bold text-foreground mb-4">Budget Range</h3>
                                             <div className="space-y-3">
                                                  <div className="flex justify-between">
                                                       <span className="text-sm text-muted-foreground">Minimum</span>
                                                       <span className="text-sm font-semibold text-foreground">
                                                            {job.currency === 'VND'
                                                                 ? `${(parseFloat(job.budget_min) / 1000000).toFixed(1)}tr VNĐ`
                                                                 : `$${parseFloat(job.budget_min)}`
                                                            }
                                                       </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                       <span className="text-sm text-muted-foreground">Maximum</span>
                                                       <span className="text-sm font-semibold text-foreground">
                                                            {job.currency === 'VND'
                                                                 ? `${(parseFloat(job.budget_max) / 1000000).toFixed(1)}tr VNĐ`
                                                                 : `$${parseFloat(job.budget_max)}`
                                                            }
                                                       </span>
                                                  </div>
                                                  <div className="flex justify-between pt-3 border-t">
                                                       <span className="text-sm text-muted-foreground">Budget Type</span>
                                                       <span className="text-sm font-semibold text-foreground">
                                                            {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                                       </span>
                                                  </div>
                                             </div>
                                        </Card>

                                        {/* Required Skills */}
                                        {job.skills_required && job.skills_required.length > 0 && (
                                             <Card className="p-6">
                                                  <h3 className="text-lg font-bold text-foreground mb-4">Skills Required</h3>
                                                  <div className="flex flex-wrap gap-2">
                                                       {job.skills_required.map((skill, index) => (
                                                            <Badge key={index} variant="outline" className="text-primary border-primary">
                                                                 {skill}
                                                            </Badge>
                                                       ))}
                                                  </div>
                                             </Card>
                                        )}

                                        {/* Apply Button */}
                                        <div>
                                             {applied ? (
                                                  <Button
                                                       className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base cursor-default"
                                                       disabled
                                                  >
                                                       <Check className="w-5 h-5 mr-2" />
                                                       Applied
                                                  </Button>
                                             ) : (
                                                  <Button
                                                       className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
                                                       onClick={handleApply}
                                                       disabled={applying}
                                                  >
                                                       {applying ? 'Applying...' : 'Apply Now'}
                                                  </Button>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
