"use client"

import { ArrowLeft, Briefcase, DollarSign, Calendar, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { Check } from "lucide-react"
import { EmployerProductsSection } from "./components/EmployerProductsSection"
import { CompleteJobModal } from "./components/CompleteJobModal"
import { RatingModal } from "@/components/RatingModal"

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
    applicant?: {
        id: string
        full_name: string
        email: string
    }
}

interface ApiResponse {
    success: boolean
    data: JobDetail
}

export default function EmployerJobDetailPage() {
    const params = useParams()
    const jobId = params.id as string

    const [job, setJob] = useState<JobDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [completingJob, setCompletingJob] = useState(false)
    const [completeModalOpen, setCompleteModalOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [submittingRating, setSubmittingRating] = useState(false)
    const [acceptedApplication, setAcceptedApplication] = useState<Application | null>(null)
    const [loadingApplications, setLoadingApplications] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response: ApiResponse = await api.jobs.getById(jobId)
                setJob(response.data)
                setError(null)

                // Fetch accepted application if job is active
                if (response.data.status === 'active') {
                    setLoadingApplications(true)
                    try {
                        const applicationsResponse = await api.applications.getJobApplications(jobId)
                        if (applicationsResponse.success && applicationsResponse.data) {
                            // Find the accepted application
                            const accepted = applicationsResponse.data.find(
                                (app: Application) => app.status === 'accepted'
                            )
                            setAcceptedApplication(accepted || null)
                        }
                    } catch (appError) {
                        console.error('Error fetching applications:', appError)
                    } finally {
                        setLoadingApplications(false)
                    }
                }
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
    }, [jobId])

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

    // Open Complete Job Modal
    const openCompleteModal = () => {
        if (!acceptedApplication) {
            alert('No accepted application found. You must accept an application before completing the job.');
            return;
        }
        setCompleteModalOpen(true);
    };

    // Handle Complete Job
    const handleCompleteJob = async () => {
        if (!job || !acceptedApplication) {
            alert('Cannot complete job: No accepted application found.');
            return;
        }

        try {
            setCompletingJob(true);

            console.log('Completing job with accepted application:', acceptedApplication.id);

            // Use the accepted application ID (required by backend)
            await api.applications.complete(acceptedApplication.id);

            // Close complete modal
            setCompleteModalOpen(false);

            // Show success message
            alert('Job has been completed successfully! Payment has been transferred to the freelancer (minus 8% platform fee).');

            // Update local state
            setJob(prev => prev ? { ...prev, status: 'completed' } : null);

            // Show rating modal after job completion
            setRatingModalOpen(true);

        } catch (error) {
            console.error('Error completing job:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to complete job';
            alert(`Failed to complete job: ${errorMessage}`);
        } finally {
            setCompletingJob(false);
        }
    }

    // Handle Rating Submit
    const handleRatingSubmit = async (rating: number, comment: string) => {
        try {
            setSubmittingRating(true)
            await api.jobReviews.create({
                job_id: jobId,
                rating,
                comment: comment || undefined,
            })
            alert("Thank you for your feedback!")
            setRatingModalOpen(false)
        } catch (error) {
            console.error("Error submitting rating:", error)
            alert("Failed to submit rating. Please try again.")
        } finally {
            setSubmittingRating(false)
        }
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
                    <Link href="/employer/jobs">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Jobs
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/employer/jobs">
                            <Button variant="outline" size="icon" className="hover:bg-gray-100">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
                            <p className="text-sm text-gray-500">View and manage your job posting</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/employer/applications?job=${job.id}`}>
                            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                                View Applications ({job.applications_count})
                            </Button>
                        </Link>
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
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6 shadow-lg border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </div>
                                Job Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </Card>

                        {/* Required Skills */}
                        {job.skills_required && job.skills_required.length > 0 && (
                            <Card className="p-6 shadow-lg border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    Required Skills
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {job.skills_required.map((skill, index) => (
                                        <div key={index} className="flex gap-3 items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-emerald-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Job Information Card */}
                        <Card className="p-6 shadow-lg border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Job Information
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Job Type</p>
                                        <p className="font-semibold text-gray-900">{job.job_type.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Budget Type</p>
                                        <p className="font-semibold text-gray-900">{job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                                        <p className="font-semibold text-gray-900">{job.experience_level}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                        <p className="font-semibold text-gray-900 capitalize">{job.status}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Products Submitted Section */}
                        <Card className="p-6 shadow-lg border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                </div>
                                Products Submitted by Freelancers
                            </h3>
                            <EmployerProductsSection jobId={jobId} />
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-24 space-y-4">
                            {/* About this Job */}
                            <Card className="p-6 shadow-lg border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">About this Job</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-900 text-2xl">{job.applications_count}</span>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">Total Applications</p>
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-gray-200">
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
                                        {job.createdAt && (
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm text-gray-600">Posted On</span>
                                                <span className="text-sm font-semibold text-gray-900 text-right">
                                                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        {job.updatedAt && (
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm text-gray-600">Last Updated</span>
                                                <span className="text-sm font-semibold text-gray-900 text-right">
                                                    {new Date(job.updatedAt).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-gray-600">Job Type</span>
                                            <span className="text-sm font-semibold text-gray-900">{job.job_type.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-gray-600">Salary</span>
                                            <span className="text-sm font-semibold text-gray-900 text-right">{formatBudget(job)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Budget Details */}
                            <Card className="p-6 shadow-lg border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Range</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Minimum</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {job.currency === 'VND'
                                                ? `${(parseFloat(job.budget_min) / 1000000).toFixed(1)}M VNĐ`
                                                : `$${parseFloat(job.budget_min)}`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Maximum</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {job.currency === 'VND'
                                                ? `${(parseFloat(job.budget_max) / 1000000).toFixed(1)}M VNĐ`
                                                : `$${parseFloat(job.budget_max)}`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">Budget Type</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {job.budget_type === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Required Skills */}
                            {job.skills_required && job.skills_required.length > 0 && (
                                <Card className="p-6 shadow-lg border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Required</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills_required.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link href={`/employer/applications?job=${job.id}`} className="block">
                                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-base shadow-lg">
                                        View All Applications
                                    </Button>
                                </Link>
                                <Button
                                    onClick={openCompleteModal}
                                    disabled={job.status === 'closed' || job.status === 'completed' || !acceptedApplication || loadingApplications}
                                    className="w-full h-12 text-base bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loadingApplications ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Loading...
                                        </>
                                    ) : job.status === 'closed' || job.status === 'completed' ? (
                                        'Job Completed'
                                    ) : !acceptedApplication ? (
                                        'No Accepted Application'
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as Done
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complete Job Modal */}
            <CompleteJobModal
                isOpen={completeModalOpen}
                onClose={() => setCompleteModalOpen(false)}
                job={job}
                acceptedApplication={acceptedApplication}
                onConfirm={handleCompleteJob}
                isLoading={completingJob}
            />

            {/* Rating Modal */}
            <RatingModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
                title="Rate Your Experience"
                description="How was your experience with this freelancer? Your feedback helps improve our platform."
                isLoading={submittingRating}
            />
        </div>
    )
}
