import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

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
    rejection_reason: string | null
    createdAt: string | null
    updatedAt: string | null
    category_id: string | null
}

interface JobCardProps {
    job: Job
    searchQuery: string
    onApply: (jobId: string, e: React.MouseEvent) => void
    isApplying: boolean
    isApplied: boolean
}

export function JobCard({ job, searchQuery, onApply, isApplying, isApplied }: JobCardProps) {
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

    const highlightText = (text: string, query: string) => {
        if (!query) return text

        const parts = text.split(new RegExp(`(${query})`, "gi"))
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

    return (
        <Link key={job.id} href={`/find-jobs/${job.id}`}>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4 flex-1">
                        <div
                            className={`w-14 h-14 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                        >
                            {getInitials(job.title)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                                {highlightText(job.title, searchQuery)}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {formatBudget(job)} • {job.budget_type === "HOURLY" ? "Per Hour" : "Fixed Price"}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className={getJobTypeBadgeColor(job.job_type)}>
                                    {job.job_type.replace("_", " ")}
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
                    <div className="text-right flex flex-col gap-2 items-end min-w-[120px]">
                        {isApplied ? (
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
                                disabled={isApplying}
                            >
                                {isApplying ? "Applying..." : "Apply"}
                            </Button>
                        )}
                        <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{job.applications_count} applied</span>
                        </p>
                        {job.deadline && (
                            <p className="text-xs text-muted-foreground">
                                Deadline: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    )
}
