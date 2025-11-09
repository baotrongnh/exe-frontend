"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, DollarSign, Upload, Star } from "lucide-react"
import { useState } from "react"
import { RatingModal } from "@/components/RatingModal"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"

interface Job {
    id: string
    owner_id: string
    title: string
    description: string
    job_type: "FREELANCE" | "PART_TIME" | "PROJECT" | "FULL_TIME"
    budget_type: "FIXED" | "HOURLY"
    budget_min: string
    budget_max: string
    currency: string
    experience_level: "INTERN" | "JUNIOR" | "MIDDLE" | "SENIOR"
    deadline: string | null
    status: string
    applications_count: number
    skills_required: string[]
    createdAt: string | null
}

interface Application {
    id: string
    user_id: string
    job_id: string
    status: string
    createdAt: string
    job: Job
}

interface JobCardProps {
    application: Application
}

export function JobCard({ application }: JobCardProps) {
    const router = useRouter()
    const { job } = application
    const toast = useToast()
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [submittingRating, setSubmittingRating] = useState(false)
    const [hasReviewed, setHasReviewed] = useState(false)

    const getJobTypeBadgeColor = (type: string) => {
        const colors: Record<string, string> = {
            FREELANCE: "bg-purple-100 text-purple-700 hover:bg-purple-100",
            PART_TIME: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
            PROJECT: "bg-blue-100 text-blue-700 hover:bg-blue-100",
            FULL_TIME: "bg-orange-100 text-orange-700 hover:bg-orange-100",
        }
        return colors[type] || "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }

    const getExperienceLevelBadgeColor = (level: string) => {
        const colors: Record<string, string> = {
            INTERN: "bg-green-100 text-green-700 hover:bg-green-100",
            JUNIOR: "bg-blue-100 text-blue-700 hover:bg-blue-100",
            MIDDLE: "bg-amber-100 text-amber-700 hover:bg-amber-100",
            SENIOR: "bg-red-100 text-red-700 hover:bg-red-100",
        }
        return colors[level] || "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }

    const formatBudget = (job: Job) => {
        const min = parseFloat(job.budget_min)
        const max = parseFloat(job.budget_max)

        if (job.currency === "VND") {
            return `${(min / 1000000).toFixed(1)}tr - ${(max / 1000000).toFixed(1)}tr VNĐ`
        }
        return `$${min} - $${max}`
    }

    const getInitials = (title: string) => {
        return title
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const getRandomColor = () => {
        const colors = ["bg-indigo-500", "bg-blue-500", "bg-teal-500", "bg-gray-800", "bg-cyan-500", "bg-purple-500"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const getApplicationStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        Pending
                    </Badge>
                )
            case "accepted":
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Accepted
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                        Rejected
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                        {status}
                    </Badge>
                )
        }
    }

    const handleRatingSubmit = async (rating: number, comment: string) => {
        try {
            setSubmittingRating(true)
            await api.jobReviews.create({
                job_id: job.id,
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

    return (
        <Card className="overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4 flex-1">
                        <div
                            className={`w-14 h-14 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                        >
                            {getInitials(job.title)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <Link href={`/find-jobs/${job.id}`} className="flex-1">
                                    <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                        {job.title}
                                    </h3>
                                </Link>
                                {getApplicationStatusBadge(application.status)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>
                                        {formatBudget(job)} • {job.budget_type === "HOURLY" ? "Per Hour" : "Fixed Price"}
                                    </span>
                                </div>
                                {job.deadline && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Deadline: {new Date(job.deadline).toLocaleDateString("en-US")}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className={getJobTypeBadgeColor(job.job_type)}>
                                    {job.job_type.replace("_", " ")}
                                </Badge>
                                <Badge variant="secondary" className={getExperienceLevelBadgeColor(job.experience_level)}>
                                    {job.experience_level}
                                </Badge>
                                {job.skills_required?.slice(0, 3).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-primary/10 text-primary hover:bg-primary/10"
                                    >
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

                    <div className="flex flex-col gap-2 min-w-[160px]">
                        {application.status === 'completed' ? (
                            hasReviewed ? (
                                <Button
                                    disabled
                                    className="w-full bg-gray-400 text-white cursor-not-allowed"
                                >
                                    <Star className="w-4 h-4 mr-2 fill-white" />
                                    Already Rated
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setRatingModalOpen(true)}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                                >
                                    <Star className="w-4 h-4 mr-2" />
                                    Rate Experience
                                </Button>
                            )
                        ) : (
                            <Button
                                onClick={() => router.push(`/find-jobs/${job.id}`)}
                                className="w-full bg-primary hover:bg-primary/90"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                View & Upload
                            </Button>
                        )}
                        <div className="text-xs text-center text-muted-foreground mt-2">
                            Applied: {new Date(application.createdAt).toLocaleDateString("en-US")}
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
        </Card>
    )
}
