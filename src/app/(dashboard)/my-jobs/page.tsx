"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"
import { PageHeader } from "./components/PageHeader"
import { JobCard } from "./components/JobCard"

// Types
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

interface ApiResponse {
    success: boolean
    data?: Application[]
    applications?: Application[]
    pagination?: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export default function MyJobsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const toast = useToast()

    useEffect(() => {
        fetchApplications()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response: ApiResponse = await api.applications.getAll()
            console.log("Applications:", response)

            // The API returns response.applications not response.data
            const applicationsData = response.applications || response.data || []

            setApplications(applicationsData)
            setError(null)
        } catch (err: unknown) {
            console.error("Error fetching applications:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to load applications"
            setError(errorMessage)
            toast.showToast(errorMessage, "error")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your jobs...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <PageHeader totalJobs={applications.length} />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {applications.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No applied jobs yet</h3>
                            <p className="text-muted-foreground mb-6">
                                You haven&apos;t applied to any jobs yet. Browse available jobs and start applying!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((application) => (
                                <JobCard
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
