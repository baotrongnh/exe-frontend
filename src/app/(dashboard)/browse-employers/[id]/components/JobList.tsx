import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, DollarSign, Check } from "lucide-react"

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

interface JobListProps {
    jobs: Job[]
    onApply: (jobId: string, e: React.MouseEvent) => void
    applyingJobId: string | null
    appliedJobs: Set<string>
}

export function JobList({ jobs, onApply, applyingJobId, appliedJobs }: JobListProps) {
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

        // Handle case where budget_min/max are not provided (NaN)
        if (isNaN(min) || isNaN(max)) {
            return "Budget not specified"
        }

        if (job.currency === "VND") {
            return `${(min / 1000000).toFixed(1)}tr - ${(max / 1000000).toFixed(1)}tr VNĐ`
        }
        return `$${min} - $${max}`
    }

    if (jobs.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">This company hasn&apos;t posted any jobs yet.</p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                            <Link href={`/find-jobs/${job.id}`} className="block mb-2">
                                <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                    {job.title}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{formatBudget(job)} • {job.budget_type === "HOURLY" ? "Per Hour" : "Fixed Price"}</span>
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

                        <div className="flex flex-col items-end gap-2 min-w-[140px]">
                            {appliedJobs.has(job.id) ? (
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white cursor-default"
                                    disabled
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Applied
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={(e) => onApply(job.id, e)}
                                    disabled={applyingJobId === job.id}
                                >
                                    {applyingJobId === job.id ? "Applying..." : "Apply"}
                                </Button>
                            )}
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">{job.applications_count} applied</span>
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
