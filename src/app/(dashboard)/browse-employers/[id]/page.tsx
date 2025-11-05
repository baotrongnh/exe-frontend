"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { EmployerHeader, JobList } from "./components"
import { useToast } from "@/components/toast"

interface Employer {
    id: string
    user_id: string
    company_name: string
    company_website: string | null
    company_logo: string | null
    company_description: string | null
    industry: string | null
    company_size: string | null
    is_verified: boolean
    created_at: string
    updated_at: string
}

interface EmployerAPIResponse {
    id: string
    user_id?: string
    company_name: string
    company_website: string | null
    company_logo: string | null
    company_description: string | null
    industry: string | null
    company_size: string | null
    createdAt?: string
    created_at?: string
    updatedAt?: string
    updated_at?: string
}

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

export default function EmployerDetailPage() {
    const params = useParams()
    const router = useRouter()
    const employerId = params.id as string
    const { showToast } = useToast()

    const [employer, setEmployer] = useState<Employer | null>(null)
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
    const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

    useEffect(() => {
        const fetchEmployerData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch all verified employers from public endpoint
                const employersResponse = await api.employer.getVerifiedEmployers({ page: 1, limit: 100 })
                console.log("Employers response:", employersResponse)

                // Find the specific employer by ID
                const employersData: EmployerAPIResponse[] = employersResponse?.data?.employers || []
                const foundEmployer = employersData.find((emp) => emp.id === employerId)

                if (!foundEmployer) {
                    setError("Employer not found")
                    setLoading(false)
                    return
                }

                // Map the employer data to include all necessary fields
                // API returns createdAt, but we need created_at for the component
                const employerWithDefaults: Employer = {
                    id: foundEmployer.id,
                    user_id: foundEmployer.user_id || "",
                    company_name: foundEmployer.company_name,
                    company_website: foundEmployer.company_website || null,
                    company_logo: foundEmployer.company_logo || null,
                    company_description: foundEmployer.company_description || null,
                    industry: foundEmployer.industry || null,
                    company_size: foundEmployer.company_size || null,
                    is_verified: true, // All employers from this endpoint are verified
                    created_at: foundEmployer.createdAt || foundEmployer.created_at || new Date().toISOString(),
                    updated_at: foundEmployer.updatedAt || foundEmployer.updated_at || new Date().toISOString(),
                }

                setEmployer(employerWithDefaults)

                // Fetch all jobs and filter by employer
                const jobsResponse = await api.jobs.getAll({
                    page: 1,
                    limit: 100,
                })

                // Filter jobs by owner_id to show only this employer's jobs
                const employerJobs = (jobsResponse.jobs || []).filter(
                    (job: Job) => job.owner_id === employerId
                )
                setJobs(employerJobs)

                // Check which jobs the user has already applied to
                const appliedJobIds = new Set<string>()
                const userApplications = await api.applications.getAll({ page: 1, limit: 100 })
                const appliedJobIdsArray = (userApplications.applications || []).map(
                    (app: { job_id: string }) => app.job_id
                )
                appliedJobIdsArray.forEach((jobId: string) => appliedJobIds.add(jobId))
                setAppliedJobs(appliedJobIds)
            } catch (err: unknown) {
                console.error("Error fetching employer data:", err)
                setError("Failed to load employer information. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        if (employerId) {
            fetchEmployerData()
        }
    }, [employerId])

    const handleApply = async (jobId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setApplyingJobId(jobId)
            await api.applications.apply(jobId)

            setAppliedJobs((prev) => new Set(prev).add(jobId))
            showToast("Your application has been submitted successfully!", "success")
        } catch (err: unknown) {
            console.error("Error applying to job:", err)
            showToast("Failed to submit application. Please try again.", "error")
        } finally {
            setApplyingJobId(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading employer details...</p>
                </div>
            </div>
        )
    }

    if (error || !employer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || "Employer not found"}</p>
                    <Button onClick={() => router.push("/browse-employers")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Employers
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => router.push("/browse-employers")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Employers
                </Button>

                {/* Employer Header */}
                <EmployerHeader employer={employer} jobsCount={jobs.length} />

                {/* Jobs Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">
                            Jobs Posted {jobs.length > 0 && `(${jobs.length})`}
                        </h2>
                    </div>

                    <JobList jobs={jobs} onApply={handleApply} applyingJobId={applyingJobId} appliedJobs={appliedJobs} />
                </div>
            </div>
        </div>
    )
}
