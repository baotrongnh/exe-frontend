"use client"

import { ArrowLeft, Briefcase, DollarSign, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { RatingModal } from "@/components/RatingModal"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/toast"

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

interface Application {
    id: string
    job_id: string
    applicant_id: string
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
}

interface ApiResponse {
    success: boolean
    data: JobDetail
}

export default function FreelancerJobDetailPage() {
    const params = useParams()
    const jobId = params.id as string
    const { user } = useAuth()
    const toast = useToast()

    const [job, setJob] = useState<JobDetail | null>(null)
    const [application, setApplication] = useState<Application | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [submittingRating, setSubmittingRating] = useState(false)
    const [hasReviewed, setHasReviewed] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response: ApiResponse = await api.jobs.getById(jobId)
                setJob(response.data)

                // Fetch user's application for this job
                const applicationsResponse = await api.applications.getAll()
                const userApplication = applicationsResponse.applications?.find(
                    (app: Application) => app.job_id === jobId
                )
                setApplication(userApplication || null)

                // Check if user has already reviewed
                if (userApplication?.status === 'completed') {
                    try {
                        const reviewsResponse = await api.jobReviews.getByJob(jobId)
                        const userReview = reviewsResponse.data?.find(
                            (review: { reviewer_id: string }) => review.reviewer_id === user?.id
                        )
                        setHasReviewed(!!userReview)
                    } catch (err) {
                        console.error("Error checking reviews:", err)
                    }
                }

                setError(null)
            } catch (err: unknown) {
                console.error('Error fetching job detail:', err)
                const errorMessage = err instanceof Error ? err.message : 'Unable to load job details'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        if (jobId) {
            fetchData()
        }
    }, [jobId, user])

    const handleRatingSubmit = async (rating: number, comment: string) => {
        try {
            setSubmittingRating(true)
            await api.jobReviews.create({
                job_id: jobId,
                rating,
                comment: comment || undefined,
            })
            toast.showToast("Thank you for your feedback!", "success")
            setRatingModalOpen(false)
            setHasReviewed(true)
        } catch (error) {
            console.error("Error submitting rating:", error)
            toast.showToast("Failed to submit rating. Please try again.", "error")
        } finally {
            setSubmittingRating(false)
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

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-700 hover:bg-green-100',
            pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            closed: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
            rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
            completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
        }
        return colors[status] || 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    }

    const formatBudget = (job: JobDetail) => {
        const min = parseFloat(job.budget_min)
        const max = parseFloat(job.budget_max)

        if (job.currency === 'VND') {
            return `${(min / 1000000).toFixed(1)}M - ${(max / 1000000).toFixed(1)}M VNĐ`
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-500 mb-4 text-lg font-semibold">{error || 'Job not found'}</p>
                    <Link href="/my-jobs">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Jobs
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const isJobCompleted = application?.status === 'completed'

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/my-jobs">
                            <Button variant="outline" size="icon" className="hover:bg-gray-100">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
                            <p className="text-sm text-gray-500">View job information and submit deliverables</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="col-span-2 space-y-6">
                        {/* Job Header Card */}
                        <Card className="p-6 shadow-lg border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div
                                        className={`w-16 h-16 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md`}
                                    >
                                        {getInitials(job.title)}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                                        <div className="flex items-center gap-3 text-gray-600 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="text-sm">{job.job_type.replace('_', ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span className="text-sm">{formatBudget(job)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className={getStatusBadgeColor(job.status)}>
                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </Badge>
                                            <Badge variant="secondary" className={getJobTypeBadgeColor(job.job_type)}>
                                                {job.job_type.replace('_', ' ')}
                                            </Badge>
                                            <Badge variant="secondary" className={getExperienceLevelBadgeColor(job.experience_level)}>
                                                {job.experience_level}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6 shadow-lg border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </Card>

                        {/* Required Skills */}
                        {job.skills_required && job.skills_required.length > 0 && (
                            <Card className="p-6 shadow-lg border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills_required.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-indigo-600 border-indigo-300 bg-indigo-50"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-24 space-y-4">
                            {/* About this Job */}
                            <Card className="p-6 shadow-lg border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">About this Job</h3>
                                <div className="space-y-3">
                                    {job.deadline && (
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-gray-600">Deadline</span>
                                            <span className="text-sm font-semibold text-gray-900 text-right">
                                                {new Date(job.deadline).toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-gray-600">Budget</span>
                                        <span className="text-sm font-semibold text-gray-900 text-right">{formatBudget(job)}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-gray-600">Budget Type</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Action Button */}
                            <div className="space-y-3">
                                {isJobCompleted ? (
                                    hasReviewed ? (
                                        <Button
                                            disabled
                                            className="w-full h-12 text-base bg-gray-400 text-white cursor-not-allowed"
                                        >
                                            <Star className="w-4 h-4 mr-2 fill-white" />
                                            Already Rated
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setRatingModalOpen(true)}
                                            className="w-full h-12 text-base bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            <Star className="w-4 h-4 mr-2" />
                                            Rate Experience
                                        </Button>
                                    )
                                ) : (
                                    <Link href={`/find-jobs/${job.id}`} className="block">
                                        <Button className="w-full h-12 text-base bg-indigo-600 text-white hover:bg-indigo-700">
                                            View & Upload
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
                title="Rate Your Experience"
                description="How was your experience working on this job? Your feedback helps us improve our platform."
                isLoading={submittingRating}
            />
        </div>
    )
}
