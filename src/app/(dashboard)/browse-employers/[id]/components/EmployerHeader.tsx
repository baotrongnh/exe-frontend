import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Building2, Users, CheckCircle2, Globe, Calendar } from "lucide-react"
import Image from "next/image"

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

interface EmployerHeaderProps {
    employer: Employer
    jobsCount: number
}

export function EmployerHeader({ employer, jobsCount }: EmployerHeaderProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const getRandomColor = () => {
        const colors = ["bg-indigo-500", "bg-blue-500", "bg-teal-500", "bg-purple-500", "bg-cyan-500"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        })
    }

    return (
        <Card className="p-8">
            <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                    {employer.company_logo ? (
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 relative">
                            <Image
                                src={employer.company_logo}
                                alt={employer.company_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className={`w-24 h-24 rounded-xl ${getRandomColor()} flex items-center justify-center text-white text-3xl font-bold`}
                        >
                            {getInitials(employer.company_name)}
                        </div>
                    )}
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-foreground">{employer.company_name}</h1>
                                {employer.is_verified && (
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            {employer.industry && (
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                    <Building2 className="w-4 h-4" />
                                    <span>{employer.industry}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {employer.company_description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">{employer.company_description}</p>
                    )}

                    {/* Company Details */}
                    <div className="flex flex-wrap gap-4">
                        {employer.company_size && (
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground font-medium">{employer.company_size}</span>
                            </div>
                        )}
                        {employer.company_website && (
                            <a
                                href={employer.company_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Globe className="w-4 h-4" />
                                <span>Visit Website</span>
                            </a>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {formatDate(employer.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">
                                {jobsCount} {jobsCount === 1 ? "Job" : "Jobs"} Posted
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
